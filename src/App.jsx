import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, Users, UtensilsCrossed, Armchair, 
  Plus, Trash2, MoonStar, ChefHat, Search, Edit2, X, Check, Loader2, Clock, CheckCircle, Phone, Printer, MessageSquareText, MessageCircle, Map, Flame, BellRing, ArrowDown
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

// Restoran Mimari Kat Planı (Çiziminize göre birebir oranlanmış, Sandalye Tipleri Eklenmiş)
// type: 'v' (Dikey 2'li), 'h' (Yatay 2'li), 'lg-v' (Büyük Dikey 4'lü)
const TABLE_MAP = [
  // Sol Üst (3x3 Dikey Masalar)
  { id: 'B-3', top: '8%', left: '5%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-2', top: '8%', left: '17%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-1', top: '8%', left: '29%', width: '8%', height: '11%', type: 'v' },
  
  { id: 'B-4', top: '23%', left: '5%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-5', top: '23%', left: '17%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-6', top: '23%', left: '29%', width: '8%', height: '11%', type: 'v' },
  
  { id: 'B-9', top: '38%', left: '5%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-8', top: '38%', left: '17%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-7', top: '38%', left: '29%', width: '8%', height: '11%', type: 'v' },
  
  // Sol Alt (Yataylar ve Ortadaki Büyük B-12, Altındaki B-24)
  { id: 'B-10', top: '53%', left: '5%', width: '13%', height: '6%', type: 'h' },
  { id: 'B-11', top: '53%', left: '21%', width: '13%', height: '6%', type: 'h' },
  { id: 'B-12', top: '48%', left: '38%', width: '9%', height: '14%', type: 'lg-v' },
  { id: 'B-24', top: '74%', left: '38%', width: '9%', height: '14%', type: 'lg-v' },
  
  // Sağ Üst (Kasa/Banka Arkası Dikeyler)
  { id: 'B-13', top: '8%', left: '76%', width: '9%', height: '14%', type: 'lg-v' },
  { id: 'B-14', top: '26%', left: '76%', width: '9%', height: '14%', type: 'lg-v' },
  
  // Sağ Alt (Sol Sütun - Yataylar: B-20, 21, 22, 23)
  { id: 'B-20', top: '48%', left: '56%', width: '14%', height: '6%', type: 'h' },
  { id: 'B-21', top: '61%', left: '56%', width: '14%', height: '6%', type: 'h' },
  { id: 'B-22', top: '74%', left: '56%', width: '14%', height: '6%', type: 'h' },
  { id: 'B-23', top: '87%', left: '56%', width: '14%', height: '6%', type: 'h' },

  // Sağ Alt (Sağ Sütun - Dikeyler)
  { id: 'B-16', top: '46%', left: '80%', width: '9%', height: '12%', type: 'lg-v' },
  { id: 'B-17', top: '60%', left: '80%', width: '9%', height: '12%', type: 'lg-v' },
  { id: 'B-18', top: '74%', left: '80%', width: '9%', height: '12%', type: 'lg-v' },
  { id: 'B-19', top: '88%', left: '80%', width: '9%', height: '12%', type: 'lg-v' },
];

