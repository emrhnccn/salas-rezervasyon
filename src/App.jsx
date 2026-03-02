import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, Users, UtensilsCrossed, Armchair, 
  Plus, Trash2, MoonStar, ChefHat, Search, Edit2, X, Check, Loader2, Clock, CheckCircle, Phone, Printer, MessageSquareText, MessageCircle
} from 'lucide-react';

// Firebase importları
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// SİZİN FIREBASE BİLGİLERİNİZ
const firebaseConfig = {
  apiKey: "AIzaSyD6RgXBBISFM21oJKRYRhwwCnR38NBbl9k",
  authDomain: "salaas-cafe-9c6dc.firebaseapp.com",
  projectId: "salaas-cafe-9c6dc",
  storageBucket: "salaas-cafe-9c6dc.firebasestorage.app",
  messagingSenderId: "1074809461661",
  appId: "1:1074809461661:web:5fb47660e84968e3ffed74"
};

// Firebase'i Başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const getToday = () => new Date().toISOString().split('T')[0];

  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilterDate, setSelectedFilterDate] = useState(getToday());
  const [isEditing, setIsEditing] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [printSingleId, setPrintSingleId] = useState(null); // Tekil yazdırma state'i
  
  // İftar Sayacı State'leri
  const [iftarTime, setIftarTime] = useState(null);
  const [countdown, setCountdown] = useState("Hesaplanıyor...");
  
  const initialFormState = {
    name: '', phone: '', notes: '', peopleCount: 1, menuTavuk: 0, menuHunkar: 0, menuKarisik: 0, menuCocuk: 0, table: '', date: getToday(),
  };
  
  const [formData, setFormData] = useState(initialFormState);

  // 1. Gebze İftar Vakti Çekme
  useEffect(() => {
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Gebze&country=Turkey&method=13')
      .then(res => res.json())
      .then(data => {
        setIftarTime(data.data.timings.Maghrib);
      })
      .catch(err => console.error("İftar vakti çekilemedi", err));
  }, []);

  // 2. Geri Sayım İşlemi
  useEffect(() => {
    if (!iftarTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const [hours, minutes] = iftarTime.split(':');
      const iftarDate = new Date();
      iftarDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      let diff = iftarDate - now;

      if (diff < 0) {
        setCountdown("İftar Vakti!");
        clearInterval(interval);
        return;
      }

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      
      setCountdown(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [iftarTime]);

  // Yazdırma işlemi tamamlandığında tekil yazdırma modunu sıfırla
  useEffect(() => {
    const handleAfterPrint = () => setPrintSingleId(null);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  // 3. Kimlik Doğrulama
  useEffect(() => {
    signInAnonymously(auth).catch((error) => {
      console.error("Giriş hatası:", error);
      setErrorMsg("Veritabanına bağlanılamadı. Lütfen sayfayı yenileyin.");
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 4. Canlı Veri Çekme
  useEffect(() => {
    if (!user) return;

    const collectionRef = collection(db, 'reservations');
    
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReservations(data);
      setLoading(false);
    }, (err) => {
      console.error("Veri çekme hatası:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Form Değişikliklerini Yakalama
  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrorMsg('');
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Count') || name.includes('menu') ? (value === '' ? '' : parseInt(value)) : value
    }));
  };

  // 5. Veri Ekleme / Güncelleme İşlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) { setErrorMsg("Sisteme bağlanılıyor, lütfen bekleyin..."); return; }
    if (!formData.name.trim() || !formData.table.trim()) {
      setErrorMsg("Lütfen İsim ve Masa alanlarını doldurun."); return;
    }

    const cleanData = {
      ...formData,
      phone: formData.phone?.trim() || '',
      notes: formData.notes?.trim() || '', 
      peopleCount: parseInt(formData.peopleCount) || 1,
      menuTavuk: parseInt(formData.menuTavuk) || 0,
      menuHunkar: parseInt(formData.menuHunkar) || 0,
      menuKarisik: parseInt(formData.menuKarisik) || 0,
      menuCocuk: parseInt(formData.menuCocuk) || 0,
    };

    try {
      const collectionRef = collection(db, 'reservations');

      if (isEditing) {
        const docRef = doc(db, 'reservations', isEditing);
        await updateDoc(docRef, { ...cleanData, updatedAt: new Date().toISOString() });
        setIsEditing(null);
      } else {
        await addDoc(collectionRef, { ...cleanData, createdAt: new Date().toISOString(), createdBy: user.uid, isArrived: false });
      }

      setFormData({ ...initialFormState, date: cleanData.date });
    } catch (err) {
      console.error("Kayıt hatası:", err);
      setErrorMsg("Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.");
    }
  };

  const handleEditClick = (res) => {
    setFormData({ 
      ...res, 
      phone: res.phone || '',
      notes: res.notes || '', 
      menuCocuk: res.menuCocuk || 0
    });
    setIsEditing(res.id);
    setSelectedFilterDate(res.date);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({ ...initialFormState, date: selectedFilterDate });
    setErrorMsg('');
  };

  const handleToggleArrived = async (id, currentStatus) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'reservations', id);
      await updateDoc(docRef, { isArrived: !currentStatus });
    } catch (err) {
      console.error("Durum güncellenemedi:", err);
    }
  };

  const executeDelete = async (id) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'reservations', id);
      await deleteDoc(docRef);
      setDeleteConfirmId(null);
      if (isEditing === id) cancelEdit();
    } catch (err) { console.error("Silme hatası:", err); }
  };

  // Tek bir masayı yazdırma fonksiyonu
  const handlePrintSingle = (id) => {
    setPrintSingleId(id);
    setTimeout(() => {
      window.print();
    }, 150); // Ekranın güncellenmesi için çok kısa bir bekleme
  };

  // WhatsApp Mesajı Gönderme Fonksiyonu
  const sendWhatsApp = (res) => {
    if (!res.phone) return;
    
    // Telefon numarasını sadece rakamlardan oluşacak şekilde temizle
    let cleanPhone = res.phone.replace(/\D/g, '');
    
    // Numara formatını Türkiye formatına (90...) getir
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '9' + cleanPhone;
    } else if (cleanPhone.length === 10) {
      cleanPhone = '90' + cleanPhone;
    }

    const message = `Sayın ${res.name},\nSalaaş Cafe'ye ${res.date} tarihindeki ${res.table} nolu masanız için ${res.peopleCount} kişilik iftar rezervasyonunuz alınmıştır. Bizi tercih ettiğiniz için teşekkür ederiz. İyi iftarlar dileriz.`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
  };

  const filteredReservations = reservations.filter(res => res.date === selectedFilterDate);

  // Akıllı Sıralama (Gelenler Alta Atılır)
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    if (a.isArrived === b.isArrived) {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); // Aynı durumdaysa en yeniler üstte
    }
    return a.isArrived ? 1 : -1; // Gelenler listesinde alta kayar
  });

  const dailySummary = filteredReservations.reduce((acc, res) => {
    acc.totalPeople += (parseInt(res.peopleCount) || 0);
    acc.totalTavuk += (parseInt(res.menuTavuk) || 0);
    acc.totalHunkar += (parseInt(res.menuHunkar) || 0);
    acc.totalKarisik += (parseInt(res.menuKarisik) || 0);
    acc.totalCocuk += (parseInt(res.menuCocuk) || 0);
    return acc;
  }, { totalPeople: 0, totalTavuk: 0, totalHunkar: 0, totalKarisik: 0, totalCocuk: 0 });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12 print:bg-white print:pb-0">
      
      {/* Genel Yazdırma Modu İçin Gizli Başlık (Sadece "Tümünü Yazdır" denildiğinde görünür) */}
      <div className={`hidden ${!printSingleId ? 'print:block' : ''} text-center mb-4 border-b-2 border-black pb-2`}>
        <h1 className="text-xl font-bold font-sans uppercase">Salaaş Cafe İftar</h1>
        <p className="text-sm mt-1 font-bold text-black">Tarih: {selectedFilterDate}</p>
      </div>

      {/* Üst Bilgi Barı (Yazdırmada Gizlenir) */}
      <header className="bg-[#0B3B2C] text-white shadow-lg sticky top-0 z-10 print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-[#FBE18D] overflow-hidden shrink-0">
               <img src="/salaas logo.jpg" alt="Salaaş Cafe Logo" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block'; }} />
               <MoonStar className="text-[#0B3B2C] hidden" size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-wide text-[#FBE18D]">Salaaş Cafe <span className="text-white">İftar</span></h1>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-yellow-500/20 rounded-xl px-4 py-2 border border-yellow-500/50 text-yellow-300 w-full md:w-auto justify-center">
              <Clock className="mr-2 animate-pulse" size={20} />
              <div className="flex flex-col items-center md:items-start">
                 <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Gebze İftar Vakti</span>
                 <span className="font-mono font-bold text-lg tracking-widest">{countdown}</span>
              </div>
            </div>

            <div className="flex items-center bg-white/10 rounded-xl px-4 py-3 border border-white/20 w-full md:w-auto justify-center">
              <CalendarDays className="mr-3 text-[#FBE18D]" size={20} />
              <input type="date" value={selectedFilterDate} onChange={(e) => setSelectedFilterDate(e.target.value)} className="bg-transparent text-white outline-none font-medium cursor-pointer text-base w-full md:w-auto" />
            </div>
          </div>

        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-32 text-emerald-800 print:hidden">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-semibold animate-pulse">Sisteme Bağlanıyor...</p>
        </div>
      ) : (
        <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 print:block print:m-0 print:p-0">
          
          {/* SOL KOLON - FORM (Yazdırmada Gizlenir) */}
          <div className="lg:col-span-4 space-y-6 print:hidden">
            <div className={`bg-white rounded-2xl shadow-md border-t-4 overflow-hidden transition-colors ${isEditing ? 'border-[#FBE18D]' : 'border-[#0B3B2C]'}`}>
              <div className={`px-6 py-4 border-b flex items-center justify-between ${isEditing ? 'bg-yellow-50' : 'bg-emerald-50'}`}>
                <div className="flex items-center gap-2">
                  {isEditing ? <Edit2 className="text-yellow-600" size={20} /> : <Plus className="text-emerald-600" size={20} />}
                  <h2 className={`text-lg font-bold ${isEditing ? 'text-yellow-800' : 'text-emerald-900'}`}>{isEditing ? 'Rezervasyonu Düzenle' : 'Rezervasyon Oluştur'}</h2>
                </div>
                {isEditing && <button onClick={cancelEdit} className="text-slate-400 p-1 hover:bg-white rounded-full"><X size={18} /></button>}
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">{errorMsg}</div>}
                
                <div className="flex gap-4">
                  <div className="flex-[3]">
                    <label className="block text-sm font-semibold mb-1">İsim</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-[#0B3B2C] bg-slate-50" placeholder="Müşteri İsmi" />
                  </div>
                  <div className="flex-[2]">
                    <label className="block text-sm font-semibold mb-1">Telefon</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-9 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-[#0B3B2C] bg-slate-50" placeholder="05XX..." />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1">Kişi</label>
                    <input type="number" inputMode="numeric" pattern="[0-9]*" name="peopleCount" min="1" value={formData.peopleCount} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-[#0B3B2C] bg-slate-50" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1">Masa</label>
                    <input type="text" name="table" value={formData.table} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-[#0B3B2C] bg-slate-50 uppercase" placeholder="Örn: A-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Tarih</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-[#0B3B2C] bg-slate-50" />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-amber-700">Özel Not (Opsiyonel)</label>
                  <input type="text" name="notes" value={formData.notes} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-500 bg-amber-50/50 placeholder:text-amber-300" placeholder="Örn: Mama sandalyesi eklenecek, Cam kenarı vb." />
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><UtensilsCrossed size={16} className="text-[#0B3B2C]" /> Menü Seçimi (Adet)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-white p-2.5 border rounded-xl"><span className="text-sm font-semibold">🐔 Tavuk</span><input type="number" inputMode="numeric" pattern="[0-9]*" name="menuTavuk" min="0" value={formData.menuTavuk} onChange={handleChange} className="w-16 px-2 py-1 text-center border rounded-lg focus:ring-2 outline-none font-bold bg-slate-50" /></div>
                    <div className="flex justify-between items-center bg-white p-2.5 border rounded-xl"><span className="text-sm font-semibold">🥩 Hünkar</span><input type="number" inputMode="numeric" pattern="[0-9]*" name="menuHunkar" min="0" value={formData.menuHunkar} onChange={handleChange} className="w-16 px-2 py-1 text-center border rounded-lg focus:ring-2 outline-none font-bold bg-slate-50" /></div>
                    <div className="flex justify-between items-center bg-white p-2.5 border rounded-xl"><span className="text-sm font-semibold">🍢 K. Izgara</span><input type="number" inputMode="numeric" pattern="[0-9]*" name="menuKarisik" min="0" value={formData.menuKarisik} onChange={handleChange} className="w-16 px-2 py-1 text-center border rounded-lg focus:ring-2 outline-none font-bold bg-slate-50" /></div>
                    <div className="flex justify-between items-center bg-orange-50 p-2.5 border border-orange-100 rounded-xl"><span className="text-sm font-semibold text-orange-800">🧸 Çocuk Menüsü</span><input type="number" inputMode="numeric" pattern="[0-9]*" name="menuCocuk" min="0" value={formData.menuCocuk} onChange={handleChange} className="w-16 px-2 py-1 text-center border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none font-bold bg-white" /></div>
                  </div>
                </div>
                
                <button type="submit" className={`w-full font-bold py-3 mt-2 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-white ${isEditing ? 'bg-[#0B3B2C]' : 'bg-[#FBE18D] text-slate-900'}`}>
                  {isEditing ? <Check size={20} /> : <Plus size={20} />} {isEditing ? 'Değişiklikleri Kaydet' : 'Sisteme Ekle'}
                </button>
              </form>
            </div>
          </div>

          {/* SAĞ KOLON - LİSTE VE MUTFAK (Yazdırmada Tam Ekran Olur) */}
          <div className="lg:col-span-8 space-y-6 print:w-full print:block print:space-y-4">
            
            {/* Mutfak Canlı Özet (Tekil yazdırmada gizlenir) */}
            <div className={`bg-[#0B3B2C] rounded-2xl p-5 shadow-md flex flex-col items-center justify-between gap-4 ${printSingleId ? 'print:hidden' : 'print:bg-white print:border-b-2 print:border-black print:rounded-none print:shadow-none print:p-2 print:mb-4'}`}>
              <div className="flex items-center gap-3 text-[#FBE18D] w-full border-b border-emerald-800/50 pb-3 print:border-black print:text-black print:pb-2">
                <div className="bg-white/10 p-2.5 rounded-xl print:hidden"><ChefHat size={24} /></div>
                <div>
                  <p className="text-xs font-bold uppercase text-emerald-200 print:text-black print:text-[10px]">Mutfak Canlı Özet</p>
                  <p className="text-xl font-bold text-white print:text-black print:text-sm">Toplam: <span className="text-[#FBE18D] print:text-black">{dailySummary.totalPeople}</span> Kişi</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 w-full print:grid-cols-2 print:gap-1">
                <div className="bg-white px-2 py-2 rounded-xl text-center print:border print:border-black print:rounded-md print:py-1"><span className="block text-[10px] text-slate-500 font-bold mb-0.5 print:text-black print:text-[8px]">TAVUK</span><span className="font-black text-xl text-[#0B3B2C] print:text-black print:text-sm">{dailySummary.totalTavuk}</span></div>
                <div className="bg-white px-2 py-2 rounded-xl text-center print:border print:border-black print:rounded-md print:py-1"><span className="block text-[10px] text-slate-500 font-bold mb-0.5 print:text-black print:text-[8px]">HÜNKAR</span><span className="font-black text-xl text-[#0B3B2C] print:text-black print:text-sm">{dailySummary.totalHunkar}</span></div>
                <div className="bg-white px-2 py-2 rounded-xl text-center print:border print:border-black print:rounded-md print:py-1"><span className="block text-[10px] text-slate-500 font-bold mb-0.5 print:text-black print:text-[8px]">IZGARA</span><span className="font-black text-xl text-[#0B3B2C] print:text-black print:text-sm">{dailySummary.totalKarisik}</span></div>
                <div className="bg-orange-50 px-2 py-2 rounded-xl text-center border border-orange-100 print:border-black print:bg-white print:rounded-md print:py-1"><span className="block text-[10px] text-orange-600 font-bold mb-0.5 print:text-black print:text-[8px]">ÇOCUK</span><span className="font-black text-xl text-orange-600 print:text-black print:text-sm">{dailySummary.totalCocuk}</span></div>
              </div>
            </div>

            {/* Masa Listesi Alanı */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[400px] print:p-0 print:border-none print:shadow-none">
              
              <div className={`flex items-center justify-between mb-5 pb-3 border-b border-slate-100 ${printSingleId ? 'print:hidden' : 'print:border-b-2 print:border-black print:pb-2 print:mb-3'}`}>
                <h2 className="text-lg font-bold flex items-center gap-2 print:text-sm"><Armchair className="text-[#0B3B2C] print:hidden" size={20} /> <span className="hidden print:inline">Masa Listesi</span><span className="print:hidden">Masalar</span></h2>
                
                <div className="flex items-center gap-3">
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold print:hidden">{filteredReservations.length} Kayıt</span>
                  {/* Tümünü Yazdır Butonu */}
                  <button onClick={() => window.print()} className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors print:hidden shadow-md" title="Tümünü Çift Sütun Yazdır">
                    <Printer size={16} /> <span className="hidden sm:inline">Tümünü Yazdır</span>
                  </button>
                </div>
              </div>
              
              {sortedReservations.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl border-2 border-dashed p-10 text-center text-slate-400 print:hidden"><Search size={32} className="mx-auto mb-3 opacity-50" /><p className="font-medium">Bu tarihe ait kayıt bulunamadı.</p></div>
              ) : (
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${printSingleId ? 'print:grid-cols-1 print:gap-0' : 'print:grid-cols-2 print:gap-2'}`}>
                  {sortedReservations.map((res) => {
                    const isArrived = res.isArrived || false;
                    const isBeingPrintedSingularly = printSingleId === res.id;
                    
                    return (
                    <div key={res.id} className={`p-4 rounded-2xl border-2 transition-all relative print:border print:border-black print:border-dashed print:rounded-lg print:shadow-none print:break-inside-avoid print:bg-white print:p-2 print:mb-1 ${printSingleId && !isBeingPrintedSingularly ? 'hidden print:hidden' : ''} ${isEditing === res.id ? 'border-[#FBE18D] bg-yellow-50/20' : isArrived ? 'border-emerald-500 bg-emerald-50 opacity-70 hover:opacity-100' : 'border-slate-100 bg-white hover:border-[#0B3B2C]/10'}`}>
                      
                      {/* Tekil yazdırma sırasında kartın içinde görünecek mini başlık */}
                      {isBeingPrintedSingularly && (
                        <div className="hidden print:block text-center font-bold text-[12px] uppercase mb-2 pb-1 border-b border-black">
                          Salaaş Cafe Adisyon<br/><span className="text-[9px] font-normal tracking-widest">{selectedFilterDate}</span>
                        </div>
                      )}

                      {/* Aksiyon Butonları (Yazdırmada Gizlenir) */}
                      <div className="absolute top-3 right-3 flex gap-1 print:hidden">
                        <button onClick={() => handleToggleArrived(res.id, isArrived)} className={`p-1.5 rounded flex items-center gap-1 text-xs font-bold transition-colors ${isArrived ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'text-slate-500 bg-slate-100 hover:text-emerald-600 hover:bg-emerald-50'}`} title={isArrived ? "İptal Et" : "Müşteri Geldi"}>
                          <CheckCircle size={16} />
                          <span className="hidden sm:inline">{isArrived ? "Geldi" : "Bekliyor"}</span>
                        </button>
                        <button onClick={() => handlePrintSingle(res.id)} className="p-1.5 text-slate-400 hover:text-purple-600 bg-slate-50 rounded border border-transparent" title="Sadece Bu Masayı Adisyon Olarak Yazdır">
                          <Printer size={16} />
                        </button>
                        <button onClick={() => handleEditClick(res)} className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 rounded border border-transparent" title="Düzenle"><Edit2 size={16} /></button>
                        <button onClick={() => setDeleteConfirmId(res.id)} className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 rounded border border-transparent" title="Sil"><Trash2 size={16} /></button>
                      </div>
                      
                      {deleteConfirmId === res.id && (
                         <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center p-3 border border-red-200 rounded-2xl print:hidden">
                           <p className="font-semibold text-sm mb-3">İptal edilsin mi?</p>
                           <div className="flex gap-2">
                             <button onClick={() => executeDelete(res.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold">Sil</button>
                             <button onClick={() => setDeleteConfirmId(null)} className="bg-slate-200 px-3 py-1.5 rounded-lg text-sm font-bold">Vazgeç</button>
                           </div>
                         </div>
                      )}
                      
                      {/* Fiş Formatı İçin Optimize Edilmiş Kart İçeriği */}
                      <h3 className={`text-md font-bold pr-32 truncate print:pr-0 print:text-black print:text-[11px] print:whitespace-normal print:leading-tight ${isArrived ? 'text-emerald-900 line-through decoration-emerald-500' : 'text-slate-800'}`}>{res.name}</h3>
                      
                      {/* TELEFON VE WHATSAPP BUTONU */}
                      {res.phone && (
                        <div className="flex items-center gap-2 mt-0.5 print:mt-0">
                          <p className={`text-xs font-medium flex items-center gap-1 print:text-black print:text-[9px] ${isArrived ? 'text-emerald-700/80' : 'text-slate-500'}`}>
                            <Phone size={12} className="print:hidden" /> <span className="hidden print:inline font-bold">Tel:</span> {res.phone}
                          </p>
                          <button onClick={() => sendWhatsApp(res)} className="print:hidden bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 hover:scale-110 p-1 rounded-full transition-all" title="WhatsApp Onay Mesajı Gönder">
                            <MessageCircle size={14} />
                          </button>
                        </div>
                      )}

                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold mt-1.5 print:bg-transparent print:p-0 print:mt-1 print:text-black print:text-[10px] ${isArrived ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}><Armchair size={12} className={`print:hidden ${isArrived ? 'text-emerald-700' : 'text-[#0B3B2C]'}`} /> <span className="hidden print:inline font-bold">Masa:</span> {res.table}</div>
                      
                      {/* ÖZEL NOT GÖSTERİMİ */}
                      {res.notes && (
                        <div className="mt-2.5 bg-amber-50 border border-amber-200 rounded-lg p-2 flex gap-1.5 items-start print:border-black print:border-dashed print:rounded-none print:bg-white print:p-1 print:mt-1.5">
                           <MessageSquareText size={14} className="text-amber-600 mt-0.5 shrink-0 print:hidden" />
                           <p className="text-xs font-semibold text-amber-800 print:text-black print:text-[9px]"><span className="hidden print:inline font-bold">Not: </span>{res.notes}</p>
                        </div>
                      )}
                      
                      <div className={`rounded-xl p-3 mt-3 border print:border-black print:border-t print:border-b-0 print:border-l-0 print:border-r-0 print:rounded-none print:bg-white print:p-0 print:pt-1 print:mt-1.5 ${isArrived ? 'bg-emerald-100/50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
                         <div className="flex items-center justify-between mb-2 border-b border-emerald-900/10 pb-1.5 print:border-none print:mb-0.5 print:pb-0">
                           <p className={`text-[10px] font-bold uppercase print:hidden ${isArrived ? 'text-emerald-700' : 'text-slate-400'}`}>Menü Detayı</p>
                           <div className={`px-2 py-0.5 rounded text-[10px] font-bold flex gap-1 items-center shrink-0 whitespace-nowrap print:bg-transparent print:text-black print:border-none print:p-0 print:text-[9px] ${isArrived ? 'bg-emerald-600 text-white' : 'bg-[#0B3B2C] text-[#FBE18D]'}`}><Users size={10} className="print:hidden" /> <span className="hidden print:inline font-bold">Kişi:</span> {res.peopleCount || 0}</div>
                         </div>
                         <ul className="text-xs space-y-1.5 font-medium text-slate-600 print:text-black print:text-[10px] print:space-y-0.5">
                            {res.menuTavuk > 0 && <li className="flex justify-between"><span>Tavuk</span> <span className={`font-bold px-1.5 rounded border print:border-none print:px-0 print:text-black ${isArrived ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-white text-slate-800'}`}>x {res.menuTavuk}</span></li>}
                            {res.menuHunkar > 0 && <li className="flex justify-between"><span>Hünkar</span> <span className={`font-bold px-1.5 rounded border print:border-none print:px-0 print:text-black ${isArrived ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-white text-slate-800'}`}>x {res.menuHunkar}</span></li>}
                            {res.menuKarisik > 0 && <li className="flex justify-between"><span>K. Izgara</span> <span className={`font-bold px-1.5 rounded border print:border-none print:px-0 print:text-black ${isArrived ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-white text-slate-800'}`}>x {res.menuKarisik}</span></li>}
                            {res.menuCocuk > 0 && <li className={`flex justify-between print:text-black ${isArrived ? 'text-emerald-800' : 'text-orange-700'}`}><span>Çocuk</span> <span className={`font-bold px-1.5 rounded border print:border-none print:px-0 print:text-black ${isArrived ? 'bg-emerald-200 border-emerald-300 text-emerald-900' : 'bg-orange-100 border-orange-200'}`}>x {res.menuCocuk}</span></li>}
                            {res.menuTavuk === 0 && res.menuHunkar === 0 && res.menuKarisik === 0 && (res.menuCocuk === 0 || res.menuCocuk === undefined) && <li className="text-slate-400 italic text-center py-1 print:text-left print:py-0 print:text-black">Menü seçilmedi</li>}
                         </ul>
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
