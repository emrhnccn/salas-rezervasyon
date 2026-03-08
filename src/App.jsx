import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, Users, UtensilsCrossed, Armchair, 
  Plus, Trash2, MoonStar, ChefHat, Search, Edit2, X, Check, Loader2, Clock, CheckCircle, Phone, Printer, MessageSquareText, MessageCircle, Map, Flame, BellRing, MonitorPlay, Lock, ArrowRight, MapPin, Instagram, Wind, Coffee
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

// İftar Restoran Mimari Kat Planı
const TABLE_MAP = [
  { id: 'B-3', top: '8%', left: '5%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-2', top: '8%', left: '17%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-1', top: '8%', left: '29%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-4', top: '23%', left: '5%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-5', top: '23%', left: '17%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-6', top: '23%', left: '29%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-9', top: '38%', left: '5%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-8', top: '38%', left: '17%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-7', top: '38%', left: '29%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-10', top: '53%', left: '5%', width: '13%', height: '6%', type: 'h' },
  { id: 'B-11', top: '53%', left: '21%', width: '13%', height: '6%', type: 'h' },
  { id: 'B-12', top: '48%', left: '38%', width: '9%', height: '14%', type: 'lg-v' },
  { id: 'B-24', top: '74%', left: '38%', width: '9%', height: '14%', type: 'lg-v' },
  { id: 'B-13', top: '8%', left: '76%', width: '9%', height: '14%', type: 'lg-v' },
  { id: 'B-14', top: '26%', left: '76%', width: '9%', height: '14%', type: 'lg-v' },
  { id: 'B-20', top: '48%', left: '56%', width: '14%', height: '6%', type: 'h' },
  { id: 'B-21', top: '61%', left: '56%', width: '14%', height: '6%', type: 'h' },
  { id: 'B-22', top: '74%', left: '56%', width: '14%', height: '6%', type: 'h' },
  { id: 'B-23', top: '87%', left: '56%', width: '14%', height: '6%', type: 'h' },
  { id: 'B-16', top: '46%', left: '80%', width: '9%', height: '12%', type: 'lg-v' },
  { id: 'B-17', top: '60%', left: '80%', width: '9%', height: '12%', type: 'lg-v' },
  { id: 'B-18', top: '74%', left: '80%', width: '9%', height: '12%', type: 'lg-v' },
  { id: 'B-19', top: '88%', left: '80%', width: '9%', height: '12%', type: 'lg-v' },
];

