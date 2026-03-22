import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, Users, UtensilsCrossed, Armchair, 
  Plus, Trash2, MoonStar, ChefHat, Search, Edit2, X, Check, Loader2, Clock, CheckCircle, Phone, Printer, MessageSquareText, MessageCircle, Map, Flame, BellRing, MonitorPlay, Lock, ArrowRight, MapPin, Instagram, Wind, Coffee, ChevronRight, Star, Inbox, CheckCircle2, AlertTriangle, History
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

// MAÇ FİKSTÜRÜ VERİTABANI
const MATCH_FIXTURE = [
  { date: '2026-03-10', displayDate: '10 Mart 2026', team1: 'Galatasaray', team2: 'Liverpool' },
  { date: '2026-03-13', displayDate: '13 Mart 2026', team1: 'F. Karagümrük', team2: 'Fenerbahçe' },
  { date: '2026-03-14', displayDate: '14 Mart 2026', team1: 'Galatasaray', team2: 'Başakşehir' },
  { date: '2026-03-15', displayDate: '15 Mart 2026', team1: 'Gençlerbirliği', team2: 'Beşiktaş' },
  { date: '2026-03-17', displayDate: '17 Mart 2026', team1: 'Fenerbahçe', team2: 'Gaziantep FK' },
  { date: '2026-03-18', displayDate: '18 Mart 2026', team1: 'Göztepe', team2: 'Galatasaray' },
  { date: '2026-03-18', displayDate: '18 Mart 2026', team1: 'Liverpool', team2: 'Galatasaray' },
  { date: '2026-03-19', displayDate: '19 Mart 2026', team1: 'Beşiktaş', team2: 'Kasımpaşa' },
  { date: '2026-04-05', displayDate: '05 Nisan 2026', team1: 'Fenerbahçe', team2: 'Beşiktaş' },
  { date: '2026-04-05', displayDate: '05 Nisan 2026', team1: 'Trabzonspor', team2: 'Galatasaray' },
  { date: '2026-04-12', displayDate: '12 Nisan 2026', team1: 'Kayserispor', team2: 'Fenerbahçe' },
  { date: '2026-04-12', displayDate: '12 Nisan 2026', team1: 'Galatasaray', team2: 'Kocaelispor' },
  { date: '2026-04-12', displayDate: '12 Nisan 2026', team1: 'Beşiktaş', team2: 'Antalyaspor' },
  { date: '2026-04-19', displayDate: '19 Nisan 2026', team1: 'Fenerbahçe', team2: 'Ç. Rizespor' },
  { date: '2026-04-19', displayDate: '19 Nisan 2026', team1: 'Gençlerbirliği', team2: 'Galatasaray' },
  { date: '2026-04-19', displayDate: '19 Nisan 2026', team1: 'Samsunspor', team2: 'Beşiktaş' },
  { date: '2026-04-26', displayDate: '26 Nisan 2026', team1: 'Galatasaray', team2: 'Fenerbahçe' },
  { date: '2026-04-26', displayDate: '26 Nisan 2026', team1: 'Beşiktaş', team2: 'F. Karagümrük' },
  { date: '2026-05-03', displayDate: '03 Mayıs 2026', team1: 'Fenerbahçe', team2: 'Başakşehir' },
  { date: '2026-05-03', displayDate: '03 Mayıs 2026', team1: 'Samsunspor', team2: 'Galatasaray' },
  { date: '2026-05-03', displayDate: '03 Mayıs 2026', team1: 'Gaziantep FK', team2: 'Beşiktaş' },
  { date: '2026-05-10', displayDate: '10 Mayıs 2026', team1: 'Konyaspor', team2: 'Fenerbahçe' },
  { date: '2026-05-10', displayDate: '10 Mayıs 2026', team1: 'Galatasaray', team2: 'Antalyaspor' },
  { date: '2026-05-10', displayDate: '10 Mayıs 2026', team1: 'Beşiktaş', team2: 'Trabzonspor' },
  { date: '2026-05-17', displayDate: '17 Mayıs 2026', team1: 'Fenerbahçe', team2: 'Eyüpspor' },
  { date: '2026-05-17', displayDate: '17 Mayıs 2026', team1: 'Kasımpaşa', team2: 'Galatasaray' },
  { date: '2026-05-17', displayDate: '17 Mayıs 2026', team1: 'Ç. Rizespor', team2: 'Beşiktaş' }
].sort((a, b) => new Date(a.date) - new Date(b.date));

