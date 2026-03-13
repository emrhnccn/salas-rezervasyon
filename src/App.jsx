import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, Users, UtensilsCrossed, Armchair, 
  Plus, Trash2, MoonStar, ChefHat, Search, Edit2, X, Check, Loader2, Clock, CheckCircle, Phone, Printer, MessageSquareText, MessageCircle, Map, Flame, BellRing, MonitorPlay, Lock, ArrowRight, MapPin, Instagram, Wind, Coffee, ChevronRight, Star, Send, Bell, ThumbsUp, ThumbsDown, AlertCircle
} from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD6RgXBBISFM21oJKRYRhwwCnR38NBbl9k",
  authDomain: "salaas-cafe-9c6dc.firebaseapp.com",
  projectId: "salaas-cafe-9c6dc",
  storageBucket: "salaas-cafe-9c6dc.firebasestorage.app",
  messagingSenderId: "1074809461661",
  appId: "1:1074809461661:web:5fb47660e84968e3ffed74"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('iftar');

  const [visitorDate, setVisitorDate] = useState(getToday());
  const [showFixtureModal, setShowFixtureModal] = useState(false);
  const [showDessertsModal, setShowDessertsModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // ── MÜŞTERİ REZERVASYON TALEP MODAL STATE ──
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState('iftar'); // 'iftar' | 'mac'
  const [requestStep, setRequestStep] = useState('form'); // 'form' | 'success'
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const initialRequestForm = { name: '', phone: '', peopleCount: 1, date: getToday(), notes: '' };
  const [requestForm, setRequestForm] = useState(initialRequestForm);
  const [requestError, setRequestError] = useState('');

  // ── ADMİN: BEKLEYEN TALEPLER STATE ──
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showPendingPanel, setShowPendingPanel] = useState(false);

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

  const [matchReservations, setMatchReservations] = useState([]);
  const [selectedMatchDate, setSelectedMatchDate] = useState(getToday());
  const [isMatchEditing, setIsMatchEditing] = useState(null);
  const [matchSearchTerm, setMatchSearchTerm] = useState('');
  const initialMatchFormState = { name: '', phone: '', notes: '', peopleCount: 1, table: '', date: getToday() };
  const [matchFormData, setMatchFormData] = useState(initialMatchFormState);
  const [matchErrorMsg, setMatchErrorMsg] = useState('');
  const [matchDeleteConfirmId, setMatchDeleteConfirmId] = useState(null);

  const [iftarTime, setIftarTime] = useState(null);
  const [countdown, setCountdown] = useState("Hesaplanıyor...");
  const [isPrepTime, setIsPrepTime] = useState(false);
  const [isIftarTime, setIsIftarTime] = useState(false);

  useEffect(() => {
    document.title = "Salaaş Cafe Restaurant";
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Gebze&country=Turkey&method=13')
      .then(res => res.json())
      .then(data => {
        if (data?.data?.timings?.Maghrib) setIftarTime(data.data.timings.Maghrib);
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
      if (diff < 0) { setCountdown("İFTAR VAKTİ!"); setIsIftarTime(true); setIsPrepTime(false); clearInterval(interval); return; }
      if (diff <= 600000 && diff > 0) setIsPrepTime(true); else setIsPrepTime(false);
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
    signInAnonymously(auth).catch((error) => console.error("Giriş hatası:", error));
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const iftarUnsub = onSnapshot(collection(db, 'reservations'), (snapshot) => {
      setReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    const matchUnsub = onSnapshot(collection(db, 'matchReservations'), (snapshot) => {
      setMatchReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    // Bekleyen talepleri dinle
    const pendingUnsub = onSnapshot(collection(db, 'reservationRequests'), (snapshot) => {
      setPendingRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => { iftarUnsub(); matchUnsub(); pendingUnsub(); };
  }, [user]);

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

  // ── MÜŞTERİ REZERVASYON TALEBİ GÖNDER ──
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestError('');
    if (!requestForm.name.trim()) { setRequestError('Lütfen adınızı girin.'); return; }
    if (!requestForm.phone.trim()) { setRequestError('Lütfen telefon numaranızı girin.'); return; }
    if (!user) { setRequestError('Bağlantı hatası, lütfen sayfayı yenileyin.'); return; }

    setRequestSubmitting(true);
    try {
      await addDoc(collection(db, 'reservationRequests'), {
        ...requestForm,
        peopleCount: parseInt(requestForm.peopleCount) || 1,
        type: requestType, // 'iftar' veya 'mac'
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      setRequestStep('success');
    } catch (err) {
      setRequestError('Gönderim sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setRequestSubmitting(false);
    }
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
    setTimeout(() => {
      setRequestStep('form');
      setRequestForm(initialRequestForm);
      setRequestError('');
    }, 300);
  };

  // ── ADMİN: TALEBİ ONAYLA (reservations veya matchReservations'a taşı) ──
  const handleApproveRequest = async (req) => {
    if (!user) return;
    try {
      const targetCollection = req.type === 'iftar' ? 'reservations' : 'matchReservations';
      const newDoc = {
        name: req.name,
        phone: req.phone,
        peopleCount: req.peopleCount,
        date: req.date,
        notes: req.notes || '',
        table: '',
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
        isArrived: false,
        approvedFrom: 'request',
      };
      if (req.type === 'iftar') {
        newDoc.menuTavuk = 0;
        newDoc.menuHunkar = 0;
        newDoc.menuKarisik = 0;
        newDoc.menuCocuk = 0;
      }
      await addDoc(collection(db, targetCollection), newDoc);
      await deleteDoc(doc(db, 'reservationRequests', req.id));
    } catch (err) {
      console.error('Onaylama hatası:', err);
    }
  };

  // ── ADMİN: TALEBİ REDDET ──
  const handleRejectRequest = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'reservationRequests', id));
    } catch (err) {
      console.error('Red hatası:', err);
    }
  };

  const handleTableSelect = (tableId) => {
    setFormData(prev => ({ ...prev, table: tableId }));
  };

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
      if (collectionName === 'reservations') { setDeleteConfirmId(null); if (isEditing === id) cancelEdit(); }
      else { setMatchDeleteConfirmId(null); if (isMatchEditing === id) cancelMatchEdit(); }
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

  // Onay WhatsApp mesajı
  const sendApprovalWhatsApp = (req) => {
    if (!req.phone) return;
    let cleanPhone = req.phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '9' + cleanPhone;
    else if (cleanPhone.length === 10) cleanPhone = '90' + cleanPhone;
    const eventName = req.type === 'iftar' ? 'iftar' : 'maç yayını';
    const message = `Sayın ${req.name},\nSalaaş Cafe'ye ${req.date} tarihli ${req.peopleCount} kişilik ${eventName} rezervasyon talebiniz onaylanmıştır. Sizi aramızda görmekten mutluluk duyarız. 🌙`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return "SC";
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return "SC";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

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

  const nextMatch = MATCH_FIXTURE.find(m => m.date >= getToday()) || MATCH_FIXTURE[MATCH_FIXTURE.length - 1];

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

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Bekleyen talepler sayısı (sadece pending olanlar)
  const pendingCount = pendingRequests.filter(r => r.status === 'pending').length;

  // =======================================================================
  // 1. MÜŞTERİ / ZİYARETÇİ EKRANI
  // =======================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-orange-50/40 to-emerald-50/60 font-sans text-slate-800 relative flex flex-col scroll-smooth w-full overflow-x-hidden">

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes shine { 100% { left: 125%; } }
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
          .delay-100 { animation-delay: 100ms; }
          .delay-200 { animation-delay: 200ms; }
          .delay-300 { animation-delay: 300ms; }
          .delay-400 { animation-delay: 400ms; }
          .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
          .shine-effect { position: relative; overflow: hidden; }
          .shine-effect::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%); transform: skewX(-20deg); animation: shine 3s infinite; }
        `}} />

        {/* NAVBAR */}
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
          <nav className={`w-full max-w-7xl pointer-events-auto transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200' : 'bg-transparent py-5 sm:py-6'}`}>
            <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <div className={`transition-all duration-500 cursor-pointer flex items-center justify-center bg-transparent shrink-0 ${isScrolled ? 'h-10 sm:h-12' : 'h-12 sm:h-16'}`} onClick={() => window.scrollTo(0,0)}>
                <img src="/salaaslogobg.png" alt="Salaaş Logo" className="h-full w-auto object-contain bg-transparent" />
              </div>
              <div className={`hidden lg:flex flex-1 justify-center items-center gap-6 lg:gap-10 font-bold text-sm lg:text-base transition-colors duration-500 ${isScrolled ? 'text-slate-700' : 'text-white drop-shadow-md'}`}>
                <button onClick={() => handleScroll('hakkimizda')} className="hover:text-orange-500 transition-colors whitespace-nowrap">Biz Kimiz?</button>
                <button onClick={() => handleScroll('lezzetler')} className="hover:text-orange-500 transition-colors whitespace-nowrap">Lezzetler</button>
                <button onClick={() => handleScroll('rezervasyon')} className="hover:text-orange-500 transition-colors whitespace-nowrap">Canlı Yoğunluk</button>
                <button onClick={() => handleScroll('iletisim')} className="hover:text-orange-500 transition-colors whitespace-nowrap">İletişim</button>
              </div>
              <div className="shrink-0 flex justify-end gap-3">
                {/* YENİ: REZERVASYON TALEP BUTONU (navbar) */}
                <button
                  onClick={() => { setShowRequestModal(true); handleScroll('rezervasyon'); }}
                  className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-4 py-2.5 rounded-full text-xs font-black tracking-widest uppercase hover:bg-white/20 transition-all shadow-lg whitespace-nowrap"
                >
                  <CalendarDays size={14} /> Rezervasyon
                </button>
                <a href="https://m.1menu.com.tr/salaascafe/" target="_blank" rel="noreferrer" className="shine-effect bg-orange-500 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-black tracking-widest uppercase hover:bg-orange-600 hover:scale-105 transition-all shadow-lg whitespace-nowrap">
                  Menüyü Gör
                </a>
              </div>
            </div>
          </nav>
        </div>

        {/* HERO */}
        <header className="relative w-full min-h-[500px] h-[75vh] lg:h-[85vh] max-h-[900px] bg-slate-900 flex items-center justify-center overflow-hidden pt-16">
          <div className="absolute inset-0 z-0">
            <img src="/salaasarkaplan.jpeg" alt="Salaaş Cafe Arka Plan" className="w-full h-full object-cover opacity-50 scale-105 object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          </div>
          <div className="relative z-10 text-center px-4 sm:px-6 w-full max-w-5xl mx-auto flex flex-col items-center justify-center h-full pb-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-wide text-white font-serif mb-6 drop-shadow-2xl animate-fade-in-up delay-100 leading-tight">
              Lezzet ve <span className="text-orange-400">Muhabbetin</span> Adresi
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-200 max-w-3xl mx-auto font-medium mb-10 drop-shadow-lg animate-fade-in-up delay-200">
              Şehrin gürültüsünden uzak, samimi atmosferimizde unutulmaz tatlar ve anılar biriktirin.
            </p>
            {/* YENİ: HERO CTA BUTONLARI */}
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up delay-300">
              <button
                onClick={() => setShowRequestModal(true)}
                className="shine-effect bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-2xl hover:scale-105 flex items-center gap-2"
              >
                <CalendarDays size={18} /> Rezervasyon Talebi
              </button>
              <button
                onClick={() => handleScroll('lezzetler')}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all shadow-xl flex items-center gap-2"
              >
                <UtensilsCrossed size={18} /> Menüyü Keşfet
              </button>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce cursor-pointer z-20" onClick={() => handleScroll('hakkimizda')}>
            <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold block mb-2 opacity-70 text-center">Keşfet</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1 mx-auto"><div className="w-1 h-2 bg-white/60 rounded-full"></div></div>
          </div>
        </header>

        <main className="w-full relative z-10 flex-1 flex flex-col">

          {/* HAKKIMIZDA */}
          <section id="hakkimizda" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
            <div className="animate-float inline-block mb-4"><MoonStar size={48} className="text-orange-400 opacity-80" /></div>
            <h2 className="text-sm font-black tracking-[0.3em] text-orange-500 uppercase mb-4">Hikayemiz</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0B3B2C] mb-8">Sıcak, Samimi ve Lezzetli</h3>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-light max-w-4xl mx-auto">
              Salaaş Cafe Restaurant olarak, misafirlerimize kendilerini evlerinde hissedecekleri sıcak bir ortam sunuyoruz.
              Özenle seçilmiş malzemelerle hazırladığımız zengin menümüz, imza ızgaralarımız, serpme kahvaltımız ve
              keyifli nargile köşemizle günün her saatinde kaliteli bir deneyim yaşatmayı hedefliyoruz.
            </p>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto mt-12 rounded-full"></div>
          </section>

          {/* LEZZETLER */}
          <section id="lezzetler" className="w-full py-20 md:py-28 border-y border-slate-200/50 bg-white/40 backdrop-blur-md">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
                <div>
                  <h2 className="text-sm font-black tracking-[0.3em] text-orange-500 uppercase mb-2">Vitrinimiz</h2>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0B3B2C]">Bunu Denediniz mi?</h3>
                </div>
                <a href="https://m.1menu.com.tr/salaascafe/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-600 transition-all uppercase tracking-widest group">
                  Tüm Menüyü Gör <div className="bg-orange-100 p-2 rounded-full group-hover:bg-orange-200 transition-colors"><ChevronRight size={16} className="text-orange-600"/></div>
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                <div className="lg:col-span-2 sm:col-span-2 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 transition-all duration-500 relative group h-72 sm:h-80 md:h-96 cursor-pointer border border-slate-100">
                  <img src={encodeURI("/salaaskoykahvaltisi.jpg")} alt="Salaaş Köy Kahvaltısı" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent flex flex-col justify-end p-6 md:p-8">
                    <span className="bg-orange-500 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full w-max mb-3 md:mb-4 flex items-center gap-1.5 shadow-lg"><Star size={14}/> İmza Lezzet</span>
                    <h4 className="text-white font-serif font-black text-3xl sm:text-4xl drop-shadow-md mb-2">Salaaş Köy Kahvaltısı</h4>
                    <p className="text-slate-200 text-sm sm:text-base font-medium max-w-md opacity-90 hidden sm:block">Güne harika başlamak için yöresel peynirler, sıcaklar ve taze demlenmiş çay eşliğinde devasa bir sofra.</p>
                  </div>
                </div>
                <div className="rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative group h-72 sm:h-80 md:h-96 cursor-pointer border border-slate-100">
                  <img src={encodeURI("/mantarlıfırınburger.jpg")} alt="Mantarlı Fırın Burger" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col justify-end p-6">
                    <h4 className="text-white font-serif font-black text-xl md:text-2xl drop-shadow-md">Mantarlı Fırın Burger</h4>
                    <p className="text-slate-300 text-xs sm:text-sm mt-1 font-medium">Özel soslu nefis deneyim.</p>
                  </div>
                </div>
                <div className="rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative group h-72 sm:h-80 md:h-96 cursor-pointer border border-slate-100">
                  <img src={encodeURI("/hunkarkofte.jpg")} alt="Hünkar Köfte" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col justify-end p-6">
                    <h4 className="text-white font-serif font-black text-xl md:text-2xl drop-shadow-md">Hünkar Köfte</h4>
                    <p className="text-slate-300 text-xs sm:text-sm mt-1 font-medium">Geleneksel lezzet şöleni.</p>
                  </div>
                </div>
                <div className="rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative group h-72 sm:h-80 md:h-96 cursor-pointer border border-slate-100">
                  <img src={encodeURI("/cafedeparis.jpg")} alt="Chicken Cafe de Paris" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col justify-end p-6">
                    <h4 className="text-white font-serif font-black text-xl md:text-2xl drop-shadow-md leading-tight">Cafe de Paris<br/>Soslu Tavuk</h4>
                  </div>
                </div>
                <div className="rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 transition-all duration-500 relative group h-72 sm:h-80 md:h-96 cursor-pointer border border-slate-100">
                  <img src={encodeURI("/salaasnargilefoto.jpg")} alt="Nargile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-[#0a192f]/60 group-hover:bg-[#0a192f]/40 transition-colors flex flex-col justify-center items-center text-center p-6 backdrop-blur-[2px]">
                    <Wind size={48} className="text-cyan-400 mb-4 drop-shadow-lg" />
                    <h4 className="text-white font-serif font-black text-2xl md:text-3xl drop-shadow-md">Nargile Keyfi</h4>
                  </div>
                </div>
                <div onClick={() => setShowDessertsModal(true)} className="lg:col-span-2 sm:col-span-2 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2 transition-all duration-500 relative group h-72 sm:h-80 md:h-96 cursor-pointer border-2 border-pink-200">
                  <img src={encodeURI("/dubai cikolatalı.jpg")} alt="Özel Tatlılarımız" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent flex flex-col justify-end p-6 md:p-8">
                    <span className="bg-pink-500 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full w-max mb-3 md:mb-4 flex items-center gap-1.5 shadow-lg group-hover:bg-pink-600 group-hover:scale-105 transition-all">Tüm Tatlılarımız <ChevronRight size={14}/></span>
                    <h4 className="text-white font-serif font-black text-3xl sm:text-4xl drop-shadow-md mb-2">Nefis Tatlı Çeşitleri</h4>
                    <p className="text-slate-200 text-sm sm:text-base font-medium max-w-md opacity-90 hidden sm:block">Dubai Çikolatalı, Lotus Dome, Profiterol ve daha fazlasını hemen keşfedin.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ORGANİZASYON */}
          <section className="w-full py-24 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #FBE18D 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute -right-20 -top-20 opacity-10 text-orange-500 hidden md:block"><MoonStar size={400}/></div>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <h2 className="text-sm font-black tracking-[0.3em] text-orange-400 uppercase mb-4">Davet & Organizasyon</h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black mb-8 drop-shadow-lg">Özel Günleriniz İçin Yanınızdayız</h3>
              <p className="text-base sm:text-lg md:text-xl text-slate-300 font-light mb-12 max-w-3xl mx-auto leading-relaxed">
                Doğum günü partileri, şirket yemekleri, toplu iftarlar ve tüm özel kutlamalarınız için 150 kişilik kapasitemiz ve size özel menülerimizle hizmetinizdeyiz.
              </p>
              <a href="tel:+902626421413" className="shine-effect inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 sm:px-10 sm:py-5 rounded-full font-black uppercase tracking-widest transition-transform hover:scale-105 shadow-2xl hover:shadow-orange-500/30 text-sm sm:text-base">
                <Phone size={20}/> Rezervasyon Hattı
              </a>
            </div>
          </section>

          {/* CANLI YOĞUNLUK */}
          <section id="rezervasyon" className="w-full py-24 bg-slate-50">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-sm font-black tracking-[0.3em] text-orange-500 uppercase mb-3">Şeffaf Hizmet</h2>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0B3B2C]">Canlı Yoğunluk Durumu</h3>
                <p className="text-slate-500 mt-4 text-base sm:text-lg font-medium max-w-2xl mx-auto">Gelmeden önce seçtiğiniz tarihteki doluluk durumumuzu ve menü hazırlıklarımızı inceleyebilirsiniz.</p>
              </div>

              {/* YENİ: REZERVASYON TALEP KARTI */}
              <div className="max-w-5xl mx-auto mb-8">
                <div className="bg-gradient-to-r from-[#0B3B2C] to-emerald-800 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
                  <div className="text-center sm:text-left">
                    <p className="text-orange-300 text-xs font-black uppercase tracking-widest mb-2">Online Rezervasyon</p>
                    <h4 className="text-white font-serif font-black text-2xl sm:text-3xl mb-2">Masanızı Ayırtın</h4>
                    <p className="text-emerald-200 text-sm font-medium max-w-md">İftar veya maç yayını için rezervasyon talebinizi gönderin, ekibimiz en kısa sürede onaylasın.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <button
                      onClick={() => { setRequestType('iftar'); setShowRequestModal(true); }}
                      className="shine-effect bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 shadow-xl flex items-center gap-2 whitespace-nowrap"
                    >
                      <MoonStar size={18} /> İftar Talebi
                    </button>
                    <button
                      onClick={() => { setRequestType('mac'); setShowRequestModal(true); }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 shadow-xl flex items-center gap-2 whitespace-nowrap"
                    >
                      <MonitorPlay size={18} /> Maç Talebi
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-10 text-orange-500"><Loader2 className="animate-spin" size={48} /></div>
              ) : (
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-2xl border border-slate-100 hover:shadow-slate-200/50 transition-shadow duration-500 max-w-5xl mx-auto">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    <span className="font-black text-slate-600 uppercase tracking-widest text-sm flex items-center gap-2">
                      <CalendarDays className="text-orange-500" size={24} /> Tarih Seçiniz:
                    </span>
                    <input type="date" value={visitorDate} onChange={(e) => setVisitorDate(e.target.value)} className="bg-slate-50 border-2 border-slate-200 text-[#0B3B2C] px-6 py-3.5 rounded-2xl font-black outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all cursor-pointer text-lg shadow-inner w-full sm:w-auto" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* İftar Kutusu */}
                    <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 relative overflow-hidden group hover:border-orange-200 transition-colors duration-300">
                      <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 pointer-events-none"><MoonStar size={200} /></div>
                      <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="bg-orange-100 text-orange-600 p-4 rounded-2xl shadow-inner shrink-0"><ChefHat size={32} /></div>
                        <div>
                          <h4 className="text-xl sm:text-2xl font-black text-[#0B3B2C]">İftar Özeti</h4>
                          <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">{visitorDate}</p>
                        </div>
                      </div>
                      <div className="mb-8 relative z-10">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Toplam Rezerve</p>
                        <p className="text-4xl sm:text-5xl font-black text-orange-500 drop-shadow-sm">{visitorIftarSummary.totalPeople} <span className="text-xl sm:text-2xl text-slate-400 font-bold">Kişi</span></p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 relative z-10">
                        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center"><span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Tavuk</span><span className="font-black text-lg sm:text-xl text-[#0B3B2C]">{visitorIftarSummary.totalTavuk}</span></div>
                        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center"><span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Hünkar</span><span className="font-black text-lg sm:text-xl text-[#0B3B2C]">{visitorIftarSummary.totalHunkar}</span></div>
                        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center"><span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Izgara</span><span className="font-black text-lg sm:text-xl text-[#0B3B2C]">{visitorIftarSummary.totalKarisik}</span></div>
                        <div className="bg-orange-50 p-3 sm:p-4 rounded-2xl border border-orange-100 shadow-sm flex justify-between items-center"><span className="text-[10px] sm:text-xs font-bold text-orange-600 uppercase tracking-wider">Çocuk</span><span className="font-black text-lg sm:text-xl text-orange-600">{visitorIftarSummary.totalCocuk}</span></div>
                      </div>
                    </div>
                    {/* Maç Kutusu */}
                    <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 relative overflow-hidden flex flex-col justify-between group hover:border-blue-200 transition-colors duration-300">
                      <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 pointer-events-none"><MonitorPlay size={200} /></div>
                      <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl shadow-inner shrink-0"><MonitorPlay size={32} /></div>
                        <div>
                          <h4 className="text-xl sm:text-2xl font-black text-[#0a192f]">Maç Yayını</h4>
                          <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">{visitorDate}</p>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-blue-100 mb-6 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1 block">Sıradaki Maç</span>
                          <p className="text-sm sm:text-base font-black text-[#0a192f]">{nextMatch.team1} - {nextMatch.team2}</p>
                          <p className="text-xs text-slate-500 font-bold mt-1">{nextMatch.displayDate}</p>
                        </div>
                        <button onClick={() => setShowFixtureModal(true)} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 shadow-md whitespace-nowrap text-center">Fikstür</button>
                      </div>
                      <div className="relative z-10 mt-auto">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Seçili Gün Seyirci</p>
                        <p className="text-4xl sm:text-5xl md:text-6xl font-black text-blue-600 drop-shadow-sm">{visitorTotalMatchPeople} <span className="text-xl sm:text-2xl text-slate-400 font-bold">Kişi</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer id="iletisim" className="w-full bg-slate-950 text-slate-400 py-16 relative z-10 border-t border-slate-800">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <img src="/salaaslogobg.png" alt="Salaaş Logo" className="h-20 object-contain mb-6 opacity-90" />
              <p className="text-sm leading-relaxed mb-6 max-w-xs font-medium">Şehrin kalbinde, lezzet ve muhabbetin kesişme noktası. Sizi ağırlamaktan mutluluk duyarız.</p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-white font-black uppercase tracking-widest mb-6">İletişim</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="tel:+902626421413" className="hover:text-orange-400 transition-colors flex items-center justify-center md:justify-start gap-3"><Phone size={18}/> 0262 642 14 13</a></li>
                <li><a href="https://www.instagram.com/salascaferestaurant/" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors flex items-center justify-center md:justify-start gap-3"><Instagram size={18}/> @salascaferestaurant</a></li>
                <li className="flex items-start justify-center md:justify-start gap-3 text-left"><MapPin size={18} className="shrink-0 mt-0.5"/> Gebze, Kocaeli</li>
              </ul>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-white font-black uppercase tracking-widest mb-6">Hızlı Bağlantılar</h4>
              <ul className="space-y-4 text-sm font-medium mb-8">
                <li><a href="https://m.1menu.com.tr/salaascafe/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2"><ChevronRight size={14} className="text-orange-500"/> Dijital Menü</a></li>
                <li><button onClick={() => handleScroll('rezervasyon')} className="hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2"><ChevronRight size={14} className="text-orange-500"/> Rezervasyon Durumu</button></li>
                <li>
                  <button onClick={() => setShowRequestModal(true)} className="hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2 text-orange-400">
                    <ChevronRight size={14} className="text-orange-500"/> Online Rezervasyon
                  </button>
                </li>
              </ul>
              <button onClick={() => setShowLoginModal(true)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-slate-700 hover:border-slate-600 shadow-lg hover:shadow-xl hover:-translate-y-1">
                <Lock size={14} /> Personel Girişi
              </button>
            </div>
          </div>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800/50 text-center text-xs font-medium opacity-60">
            <p>© 2026 Salaaş Cafe Restaurant. Tüm hakları saklıdır.</p>
          </div>
        </footer>

        {/* ── MÜŞTERİ REZERVASYON TALEP MODAL ── */}
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white w-full sm:max-w-lg rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-in">

              {/* Modal Header */}
              <div className={`p-5 sm:p-6 flex items-center justify-between shrink-0 ${requestType === 'iftar' ? 'bg-[#0B3B2C]' : 'bg-[#0a192f]'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${requestType === 'iftar' ? 'bg-orange-500/20' : 'bg-blue-500/20'}`}>
                    {requestType === 'iftar' ? <MoonStar size={22} className="text-orange-300" /> : <MonitorPlay size={22} className="text-blue-300" />}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg">Rezervasyon Talebi</h3>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-0.5">Salaaş Cafe Restaurant</p>
                  </div>
                </div>
                <button onClick={closeRequestModal} className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white/70 hover:text-white"><X size={20}/></button>
              </div>

              {/* Tür Seçim Tabları */}
              {requestStep === 'form' && (
                <div className="flex bg-slate-100 p-1.5 mx-5 mt-5 rounded-2xl shrink-0">
                  <button
                    onClick={() => setRequestType('iftar')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${requestType === 'iftar' ? 'bg-[#0B3B2C] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <MoonStar size={14} /> İftar
                  </button>
                  <button
                    onClick={() => setRequestType('mac')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${requestType === 'mac' ? 'bg-[#0a192f] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <MonitorPlay size={14} /> Maç Yayını
                  </button>
                </div>
              )}

              {/* Form İçeriği */}
              <div className="overflow-y-auto flex-1">
                {requestStep === 'form' ? (
                  <form onSubmit={handleRequestSubmit} className="p-5 sm:p-6 space-y-4">
                    {requestError && (
                      <div className="bg-red-50 text-red-600 text-sm font-bold p-3.5 rounded-xl border border-red-100 flex items-center gap-2">
                        <AlertCircle size={16} /> {requestError}
                      </div>
                    )}

                    {/* Ad Soyad */}
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Ad Soyad <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={requestForm.name}
                        onChange={e => setRequestForm(p => ({...p, name: e.target.value}))}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none bg-slate-50 font-semibold text-slate-800 transition-all"
                        placeholder="Adınız ve soyadınız"
                        required
                      />
                    </div>

                    {/* Telefon */}
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Telefon <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="tel"
                          value={requestForm.phone}
                          onChange={e => setRequestForm(p => ({...p, phone: e.target.value}))}
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none bg-slate-50 font-semibold text-slate-800 transition-all"
                          placeholder="05XX XXX XX XX"
                          required
                        />
                      </div>
                    </div>

                    {/* Kişi Sayısı + Tarih */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Kişi Sayısı</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type="number"
                            inputMode="numeric"
                            min="1"
                            max="150"
                            value={requestForm.peopleCount}
                            onChange={e => setRequestForm(p => ({...p, peopleCount: e.target.value}))}
                            className="w-full pl-11 pr-3 py-3.5 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none bg-slate-50 font-black text-slate-800 transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Tarih</label>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type="date"
                            value={requestForm.date}
                            onChange={e => setRequestForm(p => ({...p, date: e.target.value}))}
                            className="w-full pl-10 pr-2 py-3.5 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none bg-slate-50 font-semibold text-slate-800 transition-all"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Özel Not */}
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Özel Not / İstek <span className="text-slate-400 font-normal">(Opsiyonel)</span></label>
                      <textarea
                        value={requestForm.notes}
                        onChange={e => setRequestForm(p => ({...p, notes: e.target.value}))}
                        rows={3}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none bg-amber-50/50 font-medium text-slate-700 transition-all resize-none placeholder:text-amber-300"
                        placeholder="Örn: Doğum günü sürprizi, özel diyet, mama sandalyesi..."
                      />
                    </div>

                    {/* Bilgi Notu */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                      <AlertCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 font-medium leading-relaxed">
                        Talebiniz ekibimize iletilecek ve en kısa sürede WhatsApp üzerinden onay mesajı gönderilecektir.
                      </p>
                    </div>

                    {/* Gönder Butonu */}
                    <button
                      type="submit"
                      disabled={requestSubmitting}
                      className={`w-full py-4 rounded-2xl font-black text-white uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 ${requestType === 'iftar' ? 'bg-gradient-to-r from-[#0B3B2C] to-emerald-700' : 'bg-gradient-to-r from-[#0a192f] to-blue-800'}`}
                    >
                      {requestSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                      {requestSubmitting ? 'Gönderiliyor...' : 'Talebi Gönder'}
                    </button>
                  </form>
                ) : (
                  /* Başarı Ekranı */
                  <div className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                      <CheckCircle size={40} className="text-emerald-600" />
                    </div>
                    <h4 className="text-2xl font-black text-[#0B3B2C] mb-3">Talebiniz Alındı!</h4>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-sm mb-2">
                      Rezervasyon talebiniz ekibimize iletildi.
                    </p>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-sm mb-8">
                      En kısa sürede <span className="text-emerald-600 font-black">WhatsApp</span> üzerinden bilgilendirileceksiniz.
                    </p>
                    <div className="bg-slate-50 rounded-2xl p-4 w-full max-w-xs text-left mb-8 border border-slate-200">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Talep Özeti</p>
                      <div className="space-y-2 text-sm font-semibold text-slate-700">
                        <div className="flex justify-between"><span>İsim:</span><span className="font-black">{requestForm.name}</span></div>
                        <div className="flex justify-between"><span>Telefon:</span><span className="font-black">{requestForm.phone}</span></div>
                        <div className="flex justify-between"><span>Tarih:</span><span className="font-black">{requestForm.date}</span></div>
                        <div className="flex justify-between"><span>Kişi:</span><span className="font-black">{requestForm.peopleCount}</span></div>
                        <div className="flex justify-between"><span>Tür:</span><span className={`font-black ${requestType === 'iftar' ? 'text-emerald-700' : 'text-blue-700'}`}>{requestType === 'iftar' ? 'İftar' : 'Maç Yayını'}</span></div>
                      </div>
                    </div>
                    <button onClick={closeRequestModal} className="bg-[#0B3B2C] hover:bg-emerald-900 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 shadow-lg">
                      Tamam
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FİKSTÜR MODAL */}
        {showFixtureModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
              <div className="bg-[#0a192f] p-5 flex items-center justify-between text-white shrink-0">
                <h3 className="font-black tracking-wide flex items-center gap-2 text-base sm:text-lg"><MonitorPlay size={18} className="text-cyan-400"/> Dev Ekran Maç Fikstürü</h3>
                <button onClick={() => setShowFixtureModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors"><X size={20}/></button>
              </div>
              <div className="overflow-y-auto p-3 sm:p-4 bg-slate-50">
                <div className="space-y-3">
                  {MATCH_FIXTURE.map((match, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-colors">
                      <div>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1.5"><CalendarDays size={14}/> {match.displayDate}</p>
                        <p className="font-black text-[#0a192f] text-sm sm:text-base">{match.team1} <span className="text-slate-300 font-normal mx-1">vs</span> {match.team2}</p>
                      </div>
                      <button onClick={() => { setVisitorDate(match.date); setShowFixtureModal(false); handleScroll('rezervasyon'); }} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors">Seç</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TATLILAR MODAL */}
        {showDessertsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">
              <div className="bg-[#0B3B2C] p-4 sm:p-6 flex items-center justify-between text-white shrink-0">
                <h3 className="font-black tracking-wide flex items-center gap-3 text-lg sm:text-2xl"><Coffee size={28} className="text-pink-400"/> Tatlı Menümüz</h3>
                <button onClick={() => setShowDessertsModal(false)} className="p-2 sm:p-3 hover:bg-white/20 rounded-xl transition-colors"><X size={24}/></button>
              </div>
              <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 flex-1">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {DESSERTS.map((tatli) => (
                    <div key={tatli.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full group hover:shadow-xl transition-all hover:-translate-y-1">
                      <div className="w-full aspect-[4/3] bg-slate-100 relative overflow-hidden shrink-0 border-b border-slate-100">
                        <img src={encodeURI(tatli.image)} alt={tatli.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80'; }} />
                      </div>
                      <div className="p-3 sm:p-4 text-center flex flex-col justify-center grow min-h-[60px] sm:min-h-[70px] bg-white z-10">
                        <h4 className="font-black text-[#0B3B2C] text-xs sm:text-sm md:text-base leading-snug">{tatli.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOGIN MODAL */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-[#0B3B2C] p-5 sm:p-6 flex items-center justify-between text-white">
                <h3 className="font-black tracking-wide flex items-center gap-2 text-lg"><Lock size={20} className="text-orange-400"/> Sistem Girişi</h3>
                <button onClick={() => {setShowLoginModal(false); setLoginError('');}} className="p-2 hover:bg-white/20 rounded-xl transition-colors"><X size={20}/></button>
              </div>
              <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5">
                {loginError && <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl border border-red-100 flex items-center gap-2"><X size={16}/> {loginError}</div>}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kullanıcı Adı</label>
                  <input type="text" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-[#0B3B2C]/10 focus:border-[#0B3B2C] outline-none bg-slate-50 font-bold text-slate-800 transition-all" placeholder="Kullanıcı adınızı girin" autoFocus />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Şifre</label>
                  <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-[#0B3B2C]/10 focus:border-[#0B3B2C] outline-none bg-slate-50 font-bold text-slate-800 transition-all" placeholder="••••••••" />
                </div>
                <button type="submit" className="w-full bg-[#0B3B2C] hover:bg-emerald-900 text-white font-black tracking-widest uppercase py-4 rounded-xl transition-all shadow-lg hover:shadow-xl mt-4 flex items-center justify-center gap-2 hover:-translate-y-0.5">
                  Giriş Yap <ArrowRight size={20} />
                </button>
              </form>
            </div>
          </div>
        )}
        <Analytics />
      </div>
    );
  }

  // =======================================================================
  // 2. PERSONEL / ADMİN YÖNETİM EKRANI
  // =======================================================================
  return (
    <div className={`min-h-screen font-sans text-slate-800 pb-12 print:bg-white print:pb-0 relative transition-colors duration-500 ${activePage === 'iftar' ? 'bg-slate-50' : 'bg-[#f0f4f8]'}`}>

      {activePage === 'iftar' && (
        <>
          <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] print:hidden" style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="fixed top-20 right-10 z-0 pointer-events-none opacity-5 text-emerald-900 rotate-12 print:hidden"><MoonStar size={400} strokeWidth={1} /></div>
        </>
      )}
      {activePage === 'mac' && (
        <div className="fixed top-20 right-10 z-0 pointer-events-none opacity-[0.03] text-blue-900 rotate-12 print:hidden"><MonitorPlay size={400} strokeWidth={1} /></div>
      )}

      {activePage === 'iftar' && isPrepTime && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-3 flex items-center justify-center gap-3 shadow-2xl animate-pulse print:hidden">
          <BellRing className="animate-bounce" /><span className="font-black tracking-widest text-sm md:text-lg uppercase">Mutfak Bildirimi: İftara son 10 Dakika! Servis Hazırlığı Başlasın!</span><Flame className="animate-bounce text-yellow-300" />
        </div>
      )}
      {activePage === 'iftar' && isIftarTime && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-600 text-white p-3 flex items-center justify-center gap-3 shadow-2xl print:hidden">
          <MoonStar className="text-yellow-300" /><span className="font-black tracking-widest text-lg uppercase">Hayırlı İftarlar - İftar Vakti!</span>
        </div>
      )}

      <div className={`hidden ${!printSingleId ? 'print:block' : ''} text-center mb-4 border-b-2 border-black pb-2 relative z-10`}>
        <h1 className="text-xl font-bold font-sans uppercase">{activePage === 'iftar' ? 'Salaaş Cafe İftar' : 'Salaaş Cafe Maç'}</h1>
        <p className="text-sm mt-1 font-bold text-black">Tarih: {activePage === 'iftar' ? selectedFilterDate : selectedMatchDate}</p>
      </div>

      {/* HEADER */}
      <header className={`${activePage === 'iftar' ? 'bg-[#0B3B2C]' : 'bg-[#0a192f]'} text-white shadow-lg sticky z-20 print:hidden transition-colors duration-500 ${(isPrepTime || isIftarTime) && activePage === 'iftar' ? 'top-[52px]' : 'top-0'}`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 sm:h-12 shrink-0 flex items-center justify-center overflow-visible drop-shadow-md bg-transparent">
                <img src="/salaaslogobg.png" alt="Salaaş Cafe Logo" className="h-full w-auto object-contain bg-transparent" />
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-base md:text-lg font-black tracking-wide text-transparent bg-clip-text font-serif ${activePage === 'iftar' ? 'bg-gradient-to-r from-orange-400 to-yellow-300' : 'bg-gradient-to-r from-blue-400 to-cyan-300'}`}>Yönetim Paneli</h1>
              </div>
            </div>
            <div className="flex items-center bg-black/40 p-1.5 rounded-xl border border-white/10 shadow-inner ml-2 sm:ml-0">
              <button onClick={() => setActivePage('iftar')} className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black tracking-widest uppercase transition-all flex items-center gap-1.5 ${activePage === 'iftar' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                <MoonStar size={14}/> İFTAR
              </button>
              <button onClick={() => setActivePage('mac')} className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black tracking-widest uppercase transition-all flex items-center gap-1.5 ${activePage === 'mac' ? 'bg-blue-600 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                <MonitorPlay size={14}/> MAÇ
              </button>
            </div>
          </div>

          <div className="flex flex-row items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {activePage === 'iftar' ? (
              <div className={`flex shrink-0 items-center rounded-xl px-4 py-2 border w-full md:w-auto justify-center shadow-inner transition-colors duration-500 ${isPrepTime ? 'bg-red-500/20 border-red-500 text-red-100' : isIftarTime ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' : 'bg-white/5 border-orange-500/30 text-orange-200'}`}>
                <Clock className={`mr-2 ${isPrepTime ? 'animate-bounce text-red-400' : 'opacity-80'}`} size={20} />
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">İftara Kalan</span>
                  <span className={`font-mono font-black text-base sm:text-lg tracking-widest drop-shadow-md ${isPrepTime ? 'text-red-300' : isIftarTime ? 'text-emerald-300' : 'text-white'}`}>{countdown}</span>
                </div>
              </div>
            ) : null}

            <div className="flex shrink-0 items-center bg-white/10 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 border border-white/10 hover:bg-white/20 transition-colors w-full md:w-auto justify-center">
              <CalendarDays className={`mr-2 ${activePage === 'iftar' ? 'text-orange-400' : 'text-cyan-400'}`} size={18} />
              {activePage === 'mac' && <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 text-cyan-100 hidden lg:inline mr-2">Tarih Seç:</span>}
              <input type="date" value={activePage === 'iftar' ? selectedFilterDate : selectedMatchDate} onChange={(e) => activePage === 'iftar' ? setSelectedFilterDate(e.target.value) : setSelectedMatchDate(e.target.value)} className="bg-transparent text-white outline-none font-bold cursor-pointer text-xs sm:text-sm w-full md:w-auto" />
            </div>

            {/* ── BEKLEYENLERİ GÖSTER BUTONU ── */}
            <button
              onClick={() => setShowPendingPanel(true)}
              className="relative shrink-0 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors shadow-md flex items-center gap-1.5"
              title="Bekleyen Talepler"
            >
              <Bell size={14} /> Talepler
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

            <button onClick={() => {setIsAuthenticated(false); setLoginUser(''); setLoginPass('');}} className="shrink-0 bg-red-500 hover:bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors shadow-md ml-auto md:ml-0" title="Güvenli Çıkış">ÇIKIŞ</button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className={`flex flex-col items-center justify-center mt-32 relative z-10 ${activePage === 'iftar' ? 'text-orange-600' : 'text-blue-600'}`}>
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="font-bold tracking-widest animate-pulse uppercase">Sisteme Bağlanıyor...</p>
        </div>
      ) : (
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 print:block print:m-0 print:p-0 relative z-10">

          {/* İFTAR EKRANI */}
          {activePage === 'iftar' && (
            <>
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
                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4">
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
                          <div className="relative w-full aspect-[4/5] min-h-[300px] bg-[#e6e2d8] border-[10px] border-slate-700/80 rounded-xl overflow-hidden shadow-inner font-sans">
                            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, #000 20px, #000 21px)' }}></div>
                            <div className="absolute top-0 left-[42%] w-[16%] h-[4%] bg-amber-900 border-x-2 border-b-2 border-slate-800 rounded-b-md z-10 flex items-center justify-center shadow-lg"><span className="text-[7px] sm:text-[9px] font-black text-amber-100 tracking-widest">GİRİŞ</span></div>
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
                              );
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
                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4">
                      <div className="flex-[1]">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><CalendarDays size={14} className="text-orange-500"/> Rezervasyon Tarihi</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-slate-50/50 font-semibold text-[#0B3B2C]" required />
                      </div>
                      <div className="flex-[2]">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><MessageSquareText size={14}/> Özel Not (Opsiyonel)</label>
                        <input type="text" name="notes" value={formData.notes} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 bg-amber-50/50 placeholder:text-amber-300 font-medium" placeholder="Örn: Mama sandalyesi..." />
                      </div>
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
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full border-b border-emerald-700/50 pb-5 z-10 print:border-black print:pb-2 gap-4">
                    <div className="flex items-center gap-4 text-[#FBE18D] w-full sm:w-auto">
                      <div className="bg-white/10 p-3 rounded-2xl print:hidden shrink-0"><ChefHat size={28} /></div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-orange-400 print:text-black">İftar Mutfak Özeti</p>
                        <div className="flex gap-3 items-baseline mt-0.5">
                          <p className="text-2xl sm:text-3xl font-black text-white print:text-black">Kişi: <span className="text-orange-400 print:text-black">{dailySummary.totalPeople}</span></p>
                          <span className="text-emerald-500 font-bold print:hidden">|</span>
                          <p className="text-lg sm:text-xl font-bold text-slate-200 print:text-black">Menü: <span className="text-yellow-400 print:text-black">{dailySummary.totalMenu}</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-1/3 pt-1 print:hidden">
                      <div className="flex justify-between items-end mb-1.5 px-1">
                        <span className="text-[10px] font-bold text-emerald-200 uppercase">Kapasite: 150</span>
                        <span className={`text-[10px] font-black ${occupancyRate >= 90 ? 'text-red-400' : 'text-emerald-300'}`}>DOLULUK: %{occupancyRate}</span>
                      </div>
                      <div className="w-full bg-emerald-950/60 rounded-full h-2 shadow-inner overflow-hidden">
                        <div className={`h-2 rounded-full transition-all duration-1000 ${occupancyRate >= 90 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${occupancyRate}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full z-10 print:grid-cols-2 print:gap-1">
                    <div className="bg-white/95 px-3 py-3 rounded-2xl text-center shadow-lg border-b-4 border-slate-200 print:border print:border-black print:rounded-md print:py-1"><span className="block text-[10px] text-slate-500 font-bold mb-0.5">TAVUK</span><span className="font-black text-2xl sm:text-3xl text-[#0B3B2C] print:text-black">{dailySummary.totalTavuk}</span></div>
                    <div className="bg-white/95 px-3 py-3 rounded-2xl text-center shadow-lg border-b-4 border-slate-200 print:border print:border-black print:rounded-md print:py-1"><span className="block text-[10px] text-slate-500 font-bold mb-0.5">HÜNKAR</span><span className="font-black text-2xl sm:text-3xl text-[#0B3B2C] print:text-black">{dailySummary.totalHunkar}</span></div>
                    <div className="bg-white/95 px-3 py-3 rounded-2xl text-center shadow-lg border-b-4 border-slate-200 print:border print:border-black print:rounded-md print:py-1"><span className="block text-[10px] text-slate-500 font-bold mb-0.5">IZGARA</span><span className="font-black text-2xl sm:text-3xl text-[#0B3B2C] print:text-black">{dailySummary.totalKarisik}</span></div>
                    <div className="bg-orange-50 px-3 py-3 rounded-2xl text-center shadow-lg border-b-4 border-orange-200 print:border-black print:bg-white print:rounded-md print:py-1"><span className="block text-[10px] text-orange-600 font-bold mb-0.5">ÇOCUK</span><span className="font-black text-2xl sm:text-3xl text-orange-600 print:text-black">{dailySummary.totalCocuk}</span></div>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/60 p-6 sm:p-8 min-h-[400px] print:p-0 print:border-none print:shadow-none print:bg-white">
                  <div className={`flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4 ${printSingleId ? 'print:hidden' : 'print:border-b-2 print:border-black print:pb-2 print:mb-3'}`}>
                    <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2 text-[#0B3B2C]"><Armchair className="text-orange-500 print:hidden" size={28} /> Aktif Masalar</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                      <div className="relative w-full sm:w-64 print:hidden">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="İsim, masa veya telefon ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 text-sm shadow-sm outline-none bg-slate-50 transition-all" />
                      </div>
                      <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-xs font-black print:hidden shrink-0">{sortedReservations.length} Kayıt</span>
                      <button onClick={() => window.print()} className="w-full sm:w-auto bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors print:hidden shrink-0"><Printer size={16} /> YAZDIR</button>
                    </div>
                  </div>
                  {sortedReservations.length === 0 ? (
                    <div className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center text-slate-400 print:hidden"><Search size={40} className="opacity-50 text-orange-400 mx-auto mb-4" /><p className="font-bold text-xl">Kayıt bulunamadı.</p></div>
                  ) : (
                    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 sm:gap-6 ${printSingleId ? 'print:grid-cols-1 print:gap-0' : 'print:grid-cols-2 print:gap-2'}`}>
                      {sortedReservations.map((res) => {
                        const isArrived = res.isArrived || false;
                        const isPrinting = printSingleId === res.id;
                        return (
                          <div key={res.id} className={`p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 relative group print:border-black print:border-dashed print:p-2 print:mb-1 ${printSingleId && !isPrinting ? 'hidden print:hidden' : ''} ${isEditing === res.id ? 'border-orange-400 bg-orange-50/30 scale-[1.02] shadow-lg' : isArrived ? 'border-emerald-500 bg-emerald-50/50 opacity-80' : 'border-slate-100 bg-white hover:border-orange-200 hover:shadow-md'}`}>
                            {isPrinting && <div className="hidden print:block text-center font-bold text-[12px] uppercase mb-2 border-b border-black">Salaaş Cafe<br/>{selectedFilterDate}</div>}
                            {deleteConfirmId === res.id && (
                              <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-4 border border-red-200 rounded-2xl print:hidden backdrop-blur-sm">
                                <p className="font-black text-slate-800 mb-4 text-lg">Silinsin mi?</p>
                                <div className="flex gap-3"><button onClick={() => executeDelete(res.id, 'reservations')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md transition-colors">Evet, Sil</button><button onClick={() => setDeleteConfirmId(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-2 rounded-xl text-sm font-bold transition-colors">İptal</button></div>
                              </div>
                            )}
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full flex items-center justify-center font-black text-sm shadow-inner print:hidden ${isArrived ? 'bg-emerald-100 text-emerald-700' : 'bg-gradient-to-br from-orange-400 to-orange-500 text-white'}`}>{getInitials(res.name)}</div>
                              <h3 className={`text-xl font-black truncate print:text-black ${isArrived ? 'line-through text-emerald-900' : 'text-[#0B3B2C]'}`}>{res.name || 'İsimsiz'}</h3>
                            </div>
                            {res.phone && (
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm font-semibold flex items-center gap-1.5 text-slate-500 print:text-black"><Phone size={14} className="print:hidden text-orange-400" /> {res.phone}</p>
                                <button onClick={() => sendWhatsApp(res, 'iftar')} className="print:hidden bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white p-1.5 rounded-full transition-colors"><MessageCircle size={16} /></button>
                              </div>
                            )}
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-black mt-3 print:p-0 print:text-black ${isArrived ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}><Armchair size={16} className="print:hidden" /> Masa: {res.table}</div>
                            {res.notes && <div className="mt-3 text-xs sm:text-sm font-bold text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 print:border-black print:bg-white">Not: {res.notes}</div>}
                            <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-5 border-t border-slate-200 print:hidden">
                              <button onClick={() => handleToggleArrived(res.id, isArrived, 'reservations')} className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-black transition-colors ${isArrived ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}><CheckCircle size={18} /> {isArrived ? "MASADA" : "GELMEDİ"}</button>
                              <div className="flex gap-2">
                                <button onClick={() => handlePrintSingle(res.id)} className="p-2.5 text-slate-500 bg-slate-50 hover:text-[#0B3B2C] hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"><Printer size={18} /></button>
                                <button onClick={() => handleEditClick(res)} className="p-2.5 text-slate-500 bg-slate-50 hover:text-orange-600 hover:bg-orange-100 rounded-xl border border-slate-200 transition-colors"><Edit2 size={18} /></button>
                                <button onClick={() => setDeleteConfirmId(res.id)} className="p-2.5 text-slate-500 bg-slate-50 hover:text-red-600 hover:bg-red-100 rounded-xl border border-slate-200 transition-colors"><Trash2 size={18} /></button>
                              </div>
                            </div>
                            <div className="mt-4 p-3 sm:p-4 border rounded-xl print:border-t print:border-b-0 print:p-0 print:mt-1 bg-slate-50/80">
                              <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2 print:border-none print:mb-0"><p className="text-[10px] font-black uppercase text-slate-400 print:hidden">Sipariş Özeti</p><div className="bg-slate-800 text-white px-2.5 py-1 rounded-lg text-xs font-black print:bg-transparent print:text-black print:p-0 shadow-sm"><Users size={14} className="inline print:hidden mr-1" />{res.peopleCount} KİŞİ</div></div>
                              <ul className="text-xs sm:text-sm font-bold text-slate-600 print:text-black space-y-1">
                                {res.menuTavuk > 0 && <li className="flex justify-between"><span>Tavuk Menü</span><span className="bg-white px-2 py-0.5 rounded border shadow-sm">x {res.menuTavuk}</span></li>}
                                {res.menuHunkar > 0 && <li className="flex justify-between"><span>Hünkar</span><span className="bg-white px-2 py-0.5 rounded border shadow-sm">x {res.menuHunkar}</span></li>}
                                {res.menuKarisik > 0 && <li className="flex justify-between"><span>Izgara</span><span className="bg-white px-2 py-0.5 rounded border shadow-sm">x {res.menuKarisik}</span></li>}
                                {res.menuCocuk > 0 && <li className="flex justify-between text-orange-600"><span>Çocuk</span><span className="bg-orange-50 px-2 py-0.5 rounded border border-orange-200 shadow-sm">x {res.menuCocuk}</span></li>}
                              </ul>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* MAÇ EKRANI */}
          {activePage === 'mac' && (
            <>
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
                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4">
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

              <div className="lg:col-span-8 space-y-6 print:w-full print:block print:space-y-4">
                <div className={`bg-gradient-to-br from-[#0a192f] to-blue-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-2 relative overflow-hidden ${printSingleId ? 'print:hidden' : 'print:bg-white print:from-white print:to-white print:border-b-2 print:border-black print:rounded-none print:shadow-none print:p-2 print:mb-4'}`}>
                  <div className="absolute right-0 top-0 opacity-5 pointer-events-none print:hidden"><MonitorPlay size={200} /></div>
                  <div className="flex items-center gap-4 text-cyan-200 z-10 print:text-black">
                    <div className="bg-white/10 p-3 rounded-2xl print:hidden"><MonitorPlay size={32} /></div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-cyan-400 print:text-black">Maç Günü Katılım Özeti</p>
                      <p className="text-3xl sm:text-4xl font-black text-white mt-1 print:text-black">Toplam: <span className="text-cyan-400 print:text-black">{totalMatchPeople}</span> Seyirci</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/60 p-6 sm:p-8 min-h-[400px] print:p-0 print:border-none print:shadow-none print:bg-white">
                  <div className={`flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4 ${printSingleId ? 'print:hidden' : 'print:border-b-2 print:border-black print:pb-2 print:mb-3'}`}>
                    <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2 text-[#0a192f]"><MonitorPlay className="text-blue-500 print:hidden" size={28} /> Maç Rezervasyonları</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                      <div className="relative w-full sm:w-64 print:hidden">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="İsim, masa veya telefon ara..." value={matchSearchTerm} onChange={(e) => setMatchSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm shadow-sm outline-none bg-slate-50 transition-all" />
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-xs font-black print:hidden shrink-0">{sortedMatchReservations.length} Kayıt</span>
                      <button onClick={() => window.print()} className="w-full sm:w-auto bg-[#0a192f] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors print:hidden shrink-0"><Printer size={16} /> YAZDIR</button>
                    </div>
                  </div>
                  {sortedMatchReservations.length === 0 ? (
                    <div className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center text-slate-400 print:hidden"><Search size={40} className="opacity-50 text-blue-400 mx-auto mb-4" /><p className="font-bold text-xl">Bu maça ait kayıt bulunamadı.</p></div>
                  ) : (
                    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 sm:gap-6 ${printSingleId ? 'print:grid-cols-1 print:gap-0' : 'print:grid-cols-2 print:gap-2'}`}>
                      {sortedMatchReservations.map((res) => {
                        const isArrived = res.isArrived || false;
                        const isPrinting = printSingleId === res.id;
                        return (
                          <div key={res.id} className={`p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 relative group print:border-black print:border-dashed print:p-2 print:mb-1 ${printSingleId && !isPrinting ? 'hidden print:hidden' : ''} ${isMatchEditing === res.id ? 'border-blue-400 bg-blue-50/30 scale-[1.02] shadow-lg' : isArrived ? 'border-emerald-500 bg-emerald-50/50 opacity-80' : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-md'}`}>
                            {isPrinting && <div className="hidden print:block text-center font-bold text-[12px] uppercase mb-2 border-b border-black">Salaaş Cafe MAÇ<br/>{selectedMatchDate}</div>}
                            {matchDeleteConfirmId === res.id && (
                              <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center p-4 border border-red-200 rounded-2xl print:hidden backdrop-blur-sm">
                                <p className="font-black text-slate-800 mb-4 text-lg">Silinsin mi?</p>
                                <div className="flex gap-3"><button onClick={() => executeDelete(res.id, 'matchReservations')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md transition-colors">Evet, Sil</button><button onClick={() => setMatchDeleteConfirmId(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-2 rounded-xl text-sm font-bold transition-colors">İptal</button></div>
                              </div>
                            )}
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full flex items-center justify-center font-black text-sm shadow-inner print:hidden ${isArrived ? 'bg-emerald-100 text-emerald-700' : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'}`}>{getInitials(res.name)}</div>
                              <h3 className={`text-xl font-black truncate print:text-black ${isArrived ? 'line-through text-emerald-900' : 'text-[#0a192f]'}`}>{res.name || 'İsimsiz'}</h3>
                            </div>
                            {res.phone && (
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm font-semibold flex items-center gap-1.5 text-slate-500 print:text-black"><Phone size={14} className="print:hidden text-blue-400" /> {res.phone}</p>
                                <button onClick={() => sendWhatsApp(res, 'mac')} className="print:hidden bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white p-1.5 rounded-full transition-colors"><MessageCircle size={16} /></button>
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-3">
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-black print:p-0 print:text-black ${isArrived ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-800'}`}><Users size={16} className="print:hidden" /> {res.peopleCount} Kişi</div>
                              {res.table && <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-black bg-slate-100 text-slate-700 print:p-0"><Armchair size={16} className="print:hidden" /> {res.table}</div>}
                            </div>
                            {res.notes && <div className="mt-3 text-xs sm:text-sm font-bold text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 print:border-black print:bg-white">Not: {res.notes}</div>}
                            <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-5 border-t border-slate-200 print:hidden">
                              <button onClick={() => handleToggleArrived(res.id, isArrived, 'matchReservations')} className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-black transition-colors ${isArrived ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}><CheckCircle size={18} /> {isArrived ? "MASADA" : "GELMEDİ"}</button>
                              <div className="flex gap-2">
                                <button onClick={() => handlePrintSingle(res.id)} className="p-2.5 text-slate-500 bg-slate-50 hover:text-[#0a192f] hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"><Printer size={18} /></button>
                                <button onClick={() => handleMatchEditClick(res)} className="p-2.5 text-slate-500 bg-slate-50 hover:text-blue-600 hover:bg-blue-100 rounded-xl border border-slate-200 transition-colors"><Edit2 size={18} /></button>
                                <button onClick={() => setMatchDeleteConfirmId(res.id)} className="p-2.5 text-slate-500 bg-slate-50 hover:text-red-600 hover:bg-red-100 rounded-xl border border-slate-200 transition-colors"><Trash2 size={18} /></button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      )}

      {/* ── BEKLEYENLERİ PANEL (SLIDE-IN DRAWER) ── */}
      {showPendingPanel && (
        <div className="fixed inset-0 z-50 flex justify-end print:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPendingPanel(false)} />
          <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl overflow-hidden">
            {/* Drawer Header */}
            <div className="bg-amber-500 px-6 py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl"><Bell size={22} className="text-white" /></div>
                <div>
                  <h3 className="font-black text-white text-lg">Bekleyen Talepler</h3>
                  <p className="text-amber-100 text-xs font-bold mt-0.5">{pendingCount} onay bekliyor</p>
                </div>
              </div>
              <button onClick={() => setShowPendingPanel(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"><X size={20}/></button>
            </div>

            {/* Drawer İçerik */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={36} className="text-slate-300" />
                  </div>
                  <p className="font-black text-slate-400 text-lg">Bekleyen talep yok</p>
                  <p className="text-slate-400 text-sm mt-1">Tüm talepler işlendi 🎉</p>
                </div>
              ) : (
                pendingRequests.filter(r => r.status === 'pending').map((req) => (
                  <div key={req.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {/* Kart Başlık */}
                    <div className={`px-4 py-3 flex items-center justify-between ${req.type === 'iftar' ? 'bg-emerald-50 border-b border-emerald-100' : 'bg-blue-50 border-b border-blue-100'}`}>
                      <div className="flex items-center gap-2">
                        {req.type === 'iftar'
                          ? <MoonStar size={16} className="text-emerald-600" />
                          : <MonitorPlay size={16} className="text-blue-600" />
                        }
                        <span className={`text-xs font-black uppercase tracking-widest ${req.type === 'iftar' ? 'text-emerald-700' : 'text-blue-700'}`}>
                          {req.type === 'iftar' ? 'İftar Talebi' : 'Maç Talebi'}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <CalendarDays size={12} /> {req.date}
                      </span>
                    </div>

                    {/* Kart Detay */}
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0 ${req.type === 'iftar' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                          {getInitials(req.name)}
                        </div>
                        <div>
                          <p className="font-black text-slate-800">{req.name}</p>
                          <p className="text-sm text-slate-500 flex items-center gap-1"><Phone size={12}/> {req.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1">
                          <Users size={12} /> {req.peopleCount} Kişi
                        </span>
                        <span className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-100">
                          Bekliyor
                        </span>
                      </div>

                      {req.notes && (
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-2.5 mb-3 text-xs text-amber-800 font-medium">
                          Not: {req.notes}
                        </div>
                      )}

                      {/* Aksiyon Butonları */}
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => { handleApproveRequest(req); sendApprovalWhatsApp(req); }}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02]"
                        >
                          <ThumbsUp size={14} /> Onayla & WA Gönder
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="px-4 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-xs font-black transition-all border border-red-100 hover:border-red-200"
                          title="Reddet"
                        >
                          <ThumbsDown size={14} />
                        </button>
                      </div>

                      {/* Sadece Onayla (WA göndermeden) */}
                      <button
                        onClick={() => handleApproveRequest(req)}
                        className="w-full mt-2 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-xl text-xs font-bold transition-colors"
                      >
                        Sadece Onayla (WA göndermeden)
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <Analytics />
    </div>
  );
}