export default function App() {
  const getToday = () => {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Istanbul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(new Date());
  };

  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilterDate, setSelectedFilterDate] = useState(getToday());
  const [isEditing, setIsEditing] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [printSingleId, setPrintSingleId] = useState(null);
  const [showTableMap, setShowTableMap] = useState(false);
  
  const [iftarTime, setIftarTime] = useState(null);
  const [countdown, setCountdown] = useState("Hesaplanıyor...");
  const [isPrepTime, setIsPrepTime] = useState(false);
  const [isIftarTime, setIsIftarTime] = useState(false);
  
  const initialFormState = {
    name: '', phone: '', notes: '', peopleCount: 1, menuTavuk: 0, menuHunkar: 0, menuKarisik: 0, menuCocuk: 0, table: '', date: getToday(),
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Gebze&country=Turkey&method=13')
      .then(res => res.json())
      .then(data => {
        setIftarTime(data.data.timings.Maghrib);
      })
      .catch(err => console.error("İftar vakti çekilemedi", err));
  }, []);

  useEffect(() => {
    if (!iftarTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const [hours, minutes] = iftarTime.split(':');
      const iftarDate = new Date();
      iftarDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      let diff = iftarDate - now;

      if (diff < 0) {
        setCountdown("İFTAR VAKTİ!");
        setIsIftarTime(true);
        setIsPrepTime(false);
        clearInterval(interval);
        return;
      }

      if (diff <= 600000 && diff > 0) {
        setIsPrepTime(true);
      } else {
        setIsPrepTime(false);
      }

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      
      setCountdown(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [iftarTime]);

  useEffect(() => {
    const handleAfterPrint = () => setPrintSingleId(null);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrorMsg('');
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Count') || name.includes('menu') ? (value === '' ? '' : parseInt(value)) : value
    }));
  };

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
      setShowTableMap(false);
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

  const handlePrintSingle = (id) => {
    setPrintSingleId(id);
    setTimeout(() => {
      window.print();
    }, 150); 
  };

  const sendWhatsApp = (res) => {
    if (!res.phone) return;
    let cleanPhone = res.phone.replace(/\D/g, '');
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

  const getTableStatus = (tableName) => {
    const res = filteredReservations.find(r => r.table.trim().toUpperCase() === tableName.toUpperCase());
    if (!res) return 'empty';
    if (res.isArrived) return 'full';
    return 'reserved';
  };

  const handleTableSelect = (tableName) => {
    if (getTableStatus(tableName) !== 'empty') return;
    setFormData(prev => ({ ...prev, table: tableName }));
    setShowTableMap(false);
  };

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    if (a.isArrived === b.isArrived) {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); 
    }
    return a.isArrived ? 1 : -1; 
  });

  const dailySummary = filteredReservations.reduce((acc, res) => {
    acc.totalPeople += (parseInt(res.peopleCount) || 0);
    
    const tavuk = parseInt(res.menuTavuk) || 0;
    const hunkar = parseInt(res.menuHunkar) || 0;
    const karisik = parseInt(res.menuKarisik) || 0;
    const cocuk = parseInt(res.menuCocuk) || 0;
    
    acc.totalTavuk += tavuk;
    acc.totalHunkar += hunkar;
    acc.totalKarisik += karisik;
    acc.totalCocuk += cocuk;
    
    acc.totalMenu += (tavuk + hunkar + karisik + cocuk);
    
    return acc;
  }, { totalPeople: 0, totalTavuk: 0, totalHunkar: 0, totalKarisik: 0, totalCocuk: 0, totalMenu: 0 });

  // Doluluk Oranı Hesaplaması (Maks. 150 Kişi)
  const MAX_CAPACITY = 150;
  const occupancyRate = Math.min(100, Math.round((dailySummary.totalPeople / MAX_CAPACITY) * 100));

  return (
    <div className="min-h-screen font-sans text-slate-800 pb-12 print:bg-white print:pb-0 relative bg-slate-50">
      
      {/* İSLAMİ DESEN VE HİLAL (WATERMARK) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] print:hidden" 
           style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      <div className="fixed top-20 right-10 z-0 pointer-events-none opacity-5 text-emerald-900 rotate-12 print:hidden">
        <MoonStar size={400} strokeWidth={1} />
      </div>

      {/* SON 10 DAKİKA BİLDİRİMİ */}
      {isPrepTime && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-3 flex items-center justify-center gap-3 shadow-2xl animate-pulse print:hidden">
          <BellRing className="animate-bounce" />
          <span className="font-black tracking-widest text-sm md:text-lg uppercase">Mutfak Bildirimi: İftara son 10 Dakika! Servis Hazırlığı Başlasın!</span>
          <Flame className="animate-bounce text-yellow-300" />
        </div>
      )}

      {/* İFTAR VAKTİ KUTLAMA BİLDİRİMİ */}
      {isIftarTime && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-600 text-white p-3 flex items-center justify-center gap-3 shadow-2xl print:hidden">
          <MoonStar className="animate-spin-slow text-yellow-300" />
          <span className="font-black tracking-widest text-lg uppercase">Hayırlı İftarlar - İftar Vakti!</span>
        </div>
      )}

      {/* Genel Yazdırma Modu İçin Gizli Başlık */}
      <div className={`hidden ${!printSingleId ? 'print:block' : ''} text-center mb-4 border-b-2 border-black pb-2 relative z-10`}>
        <h1 className="text-xl font-bold font-sans uppercase">Salaaş Cafe İftar</h1>
        <p className="text-sm mt-1 font-bold text-black">Tarih: {selectedFilterDate}</p>
      </div>

      {/* Üst Bilgi Barı */}
      <header className={`bg-[#0B3B2C] text-white shadow-lg sticky z-20 print:hidden ${isPrepTime || isIftarTime ? 'top-[52px]' : 'top-0'} transition-all duration-300`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 shrink-0 flex items-center justify-center overflow-visible drop-shadow-md hover:scale-105 transition-transform">
               <img src="/salaas logo.png" alt="Salaaş Cafe Logo" className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
               <div className="hidden bg-orange-500 w-12 h-12 rounded-full items-center justify-center"><MoonStar className="text-white" size={24} /></div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 drop-shadow-sm font-serif">Salaaş Cafe <span className="text-white font-sans text-xl">İftar</span></h1>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <div className={`flex items-center rounded-xl px-5 py-2 border w-full md:w-auto justify-center shadow-inner transition-colors duration-500 ${isPrepTime ? 'bg-red-500/20 border-red-500 text-red-100' : isIftarTime ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' : 'bg-white/5 border-orange-500/30 text-orange-200'}`}>
              <Clock className={`mr-3 ${isPrepTime ? 'animate-bounce text-red-400' : 'opacity-80'}`} size={24} />
              <div className="flex flex-col items-center md:items-start">
                 <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Gebze İftara Kalan</span>
                 <span className={`font-mono font-black text-xl tracking-widest drop-shadow-md ${isPrepTime ? 'text-red-300' : isIftarTime ? 'text-emerald-300' : 'text-white'}`}>{countdown}</span>
              </div>
            </div>

            <div className="flex items-center bg-white/10 rounded-xl px-4 py-3 border border-white/10 w-full md:w-auto justify-center hover:bg-white/20 transition-colors">
              <CalendarDays className="mr-3 text-orange-400" size={20} />
              <input type="date" value={selectedFilterDate} onChange={(e) => setSelectedFilterDate(e.target.value)} className="bg-transparent text-white outline-none font-bold cursor-pointer text-base w-full md:w-auto" />
            </div>
          </div>

        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-32 text-orange-600 print:hidden relative z-10">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="font-bold tracking-widest animate-pulse uppercase">Sisteme Bağlanıyor...</p>
        </div>
      ) : (
        <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 print:block print:m-0 print:p-0 relative z-10">
          
          {/* SOL KOLON - FORM */}
          <div className="lg:col-span-4 space-y-6 print:hidden">
            <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border overflow-hidden transition-colors ${isEditing ? 'border-orange-400 shadow-orange-500/20' : 'border-slate-200/60'}`}>
              <div className={`px-6 py-5 flex items-center justify-between ${isEditing ? 'bg-orange-50 border-b border-orange-100' : 'bg-gradient-to-r from-slate-50 to-white border-b border-slate-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isEditing ? 'bg-orange-100 text-orange-600' : 'bg-[#0B3B2C]/10 text-[#0B3B2C]'}`}>
                    {isEditing ? <Edit2 size={20} /> : <Plus size={20} />}
                  </div>
                  <h2 className={`text-lg font-black tracking-wide ${isEditing ? 'text-orange-800' : 'text-[#0B3B2C]'}`}>{isEditing ? 'Rezervasyonu Düzenle' : 'Yeni Rezervasyon'}</h2>
                </div>
                {isEditing && <button onClick={cancelEdit} className="text-slate-400 p-1.5 hover:bg-white rounded-full shadow-sm border border-slate-200"><X size={18} /></button>}
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2 shadow-sm"><X size={16} /> {errorMsg}</div>}
                
                <div className="flex gap-4">
                  <div className="flex-[3]">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">İsim</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-slate-50/50 font-semibold transition-all" placeholder="Müşteri İsmi" />
                  </div>
                  <div className="flex-[2]">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Telefon</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-slate-50/50 font-semibold transition-all" placeholder="05XX..." />
                    </div>
                  </div>
                </div>

                {/* YENİ PREMIUM MASA PLANI (KAT KROKİSİ) */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-inner">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Masa Seçimi</label>
                    <button type="button" onClick={() => setShowTableMap(!showTableMap)} className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-orange-200 transition-colors">
                      <Map size={14} /> {showTableMap ? 'Haritayı Gizle' : 'Krokiden Seç'}
                    </button>
                  </div>
                  
                  {showTableMap ? (
                    <div className="mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      
                      {/* ÇİZİMİNİZE ÖZEL İNTERAKTİF KAT PLANI */}
                      <div className="relative w-full aspect-[4/5] sm:aspect-square min-h-[400px] bg-[#e6e2d8] border-[10px] border-slate-700/80 rounded-xl overflow-hidden shadow-inner font-sans">
                        
                        {/* Ahşap Parke Görünümlü Arka Plan Deseni */}
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, #000 20px, #000 21px)' }}></div>
                        
                        {/* GİRİŞ KAPISI VE PASPAS */}
                        <div className="absolute top-0 left-[42%] w-[16%] h-[4%] bg-amber-900 border-x-2 border-b-2 border-slate-800 rounded-b-md z-10 flex items-center justify-center shadow-lg">
                           <span className="text-[7px] sm:text-[9px] font-black text-amber-100 tracking-widest">GİRİŞ</span>
                        </div>
                        <div className="absolute top-[4%] left-[43%] w-[14%] h-[5%] bg-slate-800/60 rounded-b-sm z-0"></div>

                        {/* DUVAR ÇİZGİLERİ (Sizin çiziminizdeki hatlar) */}
                        <div className="absolute top-0 left-[68%] w-1.5 h-[22%] bg-slate-700 shadow-md rounded-b-md"></div>
                        <div className="absolute top-[39%] left-[68%] w-[15%] h-1.5 bg-slate-700 shadow-md rounded-r-md"></div>
                        <div className="absolute top-[41%] left-[73%] w-1.5 h-[8%] bg-slate-700 shadow-md rounded-t-md"></div>

                        {/* DEKORATİF BİTKİLER */}
                        <div className="absolute top-2 left-2 w-6 h-6 bg-emerald-800 rounded-full shadow-lg border-2 border-emerald-900 flex items-center justify-center z-0">
                           <div className="w-3 h-3 bg-emerald-500 rounded-full opacity-80"></div>
                        </div>
                        <div className="absolute bottom-2 left-2 w-7 h-7 bg-emerald-800 rounded-full shadow-lg border-2 border-emerald-900 flex items-center justify-center z-0">
                           <div className="w-3 h-3 bg-emerald-500 rounded-full opacity-80"></div>
                        </div>
                        <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-800 rounded-full shadow-lg border-2 border-emerald-900 flex items-center justify-center z-0">
                           <div className="w-4 h-4 bg-emerald-500 rounded-full opacity-80"></div>
                        </div>
                        
                        {/* MASALAR VE SANDALYELER */}
                        {TABLE_MAP.map(table => {
                           const status = getTableStatus(table.id);
                           
                           // Duruma Göre Renklendirmeler
                           let surfaceClass = "bg-[#d4a373] border-[#bc8a5f] text-amber-950"; // Boş (Ahşap)
                           let chairClass = "bg-[#eaddcf] border-[#d4a373]";
                           
                           if (status === 'reserved') {
                              surfaceClass = "bg-emerald-500 border-emerald-600 text-white"; // Rezerve
                              chairClass = "bg-emerald-400 border-emerald-500";
                           } else if (status === 'full') {
                              surfaceClass = "bg-red-500 border-red-600 text-white"; // Dolu
                              chairClass = "bg-red-400 border-red-500";
                           }
                           
                           return (
                              <button
                                key={table.id}
                                type="button"
                                disabled={status !== 'empty'}
                                onClick={() => handleTableSelect(table.id)}
                                className={`absolute group flex items-center justify-center transition-all duration-300 z-20 
                                  ${status === 'empty' ? 'hover:scale-110 cursor-pointer' : 'opacity-95 cursor-not-allowed'}`}
                                style={{ top: table.top, left: table.left, width: table.width, height: table.height }}
                              >
                                 {/* Masa Yüzeyi */}
                                 <div className={`relative w-full h-full flex items-center justify-center rounded shadow-lg border-b-4 border-r-2 ${surfaceClass}`}>
                                    <span className="font-black text-[8px] sm:text-[10px] drop-shadow-sm">{table.id}</span>
                                    
                                    {/* Sandalyeler (Masa Yönüne Göre Konumlanır) */}
                                    {table.type === 'v' && (
                                       <>
                                          <div className={`absolute -left-[5px] top-[20%] w-[5px] h-[60%] rounded-l-full shadow-sm border-b-2 ${chairClass}`}></div>
                                          <div className={`absolute -right-[5px] top-[20%] w-[5px] h-[60%] rounded-r-full shadow-sm border-b-2 ${chairClass}`}></div>
                                       </>
                                    )}
                                    {table.type === 'h' && (
                                       <>
                                          <div className={`absolute left-[20%] -top-[5px] w-[60%] h-[5px] rounded-t-full shadow-sm border-b-2 ${chairClass}`}></div>
                                          <div className={`absolute left-[20%] -bottom-[5px] w-[60%] h-[5px] rounded-b-full shadow-sm border-t-2 ${chairClass}`}></div>
                                       </>
                                    )}
                                    {table.type === 'lg-v' && (
                                       <>
                                          <div className={`absolute -left-[5px] top-[15%] w-[5px] h-[30%] rounded-l-full shadow-sm border-b-2 ${chairClass}`}></div>
                                          <div className={`absolute -left-[5px] bottom-[15%] w-[5px] h-[30%] rounded-l-full shadow-sm border-b-2 ${chairClass}`}></div>
                                          <div className={`absolute -right-[5px] top-[15%] w-[5px] h-[30%] rounded-r-full shadow-sm border-b-2 ${chairClass}`}></div>
                                          <div className={`absolute -right-[5px] bottom-[15%] w-[5px] h-[30%] rounded-r-full shadow-sm border-b-2 ${chairClass}`}></div>
                                       </>
                                    )}
                                 </div>
                              </button>
                           )
                        })}
                      </div>

                      {/* Kat Planı Lejantı */}
                      <div className="flex justify-center gap-5 mt-3 text-[10px] font-bold text-slate-500 border-t pt-3">
                        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#d4a373] border border-[#bc8a5f] shadow-sm"></div> Boş</span>
                        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-500 border border-emerald-600 shadow-sm"></div> Rezerve</span>
                        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-500 border border-red-600 shadow-sm"></div> Masada</span>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex gap-4">
                    <div className="flex-[2]">
                      <div className="relative">
                        <Armchair className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" name="table" value={formData.table} onChange={handleChange} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white font-black uppercase text-[#0B3B2C] transition-all shadow-sm" placeholder="Masa Kodu" />
                      </div>
                    </div>
                    <div className="flex-[1]">
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="number" inputMode="numeric" pattern="[0-9]*" name="peopleCount" min="1" value={formData.peopleCount} onChange={handleChange} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white font-black text-[#0B3B2C] transition-all shadow-sm" title="Kişi Sayısı" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><MessageSquareText size={14}/> Özel Not (Opsiyonel)</label>
                  <input type="text" name="notes" value={formData.notes} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-500 bg-amber-50/50 placeholder:text-amber-300 font-medium transition-all" placeholder="Örn: Mama sandalyesi eklenecek..." />
                </div>
                
                {/* PREMIUM MENÜ KARTLARI */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2"><UtensilsCrossed size={16} className="text-orange-500" /> İftar Menüsü (Adet)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    
                    <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-orange-300 transition-all group flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-2xl drop-shadow-sm group-hover:scale-110 transition-transform">🐔</span>
                        <input type="number" inputMode="numeric" pattern="[0-9]*" name="menuTavuk" min="0" value={formData.menuTavuk} onChange={handleChange} className="w-14 px-1 py-1 text-center border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-black text-[#0B3B2C] bg-slate-50" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Tavuk Menü</span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-orange-300 transition-all group flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-2xl drop-shadow-sm group-hover:scale-110 transition-transform">🥩</span>
                        <input type="number" inputMode="numeric" pattern="[0-9]*" name="menuHunkar" min="0" value={formData.menuHunkar} onChange={handleChange} className="w-14 px-1 py-1 text-center border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-black text-[#0B3B2C] bg-slate-50" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Hünkar Beğendi</span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-orange-300 transition-all group flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-2xl drop-shadow-sm group-hover:scale-110 transition-transform">🍢</span>
                        <input type="number" inputMode="numeric" pattern="[0-9]*" name="menuKarisik" min="0" value={formData.menuKarisik} onChange={handleChange} className="w-14 px-1 py-1 text-center border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-black text-[#0B3B2C] bg-slate-50" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Karışık Izgara</span>
                    </div>

                    <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-orange-400 transition-all group flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-2xl drop-shadow-sm group-hover:scale-110 transition-transform">🧸</span>
                        <input type="number" inputMode="numeric" pattern="[0-9]*" name="menuCocuk" min="0" value={formData.menuCocuk} onChange={handleChange} className="w-14 px-1 py-1 text-center border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-black text-orange-700 bg-white shadow-inner" />
                      </div>
                      <span className="text-xs font-bold text-orange-800">Çocuk Menüsü</span>
                    </div>

                  </div>
                </div>
                
                <button type="submit" className={`w-full font-black tracking-widest uppercase py-4 mt-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 text-white hover:scale-[1.02] active:scale-95 ${isEditing ? 'bg-gradient-to-r from-[#0B3B2C] to-emerald-900 shadow-emerald-900/30' : 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/30'}`}>
                  {isEditing ? <Check size={22} /> : <Plus size={22} strokeWidth={3} />} {isEditing ? 'Değişiklikleri Kaydet' : 'Sisteme Ekle'}
                </button>
              </form>
            </div>
          </div>

          {/* SAĞ KOLON - LİSTE VE MUTFAK */}
          <div className="lg:col-span-8 space-y-6 print:w-full print:block print:space-y-4">
            
            {/* Mutfak Canlı Özet & Kapasite Barı */}
            <div className={`bg-gradient-to-br from-[#0B3B2C] to-emerald-900 rounded-3xl p-6 shadow-xl flex flex-col gap-5 relative overflow-hidden ${printSingleId ? 'print:hidden' : 'print:bg-white print:from-white print:to-white print:border-b-2 print:border-black print:rounded-none print:shadow-none print:p-2 print:mb-4'}`}>
              <div className="absolute right-0 top-0 opacity-5 pointer-events-none print:hidden">
                 <ChefHat size={180} />
              </div>

              <div className="flex flex-col gap-4 w-full border-b border-emerald-700/50 pb-5 z-10 print:border-black print:pb-2">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
                  <div className="flex items-center gap-4 text-[#FBE18D]">
                    <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10 print:hidden"><ChefHat size={28} /></div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-orange-400 print:text-black print:text-[10px]">Mutfak Canlı Özet Paneli</p>
                      <div className="flex gap-3 items-baseline mt-0.5">
                        <p className="text-2xl font-black text-white drop-shadow-md print:text-black print:text-sm">Kişi: <span className="text-orange-400 print:text-black">{dailySummary.totalPeople}</span></p>
                        <span className="text-emerald-500 font-bold print:hidden">|</span>
                        <p className="text-xl font-bold text-slate-200 drop-shadow-sm print:text-black print:text-sm">Seçilen Menü: <span className="text-yellow-400 print:text-black">{dailySummary.totalMenu}</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* YENİ: İLERLEME/KAPASİTE BARI */}
                <div className="w-full pt-1 print:hidden">
                   <div className="flex justify-between items-end mb-1.5 px-1">
                     <span className="text-[10px] font-bold text-emerald-200 tracking-wider uppercase">Kapasite: {MAX_CAPACITY} Kişi</span>
                     <span className={`text-[10px] font-black tracking-wider ${occupancyRate >= 90 ? 'text-red-400' : occupancyRate >= 60 ? 'text-orange-300' : 'text-emerald-300'}`}>
                       DOLULUK: %{occupancyRate}
                     </span>
                   </div>
                   <div className="w-full bg-emerald-950/60 rounded-full h-2 shadow-inner overflow-hidden">
                     <div 
                       className={`h-2 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)] ${occupancyRate >= 90 ? 'bg-gradient-to-r from-red-500 to-red-400' : occupancyRate >= 60 ? 'bg-gradient-to-r from-orange-500 to-yellow-400' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'}`} 
                       style={{ width: `${occupancyRate}%` }}
                     ></div>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 w-full z-10 print:grid-cols-2 print:gap-1">
                <div className="bg-white/95 backdrop-blur-sm px-3 py-3 rounded-2xl text-center shadow-lg border-b-4 border-slate-200 print:border print:border-black print:rounded-md print:py-1"><span className="block text-[10px] text-slate-500 font-bold mb-0.5 print:text-black print:text-[8px]">TAVUK</span><span className="font-black text-2xl text-[#0B3B2C] print:text-black print:text-sm">{dailySummary.totalTavuk}</span></div>
                <div className="bg-white/95 backdrop-blur-sm px-3 py-3 rounded-2xl text-center shadow-lg border-b-4 border-slate-200 print:border print:border-black print:rounded-md print:py-1"><span className="block text-[10px] text-slate-500 font-bold mb-0.5 print:text-black print:text-[8px]">HÜNKAR</span><span className="font-black text-2xl text-[#0B3B2C] print:text-black print:text-sm">{dailySummary.totalHunkar}</span></div>
                <div className="bg-white/95 backdrop-blur-sm px-3 py-3 rounded-2xl text-center shadow-lg border-b-4 border-slate-200 print:border print:border-black print:rounded-md print:py-1"><span className="block text-[10px] text-slate-500 font-bold mb-0.5 print:text-black print:text-[8px]">IZGARA</span><span className="font-black text-2xl text-[#0B3B2C] print:text-black print:text-sm">{dailySummary.totalKarisik}</span></div>
                <div className="bg-gradient-to-b from-orange-50 to-orange-100 px-3 py-3 rounded-2xl text-center shadow-lg border-b-4 border-orange-200 print:border-black print:bg-white print:rounded-md print:py-1"><span className="block text-[10px] text-orange-600 font-bold mb-0.5 print:text-black print:text-[8px]">ÇOCUK</span><span className="font-black text-2xl text-orange-600 print:text-black print:text-sm">{dailySummary.totalCocuk}</span></div>
              </div>
            </div>

            {/* Masa Listesi Alanı */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/60 p-6 min-h-[400px] print:p-0 print:border-none print:shadow-none print:bg-white">
              
              <div className={`flex items-center justify-between mb-6 pb-4 border-b border-slate-100 ${printSingleId ? 'print:hidden' : 'print:border-b-2 print:border-black print:pb-2 print:mb-3'}`}>
                <h2 className="text-xl font-black flex items-center gap-2 tracking-wide text-[#0B3B2C] print:text-sm"><Armchair className="text-orange-500 print:hidden" size={24} /> <span className="hidden print:inline">Masa Listesi</span><span className="print:hidden">Aktif Masalar</span></h2>
                
                <div className="flex items-center gap-3">
                  <span className="bg-orange-100 text-orange-800 px-4 py-1.5 rounded-full text-xs font-black print:hidden">{filteredReservations.length} Kayıt</span>
                  {/* Tümünü Yazdır Butonu */}
                  <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors shadow-lg hover:shadow-xl print:hidden active:scale-95">
                    <Printer size={16} /> <span className="hidden sm:inline uppercase tracking-widest">Tümünü Yazdır</span>
                  </button>
                </div>
              </div>
              
              {sortedReservations.length === 0 ? (
                <div className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center text-slate-400 print:hidden flex flex-col items-center">
                  <div className="bg-white p-4 rounded-full shadow-sm mb-4"><Search size={32} className="opacity-50 text-orange-400" /></div>
                  <p className="font-bold text-lg text-slate-600">Bu tarihe ait kayıt bulunamadı.</p>
                  <p className="text-sm mt-1">Yeni rezervasyonlar soldaki formdan eklenebilir.</p>
                </div>
              ) : (
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${printSingleId ? 'print:grid-cols-1 print:gap-0' : 'print:grid-cols-2 print:gap-2'}`}>
                  {sortedReservations.map((res) => {
                    const isArrived = res.isArrived || false;
                    const isBeingPrintedSingularly = printSingleId === res.id;
                    
                    return (
                    <div key={res.id} className={`p-5 rounded-2xl border-2 transition-all duration-300 relative group print:border print:border-black print:border-dashed print:rounded-lg print:shadow-none print:break-inside-avoid print:bg-white print:p-2 print:mb-1 ${printSingleId && !isBeingPrintedSingularly ? 'hidden print:hidden' : ''} ${isEditing === res.id ? 'border-orange-400 bg-orange-50/30 shadow-lg shadow-orange-500/10' : isArrived ? 'border-emerald-500 bg-emerald-50/50 opacity-80 hover:opacity-100' : 'border-slate-100 bg-white hover:border-orange-200 hover:shadow-md'}`}>
                      
                      {isBeingPrintedSingularly && (
                        <div className="hidden print:block text-center font-bold text-[12px] uppercase mb-2 pb-1 border-b border-black">
                          Salaaş Cafe Adisyon<br/><span className="text-[9px] font-normal tracking-widest">{selectedFilterDate}</span>
                        </div>
                      )}

                      {/* Aksiyon Butonları */}
                      <div className="absolute top-4 right-4 flex gap-1 print:hidden">
                        <button onClick={() => handleToggleArrived(res.id, isArrived)} className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-black tracking-wide transition-all shadow-sm ${isArrived ? 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-md' : 'text-slate-600 bg-white border border-slate-200 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50'}`} title={isArrived ? "İptal Et" : "Müşteri Geldi İşaretle"}>
                          <CheckCircle size={16} />
                          <span className="hidden sm:inline">{isArrived ? "MASADA" : "GELMEDİ"}</span>
                        </button>
                        <button onClick={() => handlePrintSingle(res.id)} className="p-1.5 text-slate-400 hover:text-[#0B3B2C] hover:bg-slate-100 rounded-lg transition-colors" title="Adisyon Yazdır">
                          <Printer size={18} />
                        </button>
                        <button onClick={() => handleEditClick(res)} className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Düzenle"><Edit2 size={18} /></button>
                        <button onClick={() => setDeleteConfirmId(res.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sil"><Trash2 size={18} /></button>
                      </div>
                      
                      {deleteConfirmId === res.id && (
                         <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 border border-red-200 rounded-2xl print:hidden">
                           <p className="font-black text-slate-800 mb-4 tracking-wide">İptal edilsin mi?</p>
                           <div className="flex gap-3">
                             <button onClick={() => executeDelete(res.id)} className="bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-red-700">Evet, Sil</button>
                             <button onClick={() => setDeleteConfirmId(null)} className="bg-slate-100 text-slate-700 px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-200">Vazgeç</button>
                           </div>
                         </div>
                      )}
                      
                      <h3 className={`text-lg font-black pr-40 truncate print:pr-0 print:text-black print:text-[11px] print:whitespace-normal print:leading-tight ${isArrived ? 'text-emerald-900 line-through decoration-emerald-500/50 decoration-2' : 'text-[#0B3B2C]'}`}>{res.name}</h3>
                      
                      {res.phone && (
                        <div className="flex items-center gap-2 mt-1 print:mt-0">
                          <p className={`text-xs font-semibold flex items-center gap-1.5 print:text-black print:text-[9px] ${isArrived ? 'text-emerald-700/80' : 'text-slate-500'}`}>
                            <Phone size={12} className="print:hidden text-orange-400" /> <span className="hidden print:inline font-bold">Tel:</span> {res.phone}
                          </p>
                          <button onClick={() => sendWhatsApp(res)} className="print:hidden bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white p-1.5 rounded-full transition-all shadow-sm" title="WhatsApp Teyit Mesajı">
                            <MessageCircle size={14} />
                          </button>
                        </div>
                      )}

                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black mt-2.5 uppercase tracking-wide print:bg-transparent print:p-0 print:mt-1 print:text-black print:text-[10px] ${isArrived ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-50 text-orange-800 border border-orange-100'}`}><Armchair size={14} className={`print:hidden ${isArrived ? 'text-emerald-600' : 'text-orange-500'}`} /> <span className="hidden print:inline font-bold">Masa:</span> {res.table}</div>
                      
                      {res.notes && (
                        <div className="mt-3 bg-gradient-to-r from-amber-50 to-yellow-50/50 border border-amber-200 rounded-xl p-2.5 flex gap-2 items-start print:border-black print:border-dashed print:rounded-none print:bg-white print:p-1 print:mt-1.5">
                           <MessageSquareText size={16} className="text-amber-500 mt-0.5 shrink-0 print:hidden" />
                           <p className="text-xs font-bold text-amber-800 print:text-black print:text-[9px] leading-relaxed"><span className="hidden print:inline font-bold">Not: </span>{res.notes}</p>
                        </div>
                      )}
                      
                      <div className={`rounded-xl p-3.5 mt-3.5 border shadow-inner print:border-black print:border-t print:border-b-0 print:border-l-0 print:border-r-0 print:rounded-none print:bg-white print:p-0 print:pt-1 print:mt-1.5 print:shadow-none ${isArrived ? 'bg-emerald-100/30 border-emerald-200/50' : 'bg-slate-50/50 border-slate-100'}`}>
                         <div className="flex items-center justify-between mb-2.5 border-b border-slate-200/80 pb-2 print:border-none print:mb-0.5 print:pb-0">
                           <p className={`text-[10px] font-black uppercase tracking-widest print:hidden ${isArrived ? 'text-emerald-700/70' : 'text-slate-400'}`}>Sipariş</p>
                           <div className={`px-2.5 py-1 rounded-md text-[10px] font-black flex gap-1.5 items-center shrink-0 whitespace-nowrap shadow-sm print:bg-transparent print:text-black print:border-none print:p-0 print:shadow-none print:text-[9px] ${isArrived ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'}`}><Users size={12} className="print:hidden text-orange-300" /> <span className="hidden print:inline font-bold">Kişi:</span> {res.peopleCount || 0} KİŞİ</div>
                         </div>
                         <ul className="text-xs space-y-2 font-bold text-slate-600 print:text-black print:text-[10px] print:space-y-0.5">
                            {res.menuTavuk > 0 && <li className="flex justify-between items-center"><span>Tavuk Menü</span> <span className={`px-2 py-0.5 rounded-md border print:border-none print:px-0 print:text-black ${isArrived ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-white text-slate-800 shadow-sm'}`}>x {res.menuTavuk}</span></li>}
                            {res.menuHunkar > 0 && <li className="flex justify-between items-center"><span>Hünkar Beğendi</span> <span className={`px-2 py-0.5 rounded-md border print:border-none print:px-0 print:text-black ${isArrived ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-white text-slate-800 shadow-sm'}`}>x {res.menuHunkar}</span></li>}
                            {res.menuKarisik > 0 && <li className="flex justify-between items-center"><span>Karışık Izgara</span> <span className={`px-2 py-0.5 rounded-md border print:border-none print:px-0 print:text-black ${isArrived ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-white text-slate-800 shadow-sm'}`}>x {res.menuKarisik}</span></li>}
                            {res.menuCocuk > 0 && <li className={`flex justify-between items-center print:text-black ${isArrived ? 'text-emerald-800' : 'text-orange-600'}`}><span>Çocuk Menüsü</span> <span className={`px-2 py-0.5 rounded-md border print:border-none print:px-0 print:text-black ${isArrived ? 'bg-emerald-200 border-emerald-300 text-emerald-900' : 'bg-orange-100 border-orange-200 shadow-sm'}`}>x {res.menuCocuk}</span></li>}
                            {res.menuTavuk === 0 && res.menuHunkar === 0 && res.menuKarisik === 0 && (res.menuCocuk === 0 || res.menuCocuk === undefined) && <li className="text-slate-400 italic text-center py-1.5 print:text-left print:py-0 print:text-black font-medium">Sipariş seçilmedi</li>}
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