// TATLILAR VERİTABANI
const DESSERTS = [
  { id: 1, name: 'Dubai Çikolatalı', image: '/dubai cikolatalı.jpg' },
  { id: 2, name: 'Lotus Dome', image: '/lotus dome.jpg' },
  { id: 3, name: 'Profiterol', image: '/profiterol.jpg' },
  { id: 4, name: 'Frambuaz Cheesecake', image: '/frambuaz cheescake.jpg' },
  { id: 5, name: 'Luca', image: '/luca.jpg' },
  { id: 6, name: 'İbiza', image: '/ibiza.jpg' },
  { id: 7, name: 'Altın Çilek', image: '/altın cilek.jpg' },
  { id: 8, name: 'Cocostar', image: '/cocostar.jpg' },
  { id: 9, name: 'Orman Rulo', image: '/ormanrulo.jpg' },
  { id: 10, name: 'Fıstık Melanga', image: '/fıstık melanga.jpg' },
  { id: 11, name: 'Bella Vista', image: '/bella vista.jpg' },
  { id: 12, name: 'Dark Moon', image: '/dark moon.jpg' },
  { id: 13, name: 'Malaga', image: '/malaga.jpg' },
  { id: 14, name: 'Mozaik', image: '/mozaik.jpg' },
  { id: 15, name: 'Pink', image: '/Pink.jpg' },
  { id: 16, name: 'Vişne Badem', image: '/visnebadem.jpg' },
  { id: 17, name: 'Çikolata Linzer', image: '/çikolata linzer.jpg' },
  { id: 18, name: 'Tiramisu', image: '/tiramisu.jpg' },
  { id: 19, name: 'Brownie', image: '/brownie.jpg' }
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
  const [activePage, setActivePage] = useState('iftar'); // 'iftar', 'mac', 'talepler', 'gecmis'

  // MÜŞTERİ EKRANI MODALLAR & SEÇİMLER
  const [showFixtureModal, setShowFixtureModal] = useState(false);
  const [showDessertsModal, setShowDessertsModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  
  // MÜŞTERİ REZERVASYON TALEBİ STATE
  const initialRequestState = { 
    type: 'iftar', 
    name: '', 
    phone: '', 
    peopleCount: 2, 
    date: getToday(), 
    notes: '',
    menuTavuk: 0,
    menuHunkar: 0,
    menuKarisik: 0,
    menuCocuk: 0
  };
  const [requestData, setRequestData] = useState(initialRequestState);
  const [requestError, setRequestError] = useState('');

  // NAVBAR SCROLL STATE
  const [isScrolled, setIsScrolled] = useState(false);

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

  // TALEPLER (PENDING REQUESTS) STATE
  const [pendingRequests, setPendingRequests] = useState([]);

  // GEÇMİŞ (HISTORY) STATE
  const [historyDateFilter, setHistoryDateFilter] = useState(''); // '' means all history
  const [historyTypeFilter, setHistoryTypeFilter] = useState('all'); // 'all', 'iftar', 'mac'

  // İFTAR SAYAÇ STATE'LERİ
  const [iftarTime, setIftarTime] = useState(null);
  const [countdown, setCountdown] = useState("Hesaplanıyor...");
  const [isPrepTime, setIsPrepTime] = useState(false);
  const [isIftarTime, setIsIftarTime] = useState(false);

  useEffect(() => {
    document.title = "Salaaş Cafe Restaurant";
    
    // Scroll Listener for Navbar
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    const requestsUnsubscribe = onSnapshot(collection(db, 'reservationRequests'), (snapshot) => {
      const allReqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPendingRequests(allReqs.filter(r => r.status === 'pending').sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)));
    });
    return () => {
      iftarUnsubscribe();
      matchUnsubscribe();
      requestsUnsubscribe();
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

  // --- MÜŞTERİ REZERVASYON TALEBİ GÖNDERME ---
  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequestError(''); // Hata mesajını temizle
    setRequestData(prev => ({
      ...prev,
      [name]: name.includes('Count') || name.includes('menu') ? (value === '' ? '' : parseInt(value)) : value
    }));
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!requestData.name?.trim() || !requestData.phone?.trim()) return;

    if (requestData.type === 'iftar') {
      const totalMenus = (parseInt(requestData.menuTavuk) || 0) + 
                         (parseInt(requestData.menuHunkar) || 0) + 
                         (parseInt(requestData.menuKarisik) || 0) + 
                         (parseInt(requestData.menuCocuk) || 0);

      const peopleCount = parseInt(requestData.peopleCount) || 1;

      if (totalMenus !== peopleCount) {
        setRequestError(`Seçilen menü sayısı (${totalMenus}) ile kişi sayısı (${peopleCount}) uyuşmuyor. Lütfen kontrol ediniz.`);
        return;
      }
    }

    try {
      const submissionData = {
        ...requestData,
        phone: requestData.phone.trim(),
        peopleCount: parseInt(requestData.peopleCount) || 1,
        status: 'pending',
        createdAt: new Date().toISOString(),
        createdBy: user.uid
      };

      // Maç yayınında menüleri sıfırla
      if(requestData.type === 'mac') {
        submissionData.menuTavuk = 0;
        submissionData.menuHunkar = 0;
        submissionData.menuKarisik = 0;
        submissionData.menuCocuk = 0;
      }

      await addDoc(collection(db, 'reservationRequests'), submissionData);
      setRequestSuccess(true);
      setTimeout(() => {
        setShowRequestModal(false);
        setRequestSuccess(false);
        setRequestData(initialRequestState);
        setRequestError('');
      }, 3000);
    } catch (err) {
      console.error("Talep gönderilemedi:", err);
      setRequestError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  // --- ADMIN TALEP YÖNETİMİ ---
  const handleApproveRequest = async (req, sendWhatsapp = false) => {
    if (!user) return;
    try {
      const targetCollection = req.type === 'iftar' ? 'reservations' : 'matchReservations';
      const newRes = {
        name: req.name,
        phone: req.phone,
        notes: req.notes || '',
        peopleCount: req.peopleCount,
        date: req.date,
        table: '', // Admin sonradan atayabilir
        isArrived: false,
        createdAt: new Date().toISOString(),
        createdBy: user.uid
      };

      if (req.type === 'iftar') {
        newRes.menuTavuk = req.menuTavuk || 0; 
        newRes.menuHunkar = req.menuHunkar || 0; 
        newRes.menuKarisik = req.menuKarisik || 0; 
        newRes.menuCocuk = req.menuCocuk || 0; 
      }

      // Ana tabloya ekle
      await addDoc(collection(db, targetCollection), newRes);
      // Talebi sil
      await deleteDoc(doc(db, 'reservationRequests', req.id));

      if (sendWhatsapp) {
        sendWhatsApp(newRes, req.type, true); // Onay mesajı gönder
      }

    } catch(err) { console.error("Onay hatası:", err); }
  };

  const handleRejectRequest = async (id) => {
    if (!user) return;
    try {
      // Çöpe atıyoruz (veritabanından siliyoruz)
      await deleteDoc(doc(db, 'reservationRequests', id));
    } catch(err) { console.error("Red hatası:", err); }
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

  const sendWhatsApp = (res, type, isApproval = false) => {
    if (!res.phone) return;
    let cleanPhone = res.phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '9' + cleanPhone;
    else if (cleanPhone.length === 10) cleanPhone = '90' + cleanPhone;

    const eventName = type === 'iftar' ? 'iftar' : 'maç yayını';
    const masaMetni = res.table ? `${res.table} nolu masanız için ` : '';
    const nameStr = res.name || 'Misafirimiz';
    let message = `Sayın ${nameStr},\nSalaaş Cafe'ye ${res.date} tarihindeki ${masaMetni}${res.peopleCount} kişilik ${eventName} rezervasyonunuz alınmıştır. Bizi tercih ettiğiniz için teşekkür ederiz.`;

    if (isApproval) {
        message = `Sayın ${nameStr},\nSalaaş Cafe'ye ${res.date} tarihi için oluşturduğunuz ${res.peopleCount} kişilik ${eventName} rezervasyon talebiniz ONAYLANMIŞTIR. Bizi tercih ettiğiniz için teşekkür ederiz.`;
    }

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return "SC";
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return "SC";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

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

  const occupancyRate = Math.min(100, Math.round((dailySummary.totalPeople / 300) * 100)); // Kapasite 300'e güncellendi
  
  const handlePrintSingle = (id) => {
    setPrintSingleId(id);
    setTimeout(() => { window.print(); }, 150); 
  };

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if(element) {
      // Menü barının yüksekliği kadar pay bırakarak kaydır
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  // YENİ: WHATSAPP TOPLU BİLDİRİM FONKSİYONU
  const sendBulkWhatsApp = (reservationsList, type) => {
    if (!reservationsList || reservationsList.length === 0) {
        alert("Bu tarihte gönderilecek rezervasyon bulunmuyor.");
        return;
    }
    
    // Geçerli telefon numarası olanları filtrele
    const validReservations = reservationsList.filter(res => res.phone && res.phone.trim().length >= 10);
    
    if (validReservations.length === 0) {
        alert("Geçerli telefon numarası bulunan kayıt yok.");
        return;
    }

    const eventName = type === 'iftar' ? 'iftar' : 'maç yayını';
    const dateStr = type === 'iftar' ? selectedFilterDate : selectedMatchDate;

    let phoneListStr = "";
    validReservations.forEach(res => {
        let cleanPhone = res.phone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '9' + cleanPhone;
        else if (cleanPhone.length === 10) cleanPhone = '90' + cleanPhone;
        phoneListStr += cleanPhone + ",";
    });
    
    // Sondaki virgülü al
    phoneListStr = phoneListStr.slice(0, -1);

    const message = `Salaaş Cafe'ye ${dateStr} tarihindeki ${eventName} rezervasyonunuzu hatırlatırız. Bizi tercih ettiğiniz için teşekkür ederiz.`;
    
    // Tarayıcı destekliyorsa panoya kopyala
    navigator.clipboard.writeText(phoneListStr).then(() => {
        alert(`Toplam ${validReservations.length} numara kopyalandı! \n\nWhatsApp Broadcast (Toplu Mesaj) listenize bu numaraları yapıştırarak şu mesajı gönderebilirsiniz:\n\n"${message}"\n\n(Not: WhatsApp doğrudan toplu mesaj API'si olmadan tek tıkla çoklu gönderime izin vermez, numaraları panoya kopyaladık.)`);
    }).catch(err => {
        console.error('Panoya kopyalanamadı: ', err);
        alert("Numaralar kopyalanamadı, lütfen konsolu kontrol edin.");
    });
  };

  // YENİ: GEÇMİŞ (HISTORY) HESAPLAMALARI
  const getHistoryData = () => {
    let allData = [];
    if (historyTypeFilter === 'all' || historyTypeFilter === 'iftar') {
        const iftarHistory = reservations.map(r => ({ ...r, eventType: 'İftar' }));
        allData = [...allData, ...iftarHistory];
    }
    if (historyTypeFilter === 'all' || historyTypeFilter === 'mac') {
        const macHistory = matchReservations.map(r => ({ ...r, eventType: 'Maç' }));
        allData = [...allData, ...macHistory];
    }

    // Tarihe göre filtrele
    if (historyDateFilter) {
        allData = allData.filter(r => r.date === historyDateFilter);
    }

    // Tarihe göre sırala (en yeni en üstte)
    allData.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Haftalık veya genel toplamları hesapla
    const totalPeople = allData.reduce((acc, curr) => acc + (parseInt(curr.peopleCount) || 0), 0);
    const totalArrived = allData.filter(r => r.isArrived).reduce((acc, curr) => acc + (parseInt(curr.peopleCount) || 0), 0);
    const arrivalRate = totalPeople > 0 ? Math.round((totalArrived / totalPeople) * 100) : 0;

    return { list: allData, totalPeople, totalArrived, arrivalRate };
  };

  const historyStats = getHistoryData();


  // =======================================================================
  // 1. MÜŞTERİ / ZİYARETÇİ EKRANI (PREMIUM LANDING PAGE)
  // =======================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 relative flex flex-col scroll-smooth w-full overflow-x-hidden">
        
        {/* CSS KEYFRAMES FOR CUSTOM ANIMATIONS & VITE RESET */}
        <style dangerouslySetInnerHTML={{__html: `
          /* KESİN VITE CSS SIFIRLAMA (YANLARDAKİ SİYAH BOŞLUKLARI YOK EDER) */
          #root {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            text-align: left !important;
          }
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
            background-color: #f8fafc !important; /* slate-50 */
          }

          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
            100% { transform: translateY(0px); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shine {
            100% { left: 125%; }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
          .delay-100 { animation-delay: 100ms; }
          .delay-200 { animation-delay: 200ms; }
          .delay-300 { animation-delay: 300ms; }
          .delay-400 { animation-delay: 400ms; }
          .shine-effect {
            position: relative;
            overflow: hidden;
          }
          .shine-effect::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
            transform: skewX(-20deg);
            animation: shine 3s infinite;
          }
        `}} />

        {/* PREMIUM NAVBAR - DÜZELTİLMİŞ GENİŞ TASARIM */}
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
          <nav className={`w-full pointer-events-auto transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200' : 'bg-transparent py-5 sm:py-6'}`}>
            <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-24 flex items-center justify-between">
              {/* LOGO */}
              <div className={`transition-all duration-500 cursor-pointer flex items-center justify-center bg-transparent shrink-0 ${isScrolled ? 'h-10 sm:h-12' : 'h-12 sm:h-16'}`} onClick={() => window.scrollTo(0,0)}>
                <img src="/salaaslogobg.png" alt="Salaaş Logo" className="h-full w-auto object-contain bg-transparent" />
              </div>
              
              {/* LINKS (Desktop) */}
              <div className={`hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-12 font-bold text-sm xl:text-base transition-colors duration-500 ${isScrolled ? 'text-slate-700' : 'text-white drop-shadow-md'}`}>
                <button onClick={() => handleScroll('hakkimizda')} className="hover:text-orange-500 transition-colors whitespace-nowrap">Biz Kimiz?</button>
                <button onClick={() => handleScroll('lezzetler')} className="hover:text-orange-500 transition-colors whitespace-nowrap">Lezzetler</button>
                <button onClick={() => handleScroll('iletisim')} className="hover:text-orange-500 transition-colors whitespace-nowrap">İletişim</button>
              </div>
              
              {/* ACTION BUTTON */}
              <div className="shrink-0 flex items-center justify-end gap-3 sm:gap-4">
                <button onClick={() => setShowRequestModal(true)} className={`hidden sm:flex items-center gap-2 px-4 py-2.5 xl:px-6 xl:py-3 rounded-full text-xs xl:text-sm font-bold tracking-widest uppercase transition-all shadow-md ${isScrolled ? 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50' : 'bg-emerald-700/80 backdrop-blur-sm text-white hover:bg-emerald-600 border border-emerald-500/50'}`}>
                  <CalendarDays size={16} /> Rezervasyon Talebi
                </button>
                <a href="https://m.1menu.com.tr/salaascafe/" target="_blank" rel="noreferrer" className="shine-effect bg-orange-500 text-white px-5 py-2.5 sm:px-6 sm:py-3 xl:px-8 xl:py-3.5 rounded-full text-xs sm:text-sm font-black tracking-widest uppercase hover:bg-orange-600 hover:scale-105 transition-all shadow-lg whitespace-nowrap">
                  Menüyü Gör
                </a>
              </div>
            </div>
          </nav>
        </div>

        {/* HERO SECTION */}
        <header className="relative w-full min-h-[500px] h-[75vh] lg:h-[85vh] max-h-[1000px] bg-slate-900 flex items-center justify-center overflow-hidden pt-16">
           {/* Arka Plan Görseli */}
           <div className="absolute inset-0 z-0 w-full h-full">
             <img src="/salaasarkaplan.jpeg" alt="Salaaş Cafe Arka Plan" className="w-full h-full object-cover opacity-50 scale-105 object-center" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent w-full"></div>
           </div>
           
           {/* Hero İçerik */}
           <div className="relative z-10 text-center px-4 sm:px-6 w-full mx-auto flex flex-col items-center justify-center h-full pb-10">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-wide text-white font-serif mb-6 drop-shadow-2xl animate-fade-in-up delay-100 leading-tight">
                Lezzet ve <span className="text-orange-400">Muhabbetin</span> Adresi
              </h1>
              <p className="text-lg sm:text-xl lg:text-3xl text-slate-200 max-w-4xl mx-auto font-medium mb-10 drop-shadow-lg animate-fade-in-up delay-200">
                Şehrin gürültüsünden uzak, samimi atmosferimizde unutulmaz tatlar ve anılar biriktirin.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 animate-fade-in-up delay-300 w-full max-w-md lg:max-w-lg mx-auto mb-10">
                 <button onClick={() => setShowRequestModal(true)} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 lg:px-10 lg:py-5 rounded-full font-black uppercase tracking-widest transition-transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2 lg:text-lg">
                   <CalendarDays size={24} /> Rezervasyon Talebi
                 </button>
              </div>

              <div className="flex flex-wrap justify-center gap-3 sm:gap-5 lg:gap-8 text-xs sm:text-sm lg:text-base font-bold tracking-widest uppercase text-white animate-fade-in-up delay-400">
                 <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full shadow-xl"><Coffee size={20} className="text-orange-400"/> Kahvaltı</span>
                 <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full shadow-xl"><UtensilsCrossed size={20} className="text-orange-400"/> Izgara</span>
                 <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full shadow-xl"><Wind size={20} className="text-orange-400"/> Nargile</span>
              </div>
           </div>
           
           {/* Scroll Down Indicator */}
           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce cursor-pointer z-20" onClick={() => handleScroll('hakkimizda')}>
              <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold block mb-2 opacity-70 text-center">Keşfet</span>
              <div className="w-6 h-10 lg:w-8 lg:h-12 border-2 border-white/30 rounded-full flex justify-center p-1 mx-auto"><div className="w-1 h-2 lg:h-3 bg-white/60 rounded-full"></div></div>
           </div>
        </header>

        <main className="w-full relative z-10 flex-1 flex flex-col">
          
          {/* HAKKIMIZDA / BİZ KİMİZ */}
          <section id="hakkimizda" className="w-full mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 py-20 md:py-32 text-center bg-white">
            <div className="animate-float inline-block mb-6">
              <MoonStar size={56} className="text-orange-400 opacity-80" />
            </div>
            <h2 className="text-sm lg:text-base font-black tracking-[0.3em] text-orange-500 uppercase mb-4">Hikayemiz</h2>
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-[#0B3B2C] mb-8">Sıcak, Samimi ve Lezzetli</h3>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 leading-relaxed font-light max-w-5xl mx-auto">
              Salaaş Cafe Restaurant olarak, misafirlerimize kendilerini evlerinde hissedecekleri sıcak bir ortam sunuyoruz. 
              Özenle seçilmiş malzemelerle hazırladığımız zengin menümüz, imza ızgaralarımız, serpme kahvaltımız ve 
              keyifli nargile köşemizle günün her saatinde kaliteli bir deneyim yaşatmayı hedefliyoruz.
            </p>
            <div className="w-24 lg:w-32 h-1.5 lg:h-2 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto mt-12 lg:mt-16 rounded-full"></div>
          </section>

          {/* DENEDİNİZ Mİ? (LEZZETLER) */}
          <section id="lezzetler" className="w-full py-20 md:py-32 border-y border-slate-200/50 bg-slate-50">
            <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-24">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
                <div>
                  <h2 className="text-sm lg:text-base font-black tracking-[0.3em] text-orange-500 uppercase mb-2">Vitrinimiz</h2>
                  <h3 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-[#0B3B2C]">Bunu Denediniz mi?</h3>
                </div>
                <a href="https://m.1menu.com.tr/salaascafe/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm lg:text-base font-bold text-slate-500 hover:text-orange-600 transition-all uppercase tracking-widest group">
                  Tüm Menüyü Gör <div className="bg-orange-100 p-2 lg:p-3 rounded-full group-hover:bg-orange-200 transition-colors"><ChevronRight size={18} className="text-orange-600"/></div>
                </a>
              </div>

              {/* Responsive Grid System for Showcase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-10">
                
                {/* 1. Kahvaltı (Özel Boyut - 2 Kolon Kaplar) */}
                <div className="lg:col-span-2 sm:col-span-2 rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 transition-all duration-500 relative group h-80 sm:h-96 md:h-[450px] cursor-pointer border border-slate-100 bg-white">
                  <img src={encodeURI("/salaaskoykahvaltisi.jpg")} alt="Salaaş Köy Kahvaltısı" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent flex flex-col justify-end p-8 lg:p-10">
                     <span className="bg-orange-500 text-white text-xs lg:text-sm font-black uppercase tracking-widest px-4 py-1.5 lg:px-5 lg:py-2 rounded-full w-max mb-4 lg:mb-6 flex items-center gap-1.5 shadow-lg"><Star size={16}/> İmza Lezzet</span>
                     <h4 className="text-white font-serif font-black text-4xl lg:text-5xl drop-shadow-md mb-3">Salaaş Köy Kahvaltısı</h4>
                     <p className="text-slate-200 text-base lg:text-lg font-medium max-w-xl opacity-90 hidden sm:block">Güne harika başlamak için yöresel peynirler, sıcaklar ve taze demlenmiş çay eşliğinde devasa bir sofra.</p>
                  </div>
                </div>
                
                {/* 2. Burger */}
                <div className="rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative group h-80 sm:h-96 md:h-[450px] cursor-pointer border border-slate-100 bg-white">
                  <img src={encodeURI("/mantarlıfırınburger.jpg")} alt="Mantarlı Fırın Burger" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col justify-end p-8 lg:p-10">
                     <h4 className="text-white font-serif font-black text-2xl lg:text-3xl drop-shadow-md">Mantarlı Fırın Burger</h4>
                     <p className="text-slate-300 text-sm lg:text-base mt-2 font-medium">Özel soslu nefis deneyim.</p>
                  </div>
                </div>

                {/* 3. Hünkar */}
                <div className="rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative group h-80 sm:h-96 md:h-[450px] cursor-pointer border border-slate-100 bg-white">
                  <img src={encodeURI("/hunkarkofte.jpg")} alt="Hünkar Köfte" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col justify-end p-8 lg:p-10">
                     <h4 className="text-white font-serif font-black text-2xl lg:text-3xl drop-shadow-md">Hünkar Köfte</h4>
                     <p className="text-slate-300 text-sm lg:text-base mt-2 font-medium">Geleneksel lezzet şöleni.</p>
                  </div>
                </div>

                {/* 4. Cafe de Paris */}
                <div className="rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative group h-80 md:h-[450px] cursor-pointer border border-slate-100 bg-white">
                  <img src={encodeURI("/cafedeparis.jpg")} alt="Chicken Cafe de Paris" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col justify-end p-8 lg:p-10">
                     <h4 className="text-white font-serif font-black text-2xl lg:text-3xl drop-shadow-md leading-tight">Cafe de Paris<br/>Soslu Tavuk</h4>
                  </div>
                </div>

                {/* 5. Nargile */}
                <div className="rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 transition-all duration-500 relative group h-80 md:h-[450px] cursor-pointer border border-slate-100 bg-white">
                  <img src={encodeURI("/salaasnargilefoto.jpg")} alt="Nargile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-[#0a192f]/60 group-hover:bg-[#0a192f]/40 transition-colors flex flex-col justify-center items-center text-center p-8 lg:p-10 backdrop-blur-[2px]">
                     <Wind size={64} className="text-cyan-400 mb-6 drop-shadow-lg" />
                     <h4 className="text-white font-serif font-black text-3xl lg:text-4xl drop-shadow-md">Nargile Keyfi</h4>
                  </div>
                </div>

                {/* 6. TATLILAR (ÖZEL BOYUT - 2 Kolon Kaplar) */}
                <div 
                  onClick={() => setShowDessertsModal(true)}
                  className="lg:col-span-2 sm:col-span-2 rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2 transition-all duration-500 relative group h-80 sm:h-96 md:h-[450px] cursor-pointer border-4 border-pink-200 bg-white"
                >
                  <img src={encodeURI("/dubai cikolatalı.jpg")} alt="Özel Tatlılarımız" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent flex flex-col justify-end p-8 lg:p-10">
                     <span className="bg-pink-500 text-white text-xs lg:text-sm font-black uppercase tracking-widest px-4 py-1.5 lg:px-5 lg:py-2 rounded-full w-max mb-4 lg:mb-6 flex items-center gap-1.5 shadow-lg group-hover:bg-pink-600 group-hover:scale-105 transition-all">
                        Tüm Tatlılarımız <ChevronRight size={16}/>
                     </span>
                     <h4 className="text-white font-serif font-black text-4xl lg:text-5xl drop-shadow-md mb-3">Nefis Tatlı Çeşitleri</h4>
                     <p className="text-slate-200 text-base lg:text-lg font-medium max-w-xl opacity-90 hidden sm:block">Dubai Çikolatalı, Lotus Dome, Profiterol ve daha fazlasını hemen keşfedin.</p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ORGANİZASYON & ETKİNLİK */}
          <section className="w-full py-28 md:py-36 bg-slate-900 text-white relative overflow-hidden">
             <div className="absolute inset-0 opacity-5 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #FBE18D 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
             <div className="absolute -right-20 -top-20 opacity-10 text-orange-500 hidden md:block"><MoonStar size={500}/></div>
             
             <div className="w-full mx-auto px-4 sm:px-8 lg:px-16 text-center relative z-10">
               <h2 className="text-base lg:text-lg font-black tracking-[0.4em] text-orange-400 uppercase mb-6">Davet & Organizasyon</h2>
               <h3 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-black mb-10 drop-shadow-lg">Özel Günleriniz İçin Yanınızdayız</h3>
               <p className="text-lg sm:text-xl lg:text-3xl text-slate-300 font-light mb-16 max-w-4xl mx-auto leading-relaxed">
                 Doğum günü partileri, şirket yemekleri, toplu iftarlar ve tüm özel kutlamalarınız için 300 kişilik kapasitemiz ve size özel menülerimizle hizmetinizdeyiz.
               </p>
               <a href="tel:+902626421413" className="shine-effect inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 lg:px-14 lg:py-6 rounded-full font-black uppercase tracking-widest transition-transform hover:scale-105 shadow-2xl hover:shadow-orange-500/30 text-base lg:text-xl">
                 <Phone size={24}/> Rezervasyon Hattı
               </a>
             </div>
          </section>

        </main>

        {/* PREMIUM FOOTER */}
        <footer id="iletisim" className="w-full bg-slate-950 text-slate-400 py-20 lg:py-24 relative z-10 border-t border-slate-800">
          <div className="w-full mx-auto px-6 sm:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            
            {/* Logo & About */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <img src="/salaaslogobg.png" alt="Salaaş Logo" className="h-24 lg:h-32 object-contain mb-8 opacity-90" />
              <p className="text-base lg:text-lg leading-relaxed mb-6 max-w-sm font-medium text-slate-300">Şehrin kalbinde, lezzet ve muhabbetin kesişme noktası. Sizi ağırlamaktan mutluluk duyarız.</p>
            </div>

            {/* İletişim */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-white font-black uppercase tracking-widest mb-8 text-lg lg:text-xl">İletişim</h4>
              <ul className="space-y-6 text-base lg:text-lg font-medium text-slate-300">
                <li>
                   <a href="tel:+902626421413" className="hover:text-orange-400 transition-colors flex items-center justify-center md:justify-start gap-4">
                     <Phone size={20}/> 📞 Telefon: 0262 642 14 13
                   </a>
                </li>
                <li>
                   <a href="https://wa.me/905392356004" target="_blank" rel="noreferrer" className="hover:text-[#25D366] transition-colors flex items-center justify-center md:justify-start gap-4">
                     <MessageCircle size={20}/> 💬 WhatsApp: 0539 235 60 04
                   </a>
                </li>
                <li>
                   <a href="https://www.instagram.com/salascaferestaurant/" target="_blank" rel="noreferrer" className="hover:text-pink-500 transition-colors flex items-center justify-center md:justify-start gap-4">
                     <Instagram size={20}/> 📸 Instagram: @salascaferestaurant
                   </a>
                </li>
                <li>
                   <div className="flex flex-col items-center md:items-start gap-3">
                     <div className="flex items-start justify-center md:justify-start gap-4 text-left">
                        <MapPin size={20} className="shrink-0 mt-1"/> 
                        <span>📍 Harita<br/>Gebze, Kocaeli</span>
                     </div>
                     <a href="https://www.google.com/maps/dir/?api=1&destination=Salaaş+Cafe+Restaurant+Gebze" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-md mt-2 ml-0 md:ml-9">
                        Yol Tarifi Al <ArrowRight size={16}/>
                     </a>
                   </div>
                </li>
              </ul>
            </div>

            {/* Linkler & Login */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-white font-black uppercase tracking-widest mb-8 text-lg lg:text-xl">Hızlı Bağlantılar</h4>
              <ul className="space-y-5 text-base lg:text-lg font-medium mb-10 text-slate-300">
                <li><a href="https://m.1menu.com.tr/salaascafe/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center justify-center md:justify-start gap-3"><ChevronRight size={18} className="text-orange-500"/> Dijital Menü</a></li>
              </ul>
              
              {/* PERSONEL GİRİŞİ */}
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 lg:px-8 lg:py-4 rounded-2xl text-sm lg:text-base font-black uppercase tracking-widest flex items-center gap-3 transition-all border border-slate-700 hover:border-slate-600 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <Lock size={18} /> Personel Girişi
              </button>
            </div>
          </div>
          
          <div className="w-full mx-auto px-6 sm:px-12 lg:px-24 mt-20 pt-10 border-t border-slate-800/50 text-center text-sm font-medium opacity-60">
            <p>© 2026 Salaaş Cafe Restaurant. Tüm hakları saklıdır.</p>
          </div>
        </footer>

        {/* FİKSTÜR MODAL */}
        {showFixtureModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[#0a192f] p-6 lg:p-8 flex items-center justify-between text-white shrink-0">
                <h3 className="font-black tracking-wide flex items-center gap-3 text-lg lg:text-xl"><MonitorPlay size={24} className="text-cyan-400"/> Dev Ekran Maç Fikstürü</h3>
                <button onClick={() => setShowFixtureModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors"><X size={24}/></button>
              </div>
              <div className="overflow-y-auto p-4 lg:p-6 bg-slate-50">
                <div className="space-y-4">
                   {MATCH_FIXTURE.map((match, idx) => (
                     <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-colors">
                        <div>
                           <p className="text-sm font-bold text-slate-400 flex items-center gap-2 mb-2"><CalendarDays size={16}/> {match.displayDate}</p>
                           <p className="font-black text-[#0a192f] text-base lg:text-lg">{match.team1} <span className="text-slate-300 font-normal mx-2">vs</span> {match.team2}</p>
                        </div>
                        <button 
                           onClick={() => { setRequestData({...requestData, type: 'mac', date: match.date}); setShowFixtureModal(false); setShowRequestModal(true); }} 
                           className="bg-blue-50 text-blue-600 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          Seç
                        </button>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TATLILAR MENÜSÜ MODAL */}
        {showDessertsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[1400px] overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-4 duration-300">
              
              <div className="bg-[#0B3B2C] p-5 sm:p-8 flex items-center justify-between text-white shrink-0">
                <h3 className="font-black tracking-wide flex items-center gap-3 text-xl sm:text-3xl"><Coffee size={32} className="text-pink-400"/> Tatlı Menümüz</h3>
                <button onClick={() => setShowDessertsModal(false)} className="p-3 hover:bg-white/20 rounded-2xl transition-colors"><X size={32}/></button>
              </div>
              
              <div className="overflow-y-auto p-6 sm:p-10 lg:p-12 bg-slate-50 flex-1">
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
                   {DESSERTS.map((tatli) => (
                     <div key={tatli.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full group hover:shadow-xl transition-all hover:-translate-y-2">
                       <div className="w-full aspect-[4/3] bg-slate-100 relative overflow-hidden shrink-0 border-b border-slate-100">
                          <img 
                            src={encodeURI(tatli.image)} 
                            alt={tatli.name} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80'; }}
                          />
                       </div>
                       <div className="p-5 sm:p-6 text-center flex flex-col justify-center grow min-h-[80px] bg-white z-10">
                          <h4 className="font-black text-[#0B3B2C] text-sm sm:text-base lg:text-lg leading-snug">{tatli.name}</h4>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* ZİYARETÇİ REZERVASYON TALEBİ MODALI */}
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-emerald-700 p-6 sm:p-8 flex items-center justify-between text-white shrink-0 z-10">
                <h3 className="font-black tracking-wide flex items-center gap-3 text-xl lg:text-2xl"><CalendarDays size={28} className="text-emerald-300"/> Rezervasyon Talebi Oluştur</h3>
                <button onClick={() => setShowRequestModal(false)} className="p-3 hover:bg-white/20 rounded-2xl transition-colors"><X size={28}/></button>
              </div>
              
              <div className="overflow-y-auto bg-white flex-1 relative">
                {requestSuccess ? (
                   <div className="p-16 flex flex-col items-center justify-center text-center space-y-6 h-full min-h-[400px]">
                      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                         <CheckCircle2 size={48} />
                      </div>
                      <h3 className="text-3xl font-black text-slate-800">Talebiniz Alındı!</h3>
                      <p className="text-lg text-slate-500">Rezervasyon talebiniz işletmemize başarıyla iletilmiştir. En kısa sürede sizinle iletişime geçip onay verilecektir.</p>
                   </div>
                ) : (
                  <form onSubmit={submitRequest} className="p-8 sm:p-10 space-y-6">
                    
                    {requestError && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
                        <AlertTriangle size={20} className="shrink-0" />
                        {requestError}
                      </div>
                    )}

                    {/* Tür Seçimi */}
                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Rezervasyon Türü</label>
                      <div className="flex gap-4">
                         <button type="button" onClick={() => setRequestData({...requestData, type: 'iftar'})} className={`flex-1 py-4 rounded-2xl font-black text-base border-2 transition-all flex items-center justify-center gap-2 ${requestData.type === 'iftar' ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md' : 'border-slate-200 text-slate-500 hover:border-orange-200 bg-white'}`}>
                           <MoonStar size={20}/> İftar
                         </button>
                         <button type="button" onClick={() => setRequestData({...requestData, type: 'mac'})} className={`flex-1 py-4 rounded-2xl font-black text-base border-2 transition-all flex items-center justify-center gap-2 ${requestData.type === 'mac' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' : 'border-slate-200 text-slate-500 hover:border-blue-200 bg-white'}`}>
                           <MonitorPlay size={20}/> Maç Yayını
                         </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="flex-[2]">
                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Ad Soyad</label>
                        <input type="text" name="name" value={requestData.name} onChange={handleRequestChange} className={`w-full bg-white px-5 py-4 rounded-2xl border-2 focus:ring-4 outline-none font-bold text-slate-800 transition-all text-lg ${requestData.type === 'iftar' ? 'border-slate-200 focus:ring-orange-500/10 focus:border-orange-500' : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500'}`} required placeholder="Adınız Soyadınız" />
                      </div>
                      <div className="flex-[1]">
                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Kişi Sayısı</label>
                        <input type="number" name="peopleCount" min="1" value={requestData.peopleCount} onChange={handleRequestChange} className={`w-full bg-white px-5 py-4 rounded-2xl border-2 focus:ring-4 outline-none font-bold text-slate-800 transition-all text-center text-lg ${requestData.type === 'iftar' ? 'border-slate-200 focus:ring-orange-500/10 focus:border-orange-500' : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500'}`} required />
                      </div>
                    </div>

                    {/* İftar Menü Seçimi */}
                    {requestData.type === 'iftar' && (
                      <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                           <UtensilsCrossed size={18} className="text-orange-500"/> İftar Menüsü Seçimi
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                           <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                              <span className="block text-xs font-bold text-slate-500 mb-2">Tavuk</span>
                              <input type="number" name="menuTavuk" min="0" value={requestData.menuTavuk} onChange={handleRequestChange} className="w-full bg-slate-50 px-2 py-2 rounded-lg border border-slate-200 text-center font-bold outline-none focus:border-orange-500" />
                           </div>
                           <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                              <span className="block text-xs font-bold text-slate-500 mb-2">Hünkar</span>
                              <input type="number" name="menuHunkar" min="0" value={requestData.menuHunkar} onChange={handleRequestChange} className="w-full bg-slate-50 px-2 py-2 rounded-lg border border-slate-200 text-center font-bold outline-none focus:border-orange-500" />
                           </div>
                           <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                              <span className="block text-xs font-bold text-slate-500 mb-2">Izgara</span>
                              <input type="number" name="menuKarisik" min="0" value={requestData.menuKarisik} onChange={handleRequestChange} className="w-full bg-slate-50 px-2 py-2 rounded-lg border border-slate-200 text-center font-bold outline-none focus:border-orange-500" />
                           </div>
                           <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                              <span className="block text-xs font-bold text-orange-600 mb-2">Çocuk</span>
                              <input type="number" name="menuCocuk" min="0" value={requestData.menuCocuk} onChange={handleRequestChange} className="w-full bg-slate-50 px-2 py-2 rounded-lg border border-orange-200 text-orange-700 text-center font-bold outline-none focus:border-orange-500" />
                           </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-5">
                       <div className="flex-1">
                          <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Telefon</label>
                          <input type="tel" name="phone" value={requestData.phone} onChange={handleRequestChange} className={`w-full bg-white px-5 py-4 rounded-2xl border-2 focus:ring-4 outline-none font-bold text-slate-800 transition-all text-lg ${requestData.type === 'iftar' ? 'border-slate-200 focus:ring-orange-500/10 focus:border-orange-500' : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500'}`} required placeholder="05XX..." />
                       </div>
                       <div className="flex-1">
                          <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Tarih</label>
                          <input type="date" name="date" value={requestData.date} onChange={handleRequestChange} className={`w-full bg-white px-5 py-4 rounded-2xl border-2 focus:ring-4 outline-none font-bold text-slate-800 transition-all text-lg ${requestData.type === 'iftar' ? 'border-slate-200 focus:ring-orange-500/10 focus:border-orange-500' : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500'}`} required />
                       </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Notunuz (İsteğe Bağlı)</label>
                      <textarea name="notes" value={requestData.notes} onChange={handleRequestChange} rows="3" className={`w-full bg-white px-5 py-4 rounded-2xl border-2 focus:ring-4 outline-none font-medium text-slate-800 transition-all resize-none text-base ${requestData.type === 'iftar' ? 'border-slate-200 focus:ring-orange-500/10 focus:border-orange-500' : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500'}`} placeholder="Örn: Mama sandalyesi istiyoruz, cam kenarı olsun vb."></textarea>
                    </div>

                    <button type="submit" className={`w-full text-white font-black tracking-widest uppercase py-5 rounded-2xl transition-all shadow-lg hover:shadow-xl mt-4 flex items-center justify-center gap-3 hover:-translate-y-1 text-lg ${requestData.type === 'iftar' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                      Talebi Gönder <ArrowRight size={24} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LOGIN MODAL */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[#0B3B2C] p-6 sm:p-8 flex items-center justify-between text-white">
                <h3 className="font-black tracking-wide flex items-center gap-2 sm:gap-3 text-lg sm:text-xl"><Lock size={20} className="text-orange-400"/> Sistem Girişi</h3>
                <button onClick={() => {setShowLoginModal(false); setLoginError('');}} className="p-2 sm:p-3 hover:bg-white/20 rounded-xl transition-colors"><X size={20}/></button>
              </div>
              <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4 sm:space-y-6 bg-white">
                {loginError && <div className="bg-red-50 text-red-600 text-sm font-bold p-3 sm:p-4 rounded-xl border border-red-100 flex items-center gap-2"><X size={16}/> {loginError}</div>}
                
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Kullanıcı Adı</label>
                  <input 
                    type="text" 
                    value={loginUser} 
                    onChange={(e) => setLoginUser(e.target.value)} 
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-[#0B3B2C]/10 focus:border-[#0B3B2C] outline-none bg-slate-50 font-bold text-slate-800 transition-all text-base sm:text-lg" 
                    placeholder="Kullanıcı adınızı girin" 
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Şifre</label>
                  <input 
                    type="password" 
                    value={loginPass} 
                    onChange={(e) => setLoginPass(e.target.value)} 
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-[#0B3B2C]/10 focus:border-[#0B3B2C] outline-none bg-slate-50 font-bold text-slate-800 transition-all text-base sm:text-lg" 
                    placeholder="••••••••" 
                  />
                </div>
                <button type="submit" className="w-full bg-[#0B3B2C] hover:bg-emerald-900 text-white font-black tracking-widest uppercase py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-xl mt-4 sm:mt-6 flex items-center justify-center gap-2 sm:gap-3 hover:-translate-y-0.5 text-base sm:text-lg">
                  Giriş Yap <ArrowRight size={20} />
                </button>
              </form>
            </div>
          </div>
        )}
        
        {/* WHATSAPP FLOATING BUTTON */}
        <a 
          href="https://wa.me/905392356004?text=Merhaba%20Salaas%20Cafe,%20rezervasyon%20yapmak%20istiyorum." 
          target="_blank" 
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-3.5 rounded-full font-black shadow-2xl flex items-center justify-center gap-2 transition-transform hover:scale-110 border-4 border-white"
        >
          <MessageCircle size={24} />
          <span className="hidden sm:block text-sm uppercase tracking-widest">WhatsApp</span>
        </a>
      </div>
    );
  }

  // =======================================================================
  // 2. PERSONEL / ADMİN YÖNETİM EKRANI
  // =======================================================================
  return (
    <div className={`min-h-screen font-sans text-slate-800 pb-12 print:bg-white print:pb-0 relative transition-colors duration-500 w-full overflow-x-hidden ${activePage === 'iftar' ? 'bg-slate-50' : activePage === 'mac' ? 'bg-[#f0f4f8]' : activePage === 'gecmis' ? 'bg-slate-100' : 'bg-slate-100'}`}>
      
      {/* CSS KEYFRAMES FOR CUSTOM ANIMATIONS & VITE RESET */}
      <style>{`
        /* KESİN VITE CSS SIFIRLAMA (YANLARDAKİ SİYAH BOŞLUKLARI YOK EDER) */
        #root {
          max-width: 100% !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          text-align: left !important;
        }
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: hidden !important;
        }
      `}</style>

      {/* İSLAMİ DESEN */}
      {activePage === 'iftar' && (
        <>
          <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] print:hidden w-full h-full" style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="fixed top-20 right-10 z-0 pointer-events-none opacity-5 text-emerald-900 rotate-12 print:hidden"><MoonStar size={400} strokeWidth={1} /></div>
        </>
      )}

      {/* MAÇ DESENİ */}
      {activePage === 'mac' && (
        <div className="fixed top-20 right-10 z-0 pointer-events-none opacity-[0.03] text-blue-900 rotate-12 print:hidden"><MonitorPlay size={400} strokeWidth={1} /></div>
      )}

      {/* BİLDİRİMLER */}
      {activePage === 'iftar' && isPrepTime && (
        <div className="fixed top-0 left-0 right-0 w-full z-50 bg-red-600 text-white p-3 flex items-center justify-center gap-3 shadow-2xl animate-pulse print:hidden">
          <BellRing className="animate-bounce" />
          <span className="font-black tracking-widest text-sm md:text-lg uppercase">Mutfak Bildirimi: İftara son 10 Dakika! Servis Hazırlığı Başlasın!</span>
          <Flame className="animate-bounce text-yellow-300" />
        </div>
      )}
      {activePage === 'iftar' && isIftarTime && (
        <div className="fixed top-0 left-0 right-0 w-full z-50 bg-emerald-600 text-white p-3 flex items-center justify-center gap-3 shadow-2xl print:hidden">
          <MoonStar className="animate-spin-slow text-yellow-300" />
          <span className="font-black tracking-widest text-lg uppercase">Hayırlı İftarlar - İftar Vakti!</span>
        </div>
      )}

      {/* Genel Yazdırma Modu İçin Gizli Başlık */}
      <div className={`hidden ${!printSingleId ? 'print:block' : ''} text-center mb-4 border-b-2 border-black pb-2 relative z-10 w-full`}>
        <h1 className="text-xl font-bold font-sans uppercase">{activePage === 'iftar' ? 'Salaaş Cafe İftar' : 'Salaaş Cafe Maç'}</h1>
        <p className="text-sm mt-1 font-bold text-black">Tarih: {activePage === 'iftar' ? selectedFilterDate : selectedMatchDate}</p>
      </div>

      {/* Üst Bilgi Barı - GENİŞ EKRANA UYARLANDI */}
      <header className={`${activePage === 'iftar' ? 'bg-[#0B3B2C]' : activePage === 'mac' ? 'bg-[#0a192f]' : 'bg-slate-900'} text-white shadow-lg sticky z-20 print:hidden transition-colors duration-500 w-full ${(isPrepTime || isIftarTime) && activePage === 'iftar' ? 'top-[52px]' : 'top-0'}`}>
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-20 py-3 sm:py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center justify-between w-full lg:w-auto gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 sm:h-12 shrink-0 flex items-center justify-center overflow-visible drop-shadow-md bg-transparent">
                 <img src="/salaaslogobg.png" alt="Salaaş Cafe Logo" className="h-full w-auto object-contain bg-transparent" />
              </div>
              <div className="flex flex-col hidden sm:block">
                <h1 className={`text-base md:text-lg lg:text-xl font-black tracking-wide text-transparent bg-clip-text font-serif ${activePage === 'iftar' ? 'bg-gradient-to-r from-orange-400 to-yellow-300' : activePage === 'mac' ? 'bg-gradient-to-r from-blue-400 to-cyan-300' : 'bg-gradient-to-r from-slate-200 to-white'}`}>Yönetim Paneli</h1>
              </div>
            </div>

            {/* SEKMELER / GEÇİŞ BUTONLARI */}
            <div className="flex items-center bg-black/40 p-1.5 rounded-xl border border-white/10 shadow-inner ml-2 sm:ml-0 overflow-x-auto">
              <button 
                onClick={() => setActivePage('iftar')} 
                className={`px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg text-xs lg:text-sm font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activePage === 'iftar' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                <MoonStar size={16} className={activePage === 'iftar' ? '' : 'opacity-50'}/> İFTAR
              </button>
              <button 
                onClick={() => setActivePage('mac')} 
                className={`px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg text-xs lg:text-sm font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activePage === 'mac' ? 'bg-blue-600 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                <MonitorPlay size={16} className={activePage === 'mac' ? '' : 'opacity-50'}/> MAÇ
              </button>
              <button 
                onClick={() => setActivePage('talepler')} 
                className={`relative px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg text-xs lg:text-sm font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activePage === 'talepler' ? 'bg-emerald-600 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                <Inbox size={16} className={activePage === 'talepler' ? '' : 'opacity-50'}/> TALEPLER
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-md">{pendingRequests.length}</span>
                )}
              </button>
              <button 
                onClick={() => setActivePage('gecmis')} 
                className={`px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg text-xs lg:text-sm font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activePage === 'gecmis' ? 'bg-purple-600 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                <History size={16} className={activePage === 'gecmis' ? '' : 'opacity-50'}/> GEÇMİŞ
              </button>
            </div>
          </div>

          <div className="flex flex-row items-center justify-end gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
             {activePage === 'iftar' ? (
                <div className={`flex shrink-0 items-center rounded-xl px-4 py-2 border lg:w-auto justify-center shadow-inner transition-colors duration-500 ${isPrepTime ? 'bg-red-500/20 border-red-500 text-red-100' : isIftarTime ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' : 'bg-white/5 border-orange-500/30 text-orange-200'}`}>
                  <Clock className={`mr-2 ${isPrepTime ? 'animate-bounce text-red-400' : 'opacity-80'}`} size={20} />
                  <div className="flex flex-col items-center lg:items-start">
                     <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest opacity-70">İftara Kalan</span>
                     <span className={`font-mono font-black text-base lg:text-xl tracking-widest drop-shadow-md ${isPrepTime ? 'text-red-300' : isIftarTime ? 'text-emerald-300' : 'text-white'}`}>{countdown}</span>
                  </div>
                </div>
             ) : null}

            {activePage !== 'talepler' && activePage !== 'gecmis' && (
              <div className={`flex shrink-0 items-center bg-white/10 rounded-xl px-4 py-2.5 lg:px-5 lg:py-3 border border-white/10 hover:bg-white/20 transition-colors w-full lg:w-auto justify-center`}>
                <CalendarDays className={`mr-2 ${activePage === 'iftar' ? 'text-orange-400' : 'text-cyan-400'}`} size={20} />
                <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest opacity-70 text-cyan-100 hidden lg:inline mr-3">Tarih Seç:</span>
                <input type="date" value={activePage === 'iftar' ? selectedFilterDate : selectedMatchDate} onChange={(e) => activePage === 'iftar' ? setSelectedFilterDate(e.target.value) : setSelectedMatchDate(e.target.value)} className="bg-transparent text-white outline-none font-bold cursor-pointer text-sm lg:text-base w-full lg:w-auto" />
              </div>
            )}

            {/* ÇIKIŞ BUTONU */}
            <button onClick={() => {setIsAuthenticated(false); setLoginUser(''); setLoginPass('');}} className="shrink-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 lg:px-5 lg:py-3 rounded-xl text-xs lg:text-sm font-black uppercase tracking-widest transition-colors shadow-md ml-auto lg:ml-0" title="Güvenli Çıkış">ÇIKIŞ</button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className={`flex flex-col items-center justify-center mt-32 relative z-10 w-full ${activePage === 'iftar' ? 'text-orange-600' : 'text-blue-600'}`}>
          <Loader2 className="animate-spin mb-4" size={64} />
          <p className="font-bold text-lg tracking-widest animate-pulse uppercase">Sisteme Bağlanıyor...</p>
        </div>
      ) : (
        <main className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-20 mt-8 lg:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 print:block print:m-0 print:p-0 relative z-10">
          
          {/* ----------------------------- */}
          {/* TALEPLER EKRANI */}
          {/* ----------------------------- */}
          {activePage === 'talepler' && (
            <div className="lg:col-span-12 space-y-6 w-full">
               <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-100 w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 pb-6 border-b border-slate-100 gap-4">
                     <h2 className="text-2xl lg:text-3xl font-black flex items-center gap-3 text-slate-800"><Inbox className="text-emerald-500" size={36} /> Müşteri Rezervasyon Talepleri</h2>
                     <span className="bg-emerald-100 text-emerald-800 px-6 py-3 rounded-full text-sm font-black shrink-0 shadow-sm">{pendingRequests.length} Bekleyen Talep</span>
                  </div>

                  {pendingRequests.length === 0 ? (
                    <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-24 text-center text-slate-400 w-full">
                       <CheckCircle2 size={64} className="mx-auto mb-6 text-emerald-400 opacity-50" />
                       <p className="font-black text-2xl text-slate-600">Tüm talepleri yanıtladınız!</p>
                       <p className="font-medium text-lg mt-3">Şu an bekleyen yeni bir rezervasyon talebi bulunmuyor.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8 w-full">
                       {pendingRequests.map((req) => (
                         <div key={req.id} className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 lg:p-8 hover:shadow-xl transition-all relative overflow-hidden group w-full flex flex-col">
                           {/* Tür Belirteci */}
                           <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-2xl font-black text-xs uppercase tracking-widest text-white shadow-md ${req.type === 'iftar' ? 'bg-orange-500' : 'bg-blue-600'}`}>
                             {req.type === 'iftar' ? 'İFTAR' : 'MAÇ YAYINI'}
                           </div>

                           <div className="mt-4 mb-6">
                              <h3 className="text-2xl font-black text-slate-800 truncate">{req.name}</h3>
                              <p className="text-base font-bold text-slate-500 flex items-center gap-2 mt-2"><Phone size={16} className="text-slate-400"/> {req.phone}</p>
                           </div>

                           <div className="flex items-center gap-4 mb-6">
                              <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-700 shadow-sm"><CalendarDays size={16} className="text-slate-400"/> {req.date}</div>
                              <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-700 shadow-sm"><Users size={16} className="text-slate-400"/> {req.peopleCount} Kişi</div>
                           </div>

                           {req.notes && (
                              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl mb-6">
                                 <p className="text-sm font-bold text-amber-800 line-clamp-4">" {req.notes} "</p>
                              </div>
                           )}

                           <div className="flex flex-col gap-3 pt-6 border-t border-slate-200 mt-auto">
                              <button onClick={() => handleApproveRequest(req, true)} className="w-full bg-[#25D366] hover:bg-[#20b858] text-white py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-transform hover:scale-[1.02] shadow-md flex items-center justify-center gap-2">
                                 <MessageCircle size={20}/> Onayla & WA Gönder
                              </button>
                              <div className="flex gap-3">
                                 <button onClick={() => handleApproveRequest(req, false)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors shadow-sm flex items-center justify-center gap-2">
                                    <Check size={18}/> Sadece Onayla
                                 </button>
                                 <button onClick={() => handleRejectRequest(req.id)} className="flex-none bg-slate-200 hover:bg-red-500 hover:text-white text-slate-600 px-4 py-3 rounded-2xl transition-colors shadow-sm" title="Reddet / Sil">
                                    <Trash2 size={18}/>
                                 </button>
                              </div>
                           </div>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>
          )}


          {/* ----------------------------- */}
          {/* İFTAR EKRANI */}
          {/* ----------------------------- */}
          {activePage === 'iftar' && (
            <>
              {/* SOL KOLON - FORM */}
              <div className="lg:col-span-4 xl:col-span-3 space-y-6 print:hidden w-full">
                <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border overflow-hidden transition-colors w-full ${isEditing ? 'border-orange-400 shadow-orange-500/20' : 'border-slate-200/60'}`}>
                  <div className={`px-6 py-5 flex items-center justify-between ${isEditing ? 'bg-orange-50 border-b border-orange-100' : 'bg-gradient-to-r from-slate-50 to-white border-b border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isEditing ? 'bg-orange-100 text-orange-600' : 'bg-[#0B3B2C]/10 text-[#0B3B2C]'}`}><Edit2 size={20} /></div>
                      <h2 className={`text-lg lg:text-xl font-black tracking-wide ${isEditing ? 'text-orange-800' : 'text-[#0B3B2C]'}`}>{isEditing ? 'Rezervasyonu Düzenle' : 'İftar Rezervasyonu'}</h2>
                    </div>
                    {isEditing && <button onClick={cancelEdit} className="text-slate-400 p-1.5 hover:bg-white rounded-full shadow-sm border border-slate-200"><X size={18} /></button>}
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-5">
                    {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2 shadow-sm"><X size={16} /> {errorMsg}</div>}
                    
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">İsim</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 bg-slate-50/50 font-bold text-lg" placeholder="Müşteri İsmi" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Telefon</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 bg-slate-50/50 font-bold text-lg" placeholder="05XX..." />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-inner">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Masa Seçimi</label>
                        <button type="button" onClick={() => setShowTableMap(!showTableMap)} className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-orange-200 transition-colors">
                          <Map size={14} /> {showTableMap ? 'Krokiden Gizle' : 'Krokiden Seç'}
                        </button>
                      </div>
                      
                      {showTableMap && (
                        <div className="mb-5 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                          <div className="relative w-full aspect-[4/5] min-h-[300px] bg-[#e6e2d8] border-[10px] border-slate-700/80 rounded-xl overflow-hidden shadow-inner font-sans">
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
                            <Armchair className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" name="table" value={formData.table} onChange={handleChange} className="w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 bg-white font-black uppercase text-[#0B3B2C] shadow-sm text-lg" placeholder="Masa" />
                          </div>
                        </div>
                        <div className="flex-[1]">
                          <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="number" inputMode="numeric" name="peopleCount" min="1" value={formData.peopleCount} onChange={handleChange} className="w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 bg-white font-black text-[#0B3B2C] shadow-sm text-lg" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><CalendarDays size={14} className="text-orange-500"/> Rezervasyon Tarihi</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 bg-slate-50/50 font-bold text-[#0B3B2C] text-lg" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><MessageSquareText size={14}/> Özel Not (Opsiyonel)</label>
                        <input type="text" name="notes" value={formData.notes} onChange={handleChange} className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-amber-500/10 bg-amber-50/50 placeholder:text-amber-400 font-medium text-lg" placeholder="Örn: Mama sandalyesi..." />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><UtensilsCrossed size={18} className="text-orange-500" /> İftar Menüsü (Adet)</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col"><div className="flex items-center justify-between mb-3"><span className="text-3xl">🐔</span><input type="number" inputMode="numeric" name="menuTavuk" min="0" value={formData.menuTavuk} onChange={handleChange} className="w-16 px-2 py-1.5 text-center border-2 rounded-xl outline-none font-black bg-slate-50 text-lg focus:border-orange-400" /></div><span className="text-sm font-bold text-slate-600">Tavuk Menü</span></div>
                        <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col"><div className="flex items-center justify-between mb-3"><span className="text-3xl">🥩</span><input type="number" inputMode="numeric" name="menuHunkar" min="0" value={formData.menuHunkar} onChange={handleChange} className="w-16 px-2 py-1.5 text-center border-2 rounded-xl outline-none font-black bg-slate-50 text-lg focus:border-orange-400" /></div><span className="text-sm font-bold text-slate-600">Hünkar Beğendi</span></div>
                        <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col"><div className="flex items-center justify-between mb-3"><span className="text-3xl">🍢</span><input type="number" inputMode="numeric" name="menuKarisik" min="0" value={formData.menuKarisik} onChange={handleChange} className="w-16 px-2 py-1.5 text-center border-2 rounded-xl outline-none font-black bg-slate-50 text-lg focus:border-orange-400" /></div><span className="text-sm font-bold text-slate-600">Karışık Izgara</span></div>
                        <div className="bg-orange-50/50 border-2 border-orange-100 rounded-2xl p-4 shadow-sm flex flex-col"><div className="flex items-center justify-between mb-3"><span className="text-3xl">🧸</span><input type="number" inputMode="numeric" name="menuCocuk" min="0" value={formData.menuCocuk} onChange={handleChange} className="w-16 px-2 py-1.5 text-center border-2 border-orange-300 rounded-xl outline-none font-black text-orange-700 bg-white text-lg focus:border-orange-500" /></div><span className="text-sm font-bold text-orange-800">Çocuk Menüsü</span></div>
                      </div>
                    </div>
                    
                    <button type="submit" className={`w-full font-black tracking-widest uppercase py-5 mt-6 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 text-white hover:scale-[1.02] active:scale-95 text-lg ${isEditing ? 'bg-gradient-to-r from-[#0B3B2C] to-emerald-900' : 'bg-gradient-to-r from-orange-500 to-orange-600'}`}>
                      {isEditing ? <Check size={24} /> : <Plus size={24} />} {isEditing ? 'Değişiklikleri Kaydet' : 'Sisteme Ekle'}
                    </button>
                  </form>
                </div>
              </div>

              {/* SAĞ KOLON - İFTAR LİSTESİ */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-6 print:w-full print:block print:space-y-4 w-full">
                <div className={`bg-gradient-to-br from-[#0B3B2C] to-emerald-900 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col gap-6 relative overflow-hidden w-full ${printSingleId ? 'print:hidden' : 'print:bg-white print:from-white print:to-white print:border-b-2 print:border-black print:rounded-none print:shadow-none print:p-2 print:mb-4'}`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full border-b border-emerald-700/50 pb-6 z-10 print:border-black print:pb-2 gap-4">
                    <div className="flex items-center gap-5 text-[#FBE18D] w-full sm:w-auto">
                      <div className="bg-white/10 p-4 rounded-2xl print:hidden shrink-0"><ChefHat size={36} /></div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-widest text-orange-400 print:text-black">İftar Mutfak Özeti</p>
                        <div className="flex gap-4 items-baseline mt-1">
                          <p className="text-3xl sm:text-4xl font-black text-white print:text-black">Kişi: <span className="text-orange-400 print:text-black">{dailySummary.totalPeople}</span></p>
                          <span className="text-emerald-500 font-bold print:hidden">|</span>
                          <p className="text-xl sm:text-2xl font-bold text-slate-200 print:text-black">Menü: <span className="text-yellow-400 print:text-black">{dailySummary.totalMenu}</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-1/3 pt-2 print:hidden">
                       <div className="flex justify-between items-end mb-2 px-1">
                         <span className="text-xs font-bold text-emerald-200 uppercase">Kapasite: 300</span>
                         <span className={`text-xs font-black ${occupancyRate >= 90 ? 'text-red-400' : 'text-emerald-300'}`}>DOLULUK: %{occupancyRate}</span>
                       </div>
                       <div className="w-full bg-emerald-950/60 rounded-full h-3 shadow-inner overflow-hidden">
                         <div className={`h-3 rounded-full transition-all duration-1000 ${occupancyRate >= 90 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${occupancyRate}%` }}></div>
                       </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full z-10 print:grid-cols-2 print:gap-2">
                    <div className="bg-white/95 px-4 py-4 lg:py-5 rounded-2xl text-center shadow-lg border-b-4 border-slate-200 print:border print:border-black print:rounded-md print:py-2"><span className="block text-xs text-slate-500 font-bold mb-1">TAVUK</span><span className="font-black text-3xl sm:text-4xl text-[#0B3B2C] print:text-black">{dailySummary.totalTavuk}</span></div>
                    <div className="bg-white/95 px-4 py-4 lg:py-5 rounded-2xl text-center shadow-lg border-b-4 border-slate-200 print:border print:border-black print:rounded-md print:py-2"><span className="block text-xs text-slate-500 font-bold mb-1">HÜNKAR</span><span className="font-black text-3xl sm:text-4xl text-[#0B3B2C] print:text-black">{dailySummary.totalHunkar}</span></div>
                    <div className="bg-white/95 px-4 py-4 lg:py-5 rounded-2xl text-center shadow-lg border-b-4 border-slate-200 print:border print:border-black print:rounded-md print:py-2"><span className="block text-xs text-slate-500 font-bold mb-1">IZGARA</span><span className="font-black text-3xl sm:text-4xl text-[#0B3B2C] print:text-black">{dailySummary.totalKarisik}</span></div>
                    <div className="bg-orange-50 px-4 py-4 lg:py-5 rounded-2xl text-center shadow-lg border-b-4 border-orange-200 print:border-black print:bg-white print:rounded-md print:py-2"><span className="block text-xs text-orange-600 font-bold mb-1">ÇOCUK</span><span className="font-black text-3xl sm:text-4xl text-orange-600 print:text-black">{dailySummary.totalCocuk}</span></div>
                  </div>
                  
                  {/* YENİ: İftar İçin WhatsApp Toplu Mesaj Butonu */}
                  <div className="mt-4 pt-4 border-t border-emerald-700/50 flex justify-end print:hidden">
                      <button onClick={() => sendBulkWhatsApp(filteredReservations, 'iftar')} className="bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
                         <MessageCircle size={18} /> Tümüne Hatırlatma Gönder
                      </button>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/60 p-6 sm:p-8 lg:p-10 min-h-[500px] print:p-0 print:border-none print:shadow-none print:bg-white w-full">
                  <div className={`flex flex-col md:flex-row items-start md:items-center justify-between mb-10 pb-6 border-b border-slate-100 gap-5 ${printSingleId ? 'print:hidden' : 'print:border-b-2 print:border-black print:pb-2 print:mb-3'}`}>
                    <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-3 text-[#0B3B2C]"><Armchair className="text-orange-500 print:hidden" size={32} /> Aktif Masalar</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                      <div className="relative w-full sm:w-80 print:hidden">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input type="text" placeholder="İsim, masa veya telefon ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-5 py-3 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-base font-medium shadow-sm outline-none bg-slate-50 transition-all" />
                      </div>
                      <span className="bg-orange-100 text-orange-800 px-5 py-3 rounded-full text-sm font-black print:hidden shrink-0">{sortedReservations.length} Kayıt</span>
                      <button onClick={() => window.print()} className="w-full sm:w-auto bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors print:hidden shrink-0"><Printer size={18} /> YAZDIR</button>
                    </div>
                  </div>
                  
                  {sortedReservations.length === 0 ? (
                    <div className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-24 text-center text-slate-400 print:hidden w-full"><Search size={56} className="opacity-50 text-orange-400 mx-auto mb-5" /><p className="font-black text-2xl">Kayıt bulunamadı.</p></div>
                  ) : (
                    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 sm:gap-8 w-full ${printSingleId ? 'print:grid-cols-1 print:gap-0' : 'print:grid-cols-2 print:gap-4'}`}>
                      {sortedReservations.map((res) => {
                        const isArrived = res.isArrived || false;
                        const isPrinting = printSingleId === res.id;
                        return (
                        <div key={res.id} className={`p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 relative group print:border-black print:border-dashed print:p-4 print:mb-2 w-full ${printSingleId && !isPrinting ? 'hidden print:hidden' : ''} ${isEditing === res.id ? 'border-orange-400 bg-orange-50/30 scale-[1.02] shadow-xl' : isArrived ? 'border-emerald-500 bg-emerald-50/50 opacity-80' : 'border-slate-100 bg-white hover:border-orange-200 hover:shadow-lg'}`}>
                          {isPrinting && <div className="hidden print:block text-center font-bold text-[14px] uppercase mb-4 border-b border-black">Salaaş Cafe<br/>{selectedFilterDate}</div>}
                          
                          {deleteConfirmId === res.id && (
                             <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-6 border border-red-200 rounded-3xl print:hidden backdrop-blur-sm">
                               <p className="font-black text-slate-800 mb-5 text-xl">Silinsin mi?</p>
                               <div className="flex gap-4"><button onClick={() => executeDelete(res.id, 'reservations')} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl text-base font-bold shadow-md transition-colors">Evet, Sil</button><button onClick={() => setDeleteConfirmId(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-8 py-3 rounded-xl text-base font-bold transition-colors">İptal</button></div>
                             </div>
                          )}
                          
                          <div className="flex items-center gap-4 mb-4">
                             <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full flex items-center justify-center font-black text-base shadow-inner print:hidden ${isArrived ? 'bg-emerald-100 text-emerald-700' : 'bg-gradient-to-br from-orange-400 to-orange-500 text-white'}`}>{getInitials(res.name)}</div>
                             <h3 className={`text-2xl font-black truncate print:text-black ${isArrived ? 'line-through text-emerald-900' : 'text-[#0B3B2C]'}`}>{res.name || 'İsimsiz'}</h3>
                          </div>
                          
                          {res.phone && (
                            <div className="flex items-center gap-3 mt-2">
                              <p className="text-base font-semibold flex items-center gap-2 text-slate-500 print:text-black"><Phone size={16} className="print:hidden text-orange-400" /> {res.phone}</p>
                              <button onClick={() => sendWhatsApp(res, 'iftar')} className="print:hidden bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white p-2 rounded-full transition-colors"><MessageCircle size={18} /></button>
                            </div>
                          )}

                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black mt-4 print:p-0 print:text-black ${isArrived ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}><Armchair size={18} className="print:hidden" /> Masa: {res.table}</div>
                          
                          {res.notes && <div className="mt-4 text-sm sm:text-base font-bold text-amber-800 bg-amber-50 p-4 rounded-xl border border-amber-200 print:border-black print:bg-white">Not: {res.notes}</div>}

                          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200 print:hidden">
                            <button onClick={() => handleToggleArrived(res.id, isArrived, 'reservations')} className={`px-6 py-3 rounded-xl flex items-center gap-3 text-sm font-black transition-colors ${isArrived ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}><CheckCircle size={20} /> {isArrived ? "MASADA" : "GELMEDİ"}</button>
                            <div className="flex gap-3">
                              <button onClick={() => handlePrintSingle(res.id)} className="p-3 text-slate-500 bg-slate-50 hover:text-[#0B3B2C] hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"><Printer size={20} /></button>
                              <button onClick={() => handleEditClick(res)} className="p-3 text-slate-500 bg-slate-50 hover:text-orange-600 hover:bg-orange-100 rounded-xl border border-slate-200 transition-colors"><Edit2 size={20} /></button>
                              <button onClick={() => setDeleteConfirmId(res.id)} className="p-3 text-slate-500 bg-slate-50 hover:text-red-600 hover:bg-red-100 rounded-xl border border-slate-200 transition-colors"><Trash2 size={20} /></button>
                            </div>
                          </div>
                          
                          <div className="mt-5 p-4 sm:p-5 border-2 rounded-2xl print:border-t print:border-b-0 print:p-0 print:mt-2 bg-slate-50/80">
                             <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3 print:border-none print:mb-0"><p className="text-xs font-black uppercase text-slate-400 print:hidden">Sipariş Özeti</p><div className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm font-black print:bg-transparent print:text-black print:p-0 shadow-sm"><Users size={16} className="inline print:hidden mr-1.5" />{res.peopleCount} KİŞİ</div></div>
                             <ul className="text-sm sm:text-base font-bold text-slate-600 print:text-black space-y-2">
                                {res.menuTavuk > 0 && <li className="flex justify-between"><span>Tavuk Menü</span> <span className="bg-white px-3 py-1 rounded-lg border shadow-sm">x {res.menuTavuk}</span></li>}
                                {res.menuHunkar > 0 && <li className="flex justify-between"><span>Hünkar</span> <span className="bg-white px-3 py-1 rounded-lg border shadow-sm">x {res.menuHunkar}</span></li>}
                                {res.menuKarisik > 0 && <li className="flex justify-between"><span>Izgara</span> <span className="bg-white px-3 py-1 rounded-lg border shadow-sm">x {res.menuKarisik}</span></li>}
                                {res.menuCocuk > 0 && <li className="flex justify-between text-orange-600"><span>Çocuk</span> <span className="bg-orange-50 px-3 py-1 rounded-lg border border-orange-200 shadow-sm">x {res.menuCocuk}</span></li>}
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
              <div className="lg:col-span-4 xl:col-span-3 space-y-6 print:hidden w-full">
                <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border overflow-hidden transition-colors w-full ${isMatchEditing ? 'border-blue-400 shadow-blue-500/20' : 'border-slate-200/60'}`}>
                  <div className={`px-6 py-5 flex items-center justify-between ${isMatchEditing ? 'bg-blue-50 border-b border-blue-100' : 'bg-gradient-to-r from-slate-50 to-white border-b border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isMatchEditing ? 'bg-blue-100 text-blue-600' : 'bg-[#0a192f]/10 text-[#0a192f]'}`}><MonitorPlay size={20} /></div>
                      <h2 className={`text-lg lg:text-xl font-black tracking-wide ${isMatchEditing ? 'text-blue-800' : 'text-[#0a192f]'}`}>{isMatchEditing ? 'Rezervasyonu Düzenle' : 'Maç Rezervasyonu'}</h2>
                    </div>
                    {isMatchEditing && <button onClick={() => cancelMatchEdit()} className="text-slate-400 p-1.5 hover:bg-white rounded-full shadow-sm border border-slate-200"><X size={18} /></button>}
                  </div>
                  
                  <form onSubmit={handleMatchSubmit} className="p-6 lg:p-8 space-y-6">
                    {matchErrorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2 shadow-sm"><X size={16} /> {matchErrorMsg}</div>}
                    
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">İsim</label>
                        <input type="text" name="name" value={matchFormData.name} onChange={handleMatchChange} className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-slate-50/50 font-bold text-lg" placeholder="Müşteri İsmi" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Telefon</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="tel" name="phone" value={matchFormData.phone} onChange={handleMatchChange} className="w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-slate-50/50 font-bold text-lg" placeholder="05XX..." />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-[2]">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Masa (Opsiyonel)</label>
                        <div className="relative">
                          <Armchair className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="text" name="table" value={matchFormData.table} onChange={handleMatchChange} className="w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/50 font-black uppercase text-[#0a192f] text-lg" placeholder="Masa Kodu" />
                        </div>
                      </div>
                      <div className="flex-[1]">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kişi</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="number" inputMode="numeric" name="peopleCount" min="1" value={matchFormData.peopleCount} onChange={handleMatchChange} className="w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/50 font-black text-[#0a192f] text-lg" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><CalendarDays size={14} className="text-blue-500"/> Maç Tarihi</label>
                      <input type="date" name="date" value={matchFormData.date} onChange={handleMatchChange} className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/50 font-bold text-[#0a192f] text-lg" required />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><MessageSquareText size={14}/> Özel Not (Opsiyonel)</label>
                      <textarea name="notes" value={matchFormData.notes} onChange={handleMatchChange} rows="2" className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/50 font-medium text-lg resize-none" placeholder="Örn: Forma ile gelecek..."></textarea>
                    </div>
                    
                    <button type="submit" className={`w-full font-black tracking-widest uppercase py-5 mt-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 text-white hover:scale-[1.02] active:scale-95 text-lg ${isMatchEditing ? 'bg-gradient-to-r from-[#0a192f] to-blue-900' : 'bg-gradient-to-r from-blue-500 to-cyan-600'}`}>
                      {isMatchEditing ? <Check size={24} /> : <Plus size={24} />} {isMatchEditing ? 'Güncelle' : 'Maç Listesine Ekle'}
                    </button>
                  </form>
                </div>
              </div>

              {/* MAÇ SAĞ KOLON - LİSTE */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-6 print:w-full print:block print:space-y-4 w-full">
                
                <div className={`bg-gradient-to-br from-[#0a192f] to-blue-900 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col justify-between gap-4 relative overflow-hidden w-full ${printSingleId ? 'print:hidden' : 'print:bg-white print:from-white print:to-white print:border-b-2 print:border-black print:rounded-none print:shadow-none print:p-2 print:mb-4'}`}>
                  <div className="absolute right-0 top-0 opacity-5 pointer-events-none print:hidden"><MonitorPlay size={300} /></div>
                  <div className="flex items-center gap-5 text-cyan-200 z-10 print:text-black">
                    <div className="bg-white/10 p-4 rounded-2xl print:hidden"><MonitorPlay size={36} /></div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest text-cyan-400 print:text-black">Maç Günü Katılım Özeti</p>
                      <p className="text-4xl sm:text-5xl font-black text-white mt-1 print:text-black">Toplam: <span className="text-cyan-400 print:text-black">{totalMatchPeople}</span> Seyirci</p>
                    </div>
                  </div>
                  
                  {/* YENİ: Maç İçin WhatsApp Toplu Mesaj Butonu */}
                  <div className="mt-2 pt-4 border-t border-blue-800/50 flex justify-end print:hidden">
                      <button onClick={() => sendBulkWhatsApp(filteredMatchReservations, 'mac')} className="bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
                         <MessageCircle size={18} /> Tümüne Hatırlatma Gönder
                      </button>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/60 p-6 sm:p-8 lg:p-10 min-h-[500px] print:p-0 print:border-none print:shadow-none print:bg-white w-full">
                  <div className={`flex flex-col md:flex-row items-start md:items-center justify-between mb-10 pb-6 border-b border-slate-100 gap-5 ${printSingleId ? 'print:hidden' : 'print:border-b-2 print:border-black print:pb-2 print:mb-3'}`}>
                    <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-3 text-[#0a192f]"><MonitorPlay className="text-blue-500 print:hidden" size={32} /> Maç Rezervasyonları</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                      <div className="relative w-full sm:w-80 print:hidden">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input type="text" placeholder="İsim, masa veya telefon ara..." value={matchSearchTerm} onChange={(e) => setMatchSearchTerm(e.target.value)} className="w-full pl-12 pr-5 py-3 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-base font-medium shadow-sm outline-none bg-slate-50 transition-all" />
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-5 py-3 rounded-full text-sm font-black print:hidden shrink-0">{sortedMatchReservations.length} Kayıt</span>
                      <button onClick={() => window.print()} className="w-full sm:w-auto bg-[#0a192f] text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors print:hidden shrink-0"><Printer size={18} /> YAZDIR</button>
                    </div>
                  </div>
                  
                  {sortedMatchReservations.length === 0 ? (
                    <div className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-24 text-center text-slate-400 print:hidden w-full"><Search size={56} className="opacity-50 text-blue-400 mx-auto mb-5" /><p className="font-black text-2xl">Bu maça ait kayıt bulunamadı.</p></div>
                  ) : (
                    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 sm:gap-8 w-full ${printSingleId ? 'print:grid-cols-1 print:gap-0' : 'print:grid-cols-2 print:gap-4'}`}>
                      {sortedMatchReservations.map((res) => {
                        const isArrived = res.isArrived || false;
                        const isPrinting = printSingleId === res.id;
                        return (
                        <div key={res.id} className={`p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 relative group print:border-black print:border-dashed print:p-4 print:mb-2 w-full ${printSingleId && !isPrinting ? 'hidden print:hidden' : ''} ${isMatchEditing === res.id ? 'border-blue-400 bg-blue-50/30 scale-[1.02] shadow-xl' : isArrived ? 'border-emerald-500 bg-emerald-50/50 opacity-80' : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg'}`}>
                          {isPrinting && <div className="hidden print:block text-center font-bold text-[14px] uppercase mb-4 border-b border-black">Salaaş Cafe MAÇ<br/>{selectedMatchDate}</div>}
                          
                          {matchDeleteConfirmId === res.id && (
                             <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-6 border border-red-200 rounded-3xl print:hidden backdrop-blur-sm">
                               <p className="font-black text-slate-800 mb-5 text-xl">Silinsin mi?</p>
                               <div className="flex gap-4"><button onClick={() => executeDelete(res.id, 'matchReservations')} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl text-base font-bold shadow-md transition-colors">Evet, Sil</button><button onClick={() => setMatchDeleteConfirmId(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-8 py-3 rounded-xl text-base font-bold transition-colors">İptal</button></div>
                             </div>
                          )}
                          
                          <div className="flex items-center gap-4 mb-4">
                             <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full flex items-center justify-center font-black text-base shadow-inner print:hidden ${isArrived ? 'bg-emerald-100 text-emerald-700' : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'}`}>{getInitials(res.name)}</div>
                             <h3 className={`text-2xl font-black truncate print:text-black ${isArrived ? 'line-through text-emerald-900' : 'text-[#0a192f]'}`}>{res.name || 'İsimsiz'}</h3>
                          </div>
                          
                          {res.phone && (
                            <div className="flex items-center gap-3 mt-2">
                              <p className="text-base font-semibold flex items-center gap-2 text-slate-500 print:text-black"><Phone size={16} className="print:hidden text-blue-400" /> {res.phone}</p>
                              <button onClick={() => sendWhatsApp(res, 'mac')} className="print:hidden bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white p-2 rounded-full transition-colors"><MessageCircle size={18} /></button>
                            </div>
                          )}

                          <div className="flex items-center gap-3 mt-4">
                             <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black print:p-0 print:text-black ${isArrived ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-800'}`}><Users size={18} className="print:hidden" /> {res.peopleCount} Kişi</div>
                             {res.table && <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black bg-slate-100 text-slate-700 print:p-0"><Armchair size={18} className="print:hidden" /> {res.table}</div>}
                          </div>
                          
                          {res.notes && <div className="mt-4 text-sm sm:text-base font-bold text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 print:border-black print:bg-white">Not: {res.notes}</div>}

                          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200 print:hidden">
                            <button onClick={() => handleToggleArrived(res.id, isArrived, 'matchReservations')} className={`px-6 py-3 rounded-xl flex items-center gap-3 text-sm font-black transition-colors ${isArrived ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}><CheckCircle size={20} /> {isArrived ? "MASADA" : "GELMEDİ"}</button>
                            <div className="flex gap-3">
                              <button onClick={() => handlePrintSingle(res.id)} className="p-3 text-slate-500 bg-slate-50 hover:text-[#0a192f] hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"><Printer size={20} /></button>
                              <button onClick={() => handleMatchEditClick(res)} className="p-3 text-slate-500 bg-slate-50 hover:text-blue-600 hover:bg-blue-100 rounded-xl border border-slate-200 transition-colors"><Edit2 size={20} /></button>
                              <button onClick={() => setMatchDeleteConfirmId(res.id)} className="p-3 text-slate-500 bg-slate-50 hover:text-red-600 hover:bg-red-100 rounded-xl border border-slate-200 transition-colors"><Trash2 size={20} /></button>
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

          {/* ----------------------------- */}
          {/* GEÇMİŞ (HISTORY) EKRANI */}
          {/* ----------------------------- */}
          {activePage === 'gecmis' && (
            <div className="lg:col-span-12 space-y-6 w-full">
               
               {/* Geçmiş Özet Kartı */}
               <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden w-full text-white">
                  <div className="absolute right-0 top-0 opacity-10 pointer-events-none"><History size={250} /></div>
                  <div className="flex items-center gap-5 z-10 w-full sm:w-auto">
                    <div className="bg-white/10 p-4 rounded-2xl shrink-0"><History size={36} className="text-purple-300" /></div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-black">Sistem Geçmişi & İstatistikler</h2>
                      <p className="text-sm font-medium text-purple-200 mt-1">Geçmişe dönük tüm rezervasyon ve katılım verileri</p>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full sm:w-auto z-10">
                     <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center flex-1">
                        <span className="block text-xs font-bold text-purple-200 uppercase tracking-wider mb-1">Toplam Rezerve</span>
                        <span className="text-3xl font-black">{historyStats.totalPeople}</span>
                     </div>
                     <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center flex-1">
                        <span className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">Gelen Misafir</span>
                        <span className="text-3xl font-black text-emerald-400">{historyStats.totalArrived} <span className="text-sm text-purple-200 font-medium">(%{historyStats.arrivalRate})</span></span>
                     </div>
                  </div>
               </div>

               {/* Geçmiş Filtreleri ve Liste */}
               <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-100 w-full min-h-[500px]">
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 pb-6 border-b border-slate-100 gap-5">
                     <h3 className="text-xl sm:text-2xl font-black text-slate-800">Geçmiş Kayıtlar</h3>
                     
                     <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <select value={historyTypeFilter} onChange={(e) => setHistoryTypeFilter(e.target.value)} className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none focus:border-purple-500">
                           <option value="all">Tümü (İftar + Maç)</option>
                           <option value="iftar">Sadece İftar</option>
                           <option value="mac">Sadece Maç</option>
                        </select>
                        <input type="date" value={historyDateFilter} onChange={(e) => setHistoryDateFilter(e.target.value)} className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none focus:border-purple-500 cursor-pointer" />
                        {historyDateFilter && (
                           <button onClick={() => setHistoryDateFilter('')} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-3 rounded-xl font-bold transition-colors">Tarihi Sıfırla</button>
                        )}
                     </div>
                  </div>

                  {historyStats.list.length === 0 ? (
                     <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-24 text-center text-slate-400 w-full">
                       <History size={56} className="opacity-50 text-purple-400 mx-auto mb-5" />
                       <p className="font-black text-2xl text-slate-600">Kayıt Bulunamadı</p>
                       <p className="font-medium text-lg mt-3">Seçilen kriterlere uygun geçmiş veri bulunmuyor.</p>
                     </div>
                  ) : (
                     <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="border-b-2 border-slate-200">
                                 <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-slate-400">Tarih</th>
                                 <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-slate-400">Tür</th>
                                 <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-slate-400">Müşteri</th>
                                 <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-slate-400">Telefon</th>
                                 <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-slate-400 text-center">Kişi</th>
                                 <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-slate-400 text-center">Durum</th>
                              </tr>
                           </thead>
                           <tbody>
                              {historyStats.list.map((res, idx) => (
                                 <tr key={res.id || idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-4 font-bold text-slate-700 whitespace-nowrap">{res.date}</td>
                                    <td className="py-4 px-4">
                                       <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${res.eventType === 'İftar' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                          {res.eventType}
                                       </span>
                                    </td>
                                    <td className="py-4 px-4 font-bold text-slate-800">{res.name}</td>
                                    <td className="py-4 px-4 text-slate-500 font-medium">{res.phone}</td>
                                    <td className="py-4 px-4 text-center font-black text-slate-700">{res.peopleCount}</td>
                                    <td className="py-4 px-4 text-center">
                                       {res.isArrived ? (
                                          <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-xs font-bold"><CheckCircle2 size={14}/> Geldi</span>
                                       ) : (
                                          <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold"><X size={14}/> Gelmedi</span>
                                       )}
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  )}
               </div>
            </div>
          )}

        </main>
      )}
    </div>
  );
}