export default function App() {
  const getToday = () => {
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' });
    return formatter.format(new Date());
  };

  // OTURUM AÇMA (LOGIN) STATE'LERİ
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // SAYFA GEÇİŞ STATE'İ (Sadece admin için)
  const [activePage, setActivePage] = useState('iftar'); // 'iftar' veya 'mac'

  // MÜŞTERİ EKRANI TARİH SEÇİMİ
  const [visitorDate, setVisitorDate] = useState(getToday());

  // İFTAR STATE'LERİ
  const [reservations, setReservations] = useState([]);
  const [selectedFilterDate, setSelectedFilterDate] = useState(getToday());
  const [isEditing, setIsEditing] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [printSingleId, setPrintSingleId] = useState(null);
  const [showTableMap, setShowTableMap] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const initialFormState = { name: '', phone: '', notes: '', peopleCount: 1, menuTavuk: 0, menuHunkar: 0, menuKarisik: 0, menuCocuk: 0, table: '', date: getToday() };
  const [formData, setFormData] = useState(initialFormState);

  // MAÇ STATE'LERİ
  const [matchReservations, setMatchReservations] = useState([]);
  const [selectedMatchDate, setSelectedMatchDate] = useState(getToday());
  const [isMatchEditing, setIsMatchEditing] = useState(null);
  const [matchSearchTerm, setMatchSearchTerm] = useState('');
  const initialMatchFormState = { name: '', phone: '', notes: '', peopleCount: 1, table: '', date: getToday() };
  const [matchFormData, setMatchFormData] = useState(initialMatchFormState);
  const [matchErrorMsg, setMatchErrorMsg] = useState('');
  const [matchDeleteConfirmId, setMatchDeleteConfirmId] = useState(null);

  // İFTAR SAYAÇ STATE'LERİ
  const [iftarTime, setIftarTime] = useState(null);
  const [countdown, setCountdown] = useState("Hesaplanıyor...");
  const [isPrepTime, setIsPrepTime] = useState(false);
  const [isIftarTime, setIsIftarTime] = useState(false);

  useEffect(() => {
    document.title = "Salaaş Cafe Restaurant";
  }, []);

  // Gebze İftar Vakti Çekme
  useEffect(() => {
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Gebze&country=Turkey&method=13')
      .then(res => res.json())
      .then(data => {
        if (data && data.data && data.data.timings && data.data.timings.Maghrib) {
          setIftarTime(data.data.timings.Maghrib);
        }
      })
      .catch(err => console.error("İftar vakti çekilemedi", err));
  }, []);

  // Geri Sayım
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
      if (diff <= 600000 && diff > 0) setIsPrepTime(true);
      else setIsPrepTime(false);

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

  // Auth ve Veri Çekme
  useEffect(() => {
    signInAnonymously(auth).catch((error) => console.error("Giriş hatası:", error));
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const iftarUnsubscribe = onSnapshot(collection(db, 'reservations'), (snapshot) => {
      setReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    const matchUnsubscribe = onSnapshot(collection(db, 'matchReservations'), (snapshot) => {
      setMatchReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => {
      iftarUnsubscribe();
      matchUnsubscribe();
    };
  }, [user]);

  // LOGIN FONKSİYONU
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUser === 'salaas' && loginPass === 'Salaas.2026') {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setLoginError('');
    } else {
      setLoginError('Kullanıcı adı veya şifre hatalı!');
    }
  };

  // --- İFTAR FONKSİYONLARI ---
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
    if (!user) return;
    if (!formData.name?.trim()) { setErrorMsg("Lütfen İsim alanını doldurun."); return; }
    
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
      if (isEditing) {
        await updateDoc(doc(db, 'reservations', isEditing), { ...cleanData, updatedAt: new Date().toISOString() });
        setIsEditing(null);
      } else {
        await addDoc(collection(db, 'reservations'), { ...cleanData, createdAt: new Date().toISOString(), createdBy: user.uid, isArrived: false });
      }
      setFormData({ ...initialFormState, date: cleanData.date });
      setShowTableMap(false);
    } catch (err) { setErrorMsg("Kayıt hatası."); }
  };

  const handleEditClick = (res) => {
    setFormData({ ...res, phone: res.phone || '', notes: res.notes || '', menuCocuk: res.menuCocuk || 0 });
    setIsEditing(res.id);
    setSelectedFilterDate(res.date);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({ ...initialFormState, date: selectedFilterDate });
    setErrorMsg('');
  };

  // --- MAÇ FONKSİYONLARI ---
  const handleMatchChange = (e) => {
    const { name, value } = e.target;
    setMatchErrorMsg('');
    setMatchFormData(prev => ({
      ...prev,
      [name]: name === 'peopleCount' ? (value === '' ? '' : parseInt(value)) : value
    }));
  };

  const handleMatchSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!matchFormData.name?.trim()) { setMatchErrorMsg("Lütfen İsim alanını doldurun."); return; }
    
    const cleanData = {
      ...matchFormData,
      phone: matchFormData.phone?.trim() || '',
      notes: matchFormData.notes?.trim() || '', 
      peopleCount: parseInt(matchFormData.peopleCount) || 1,
    };

    try {
      if (isMatchEditing) {
        await updateDoc(doc(db, 'matchReservations', isMatchEditing), { ...cleanData, updatedAt: new Date().toISOString() });
        setIsMatchEditing(null);
      } else {
        await addDoc(collection(db, 'matchReservations'), { ...cleanData, createdAt: new Date().toISOString(), createdBy: user.uid, isArrived: false });
      }
      setMatchFormData({ ...initialMatchFormState, date: cleanData.date });
    } catch (err) { setMatchErrorMsg("Kayıt hatası."); }
  };

  const handleMatchEditClick = (res) => {
    setMatchFormData({ ...res, phone: res.phone || '', notes: res.notes || '' });
    setIsMatchEditing(res.id);
    setSelectedMatchDate(res.date);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelMatchEdit = () => {
    setIsMatchEditing(null);
    setMatchFormData({ ...initialMatchFormState, date: selectedMatchDate });
    setMatchErrorMsg('');
  };

  // --- ORTAK FONKSİYONLAR ---
  const handleToggleArrived = async (id, currentStatus, collectionName) => {
    if (!user) return;
    await updateDoc(doc(db, collectionName, id), { isArrived: !currentStatus });
  };

  const executeDelete = async (id, collectionName) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      if (collectionName === 'reservations') {
        setDeleteConfirmId(null);
        if (isEditing === id) cancelEdit();
      } else {
        setMatchDeleteConfirmId(null);
        if (isMatchEditing === id) cancelMatchEdit();
      }
    } catch (err) { console.error("Silme hatası:", err); }
  };

  const sendWhatsApp = (res, type) => {
    if (!res.phone) return;
    let cleanPhone = res.phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '9' + cleanPhone;
    else if (cleanPhone.length === 10) cleanPhone = '90' + cleanPhone;

    const eventName = type === 'iftar' ? 'iftar' : 'maç yayını';
    const masaMetni = res.table ? `${res.table} nolu masanız için ` : '';
    const nameStr = res.name || 'Misafirimiz';
    const message = `Sayın ${nameStr},\nSalaaş Cafe'ye ${res.date} tarihindeki ${masaMetni}${res.peopleCount} kişilik ${eventName} rezervasyonunuz alınmıştır. Bizi tercih ettiğiniz için teşekkür ederiz.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return "SC";
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return "SC";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // MÜŞTERİ GİRİŞİ (VISITOR) HESAPLAMALARI
  const visitorIftarReservations = reservations.filter(res => res.date === visitorDate);
  const visitorIftarSummary = visitorIftarReservations.reduce((acc, res) => {
    acc.totalPeople += (parseInt(res.peopleCount) || 0);
    acc.totalTavuk += (parseInt(res.menuTavuk) || 0);
    acc.totalHunkar += (parseInt(res.menuHunkar) || 0);
    acc.totalKarisik += (parseInt(res.menuKarisik) || 0);
    acc.totalCocuk += (parseInt(res.menuCocuk) || 0);
    acc.totalMenu += ((parseInt(res.menuTavuk) || 0) + (parseInt(res.menuHunkar) || 0) + (parseInt(res.menuKarisik) || 0) + (parseInt(res.menuCocuk) || 0));
    return acc;
  }, { totalPeople: 0, totalTavuk: 0, totalHunkar: 0, totalKarisik: 0, totalCocuk: 0, totalMenu: 0 });

  const visitorMatchReservations = matchReservations.filter(res => res.date === visitorDate);
  const visitorTotalMatchPeople = visitorMatchReservations.reduce((acc, res) => acc + (parseInt(res.peopleCount) || 0), 0);

  // ADMİN İFTAR FİLTRELEME & MATEMATİK
  const filteredReservations = reservations.filter(res => res.date === selectedFilterDate);
  const searchedReservations = filteredReservations.filter(res => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return res.name?.toLowerCase().includes(term) || res.table?.toLowerCase().includes(term) || (res.phone && res.phone.includes(term));
  });
  const sortedReservations = [...searchedReservations].sort((a, b) => {
    if (a.isArrived === b.isArrived) return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); 
    return a.isArrived ? 1 : -1; 
  });
  const dailySummary = filteredReservations.reduce((acc, res) => {
    acc.totalPeople += (parseInt(res.peopleCount) || 0);
    acc.totalTavuk += (parseInt(res.menuTavuk) || 0);
    acc.totalHunkar += (parseInt(res.menuHunkar) || 0);
    acc.totalKarisik += (parseInt(res.menuKarisik) || 0);
    acc.totalCocuk += (parseInt(res.menuCocuk) || 0);
    acc.totalMenu += ((parseInt(res.menuTavuk) || 0) + (parseInt(res.menuHunkar) || 0) + (parseInt(res.menuKarisik) || 0) + (parseInt(res.menuCocuk) || 0));
    return acc;
  }, { totalPeople: 0, totalTavuk: 0, totalHunkar: 0, totalKarisik: 0, totalCocuk: 0, totalMenu: 0 });

  // ADMİN MAÇ FİLTRELEME & MATEMATİK
  const filteredMatchReservations = matchReservations.filter(res => res.date === selectedMatchDate);
  const searchedMatchReservations = filteredMatchReservations.filter(res => {
    if (!matchSearchTerm) return true;
    const term = matchSearchTerm.toLowerCase();
    return res.name?.toLowerCase().includes(term) || (res.table && res.table.toLowerCase().includes(term)) || (res.phone && res.phone.includes(term));
  });
  const sortedMatchReservations = [...searchedMatchReservations].sort((a, b) => {
    if (a.isArrived === b.isArrived) return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); 
    return a.isArrived ? 1 : -1; 
  });
  const totalMatchPeople = filteredMatchReservations.reduce((acc, res) => acc + (parseInt(res.peopleCount) || 0), 0);

  const getTableStatus = (tableName) => {
    const res = filteredReservations.find(r => r.table?.trim().toUpperCase() === tableName.toUpperCase());
    if (!res) return 'empty';
    if (res.isArrived) return 'full';
    return 'reserved';
  };

  const occupancyRate = Math.min(100, Math.round((dailySummary.totalPeople / 150) * 100));
  
  const handlePrintSingle = (id) => {
    setPrintSingleId(id);
    setTimeout(() => { window.print(); }, 150); 
  };


  // =======================================================================
  // 1. MÜŞTERİ / ZİYARETÇİ EKRANI (LANDING PAGE)
  // =======================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 relative overflow-hidden flex flex-col">
        {/* İslami Desen Arka Plan */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0B3B2C 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute -top-32 -right-32 z-0 pointer-events-none opacity-5 text-[#0B3B2C] rotate-12"><MoonStar size={500} strokeWidth={1} /></div>

        {/* Müşteri Üst Bar - Tam Genişlik Logo Banner */}
        <header className="w-full bg-white shadow-md relative z-10 border-b border-slate-200 flex justify-center items-center">
           <img 
              src="/salaaslogouzun.jpg" 
              alt="Salaaş Cafe Restaurant" 
              className="w-full h-auto max-h-[300px] sm:max-h-[400px] object-contain hover:scale-[1.01] transition-transform duration-700" 
           />
        </header>

        {/* Ana İçerik */}
        <main className="max-w-2xl mx-auto px-4 py-8 w-full relative z-10 flex-1 flex flex-col gap-6 mt-2">
          
          {loading ? (
            <div className="flex justify-center py-10 text-orange-500"><Loader2 className="animate-spin" size={40} /></div>
          ) : (
            <>
              {/* DİJİTAL MENÜ BUTONU */}
              <a href="https://m.1menu.com.tr/salaascafe/" target="_blank" rel="noreferrer" className="bg-gradient-to-r from-[#0B3B2C] to-emerald-800 text-white rounded-3xl p-6 shadow-xl flex items-center justify-between hover:scale-[1.02] hover:shadow-2xl transition-all relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform"><UtensilsCrossed size={120} /></div>
                <div className="flex items-center gap-5 relative z-10">
                  <div className="bg-orange-500 text-white p-4 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                    <UtensilsCrossed size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-wide text-orange-400">Dijital Menümüz</h3>
                    <p className="text-sm text-emerald-100 font-medium mt-1">Tüm lezzetlerimizi ve fiyatlarımızı inceleyin.</p>
                  </div>
                </div>
                <div className="bg-emerald-700/50 p-3 rounded-full relative z-10 border border-emerald-600">
                  <ArrowRight size={24} className="text-orange-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              {/* YENİ: GÖRSEL GALERİ (Kendi Menü Fotoğraflarınız) */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 mt-2">
                <h4 className="text-xl font-black mb-5 text-[#0B3B2C] flex items-center gap-2">
                  <Flame className="text-orange-500" size={24} /> Öne Çıkan Lezzetlerimiz
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {/* Başrolde: Salaaş Köy Kahvaltısı */}
                  <div className="rounded-2xl overflow-hidden shadow-sm aspect-[16/9] relative group col-span-2 border-2 border-orange-100">
                    <img 
                      src="/salaaskoykahvaltisi.jpg" 
                      alt="Salaaş Köy Kahvaltısı" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                       <span className="text-orange-400 font-black text-xs tracking-widest uppercase mb-1 flex items-center gap-1"><Flame size={12}/> En Çok Tercih Edilen</span>
                       <span className="text-white font-black text-xl sm:text-2xl drop-shadow-md">Salaaş Köy Kahvaltısı</span>
                    </div>
                  </div>
                  
                  {/* Kendi Yemek Görselleriniz */}
                  <div className="rounded-2xl overflow-hidden shadow-sm aspect-square relative group">
                    <img 
                      src="/mantarlıfırınburger.jpg" 
                      alt="Mantarlı Fırın Burger" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                       <span className="text-white font-bold text-sm">Mantarlı Fırın Burger</span>
                    </div>
                  </div>

                  <div className="rounded-2xl overflow-hidden shadow-sm aspect-square relative group">
                    <img 
                      src="/hunkarkofte.jpg" 
                      alt="Hünkar Köfte" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                       <span className="text-white font-bold text-sm">Hünkar Köfte</span>
                    </div>
                  </div>

                  <div className="rounded-2xl overflow-hidden shadow-sm aspect-square relative group">
                    <img 
                      src="/cafedeparis.jpg" 
                      alt="Chicken Cafe de Paris" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                       <span className="text-white font-bold text-sm">Chicken Cafe de Paris</span>
                    </div>
                  </div>

                  {/* Nargile Özel Kutu */}
                  <div className="rounded-2xl overflow-hidden shadow-sm aspect-square relative group border border-slate-200">
                    <img 
                      src="/salaasnargilefoto.jpg" 
                      alt="Nargile Çeşitleri" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/90 to-transparent flex flex-col justify-end p-4">
                       <Wind className="text-cyan-400 mb-1" size={20} />
                       <span className="text-white font-bold text-sm">Nargile Keyfi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rezervasyon Durumu (Canlı) */}
              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Canlı Yoğunluk Durumu</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              {/* Tarih Seçimi (Müşteri İçin) */}
              <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200 flex items-center justify-between gap-4">
                 <span className="font-black text-slate-600 uppercase tracking-widest text-sm flex items-center gap-2">
                   <CalendarDays className="text-orange-500" size={20} /> Tarih Seçiniz
                 </span>
                 <input 
                   type="date" 
                   value={visitorDate} 
                   onChange={(e) => setVisitorDate(e.target.value)} 
                   className="bg-slate-50 border border-slate-200 text-slate-800 px-4 py-2 rounded-xl font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all cursor-pointer" 
                 />
              </div>

              {/* İftar Detaylı Özeti (Müşteri Görecek) */}
              <div className="bg-gradient-to-br from-[#0B3B2C] to-emerald-900 rounded-3xl p-6 shadow-xl flex flex-col gap-5 relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-5 pointer-events-none"><ChefHat size={180} /></div>
                <div className="flex flex-col gap-4 w-full border-b border-emerald-700/50 pb-5 z-10">
                  <div className="flex items-center gap-4 text-[#FBE18D]">
                    <div className="bg-white/10 p-3 rounded-2xl"><ChefHat size={28} /></div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-orange-400">İftar Özeti ({visitorDate})</p>
                      <div className="flex gap-3 items-baseline mt-0.5">
                        <p className="text-2xl font-black text-white">Kayıtlı: <span className="text-orange-400">{visitorIftarSummary.totalPeople}</span> Kişi</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 4'lü Menü Kutu Tasarımı (Ziyaretçi de görsün) */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full z-10">
                  <div className="bg-white/95 px-2 py-3 rounded-2xl text-center shadow-lg border-b-4 border-slate-200">
                    <span className="block text-[9px] sm:text-[10px] text-slate-500 font-bold mb-0.5">TAVUK</span>
                    <span className="font-black text-xl sm:text-2xl text-[#0B3B2C]">{visitorIftarSummary.totalTavuk}</span>
                  </div>
                  <div className="bg-white/95 px-2 py-3 rounded-2xl text-center shadow-lg border-b-4 border-slate-200">
                    <span className="block text-[9px] sm:text-[10px] text-slate-500 font-bold mb-0.5">HÜNKAR</span>
                    <span className="font-black text-xl sm:text-2xl text-[#0B3B2C]">{visitorIftarSummary.totalHunkar}</span>
                  </div>
                  <div className="bg-white/95 px-2 py-3 rounded-2xl text-center shadow-lg border-b-4 border-slate-200">
                    <span className="block text-[9px] sm:text-[10px] text-slate-500 font-bold mb-0.5">IZGARA</span>
                    <span className="font-black text-xl sm:text-2xl text-[#0B3B2C]">{visitorIftarSummary.totalKarisik}</span>
                  </div>
                  <div className="bg-orange-50 px-2 py-3 rounded-2xl text-center shadow-lg border-b-4 border-orange-200">
                    <span className="block text-[9px] sm:text-[10px] text-orange-600 font-bold mb-0.5">ÇOCUK</span>
                    <span className="font-black text-xl sm:text-2xl text-orange-600">{visitorIftarSummary.totalCocuk}</span>
                  </div>
                </div>
              </div>

              {/* Maç Özeti Kartı */}
              <div className="bg-gradient-to-br from-[#0a192f] to-blue-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-2 relative overflow-hidden mt-2">
                <div className="absolute right-0 top-0 opacity-5 pointer-events-none"><MonitorPlay size={180} /></div>
                <div className="flex items-center gap-4 text-cyan-200 z-10">
                  <div className="bg-white/10 p-3 rounded-2xl"><MonitorPlay size={32} /></div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-cyan-400">Maç Günü Katılım ({visitorDate})</p>
                    <p className="text-3xl font-black text-white mt-1">Toplam: <span className="text-cyan-400">{visitorTotalMatchPeople}</span> Seyirci</p>
                  </div>
                </div>
              </div>

              {/* İletişim / Bilgi Kartı */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-lg mt-4">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-orange-400"><MapPin size={20}/> İletişim & Rezervasyon</h4>
                <div className="space-y-4 text-slate-300">
                  <p className="flex items-start gap-3">
                    <Phone className="shrink-0 text-slate-400 mt-0.5" size={18}/>
                    <span>Rezervasyon için bizi arayabilirsiniz:<br/><a href="tel:+902626421413" className="text-white font-bold hover:text-orange-400 text-lg transition-colors">0262 642 14 13</a></span>
                  </p>
                  <p className="flex items-start gap-3 border-t border-slate-700 pt-4">
                    <Instagram className="shrink-0 text-slate-400 mt-0.5" size={18}/>
                    <span>Bizi Instagram'da takip edin:<br/><a href="https://www.instagram.com/salascaferestaurant/" target="_blank" rel="noreferrer" className="text-white font-bold hover:text-orange-400 transition-colors">@salascaferestaurant</a></span>
                  </p>
                </div>
              </div>
            </>
          )}
        </main>

        {/* Footer & Personel Girişi Tetikleyici */}
        <footer className="py-6 text-center relative z-10 mt-auto">
          <p className="text-slate-400 text-xs font-medium mb-3">© 2026 Salaaş Cafe Restaurant. Tüm hakları saklıdır.</p>
          <button 
            onClick={() => setShowLoginModal(true)} 
            className="text-[10px] font-bold text-slate-300 hover:text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            <Lock size={10} /> Personel Girişi
          </button>
        </footer>

        {/* LOGIN MODAL (Sadece butona basıldığında açılır) */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[#0B3B2C] p-5 flex items-center justify-between text-white">
                <h3 className="font-black tracking-wide flex items-center gap-2"><Lock size={18} className="text-orange-400"/> Sistem Girişi</h3>
                <button onClick={() => {setShowLoginModal(false); setLoginError('');}} className="p-1 hover:bg-white/20 rounded-lg transition-colors"><X size={20}/></button>
              </div>
              <form onSubmit={handleLogin} className="p-6 space-y-4">
                {loginError && <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100">{loginError}</div>}
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Kullanıcı Adı</label>
                  <input 
                    type="text" 
                    value={loginUser} 
                    onChange={(e) => setLoginUser(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3B2C] outline-none bg-slate-50 font-medium" 
                    placeholder="Kullanıcı adınızı girin" 
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Şifre</label>
                  <input 
                    type="password" 
                    value={loginPass} 
                    onChange={(e) => setLoginPass(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3B2C] outline-none bg-slate-50 font-medium" 
                    placeholder="••••••••" 
                  />
                </div>
                <button type="submit" className="w-full bg-[#0B3B2C] hover:bg-emerald-900 text-white font-black tracking-widest uppercase py-3.5 rounded-xl transition-colors mt-2 flex items-center justify-center gap-2">
                  Giriş Yap <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =======================================================================
  // 2. PERSONEL / ADMİN YÖNETİM EKRANI (ŞİFRE GİRİLDİKTEN SONRA AÇILIR)
  // =======================================================================
  return (
    <div className={`min-h-screen font-sans text-slate-800 pb-12 print:bg-white print:pb-0 relative transition-colors duration-500 ${activePage === 'iftar' ? 'bg-slate-50' : 'bg-[#f0f4f8]'}`}>
      
      {/* İSLAMİ DESEN (Sadece İftar Sayfasında) */}
      {activePage === 'iftar' && (
        <>
          <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] print:hidden" style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="fixed top-20 right-10 z-0 pointer-events-none opacity-5 text-emerald-900 rotate-12 print:hidden"><MoonStar size={400} strokeWidth={1} /></div>
        </>
      )}

      {/* MAÇ DESENİ (Sadece Maç Sayfasında) */}
      {activePage === 'mac' && (
        <div className="fixed top-20 right-10 z-0 pointer-events-none opacity-[0.03] text-blue-900 rotate-12 print:hidden"><MonitorPlay size={400} strokeWidth={1} /></div>
      )}

      {/* BİLDİRİMLER (Sadece İftar Modunda Aktif) */}
      {activePage === 'iftar' && isPrepTime && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-3 flex items-center justify-center gap-3 shadow-2xl animate-pulse print:hidden">
          <BellRing className="animate-bounce" />
          <span className="font-black tracking-widest text-sm md:text-lg uppercase">Mutfak Bildirimi: İftara son 10 Dakika! Servis Hazırlığı Başlasın!</span>
          <Flame className="animate-bounce text-yellow-300" />
        </div>
      )}
      {activePage === 'iftar' && isIftarTime && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-600 text-white p-3 flex items-center justify-center gap-3 shadow-2xl print:hidden">
          <MoonStar className="animate-spin-slow text-yellow-300" />
          <span className="font-black tracking-widest text-lg uppercase">Hayırlı İftarlar - İftar Vakti!</span>
        </div>
      )}

      {/* Genel Yazdırma Modu İçin Gizli Başlık */}
      <div className={`hidden ${!printSingleId ? 'print:block' : ''} text-center mb-4 border-b-2 border-black pb-2 relative z-10`}>
        <h1 className="text-xl font-bold font-sans uppercase">{activePage === 'iftar' ? 'Salaaş Cafe İftar' : 'Salaaş Cafe Maç'}</h1>
        <p className="text-sm mt-1 font-bold text-black">Tarih: {activePage === 'iftar' ? selectedFilterDate : selectedMatchDate}</p>
      </div>

      {/* Üst Bilgi Barı */}
      <header className={`${activePage === 'iftar' ? 'bg-[#0B3B2C]' : 'bg-[#0a192f]'} text-white shadow-lg sticky z-20 print:hidden transition-colors duration-500 ${(isPrepTime || isIftarTime) && activePage === 'iftar' ? 'top-[52px]' : 'top-0'}`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-3">
              {/* ADMİN EKRANI GÜNCEL LOGO */}
              <div className="w-24 sm:w-32 h-10 sm:h-12 shrink-0 flex items-center justify-center overflow-hidden bg-white/10 rounded-xl px-2">
                 <img src="/salaaslogouzun.jpg" alt="Salaaş Cafe Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <h1 className={`text-lg md:text-xl font-black tracking-wide text-transparent bg-clip-text font-serif ${activePage === 'iftar' ? 'bg-gradient-to-r from-orange-400 to-yellow-300' : 'bg-gradient-to-r from-blue-400 to-cyan-300'}`}>Yönetim Paneli</h1>
              </div>
            </div>

            {/* SEKMELER / GEÇİŞ BUTONLARI */}
            <div className="flex items-center bg-black/40 p-1.5 rounded-xl border border-white/10 shadow-inner">
              <button 
                onClick={() => setActivePage('iftar')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all flex items-center gap-1.5 ${activePage === 'iftar' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                <MoonStar size={14} className={activePage === 'iftar' ? '' : 'opacity-50'}/> İFTAR
              </button>
              <button 
                onClick={() => setActivePage('mac')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all flex items-center gap-1.5 ${activePage === 'mac' ? 'bg-blue-600 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                <MonitorPlay size={14} className={activePage === 'mac' ? '' : 'opacity-50'}/> MAÇ
              </button>
            </div>
          </div>

          <div className="flex flex-row items-center gap-3 w-full md:w-auto">
             {activePage === 'iftar' ? (
                <div className={`flex items-center rounded-xl px-4 py-2 border w-full md:w-auto justify-center shadow-inner transition-colors duration-500 ${isPrepTime ? 'bg-red-500/20 border-red-500 text-red-100' : isIftarTime ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' : 'bg-white/5 border-orange-500/30 text-orange-200'}`}>
                  <Clock className={`mr-2 ${isPrepTime ? 'animate-bounce text-red-400' : 'opacity-80'}`} size={20} />
                  <div className="flex flex-col items-center md:items-start">
                     <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">İftara Kalan</span>
                     <span className={`font-mono font-black text-lg tracking-widest drop-shadow-md ${isPrepTime ? 'text-red-300' : isIftarTime ? 'text-emerald-300' : 'text-white'}`}>{countdown}</span>
                  </div>
                </div>
             ) : null}

            <div className={`flex items-center bg-white/10 rounded-xl px-3 py-2 border border-white/10 hover:bg-white/20 transition-colors w-full md:w-auto justify-center ${activePage === 'mac' ? 'py-2.5 px-4' : ''}`}>
              <CalendarDays className={`mr-2 ${activePage === 'iftar' ? 'text-orange-400' : 'text-cyan-400'}`} size={18} />
              {activePage === 'mac' && <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 text-cyan-100 hidden md:inline mr-2">Tarih Seç:</span>}
              <input type="date" value={activePage === 'iftar' ? selectedFilterDate : selectedMatchDate} onChange={(e) => activePage === 'iftar' ? setSelectedFilterDate(e.target.value) : setSelectedMatchDate(e.target.value)} className="bg-transparent text-white outline-none font-bold cursor-pointer text-sm w-full md:w-auto" />
            </div>

            {/* ÇIKIŞ BUTONU */}
            <button onClick={() => {setIsAuthenticated(false); setLoginUser(''); setLoginPass('');}} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-md ml-auto md:ml-0" title="Güvenli Çıkış">ÇIKIŞ</button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className={`flex flex-col items-center justify-center mt-32 relative z-10 ${activePage === 'iftar' ? 'text-orange-600' : 'text-blue-600'}`}>
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="font-bold tracking-widest animate-pulse uppercase">Sisteme Bağlanıyor...</p>
        </div>
      ) : (
        <main className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 print:block print:m-0 print:p-0 relative z-10">
          
          {/* ----------------------------- */}
          {/* İFTAR EKRANI */}
          {/* ----------------------------- */}
          {activePage === 'iftar' && (
            <>
              {/* SOL KOLON - FORM */}
              <div className="lg:col-span-4 space-y-6 print:hidden">
                <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border overflow-hidden transition-colors ${isEditing ? 'border-orange-400 shadow-orange-500/20' : 'border-slate-200/60'}`}>
                  <div className={`px-6 py-5 flex items-center justify-between ${isEditing ? 'bg-orange-50 border-b border-orange-100' : 'bg-gradient-to-r from-slate-50 to-white border-b border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isEditing ? 'bg-orange-100 text-orange-600' : 'bg-[#0B3B2C]/10 text-[#0B3B2C]'}`}><Edit2 size={20} /></div>
                      <h2 className={`text-lg font-black tracking-wide ${isEditing ? 'text-orange-800' : 'text-[#0B3B2C]'}`}>{isEditing ? 'Rezervasyonu Düzenle' : 'İftar Rezervasyonu'}</h2>
                    </div>
                    {isEditing && <button onClick={cancelEdit} className="text-slate-400 p-1.5 hover:bg-white rounded-full shadow-sm border border-slate-200"><X size={18} /></button>}
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2 shadow-sm"><X size={16} /> {errorMsg}</div>}
                    
                    <div className="flex gap-4">
                      <div className="flex-[3]">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">İsim</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-slate-50/50 font-semibold" placeholder="Müşteri İsmi" />
                      </div>
                      <div className="flex-[2]">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Telefon</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-slate-50/50 font-semibold" placeholder="05XX..." />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-inner">
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Masa Seçimi</label>
                        <button type="button" onClick={() => setShowTableMap(!showTableMap)} className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-orange-200 transition-colors">
                          <Map size={14} /> {showTableMap ? 'Haritayı Gizle' : 'Krokiden Seç'}
                        </button>
                      </div>
                      
                      {showTableMap && (
                        <div className="mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                          <div className="relative w-full aspect-[4/5] sm:aspect-square min-h-[400px] bg-[#e6e2d8] border-[10px] border-slate-700/80 rounded-xl overflow-hidden shadow-inner font-sans">
                            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, #000 20px, #000 21px)' }}></div>
                            <div className="absolute top-0 left-[42%] w-[16%] h-[4%] bg-amber-900 border-x-2 border-b-2 border-slate-800 rounded-b-md z-10 flex items-center justify-center shadow-lg"><span className="text-[7px] sm:text-[9px] font-black text-amber-100 tracking-widest">GİRİŞ</span></div>
                            <div className="absolute top-[4%] left-[43%] w-[14%] h-[5%] bg-slate-800/60 rounded-b-sm z-0"></div>
                            <div className="absolute top-0 left-[68%] w-1.5 h-[22%] bg-slate-700 shadow-md rounded-b-md"></div>
                            <div className="absolute top-[39%] left-[68%] w-[15%] h-1.5 bg-slate-700 shadow-md rounded-r-md"></div>
                            <div className="absolute top-[41%] left-[73%] w-1.5 h-[8%] bg-slate-700 shadow-md rounded-t-md"></div>
                            
                            {TABLE_MAP.map(table => {
                               const status = getTableStatus(table.id);
                               const resForTable = status !== 'empty' ? filteredReservations.find(r => r.table?.trim().toUpperCase() === table.id.toUpperCase()) : null;
                               let surf = "bg-[#d4a373] border-[#bc8a5f] text-amber-950"; let chr = "bg-[#eaddcf] border-[#d4a373]";
                               if (status === 'reserved') { surf = "bg-emerald-500 border-emerald-600 text-white"; chr = "bg-emerald-400 border-emerald-500"; }
                               else if (status === 'full') { surf = "bg-red-500 border-red-600 text-white"; chr = "bg-red-400 border-red-500"; }
                               return (
                                  <button key={table.id} type="button" disabled={status !== 'empty'} onClick={() => handleTableSelect(table.id)} className={`absolute group flex items-center justify-center transition-all duration-300 z-20 ${status === 'empty' ? 'hover:scale-110 cursor-pointer' : 'opacity-95 cursor-not-allowed'}`} style={{ top: table.top, left: table.left, width: table.width, height: table.height }}>
                                     <div className={`relative w-full h-full flex items-center justify-center rounded shadow-lg border-b-4 border-r-2 ${surf}`}>
                                        <span className="font-black text-[8px] sm:text-[10px] drop-shadow-sm">{table.id}</span>
                                        {status !== 'empty' && resForTable && (
                                           <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl flex flex-col items-center border border-slate-600">
                                             <span className="font-bold text-orange-400">{resForTable.name || 'İsimsiz'}</span><span>{resForTable.peopleCount || 0} Kişi</span>
                                             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45 border-b border-r border-slate-600"></div>
                                           </div>
                                        )}
                                        {table.type === 'v' && <><div className={`absolute -left-[5px] top-[20%] w-[5px] h-[60%] rounded-l-full shadow-sm border-b-2 ${chr}`}></div><div className={`absolute -right-[5px] top-[20%] w-[5px] h-[60%] rounded-r-full shadow-sm border-b-2 ${chr}`}></div></>}
                                        {table.type === 'h' && <><div className={`absolute left-[20%] -top-[5px] w-[60%] h-[5px] rounded-t-full shadow-sm border-b-2 ${chr}`}></div><div className={`absolute left-[20%] -bottom-[5px] w-[60%] h-[5px] rounded-b-full shadow-sm border-t-2 ${chr}`}></div></>}
                                        {table.type === 'lg-v' && <><div className={`absolute -left-[5px] top-[15%] w-[5px] h-[30%] rounded-l-full shadow-sm border-b-2 ${chr}`}></div><div className={`absolute -left-[5px] bottom-[15%] w-[5px] h-[30%] rounded-l-full shadow-sm border-b-2 ${chr}`}></div><div className={`absolute -right-[5px] top-[15%] w-[5px] h-[30%] rounded-r-full shadow-sm border-b-2 ${chr}`}></div><div className={`absolute -right-[5px] bottom-[15%] w-[5px] h-[30%] rounded-r-full shadow-sm border-b-2 ${chr}`}></div></>}
                                     </div>
                                  </button>
                               )
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <div className="flex-[2]">
                          <div className="relative">
                            <Armchair className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" name="table" value={formData.table} onChange={handleChange} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white font-black uppercase text-[#0B3B2C] shadow-sm" placeholder="Masa Kodu" />
                          </div>
                        </div>
                        <div className="flex-[1]">
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="number" inputMode="numeric" name="peopleCount" min="1" value={formData.peopleCount} onChange={handleChange} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white font-black text-[#0B3B2C] shadow-sm" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><CalendarDays size={14} className="text-orange-500"/> Rezervasyon Tarihi</label>
                      <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-slate-50/50 font-semibold text-[#0B3B2C]" required />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><MessageSquareText size={14}/> Özel Not (Opsiyonel)</label>
                      <input type="text" name="notes" value={formData.notes} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 bg-amber-50/50 placeholder:text-amber-300 font-medium" placeholder="Örn: Mama sandalyesi..." />
                    </div>
                    
                    <div className="pt-2">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2"><UtensilsCrossed size={16} className="text-orange-500" /> İftar Menüsü (Adet)</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col"><div className="flex justify-between mb-2"><span className="text-2xl">🐔</span><input type="number" inputMode="numeric" name="menuTavuk" min="0" value={formData.menuTavuk} onChange={handleChange} className="w-14 px-1 py-1 text-center border rounded-lg outline-none font-black bg-slate-50" /></div><span className="text-xs font-bold">Tavuk Menü</span></div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col"><div className="flex justify-between mb-2"><span className="text-2xl">🥩</span><input type="number" inputMode="numeric" name="menuHunkar" min="0" value={formData.menuHunkar} onChange={handleChange} className="w-14 px-1 py-1 text-center border rounded-lg outline-none font-black bg-slate-50" /></div><span className="text-xs font-bold">Hünkar Beğendi</span></div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col"><div className="flex justify-between mb-2"><span className="text-2xl">🍢</span><input type="number" inputMode="numeric" name="menuKarisik" min="0" value={formData.menuKarisik} onChange={handleChange} className="w-14 px-1 py-1 text-center border rounded-lg outline-none font-black bg-slate-50" /></div><span className="text-xs font-bold">Karışık Izgara</span></div>
                        <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-3 shadow-sm flex flex-col"><div className="flex justify-between mb-2"><span className="text-2xl">🧸</span><input type="number" inputMode="numeric" name="menuCocuk" min="0" value={formData.menuCocuk} onChange={handleChange} className="w-14 px-1 py-1 text-center border-orange-300 rounded-lg outline-none font-black text-orange-700 bg-white" /></div><span className="text-xs font-bold text-orange-800">Çocuk Menüsü</span></div>
                      </div>
                    </div>
                    
                    <button type="submit" className={`w-full font-black tracking-widest uppercase py-4 mt-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 text-white hover:scale-[1.02] active:scale-95 ${isEditing ? 'bg-gradient-to-r from-[#0B3B2C] to-emerald-900' : 'bg-gradient-to-r from-orange-500 to-orange-600'}`}>
                      {isEditing ? <Check size={22} /> : <Plus size={22} />} {isEditing ? 'Değişiklikleri Kaydet' : 'Sisteme Ekle'}
                    </button>
                  </form>
                </div>
              </div>

              {/* SAĞ KOLON - İFTAR LİSTESİ */}
              <div className="lg:col-span-8 space-y-6 print:w-full print:block print:space-y-4">
                <div className={`bg-gradient-to-br from-[#0B3B2C] to-emerald-900 rounded-3xl p-6 shadow-xl flex flex-col gap-5 relative overflow-hidden ${printSingleId ? 'print:hidden' : 'print:bg-white print:from-white print:to-white print:border-b-2 print:border-black print:rounded-none print:shadow-none print:p-2 print:mb-4'}`}>
                  <div className="flex flex-col gap-4 w-full border-b border-emerald-700/50 pb-5 z-10 print:border-black print:pb-2">
                    <div className="flex items-center gap-4 text-[#FBE18D]">
                      <div className="bg-white/10 p-3 rounded-2xl print:hidden"><ChefHat size={28} /></div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-orange-400 print:text-black">İftar Mutfak Özeti</p>
                        <div className="flex gap-3 items-baseline mt-0.5">
                          <p className="text-2xl font-black text-white print:text-black">Kişi: <span className="text-orange-400 print:text-black">{dailySummary.totalPeople}</span></p>
                          <span className="text-emerald-500 font-bold print:hidden">|</span>
                          <p className="text-xl font-bold text-slate-200 print:text-black">Menü: <span className="text-yellow-400 print:text-black">{dailySummary.totalMenu}</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full pt-1 print:hidden">
                       <div className="flex justify-between items-end mb-1.5 px-1">
                         <span className="text-[10px] font-bold text-emerald-200 uppercase">Kapasite: 150</span>
                         <span className={`text-[10px] font-black ${occupancyRate >= 90 ? 'text-red-400' : 'text-emerald-300'}`}>DOLULUK: %{occupancyRate}</span>
                       </div>
                       <div className="w-full bg-emerald-950/60 rounded-full h-2 shadow-inner overflow-hidden">
                         <div className={`h-2 rounded-full ${occupancyRate >= 90 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${occupancyRate}%` }}></div>
                       </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 w-full z-10 print:grid-cols-2 print:gap-1">
                    <div className="bg-white/95 px-3 py-3 rounded-2xl text-center shadow-lg border-b-4 border-slate-200 print:border print:border-black print:rounded-md print:py-1"><span className="block text-[10px] text-slate-500 font-bold mb-0.5">TAVUK</span><span className="font-black text-2xl text-[#0B3B2C] print:text-black">{dailySummary.totalTavuk}</span></div>
                    <div className="bg-white/95 px-3 py-3 rounded-2xl text-center shadow-lg border-b-4 border-slate-200 print:border print:border-black print:rounded-md print:py-1"><span className="block text-[10px] text-slate-500 font-bold mb-0.5">HÜNKAR</span><span className="font-black text-2xl text-[#0B3B2C] print:text-black">{dailySummary.totalHunkar}</span></div>
                    <div className="bg-white/95 px-3 py-3 rounded-2xl text-center shadow-lg border-b-4 border-slate-200 print:border print:border-black print:rounded-md print:py-1"><span className="block text-[10px] text-slate-500 font-bold mb-0.5">IZGARA</span><span className="font-black text-2xl text-[#0B3B2C] print:text-black">{dailySummary.totalKarisik}</span></div>
                    <div className="bg-orange-50 px-3 py-3 rounded-2xl text-center shadow-lg border-b-4 border-orange-200 print:border-black print:bg-white print:rounded-md print:py-1"><span className="block text-[10px] text-orange-600 font-bold mb-0.5">ÇOCUK</span><span className="font-black text-2xl text-orange-600 print:text-black">{dailySummary.totalCocuk}</span></div>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/60 p-6 min-h-[400px] print:p-0 print:border-none print:shadow-none print:bg-white">
                  <div className={`flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4 ${printSingleId ? 'print:hidden' : 'print:border-b-2 print:border-black print:pb-2 print:mb-3'}`}>
                    <h2 className="text-xl font-black flex items-center gap-2 text-[#0B3B2C]"><Armchair className="text-orange-500 print:hidden" size={24} /> Aktif Masalar</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                      <div className="relative w-full sm:w-56 print:hidden">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 text-sm shadow-sm outline-none bg-slate-50" />
                      </div>
                      <span className="bg-orange-100 text-orange-800 px-4 py-1.5 rounded-full text-xs font-black print:hidden">{sortedReservations.length} Kayıt</span>
                      <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-700 print:hidden"><Printer size={16} /> YAZDIR</button>
                    </div>
                  </div>
                  
                  {sortedReservations.length === 0 ? (
                    <div className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center text-slate-400 print:hidden"><Search size={32} className="opacity-50 text-orange-400 mx-auto mb-3" /><p className="font-bold text-lg">Kayıt bulunamadı.</p></div>
                  ) : (
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${printSingleId ? 'print:grid-cols-1 print:gap-0' : 'print:grid-cols-2 print:gap-2'}`}>
                      {sortedReservations.map((res) => {
                        const isArrived = res.isArrived || false;
                        const isPrinting = printSingleId === res.id;
                        return (
                        <div key={res.id} className={`p-5 rounded-2xl border-2 transition-all relative group print:border-black print:border-dashed print:p-2 print:mb-1 ${printSingleId && !isPrinting ? 'hidden print:hidden' : ''} ${isEditing === res.id ? 'border-orange-400 bg-orange-50/30' : isArrived ? 'border-emerald-500 bg-emerald-50/50 opacity-80' : 'border-slate-100 bg-white hover:border-orange-200'}`}>
                          {isPrinting && <div className="hidden print:block text-center font-bold text-[12px] uppercase mb-2 border-b border-black">Salaaş Cafe<br/>{selectedFilterDate}</div>}
                          
                          {deleteConfirmId === res.id && (
                             <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center p-4 border border-red-200 rounded-2xl print:hidden">
                               <p className="font-black text-slate-800 mb-3">Silinsin mi?</p>
                               <div className="flex gap-2"><button onClick={() => executeDelete(res.id, 'reservations')} className="bg-red-600 text-white px-4 py-1.5 rounded-xl text-sm font-bold">Sil</button><button onClick={() => setDeleteConfirmId(null)} className="bg-slate-200 px-4 py-1.5 rounded-xl text-sm font-bold">İptal</button></div>
                             </div>
                          )}
                          
                          <div className="flex items-center gap-3 mb-1.5">
                             <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-black text-xs shadow-inner print:hidden ${isArrived ? 'bg-emerald-100 text-emerald-700' : 'bg-gradient-to-br from-orange-400 to-orange-500 text-white'}`}>{getInitials(res.name)}</div>
                             <h3 className={`text-lg font-black truncate print:text-black ${isArrived ? 'line-through text-emerald-900' : 'text-[#0B3B2C]'}`}>{res.name || 'İsimsiz'}</h3>
                          </div>
                          
                          {res.phone && (
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs font-semibold flex items-center gap-1.5 text-slate-500 print:text-black"><Phone size={12} className="print:hidden text-orange-400" /> {res.phone}</p>
                              <button onClick={() => sendWhatsApp(res, 'iftar')} className="print:hidden bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white p-1.5 rounded-full"><MessageCircle size={14} /></button>
                            </div>
                          )}

                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black mt-2 print:p-0 print:text-black ${isArrived ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}><Armchair size={14} className="print:hidden" /> Masa: {res.table}</div>
                          
                          {res.notes && <div className="mt-2 text-xs font-bold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 print:border-black print:bg-white">Not: {res.notes}</div>}

                          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-200 print:hidden">
                            <button onClick={() => handleToggleArrived(res.id, isArrived, 'reservations')} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black ${isArrived ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}><CheckCircle size={18} /> {isArrived ? "MASADA" : "GELMEDİ"}</button>
                            <div className="flex gap-1.5">
                              <button onClick={() => handlePrintSingle(res.id)} className="p-2 text-slate-500 bg-slate-50 hover:text-[#0B3B2C] hover:bg-slate-200 rounded-xl border border-slate-200"><Printer size={18} /></button>
                              <button onClick={() => handleEditClick(res)} className="p-2 text-slate-500 bg-slate-50 hover:text-orange-600 hover:bg-orange-100 rounded-xl border border-slate-200"><Edit2 size={18} /></button>
                              <button onClick={() => setDeleteConfirmId(res.id)} className="p-2 text-slate-500 bg-slate-50 hover:text-red-600 hover:bg-red-100 rounded-xl border border-slate-200"><Trash2 size={18} /></button>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 border rounded-xl print:border-t print:border-b-0 print:p-0 print:mt-1 bg-slate-50">
                             <div className="flex items-center justify-between mb-2 border-b pb-2 print:border-none print:mb-0"><p className="text-[10px] font-black uppercase text-slate-400 print:hidden">Sipariş</p><div className="bg-slate-800 text-white px-2 py-1 rounded text-[10px] font-black print:bg-transparent print:text-black print:p-0"><Users size={12} className="inline print:hidden mr-1" />{res.peopleCount} KİŞİ</div></div>
                             <ul className="text-xs font-bold text-slate-600 print:text-black">
                                {res.menuTavuk > 0 && <li className="flex justify-between mt-1"><span>Tavuk Menü</span> <span>x {res.menuTavuk}</span></li>}
                                {res.menuHunkar > 0 && <li className="flex justify-between mt-1"><span>Hünkar</span> <span>x {res.menuHunkar}</span></li>}
                                {res.menuKarisik > 0 && <li className="flex justify-between mt-1"><span>Izgara</span> <span>x {res.menuKarisik}</span></li>}
                                {res.menuCocuk > 0 && <li className="flex justify-between mt-1 text-orange-600"><span>Çocuk</span> <span>x {res.menuCocuk}</span></li>}
                             </ul>
                          </div>
                        </div>
                      )})}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ----------------------------- */}
          {/* MAÇ EKRANI */}
          {/* ----------------------------- */}
          {activePage === 'mac' && (
            <>
              {/* MAÇ SOL KOLON - FORM */}
              <div className="lg:col-span-4 space-y-6 print:hidden">
                <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border overflow-hidden transition-colors ${isMatchEditing ? 'border-blue-400 shadow-blue-500/20' : 'border-slate-200/60'}`}>
                  <div className={`px-6 py-5 flex items-center justify-between ${isMatchEditing ? 'bg-blue-50 border-b border-blue-100' : 'bg-gradient-to-r from-slate-50 to-white border-b border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isMatchEditing ? 'bg-blue-100 text-blue-600' : 'bg-[#0a192f]/10 text-[#0a192f]'}`}><MonitorPlay size={20} /></div>
                      <h2 className={`text-lg font-black tracking-wide ${isMatchEditing ? 'text-blue-800' : 'text-[#0a192f]'}`}>{isMatchEditing ? 'Rezervasyonu Düzenle' : 'Maç Rezervasyonu'}</h2>
                    </div>
                    {isMatchEditing && <button onClick={() => cancelMatchEdit()} className="text-slate-400 p-1.5 hover:bg-white rounded-full shadow-sm border border-slate-200"><X size={18} /></button>}
                  </div>
                  
                  <form onSubmit={handleMatchSubmit} className="p-6 space-y-5">
                    {matchErrorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2 shadow-sm"><X size={16} /> {matchErrorMsg}</div>}
                    
                    <div className="flex gap-4">
                      <div className="flex-[3]">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">İsim</label>
                        <input type="text" name="name" value={matchFormData.name} onChange={handleMatchChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-semibold" placeholder="Müşteri İsmi" />
                      </div>
                      <div className="flex-[2]">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Telefon</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input type="tel" name="phone" value={matchFormData.phone} onChange={handleMatchChange} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-semibold" placeholder="05XX..." />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-[2]">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Masa (Opsiyonel)</label>
                        <div className="relative">
                          <Armchair className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input type="text" name="table" value={matchFormData.table} onChange={handleMatchChange} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-black uppercase text-[#0a192f]" placeholder="Masa Kodu" />
                        </div>
                      </div>
                      <div className="flex-[1]">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kişi</label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input type="number" inputMode="numeric" name="peopleCount" min="1" value={matchFormData.peopleCount} onChange={handleMatchChange} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-black text-[#0a192f]" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><CalendarDays size={14} className="text-blue-500"/> Maç Tarihi</label>
                      <input type="date" name="date" value={matchFormData.date} onChange={handleMatchChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-semibold text-[#0a192f]" required />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><MessageSquareText size={14}/> Özel Not (Opsiyonel)</label>
                      <input type="text" name="notes" value={matchFormData.notes} onChange={handleMatchChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-medium" placeholder="Örn: Forma ile gelecek..." />
                    </div>
                    
                    <button type="submit" className={`w-full font-black tracking-widest uppercase py-4 mt-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 text-white hover:scale-[1.02] active:scale-95 ${isMatchEditing ? 'bg-gradient-to-r from-[#0a192f] to-blue-900' : 'bg-gradient-to-r from-blue-500 to-cyan-600'}`}>
                      {isMatchEditing ? <Check size={22} /> : <Plus size={22} />} {isMatchEditing ? 'Güncelle' : 'Maç Listesine Ekle'}
                    </button>
                  </form>
                </div>
              </div>

              {/* MAÇ SAĞ KOLON - LİSTE */}
              <div className="lg:col-span-8 space-y-6 print:w-full print:block print:space-y-4">
                
                <div className={`bg-gradient-to-br from-[#0a192f] to-blue-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-2 relative overflow-hidden ${printSingleId ? 'print:hidden' : 'print:bg-white print:from-white print:to-white print:border-b-2 print:border-black print:rounded-none print:shadow-none print:p-2 print:mb-4'}`}>
                  <div className="absolute right-0 top-0 opacity-5 pointer-events-none print:hidden"><MonitorPlay size={200} /></div>
                  <div className="flex items-center gap-4 text-cyan-200 z-10 print:text-black">
                    <div className="bg-white/10 p-3 rounded-2xl print:hidden"><MonitorPlay size={32} /></div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-cyan-400 print:text-black">Maç Günü Katılım Özeti</p>
                      <p className="text-3xl font-black text-white mt-1 print:text-black">Toplam: <span className="text-cyan-400 print:text-black">{totalMatchPeople}</span> Seyirci</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/60 p-6 min-h-[400px] print:p-0 print:border-none print:shadow-none print:bg-white">
                  <div className={`flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4 ${printSingleId ? 'print:hidden' : 'print:border-b-2 print:border-black print:pb-2 print:mb-3'}`}>
                    <h2 className="text-xl font-black flex items-center gap-2 text-[#0a192f]"><MonitorPlay className="text-blue-500 print:hidden" size={24} /> Maç Rezervasyonları</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                      <div className="relative w-full sm:w-56 print:hidden">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Ara..." value={matchSearchTerm} onChange={(e) => setMatchSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm shadow-sm outline-none bg-slate-50" />
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-xs font-black print:hidden">{sortedMatchReservations.length} Kayıt</span>
                      <button onClick={() => window.print()} className="bg-[#0a192f] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-blue-900 print:hidden"><Printer size={16} /> YAZDIR</button>
                    </div>
                  </div>
                  
                  {sortedMatchReservations.length === 0 ? (
                    <div className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center text-slate-400 print:hidden"><Search size={32} className="opacity-50 text-blue-400 mx-auto mb-3" /><p className="font-bold text-lg">Bu maça ait kayıt bulunamadı.</p></div>
                  ) : (
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${printSingleId ? 'print:grid-cols-1 print:gap-0' : 'print:grid-cols-2 print:gap-2'}`}>
                      {sortedMatchReservations.map((res) => {
                        const isArrived = res.isArrived || false;
                        const isPrinting = printSingleId === res.id;
                        return (
                        <div key={res.id} className={`p-5 rounded-2xl border-2 transition-all relative group print:border-black print:border-dashed print:p-2 print:mb-1 ${printSingleId && !isPrinting ? 'hidden print:hidden' : ''} ${isMatchEditing === res.id ? 'border-blue-400 bg-blue-50/30' : isArrived ? 'border-emerald-500 bg-emerald-50/50 opacity-80' : 'border-slate-100 bg-white hover:border-blue-200'}`}>
                          {isPrinting && <div className="hidden print:block text-center font-bold text-[12px] uppercase mb-2 border-b border-black">Salaaş Cafe MAÇ<br/>{selectedMatchDate}</div>}
                          
                          {matchDeleteConfirmId === res.id && (
                             <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center p-4 border border-red-200 rounded-2xl print:hidden">
                               <p className="font-black text-slate-800 mb-3">Silinsin mi?</p>
                               <div className="flex gap-2"><button onClick={() => executeDelete(res.id, 'matchReservations')} className="bg-red-600 text-white px-4 py-1.5 rounded-xl text-sm font-bold">Sil</button><button onClick={() => setMatchDeleteConfirmId(null)} className="bg-slate-200 px-4 py-1.5 rounded-xl text-sm font-bold">İptal</button></div>
                             </div>
                          )}
                          
                          <div className="flex items-center gap-3 mb-1.5">
                             <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-black text-xs shadow-inner print:hidden ${isArrived ? 'bg-emerald-100 text-emerald-700' : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'}`}>{getInitials(res.name)}</div>
                             <h3 className={`text-lg font-black truncate print:text-black ${isArrived ? 'line-through text-emerald-900' : 'text-[#0a192f]'}`}>{res.name || 'İsimsiz'}</h3>
                          </div>
                          
                          {res.phone && (
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs font-semibold flex items-center gap-1.5 text-slate-500 print:text-black"><Phone size={12} className="print:hidden text-blue-400" /> {res.phone}</p>
                              <button onClick={() => sendWhatsApp(res, 'mac')} className="print:hidden bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white p-1.5 rounded-full"><MessageCircle size={14} /></button>
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-2">
                             <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black print:p-0 print:text-black ${isArrived ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-800'}`}><Users size={14} className="print:hidden" /> {res.peopleCount} Kişi</div>
                             {res.table && <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-slate-100 text-slate-700 print:p-0"><Armchair size={14} className="print:hidden" /> {res.table}</div>}
                          </div>
                          
                          {res.notes && <div className="mt-2 text-xs font-bold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 print:border-black print:bg-white">Not: {res.notes}</div>}

                          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-200 print:hidden">
                            <button onClick={() => handleToggleArrived(res.id, isArrived, 'matchReservations')} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black ${isArrived ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}><CheckCircle size={18} /> {isArrived ? "MASADA" : "GELMEDİ"}</button>
                            <div className="flex gap-1.5">
                              <button onClick={() => handlePrintSingle(res.id)} className="p-2 text-slate-500 bg-slate-50 hover:text-[#0a192f] hover:bg-slate-200 rounded-xl border border-slate-200"><Printer size={18} /></button>
                              <button onClick={() => handleMatchEditClick(res)} className="p-2 text-slate-500 bg-slate-50 hover:text-blue-600 hover:bg-blue-100 rounded-xl border border-slate-200"><Edit2 size={18} /></button>
                              <button onClick={() => setMatchDeleteConfirmId(res.id)} className="p-2 text-slate-500 bg-slate-50 hover:text-red-600 hover:bg-red-100 rounded-xl border border-slate-200"><Trash2 size={18} /></button>
                            </div>
                          </div>
                        </div>
                      )})}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        </main>
      )}
    </div>
  );
}
