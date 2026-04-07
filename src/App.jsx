import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, Users, UtensilsCrossed, Armchair, Plus, Trash2, MoonStar, 
  ChefHat, Search, Edit2, X, Check, Loader2, Clock, CheckCircle, Phone, 
  Printer, MessageSquareText, MessageCircle, Map, Flame, BellRing, 
  MonitorPlay, Lock, ArrowRight, MapPin, Instagram, Wind, Coffee, 
  ChevronRight, Star, Inbox, CheckCircle2, AlertTriangle, History, MenuSquare,
  Image as ImageIcon, AlignLeft, DollarSign, UploadCloud, GripVertical
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// --- FIREBASE AYARLARI ---
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
const storage = getStorage(app);

// --- SABİTLER VE VERİLER ---
const WHATSAPP_NO = "905360170208";

const TABLE_MAP = [
  { id: 'B-3', top: '8%', left: '5%', width: '8%', height: '11%', type: 'v' }, { id: 'B-2', top: '8%', left: '17%', width: '8%', height: '11%', type: 'v' }, { id: 'B-1', top: '8%', left: '29%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-4', top: '23%', left: '5%', width: '8%', height: '11%', type: 'v' }, { id: 'B-5', top: '23%', left: '17%', width: '8%', height: '11%', type: 'v' }, { id: 'B-6', top: '23%', left: '29%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-9', top: '38%', left: '5%', width: '8%', height: '11%', type: 'v' }, { id: 'B-8', top: '38%', left: '17%', width: '8%', height: '11%', type: 'v' }, { id: 'B-7', top: '38%', left: '29%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-10', top: '53%', left: '5%', width: '13%', height: '6%', type: 'h' }, { id: 'B-11', top: '53%', left: '21%', width: '13%', height: '6%', type: 'h' },
  { id: 'B-12', top: '48%', left: '38%', width: '9%', height: '14%', type: 'lg-v' }, { id: 'B-24', top: '74%', left: '38%', width: '9%', height: '14%', type: 'lg-v' },
  { id: 'B-13', top: '8%', left: '76%', width: '9%', height: '14%', type: 'lg-v' }, { id: 'B-14', top: '26%', left: '76%', width: '9%', height: '14%', type: 'lg-v' },
  { id: 'B-20', top: '48%', left: '56%', width: '14%', height: '6%', type: 'h' }, { id: 'B-21', top: '61%', left: '56%', width: '14%', height: '6%', type: 'h' }, { id: 'B-22', top: '74%', left: '56%', width: '14%', height: '6%', type: 'h' }, { id: 'B-23', top: '87%', left: '56%', width: '14%', height: '6%', type: 'h' },
  { id: 'B-16', top: '46%', left: '80%', width: '9%', height: '12%', type: 'lg-v' }, { id: 'B-17', top: '60%', left: '80%', width: '9%', height: '12%', type: 'lg-v' }, { id: 'B-18', top: '74%', left: '80%', width: '9%', height: '12%', type: 'lg-v' }, { id: 'B-19', top: '88%', left: '80%', width: '9%', height: '12%', type: 'lg-v' },
];

const MATCH_FIXTURE = [
  { date: '2026-03-10', displayDate: '10 Mart 2026', team1: 'Galatasaray', team2: 'Liverpool' },
  { date: '2026-03-13', displayDate: '13 Mart 2026', team1: 'F. Karagümrük', team2: 'Fenerbahçe' },
  { date: '2026-03-14', displayDate: '14 Mart 2026', team1: 'Galatasaray', team2: 'Başakşehir' },
].sort((a, b) => new Date(a.date) - new Date(b.date));

const BASE_CATEGORIES = [
  { id: 'kahvalti', name: 'KAHVALTI', Icon: Coffee }, { id: 'tostlar', name: 'TOSTLAR', Icon: UtensilsCrossed },
  { id: 'wrap', name: 'WRAP & QUESADILLA', Icon: UtensilsCrossed }, { id: 'pizza', name: 'PİZZA', Icon: UtensilsCrossed },
  { id: 'burger', name: 'HAMBURGER', Icon: UtensilsCrossed }, { id: 'kofte', name: 'KÖFTE LEZZETLERİ', Icon: ChefHat },
  { id: 'tavuk', name: 'TAVUK LEZZETLERİ', Icon: ChefHat }, { id: 'et', name: 'ET LEZZETLERİ', Icon: ChefHat },
  { id: 'makarna', name: 'MAKARNA ÇEŞİTLERİ', Icon: UtensilsCrossed }, { id: 'salata', name: 'SALATA ÇEŞİTLERİ', Icon: UtensilsCrossed },
  { id: 'tatli', name: 'SALAŞ TATLI', Icon: Star }, { id: 'cay', name: 'ÇAYLAR', Icon: Coffee },
  { id: 'turk_kahvesi', name: 'TÜRK KAHVESİ', Icon: Coffee }, { id: 'sicak_kahve', name: 'SICAK KAHVELER', Icon: Coffee },
  { id: 'sicak_diger', name: 'SICAK ÇİKOLATA', Icon: Coffee }, { id: 'soguk_kahve', name: 'SOĞUK KAHVELER', Icon: Coffee },
  { id: 'kokteyl', name: 'KOKTEYLLER', Icon: Coffee }, { id: 'soguk_icecek', name: 'SOĞUK İÇECEKLER', Icon: Coffee },
  { id: 'nargile', name: 'NARGİLE ÇEŞİTLERİ', Icon: Wind }
];

const AVAILABLE_ICONS_MAP = { Coffee, UtensilsCrossed, ChefHat, Star, Wind, Flame, MoonStar, CheckCircle };

const BADGE_OPTIONS = [
  { id: 'iki_kisilik', label: 'İki Kişiliktir', icon: '👥' },
  { id: 'yeni', label: 'Yeni Çıkan', icon: '🆕' },
  { id: 'acili', label: 'Acılı', icon: '🌶️' },
  { id: 'sefin_onerisi', label: 'Şefin Önerisi', icon: '👨‍🍳' },
  { id: 'populer', label: 'En Çok Tercih Edilen', icon: '🔥' },
  { id: 'vegan', label: 'Vegan', icon: '🌿' }
];

const DEFAULT_MENU_GALLERY = [
  { id: '1', name: 'Salaaş Köy Kahvaltısı', image: '/salaskoy.jpg', tag: 'İmza Lezzet', isFeatured: true },
  { id: '2', name: 'Patron Kahvaltısı', image: '/patronkahvaltisi.jpg', tag: 'Özel', isFeatured: true },
  { id: '3', name: 'Ispanak Yatağında Tavuk', image: '/ıspanakyatagındatavuk.jpg', tag: 'Şefin Tavsiyesi', isFeatured: true },
  { id: '4', name: 'Etli Bowl Tabağı', image: '/etlibowltabagi.jpg', tag: 'Sağlıklı', isFeatured: true },
  { id: '5', name: 'Üç Renkli Tortellini', image: '/ucrenklitortellini.jpg', tag: 'Yeni', isFeatured: true },
];

const DEFAULT_MENU_ITEMS = [
  { cat: 'kahvalti', items: [{n:'Salaaş Köy Kahvaltısı', i:'/salaskoy.jpg', f:true, b:['sefin_onerisi'], o:1}, {n:'Patron Kahvaltısı', i:'/patronkahvaltisi.jpg', f:true, b:['iki_kisilik'], o:2}, {n:'Kahvaltı Tabağı', i:'/kahvaltitabagi.jpg', o:3}, {n:'Menemen', o:4}, {n:'Pankek', o:5}] },
  { cat: 'burger', items: [{n:'Mantarlı Fırın Burger', i:'/mantarlıfırınburger.jpg', b:['populer'], o:1}, {n:'Klasik Burger', o:2}, {n:'Cheeseburger', o:3}] },
  { cat: 'kofte', items: [{n:'Hünkar Köfte', i:'/hunkarkofte.jpg', b:['sefin_onerisi'], o:1}, {n:'Izgara Köfte', o:2}, {n:'Kaşarlı Köfte', o:3}] },
  { cat: 'tavuk', items: [{n:'Cafe de Paris Soslu Tavuk', i:'/cafedeparis.jpg', o:1}, {n:'Ispanak Yatağında Tavuk', i:'/ıspanakyatagındatavuk.jpg', f:true, o:2}, {n:'Köz Patlıcanlı Tavuk', i:'/közpatlıcanlıtavukbnfile.jpg', o:3}] },
  { cat: 'et', items: [{n:'Etli Bowl Tabağı', i:'/etlibowltabagi.jpg', f:true, o:1}, {n:'Dana Lokum', o:2}, {n:'Çoban Kavurma', o:3}] },
  { cat: 'makarna', items: [{n:'Üç Renkli Tortellini', i:'/ucrenklitortellini.jpg', f:true, o:1}, {n:'Cheddar Çıtır Makarna', i:'/chedarcitirmakarna.jpg', o:2}, {n:'Penne Arabiata', o:3}] },
  { cat: 'tatli', items: [{n:'Dubai Çikolatalı', i:'/dubai cikolatalı.jpg', b:['yeni', 'populer'], o:1}, {n:'Lotus Dome', i:'/lotus dome.jpg', o:2}, {n:'Profiterol', i:'/profiterol.jpg', o:3}] },
  { cat: 'kokteyl', items: [{n:'Cool Lime', i:'/coollime.jpg', o:1}, {n:'Mojito', o:2}, {n:'Pina Colada', o:3}] },
  { cat: 'soguk_kahve', items: [{n:'Ice Mocha', i:'/icemocha.jpg', o:1}, {n:'Ice Latte', o:2}] },
  { cat: 'sicak_kahve', items: [{n:'Caramel Macchiato', i:'/caramelmachiato.jpg', o:1}, {n:'Espresso', o:2}] }
];

const GLOBAL_CSS = `
#root { max-width: 100% !important; width: 100% !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; }
body, html { margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; overflow-x: hidden !important; background-color: #f8fafc !important; }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.shine-effect { position: relative; overflow: hidden; }
.shine-effect::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%); transform: skewX(-20deg); animation: shine 3s infinite; }
@keyframes shine { 100% { left: 125%; } }
`;

export default function App() {
  const getToday = () => {
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' });
    return formatter.format(new Date());
  };

  const typeLabels = { kahvalti: 'Kahvaltı', yemek: 'Yemek', dogum_gunu: 'Doğum Günü', organizasyon: 'Organizasyon', mac: 'Maç Yayını' };

  // --- STATE ---
  const [currentView, setCurrentView] = useState('landing');
  const [activeAdminTab, setActiveAdminTab] = useState('restoran');
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bulkMessage, setBulkMessage] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestData, setRequestData] = useState({ type: 'yemek', name: '', phone: '', peopleCount: 2, date: getToday(), notes: '' });
  const [requestError, setRequestError] = useState('');

  const [reservations, setReservations] = useState([]);
  const [matchReservations, setMatchReservations] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  
  const [menuItems, setMenuItems] = useState([]);
  const [dbCategories, setDbCategories] = useState([]); // Dinamik Kategoriler

  const [selectedFilterDate, setSelectedFilterDate] = useState(getToday());
  const [selectedMatchDate, setSelectedMatchDate] = useState(getToday());
  const [searchTerm, setSearchTerm] = useState('');
  const [matchSearchTerm, setMatchSearchTerm] = useState('');
  
  const [isEditing, setIsEditing] = useState(null);
  const [isMatchEditing, setIsMatchEditing] = useState(null);
  
  const initialFormState = { type: 'yemek', name: '', phone: '', notes: '', peopleCount: 1, table: '', date: getToday() };
  const [formData, setFormData] = useState(initialFormState);
  
  const initialMatchFormState = { type: 'mac', name: '', phone: '', notes: '', peopleCount: 1, table: '', date: getToday() };
  const [matchFormData, setMatchFormData] = useState(initialMatchFormState);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [matchErrorMsg, setMatchErrorMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [matchDeleteConfirmId, setMatchDeleteConfirmId] = useState(null);
  const [printSingleId, setPrintSingleId] = useState(null);
  const [showTableMap, setShowTableMap] = useState(false);

  const [historyDateFilter, setHistoryDateFilter] = useState(''); 
  const [historyTypeFilter, setHistoryTypeFilter] = useState('all'); 

  // --- MENÜ YÖNETİMİ STATE ---
  const [isMenuEditing, setIsMenuEditing] = useState(null);
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  const [menuFilterCategory, setMenuFilterCategory] = useState('all'); // Kategori Filtresi
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [draggedItem, setDraggedItem] = useState(null); // Drag & Drop State

  const initialMenuItemState = { category: 'kahvalti', name: '', price: '', description: '', image: '', isFeatured: false, order: '', badges: [], isSoldOut: false, prepTime: '', calories: '' };
  const [menuItemData, setMenuItemData] = useState(initialMenuItemState);
  const [menuErrorMsg, setMenuErrorMsg] = useState('');
  const [menuDeleteConfirmId, setMenuDeleteConfirmId] = useState(null);

  // --- ZİYARETÇİ EKRANI MODAL ---
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  // --- EFEKTLER ---
  useEffect(() => {
    document.title = "Salaaş Cafe Restaurant";
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleAfterPrint = () => setPrintSingleId(null);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  useEffect(() => {
    signInAnonymously(auth).catch((err) => console.error("Auth error:", err));
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const restoranUnsub = onSnapshot(collection(db, 'reservations'), (snapshot) => {
      setReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    
    const matchUnsub = onSnapshot(collection(db, 'matchReservations'), (snapshot) => {
      setMatchReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    
    const reqUnsub = onSnapshot(collection(db, 'reservationRequests'), (snapshot) => {
      const allReqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPendingRequests(
        allReqs.filter(r => r.status === 'pending').sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
      );
    });
    
    const menuUnsub = onSnapshot(collection(db, 'menuItems'), (snapshot) => {
      setMenuItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const catUnsub = onSnapshot(collection(db, 'menuCategories'), (snapshot) => {
      setDbCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    
    return () => { 
      restoranUnsub(); 
      matchUnsub(); 
      reqUnsub(); 
      menuUnsub(); 
      catUnsub();
    };
  }, [user]);

  // --- YARDIMCI FONKSİYONLAR ---
  const handleNavToMenu = () => {
    setCurrentView('menu');
    window.scrollTo(0, 0);
  };

  const handleNavToHome = () => {
    setCurrentView('landing');
    window.scrollTo(0, 0);
  };

  const handleScrollToId = (id) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const scrollToMenuCategory = (id) => {
    const el = document.getElementById(`cat-${id}`);
    if (el) { 
      const y = el.getBoundingClientRect().top + window.scrollY - 130; 
      window.scrollTo({ top: y, behavior: 'smooth' }); 
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUser === 'salaas' && loginPass === 'Salaas.2026') {
      setIsAuthenticated(true); 
      setShowLoginModal(false); 
      setLoginError('');
      setCurrentView('admin'); 
    } else { 
      setLoginError('Kullanıcı adı veya şifre hatalı!'); 
    }
  };

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequestError('');
    setRequestData(prev => ({ 
      ...prev, 
      [name]: name.includes('Count') ? (value === '' ? '' : parseInt(value, 10)) : value 
    }));
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!requestData.name?.trim() || !requestData.phone?.trim()) return;

    if ((requestData.type === 'dogum_gunu' || requestData.type === 'organizasyon') && (!requestData.notes || !requestData.notes.trim())) {
      setRequestError("Lütfen detaylı açıklama giriniz."); 
      return;
    }

    try {
      const submissionData = { 
        ...requestData, 
        phone: requestData.phone.trim(), 
        peopleCount: parseInt(requestData.peopleCount, 10) || 1, 
        status: 'pending', 
        createdAt: new Date().toISOString(), 
        createdBy: user.uid 
      };
      await addDoc(collection(db, 'reservationRequests'), submissionData);
      setRequestSuccess(true);
      setTimeout(() => { 
        setShowRequestModal(false); 
        setRequestSuccess(false); 
        setRequestData({ type: 'yemek', name: '', phone: '', peopleCount: 2, date: getToday(), notes: '' }); 
        setRequestError(''); 
      }, 3000);
    } catch (err) { 
      setRequestError("Hata oluştu."); 
    }
  };

  const handleApproveRequest = async (req, sendWhatsapp = false) => {
    if (!user) return;
    try {
      const targetCol = req.type === 'mac' ? 'matchReservations' : 'reservations';
      const newRes = { 
        type: req.type || 'yemek', 
        name: req.name, 
        phone: req.phone, 
        notes: req.notes || '', 
        peopleCount: req.peopleCount, 
        date: req.date, 
        table: '', 
        isArrived: false, 
        createdAt: new Date().toISOString(), 
        createdBy: user.uid 
      };
      await addDoc(collection(db, targetCol), newRes);
      await deleteDoc(doc(db, 'reservationRequests', req.id));
      if (sendWhatsapp) sendWhatsApp(newRes, req.type, true);
    } catch(err) { 
      console.error(err); 
    }
  };

  const handleRejectRequest = async (id) => {
    if (!user) return;
    try { await deleteDoc(doc(db, 'reservationRequests', id)); } catch(err) {}
  };

  const handleFormSubmit = async (e, isMac) => {
    e.preventDefault();
    if (!user) return;
    
    const currentForm = isMac ? matchFormData : formData;
    const currentEdit = isMac ? isMatchEditing : isEditing;
    const setFunc = isMac ? setMatchErrorMsg : setErrorMsg;
    const setForm = isMac ? setMatchFormData : setFormData;
    const initialForm = isMac ? { ...initialFormState, type: 'mac' } : initialFormState;
    const colName = isMac ? 'matchReservations' : 'reservations';

    if (!currentForm.name?.trim()) { 
      setFunc("İsim alanını doldurun."); 
      return; 
    }
    const cleanData = { 
      ...currentForm, 
      phone: currentForm.phone?.trim() || '', 
      notes: currentForm.notes?.trim() || '', 
      peopleCount: parseInt(currentForm.peopleCount, 10) || 1 
    };
    
    try {
      if (currentEdit) { 
        await updateDoc(doc(db, colName, currentEdit), { 
          ...cleanData, 
          updatedAt: new Date().toISOString() 
        }); 
        isMac ? setIsMatchEditing(null) : setIsEditing(null); 
      } else { 
        await addDoc(collection(db, colName), { 
          ...cleanData, 
          createdAt: new Date().toISOString(), 
          createdBy: user.uid, 
          isArrived: false 
        }); 
      }
      setForm({ ...initialForm, date: cleanData.date }); 
      setShowTableMap(false); 
      setFunc('');
    } catch (err) { 
      setFunc("Kayıt hatası."); 
    }
  };

  const handleEditClick = (res, isMac) => { 
    if(isMac) { 
      setMatchFormData({ ...res, phone: res.phone || '', notes: res.notes || '' }); 
      setIsMatchEditing(res.id); 
      setSelectedMatchDate(res.date); 
    } else { 
      setFormData({ ...res, phone: res.phone || '', notes: res.notes || '' }); 
      setIsEditing(res.id); 
      setSelectedFilterDate(res.date); 
    }
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };
  
  const cancelEdit = (isMac) => { 
    if(isMac) { 
      setIsMatchEditing(null); 
      setMatchFormData({ ...initialFormState, type: 'mac', date: selectedMatchDate }); 
      setMatchErrorMsg(''); 
    } else { 
      setIsEditing(null); 
      setFormData({ ...initialFormState, date: selectedFilterDate }); 
      setErrorMsg(''); 
    }
  };

  // --- MENÜ YÖNETİMİ FONKSİYONLARI ---
  const handleMenuChange = (e) => {
    const { name, value } = e.target;
    setMenuErrorMsg('');
    setMenuItemData(prev => ({ 
      ...prev, 
      [name]: name === 'order' ? (value === '' ? '' : parseInt(value, 10)) : value 
    }));
  };

  const handleBadgeChange = (badgeId) => {
    setMenuItemData(prev => {
      const hasBadge = prev.badges.includes(badgeId);
      if (hasBadge) {
        return { ...prev, badges: prev.badges.filter(b => b !== badgeId) };
      } else {
        if (prev.badges.length >= 2) {
          alert("Maksimum 2 adet ikon seçebilirsiniz.");
          return prev;
        }
        return { ...prev, badges: [...prev.badges, badgeId] };
      }
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    setMenuErrorMsg('');
    
    try {
      const storageRef = ref(storage, `menu_images/${Date.now()}_${file.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      setMenuItemData(prev => ({ ...prev, image: downloadURL }));
    } catch (error) {
      console.error(error);
      if (error.message && error.message.includes('CORS')) {
         setMenuErrorMsg("CORS Hatası: Lütfen Vercel rehberindeki Firebase CORS ayarlarını yapın.");
      } else {
         setMenuErrorMsg("Resim yüklenirken hata oluştu: " + error.message);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const removeMenuImage = () => {
    setMenuItemData(prev => ({ ...prev, image: '' }));
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!menuItemData.name?.trim()) { 
      setMenuErrorMsg("Ürün adı zorunludur."); 
      return; 
    }
    
    const dataToSave = {
      ...menuItemData,
      order: menuItemData.order === '' ? 999 : menuItemData.order
    };

    try {
      if (isMenuEditing) {
        await updateDoc(doc(db, 'menuItems', isMenuEditing), { 
          ...dataToSave, 
          updatedAt: new Date().toISOString() 
        });
        setIsMenuEditing(null);
      } else {
        await addDoc(collection(db, 'menuItems'), { 
          ...dataToSave, 
          createdAt: new Date().toISOString() 
        });
      }
      setMenuItemData(initialMenuItemState); 
      setMenuErrorMsg('');
    } catch (err) { 
      setMenuErrorMsg("Menü kaydedilirken hata oluştu."); 
    }
  };

  const duplicateMenuItem = (item) => {
    setMenuItemData({
       category: item.category, 
       name: `${item.name} (Kopya)`, 
       price: item.price || '', 
       description: item.description || '', 
       image: item.image || '', 
       isFeatured: item.isFeatured || false, 
       order: item.order || 999, 
       badges: item.badges || [],
       isSoldOut: false,
       prepTime: item.prepTime || '',
       calories: item.calories || ''
    });
    setIsMenuEditing(null);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const toggleSoldOut = async (item) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'menuItems', item.id), { isSoldOut: !item.isSoldOut });
    } catch(err) { console.error(err); }
  };

  const handleAddCategory = async () => {
    if (!user || !newCategoryName.trim()) return;
    try {
      const catId = newCategoryName.trim().toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
      await addDoc(collection(db, 'menuCategories'), {
        id: catId,
        name: newCategoryName.trim().toUpperCase(),
        iconString: 'UtensilsCrossed'
      });
      setShowCategoryModal(false);
      setNewCategoryName('');
      setMenuItemData(prev => ({...prev, category: catId}));
    } catch(err) { console.error(err); }
  };

  // --- DRAG AND DROP SIFIRLAMA (HTML5) ---
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetItem) => {
    e.preventDefault();
    if (!user || !draggedItem || draggedItem.id === targetItem.id) {
       setDraggedItem(null);
       return;
    }

    const o1 = draggedItem.order !== undefined && draggedItem.order !== '' ? draggedItem.order : 999;
    const o2 = targetItem.order !== undefined && targetItem.order !== '' ? targetItem.order : 999;
    
    let finalO1 = o2;
    let finalO2 = o1;
    if (o1 === o2) { finalO1 = o1 - 1; finalO2 = o2 + 1; }

    try {
      await updateDoc(doc(db, 'menuItems', draggedItem.id), { order: finalO1 });
      await updateDoc(doc(db, 'menuItems', targetItem.id), { order: finalO2 });
    } catch(err) { console.error(err); }

    setDraggedItem(null);
  };

  const importDefaultMenu = async () => {
    if (!user) return;
    if (window.confirm("Varsayılan menü veritabanına eklenecektir. Onaylıyor musunuz?")) {
      try {
        for (const cat of DEFAULT_MENU_ITEMS) {
          for (const item of cat.items) {
            await addDoc(collection(db, 'menuItems'), { 
              category: cat.cat, 
              name: item.n, 
              price: '', 
              description: '', 
              image: item.i || '', 
              isFeatured: item.f || false, 
              order: item.o || 999,
              badges: item.b || [],
              isSoldOut: false,
              prepTime: '',
              calories: '',
              createdAt: new Date().toISOString() 
            });
          }
        }
        alert("Menü başarıyla aktarıldı!");
      } catch (err) { 
        alert("Aktarım sırasında hata oluştu."); 
      }
    }
  };

  const handleToggleArrived = async (id, currentStatus, collectionName) => {
    if (!user) return; 
    await updateDoc(doc(db, collectionName, id), { isArrived: !currentStatus });
  };

  const executeDelete = async (id, colName) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, colName, id));
      if (colName === 'reservations') { 
        setDeleteConfirmId(null); 
        if (isEditing === id) cancelEdit(false); 
      } 
      else if (colName === 'matchReservations') { 
        setMatchDeleteConfirmId(null); 
        if (isMatchEditing === id) cancelEdit(true); 
      } 
      else if (colName === 'menuItems') { 
        setMenuDeleteConfirmId(null); 
        if (isMenuEditing === id) { setIsMenuEditing(null); setMenuItemData(initialMenuItemState); } 
      }
    } catch (err) {}
  };

  const sendWhatsApp = (res, type, isApproval = false) => {
    if (!res.phone) return;
    let cleanPhone = res.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '9' + cleanPhone;
    else if (cleanPhone.length === 10) cleanPhone = '90' + cleanPhone;
    
    const eventName = typeLabels[res.type] ? typeLabels[res.type].toLowerCase() : 'rezervasyon';
    const masaMetni = res.table ? `${res.table} nolu masanız için ` : '';
    
    let message = `Sayın ${res.name || 'Misafirimiz'},\nSalaaş Cafe'ye ${res.date} tarihindeki ${masaMetni}${res.peopleCount} kişilik ${eventName} rezervasyonunuz alınmıştır. Bizi tercih ettiğiniz için teşekkür ederiz.`;
    
    if (isApproval) {
      message = `Sayın ${res.name || 'Misafirimiz'},\nSalaaş Cafe'ye ${res.date} tarihi için oluşturduğunuz ${res.peopleCount} kişilik ${eventName} rezervasyon talebiniz ONAYLANMIŞTIR. Bizi tercih ettiğiniz için teşekkür ederiz.`;
    }
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const sendBulkWhatsApp = (reservationsList, type) => {
    if (!reservationsList || reservationsList.length === 0) { 
      setBulkMessage("Gönderilecek kayıt yok."); 
      setTimeout(() => setBulkMessage(''), 5000); 
      return; 
    }
    const validReservations = reservationsList.filter(res => res.phone && res.phone.trim().length >= 10);
    if (validReservations.length === 0) { 
      setBulkMessage("Geçerli telefon numarası yok."); 
      setTimeout(() => setBulkMessage(''), 5000); 
      return; 
    }
    
    const eventName = type === 'mac' ? 'maç yayını' : 'rezervasyonunuzu';
    const dateStr = type === 'mac' ? selectedMatchDate : selectedFilterDate;
    
    let phoneListStr = "";
    validReservations.forEach(res => {
        let cleanPhone = res.phone.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '9' + cleanPhone;
        else if (cleanPhone.length === 10) cleanPhone = '90' + cleanPhone;
        phoneListStr += cleanPhone + ",";
    });
    phoneListStr = phoneListStr.slice(0, -1);
    
    if(navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(phoneListStr).then(() => {
            setBulkMessage(`${validReservations.length} numara kopyalandı! Broadcast listenize yapıştırıp mesajı iletebilirsiniz.`);
            setTimeout(() => setBulkMessage(''), 6000);
        }).catch(err => { console.error(err); });
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return "SC";
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return "SC";
    return parts.length === 1 ? parts[0].substring(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // --- HESAPLAMALAR VE VİTRİN ---
  const ALL_CATEGORIES = [...BASE_CATEGORIES];
  dbCategories.forEach(dbC => {
    if (!ALL_CATEGORIES.find(c => c.id === dbC.id)) {
       ALL_CATEGORIES.push({ ...dbC, Icon: AVAILABLE_ICONS_MAP[dbC.iconString] || UtensilsCrossed });
    }
  });

  const activeMenuCategories = menuItems.length > 0 
    ? ALL_CATEGORIES.map(cat => ({ 
        ...cat, 
        items: menuItems
                 .filter(item => item.category === cat.id)
                 .sort((a,b) => (a.order || 999) - (b.order || 999) || a.name.localeCompare(b.name)) 
      })).filter(cat => cat.items.length > 0)
    : ALL_CATEGORIES.map(cat => {
        const defaultCat = DEFAULT_MENU_ITEMS.find(c => c.cat === cat.id);
        return { 
          ...cat, 
          items: defaultCat ? defaultCat.items.map(i => ({
            name: i.n, image: i.i || null, isFeatured: i.f || false, tag: i.t || null, price: null, description: null, order: i.o || 999, badges: i.b || [], isSoldOut: false, prepTime: '', calories: ''
          })).sort((a,b) => a.order - b.order) : [] 
        };
      }).filter(cat => cat.items.length > 0);

  const activeGallery = menuItems.length > 0 
    ? menuItems.filter(item => item.isFeatured).sort((a,b) => (a.order || 999) - (b.order || 999)) 
    : DEFAULT_MENU_GALLERY;

  const filteredReservations = reservations.filter(res => res.date === selectedFilterDate);
  const searchedReservations = filteredReservations.filter(res => !searchTerm || res.name?.toLowerCase().includes(searchTerm.toLowerCase()) || res.table?.toLowerCase().includes(searchTerm.toLowerCase()) || (res.phone && res.phone.includes(searchTerm)));
  const sortedReservations = [...searchedReservations].sort((a, b) => a.isArrived === b.isArrived ? new Date(b.createdAt) - new Date(a.createdAt) : (a.isArrived ? 1 : -1));
  const dailySummary = filteredReservations.reduce((acc, res) => { acc.totalPeople += (parseInt(res.peopleCount, 10) || 0); return acc; }, { totalPeople: 0 });

  const filteredMatchReservations = matchReservations.filter(res => res.date === selectedMatchDate);
  const searchedMatchReservations = filteredMatchReservations.filter(res => !matchSearchTerm || res.name?.toLowerCase().includes(matchSearchTerm.toLowerCase()) || res.table?.toLowerCase().includes(matchSearchTerm.toLowerCase()) || (res.phone && res.phone.includes(matchSearchTerm)));
  const sortedMatchReservations = [...searchedMatchReservations].sort((a, b) => a.isArrived === b.isArrived ? new Date(b.createdAt) - new Date(a.createdAt) : (a.isArrived ? 1 : -1));
  const totalMatchPeople = filteredMatchReservations.reduce((acc, res) => acc + (parseInt(res.peopleCount, 10) || 0), 0);

  const getTableStatus = (tableName) => {
    const res = filteredReservations.find(r => r.table?.trim().toUpperCase() === tableName.toUpperCase());
    if (!res) return 'empty';
    if (res.isArrived) return 'full';
    return 'reserved';
  };

  const handlePrintSingle = (id) => { 
    setPrintSingleId(id); 
    setTimeout(() => { window.print(); }, 150); 
  };

  const getHistoryData = () => {
    let allData = [];
    if (historyTypeFilter === 'all' || historyTypeFilter === 'restoran') {
        allData = [...allData, ...reservations.map(r => ({ ...r, eventType: typeLabels[r.type] || 'Genel' }))];
    }
    if (historyTypeFilter === 'all' || historyTypeFilter === 'mac') {
        allData = [...allData, ...matchReservations.map(r => ({ ...r, eventType: 'Maç' }))];
    }
    if (historyDateFilter) {
      allData = allData.filter(r => r.date === historyDateFilter);
    }
    allData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const totalPeople = allData.reduce((acc, curr) => acc + (parseInt(curr.peopleCount, 10) || 0), 0);
    const totalArrived = allData.filter(r => r.isArrived).reduce((acc, curr) => acc + (parseInt(curr.peopleCount, 10) || 0), 0);
    const arrivalRate = totalPeople > 0 ? Math.round((totalArrived * 100) / (totalPeople || 1)) : 0;
    
    return { list: allData, totalPeople, totalArrived, arrivalRate };
  };

  const historyStats = getHistoryData();

  // --- RENDER MODÜLLERİ (YARDIMCI COMPONENTLER) ---
  const renderNavbar = (isDark = false) => (
    <div className={`fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none`}>
      <nav className={`w-full pointer-events-auto transition-all duration-500 ${isScrolled || isDark ? 'bg-black/90 backdrop-blur-md shadow-md py-3 border-b border-white/10' : 'bg-transparent py-5 sm:py-6'}`}>
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-24 flex items-center justify-between">
          <div className={`transition-all duration-500 cursor-pointer flex items-center justify-center shrink-0 ${isScrolled || isDark ? 'h-10 sm:h-12' : 'h-12 sm:h-16'}`} onClick={handleNavToHome}>
            <img src="/salaaslogobg.png" alt="Salaaş Logo" className={`h-full w-auto object-contain ${isDark ? 'filter drop-shadow-md brightness-200' : ''}`} />
          </div>
          
          <div className={`hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-12 font-bold text-sm xl:text-base transition-colors duration-500 ${isScrolled ? (isDark ? 'text-slate-300' : 'text-slate-700') : 'text-white drop-shadow-md'}`}>
            <button onClick={() => handleScrollToId('hakkimizda')} className="hover:text-orange-500 transition-colors">Biz Kimiz?</button>
            <button onClick={() => handleScrollToId('lezzetler')} className="hover:text-orange-500 transition-colors">Lezzetler</button>
            <button onClick={() => handleScrollToId('iletisim')} className="hover:text-orange-500 transition-colors">İletişim</button>
          </div>
          
          <div className="shrink-0 flex items-center justify-end gap-3 sm:gap-4">
            <button 
              onClick={() => setShowRequestModal(true)} 
              className={`hidden sm:flex items-center gap-2 px-4 py-2.5 xl:px-6 xl:py-3 rounded-full text-xs xl:text-sm font-bold tracking-widest uppercase transition-all shadow-md ${isScrolled && !isDark ? 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50' : 'bg-emerald-700/80 backdrop-blur-sm text-white hover:bg-emerald-600 border border-emerald-500/50'}`}
            >
              <CalendarDays size={16} /> Rezervasyon
            </button>
            <button 
              onClick={handleNavToMenu} 
              className="shine-effect bg-black/80 text-[#FBE18D] border border-[#FBE18D]/30 px-5 py-2.5 sm:px-6 sm:py-3 xl:px-8 xl:py-3.5 rounded-full text-xs sm:text-sm font-black tracking-widest uppercase hover:bg-black hover:border-[#FBE18D] hover:scale-105 transition-all shadow-lg whitespace-nowrap flex items-center gap-2"
            >
              <MenuSquare size={16} /> Dijital Menü
            </button>
          </div>
        </div>
      </nav>
    </div>
  );

  const renderFooter = () => (
    <footer id="iletisim" className="w-full bg-slate-950 text-slate-400 py-20 lg:py-24 relative z-10 border-t border-slate-800">
      <div className="w-full mx-auto px-6 sm:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img src="/salaaslogobg.png" alt="Salaaş Logo" className="h-24 lg:h-32 object-contain mb-8 opacity-90" />
          <p className="text-base lg:text-lg leading-relaxed mb-6 max-w-sm font-medium text-slate-300">
            Şehrin kalbinde, lezzet ve muhabbetin kesişme noktası. Sizi ağırlamaktan mutluluk duyarız.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-white font-black uppercase tracking-widest mb-8 text-lg lg:text-xl">İletişim</h4>
          <ul className="space-y-6 text-base lg:text-lg font-medium text-slate-300">
            <li>
               <div className="flex flex-col items-center md:items-start gap-2">
                 <div className="flex items-center justify-center md:justify-start gap-3">
                    <MapPin size={20} className="text-orange-500 shrink-0"/> 
                    <span className="text-white font-bold">📍 Harita</span>
                 </div>
                 <p className="ml-0 md:ml-8 text-slate-400">Gebze, Kocaeli</p>
                 <a 
                   href="https://www.google.com/maps/dir/?api=1&destination=Salaaş+Cafe+Restaurant+Gebze" 
                   target="_blank" 
                   rel="noreferrer" 
                   className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-md mt-1 ml-0 md:ml-8 border border-slate-700 w-max"
                 >
                    Yol Tarifi Al <ArrowRight size={16}/>
                 </a>
               </div>
            </li>
            <li>
               <a href={`tel:+${WHATSAPP_NO}`} className="hover:text-orange-400 transition-colors flex items-center justify-center md:justify-start gap-3">
                 <Phone size={20} className="text-orange-500 shrink-0"/> 
                 <span className="text-white font-bold">📞 Telefon</span>
                 <span className="ml-2">0536 017 02 08</span>
               </a>
            </li>
            <li>
               <a href="https://www.instagram.com/salascaferestaurant/" target="_blank" rel="noreferrer" className="hover:text-pink-500 transition-colors flex items-center justify-center md:justify-start gap-3">
                 <Instagram size={20} className="text-pink-500 shrink-0"/> 
                 <span className="text-white font-bold">📸 Instagram</span>
                 <span className="ml-2">@salascaferestaurant</span>
               </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-white font-black uppercase tracking-widest mb-8 text-lg lg:text-xl">Hızlı Bağlantılar</h4>
          <ul className="space-y-5 text-base lg:text-lg font-medium mb-10 text-slate-300">
            <li>
              <button 
                onClick={handleNavToMenu} 
                className="hover:text-white transition-colors flex items-center justify-center md:justify-start gap-3"
              >
                <ChevronRight size={18} className="text-orange-500"/> Dijital Menü
              </button>
            </li>
          </ul>
          
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
  );

  const renderModals = () => (
    <>
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-emerald-700 p-6 sm:p-8 flex items-center justify-between text-white shrink-0 z-10">
              <h3 className="font-black tracking-wide flex items-center gap-3 text-xl lg:text-2xl"><CalendarDays size={28} className="text-emerald-300"/> Rezervasyon Talebi</h3>
              <button onClick={() => setShowRequestModal(false)} className="p-3 hover:bg-white/20 rounded-2xl transition-colors"><X size={28}/></button>
            </div>
            
            <div className="overflow-y-auto bg-white flex-1 relative">
              {requestSuccess ? (
                 <div className="p-16 flex flex-col items-center justify-center text-center space-y-6 h-full min-h-[400px]">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4"><CheckCircle2 size={48} /></div>
                    <h3 className="text-3xl font-black text-slate-800">Talebiniz Alındı!</h3>
                    <p className="text-lg text-slate-500">Rezervasyon talebiniz işletmemize başarıyla iletilmiştir. En kısa sürede sizinle iletişime geçip onay verilecektir.</p>
                 </div>
              ) : (
                <form onSubmit={submitRequest} className="p-8 sm:p-10 space-y-6">
                  {requestError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
                      <AlertTriangle size={20} className="shrink-0" /> {requestError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Rezervasyon Türü</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <button type="button" onClick={() => setRequestData({...requestData, type: 'kahvalti'})} className={`py-3.5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all flex items-center justify-center gap-2 ${requestData.type === 'kahvalti' ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md' : 'border-slate-200 text-slate-500 hover:border-orange-200 bg-white'}`}>
                           <Coffee size={18}/> Kahvaltı
                        </button>
                        <button type="button" onClick={() => setRequestData({...requestData, type: 'yemek'})} className={`py-3.5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all flex items-center justify-center gap-2 ${requestData.type === 'yemek' ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md' : 'border-slate-200 text-slate-500 hover:border-orange-200 bg-white'}`}>
                           <UtensilsCrossed size={18}/> Yemek
                        </button>
                        <button type="button" onClick={() => setRequestData({...requestData, type: 'mac'})} className={`py-3.5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all flex items-center justify-center gap-2 ${requestData.type === 'mac' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' : 'border-slate-200 text-slate-500 hover:border-blue-200 bg-white'}`}>
                           <MonitorPlay size={18}/> Maç
                        </button>
                        <button type="button" onClick={() => setRequestData({...requestData, type: 'dogum_gunu'})} className={`py-3.5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all flex items-center justify-center gap-2 ${requestData.type === 'dogum_gunu' ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md' : 'border-slate-200 text-slate-500 hover:border-purple-200 bg-white'}`}>
                           <Star size={18}/> Doğum Günü
                        </button>
                        <button type="button" onClick={() => setRequestData({...requestData, type: 'organizasyon'})} className={`py-3.5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all flex items-center justify-center gap-2 md:col-span-2 ${requestData.type === 'organizasyon' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md' : 'border-slate-200 text-slate-500 hover:border-emerald-200 bg-white'}`}>
                           <Users size={18}/> Organizasyon
                        </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex-[2]">
                      <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Ad Soyad</label>
                      <input type="text" name="name" value={requestData.name} onChange={handleRequestChange} className="w-full bg-white px-5 py-4 rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-slate-800 transition-all text-lg" required placeholder="Adınız Soyadınız" />
                    </div>
                    <div className="flex-[1]">
                      <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Kişi Sayısı</label>
                      <input type="number" name="peopleCount" min="1" value={requestData.peopleCount} onChange={handleRequestChange} className="w-full bg-white px-5 py-4 rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-slate-800 transition-all text-center text-lg" required />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5">
                     <div className="flex-1">
                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Telefon</label>
                        <input type="tel" name="phone" value={requestData.phone} onChange={handleRequestChange} className="w-full bg-white px-5 py-4 rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-slate-800 transition-all text-lg" required placeholder="05XX..." />
                     </div>
                     <div className="flex-1">
                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Tarih</label>
                        <input type="date" name="date" value={requestData.date} onChange={handleRequestChange} className="w-full bg-white px-5 py-4 rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-slate-800 transition-all text-lg" required />
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                      {(requestData.type === 'dogum_gunu' || requestData.type === 'organizasyon') ? 'Detaylı Açıklama (Zorunlu)' : 'Notunuz (İsteğe Bağlı)'}
                    </label>
                    <textarea name="notes" value={requestData.notes} onChange={handleRequestChange} rows="3" required={(requestData.type === 'dogum_gunu' || requestData.type === 'organizasyon')} className="w-full bg-white px-5 py-4 rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-medium text-slate-800 transition-all resize-none text-base" placeholder="Özel isteklerinizi yazın."></textarea>
                  </div>

                  <button type="submit" className="w-full text-white font-black tracking-widest uppercase py-5 rounded-2xl transition-all shadow-lg hover:shadow-xl mt-4 flex items-center justify-center gap-3 hover:-translate-y-1 text-lg bg-emerald-600 hover:bg-emerald-700">
                    Talebi Gönder <ArrowRight size={24} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-[#0B3B2C] p-6 sm:p-8 flex items-center justify-between text-white">
              <h3 className="font-black tracking-wide flex items-center gap-2 sm:gap-3 text-lg sm:text-xl"><Lock size={20} className="text-orange-400"/> Sistem Girişi</h3>
              <button onClick={() => {setShowLoginModal(false); setLoginError('');}} className="p-2 sm:p-3 hover:bg-white/20 rounded-xl transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4 sm:space-y-6 bg-white">
              {loginError && (
                <div className="bg-red-50 text-red-600 text-sm font-bold p-3 sm:p-4 rounded-xl border border-red-100 flex items-center gap-2">
                  <X size={16}/> {loginError}
                </div>
              )}
              
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Kullanıcı Adı</label>
                <input type="text" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-[#0B3B2C]/10 focus:border-[#0B3B2C] outline-none bg-slate-50 font-bold text-slate-800 transition-all text-base sm:text-lg" placeholder="Kullanıcı adınızı girin" autoFocus />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Şifre</label>
                <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-[#0B3B2C]/10 focus:border-[#0B3B2C] outline-none bg-slate-50 font-bold text-slate-800 transition-all text-base sm:text-lg" placeholder="••••••••" />
              </div>
              
              <button type="submit" className="w-full bg-[#0B3B2C] hover:bg-emerald-900 text-white font-black tracking-widest uppercase py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-xl mt-4 sm:mt-6 flex items-center justify-center gap-2 sm:gap-3 hover:-translate-y-0.5 text-base sm:text-lg">
                Giriş Yap <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAYLI ÜRÜN MODALI */}
      {selectedMenuItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111] rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg overflow-hidden flex flex-col relative border border-white/10 animate-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedMenuItem(null)} className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
            
            <div className="w-full bg-[#1a1a1a] relative flex justify-center items-center border-b border-white/10">
              {selectedMenuItem.image ? (
                 <img src={selectedMenuItem.image} alt={selectedMenuItem.name} className={`w-full h-auto max-h-[45vh] object-contain ${selectedMenuItem.isSoldOut ? 'opacity-40 grayscale' : ''}`} />
              ) : (
                 <div className="w-full h-48 flex items-center justify-center text-slate-500"><ImageIcon size={48} /></div>
              )}
              {selectedMenuItem.isSoldOut && (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-red-600/90 text-white px-6 py-2 rounded-xl font-black text-xl tracking-widest uppercase rotate-[-10deg] shadow-2xl border-2 border-red-400">TÜKENDİ</span>
                 </div>
              )}
            </div>
            
            <div className="p-6 sm:p-8 flex flex-col gap-4">
               <div className="flex justify-between items-start gap-4">
                  <h3 className={`text-2xl font-serif font-black leading-tight ${selectedMenuItem.isSoldOut ? 'text-slate-500' : 'text-white'}`}>{selectedMenuItem.name}</h3>
                  {selectedMenuItem.price && <span className={`text-xl font-black whitespace-nowrap ${selectedMenuItem.isSoldOut ? 'text-slate-600' : 'text-orange-500'}`}>{selectedMenuItem.price} TL</span>}
               </div>
               
               {(selectedMenuItem.badges?.length > 0 || selectedMenuItem.prepTime || selectedMenuItem.calories) && (
                 <div className="flex flex-wrap gap-2 items-center border-b border-white/10 pb-4">
                   {selectedMenuItem.badges?.map(b => {
                     const badgeDef = BADGE_OPTIONS.find(opt => opt.id === b);
                     return badgeDef ? (
                       <span key={b} className={`bg-white/10 text-slate-300 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-white/5 ${selectedMenuItem.isSoldOut ? 'opacity-50' : ''}`}>
                         <span>{badgeDef.icon}</span> {badgeDef.label}
                       </span>
                     ) : null;
                   })}
                   {selectedMenuItem.prepTime && <span className="flex items-center gap-1 text-slate-400 text-sm ml-2"><Clock size={14}/> {selectedMenuItem.prepTime}</span>}
                   {selectedMenuItem.calories && <span className="flex items-center gap-1 text-slate-400 text-sm ml-2"><Flame size={14}/> {selectedMenuItem.calories}</span>}
                 </div>
               )}
               
               {selectedMenuItem.description && (
                 <p className={`text-sm leading-relaxed ${selectedMenuItem.isSoldOut ? 'text-slate-600' : 'text-slate-400'}`}>
                   {selectedMenuItem.description}
                 </p>
               )}
               
               <button onClick={() => setSelectedMenuItem(null)} className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-black py-3 sm:py-4 rounded-xl transition-colors uppercase tracking-widest text-sm">
                 Kapat
               </button>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6">
              <h3 className="font-black text-lg mb-4 text-slate-800">Yeni Kategori Ekle</h3>
              <input type="text" placeholder="Örn: Tatlılar" value={newCategoryName} onChange={(e)=>setNewCategoryName(e.target.value)} className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-[#8b5cf6] outline-none font-bold mb-6" autoFocus />
              <div className="flex gap-3">
                 <button onClick={()=>setShowCategoryModal(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">İptal</button>
                 <button onClick={handleAddCategory} className="flex-1 py-3 bg-[#8b5cf6] text-white font-bold rounded-xl shadow-md hover:bg-[#7c3aed] transition-colors">Ekle</button>
              </div>
           </div>
        </div>
      )}
    </>
  );

  // --- SAYFA RENDER: VİTRİN ---
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 relative flex flex-col scroll-smooth w-full overflow-x-hidden">
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        {renderNavbar(false)}

        <header className="relative w-full min-h-[500px] h-[75vh] lg:h-[85vh] max-h-[1000px] bg-slate-900 flex items-center justify-center overflow-hidden pt-16">
           <div className="absolute inset-0 z-0">
             <img src="/salaasarkaplan.jpeg" alt="Salaaş Cafe Arka Plan" className="w-full h-full object-cover opacity-50 scale-105 object-center" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent w-full"></div>
           </div>
           
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
                 <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full shadow-xl">
                   <Coffee size={20} className="text-orange-400"/> Kahvaltı
                 </span>
                 <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full shadow-xl">
                   <UtensilsCrossed size={20} className="text-orange-400"/> Izgara
                 </span>
                 <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full shadow-xl">
                   <Wind size={20} className="text-orange-400"/> Nargile
                 </span>
              </div>
           </div>
           
           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce cursor-pointer z-20" onClick={() => handleScrollToId('hakkimizda')}>
              <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold block mb-2 opacity-70 text-center">Keşfet</span>
              <div className="w-6 h-10 lg:w-8 lg:h-12 border-2 border-white/30 rounded-full flex justify-center p-1 mx-auto">
                <div className="w-1 h-2 lg:h-3 bg-white/60 rounded-full"></div>
              </div>
           </div>
        </header>

        <main className="w-full relative z-10 flex-1 flex flex-col">
          <section id="hakkimizda" className="w-full mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 py-20 md:py-32 text-center bg-white">
            <div className="animate-float inline-block mb-6">
              <MoonStar size={56} className="text-orange-400 opacity-80" />
            </div>
            <h2 className="text-sm lg:text-base font-black tracking-[0.3em] text-orange-500 uppercase mb-4">Hikayemiz</h2>
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-[#0B3B2C] mb-8">Sıcak, Samimi ve Lezzetli</h3>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 leading-relaxed font-light max-w-5xl mx-auto">
              Salaaş Cafe Restaurant olarak, misafirlerimize kendilerini evlerinde hissedecekleri sıcak bir ortam sunuyoruz. Özenle seçilmiş malzemelerle hazırladığımız zengin menümüz, imza ızgaralarımız, serpme kahvaltımız ve keyifli nargile köşemizle günün her saatinde kaliteli bir deneyim yaşatmayı hedefliyoruz.
            </p>
            <div className="w-24 lg:w-32 h-1.5 lg:h-2 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto mt-12 lg:mt-16 rounded-full"></div>
          </section>

          <section id="lezzetler" className="w-full py-20 md:py-32 border-y border-slate-200/50 bg-slate-50">
            <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-24">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
                <div>
                  <h2 className="text-sm lg:text-base font-black tracking-[0.3em] text-orange-500 uppercase mb-2">Vitrinimiz</h2>
                  <h3 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-[#0B3B2C]">Bunu Denediniz mi?</h3>
                </div>
                <button 
                  onClick={handleNavToMenu} 
                  className="flex items-center gap-2 text-sm lg:text-base font-bold text-slate-500 hover:text-orange-600 transition-all uppercase tracking-widest group"
                >
                  Tüm Menüyü Gör 
                  <div className="bg-orange-100 p-2 lg:p-3 rounded-full group-hover:bg-orange-200 transition-colors">
                    <ChevronRight size={18} className="text-orange-600"/>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-10">
                {activeGallery.slice(0, 4).map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedMenuItem(item)} 
                    className="lg:col-span-2 sm:col-span-2 rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 transition-all duration-500 relative group h-80 sm:h-96 md:h-[450px] cursor-pointer border border-slate-100 bg-white"
                  >
                    <img src={item.image} alt={item.name} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${item.isSoldOut ? 'opacity-40 grayscale' : ''}`} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent flex flex-col justify-end p-8 lg:p-10">
                       <span className={`text-white text-xs lg:text-sm font-black uppercase tracking-widest px-4 py-1.5 lg:px-5 lg:py-2 rounded-full w-max mb-4 lg:mb-6 flex items-center gap-1.5 shadow-lg ${item.isSoldOut ? 'bg-red-500' : 'bg-orange-500'}`}>
                         {item.isSoldOut ? 'TÜKENDİ' : <><Star size={16}/> {item.tag || 'Öne Çıkan'}</>}
                       </span>
                       <h4 className="text-white font-serif font-black text-4xl lg:text-5xl drop-shadow-md mb-3">{item.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full py-28 md:py-36 bg-emerald-950 text-white relative overflow-hidden">
             <div className="absolute inset-0 opacity-5 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #FBE18D 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
             <div className="absolute -right-20 -top-20 opacity-10 text-emerald-500 hidden md:block"><Star size={500}/></div>
             
             <div className="w-full mx-auto px-4 sm:px-8 lg:px-16 text-center relative z-10">
               <h2 className="text-base lg:text-lg font-black tracking-[0.4em] text-emerald-400 uppercase mb-6">Davet & Organizasyon</h2>
               <h3 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-black mb-10 drop-shadow-lg text-white">Özel Günleriniz İçin Yanınızdayız</h3>
               <p className="text-lg sm:text-xl lg:text-3xl text-emerald-100 font-light mb-16 max-w-4xl mx-auto leading-relaxed">
                 Doğum günü partileri, şirket yemekleri, toplu iftarlar ve tüm özel kutlamalarınız için 300 kişilik kapasitemiz ve size özel menülerimizle hizmetinizdeyiz.
               </p>
               <button 
                 onClick={() => {setRequestData({...requestData, type: 'organizasyon'}); setShowRequestModal(true);}} 
                 className="shine-effect inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-5 lg:px-14 lg:py-6 rounded-full font-black uppercase tracking-widest transition-transform hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.4)] text-base lg:text-xl border border-emerald-400"
               >
                 <CalendarDays size={24}/> Organizasyon Talebi
               </button>
             </div>
          </section>

        </main>

        {renderFooter()}
        {renderModals()}
      </div>
    );
  }

  // --- SAYFA RENDER: DİJİTAL MENÜ ---
  if (currentView === 'menu') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] font-sans text-slate-200 relative w-full overflow-x-hidden">
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        {renderNavbar(true)}
        
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #FBE18D 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="sticky top-[73px] sm:top-[81px] z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl mt-[73px] sm:mt-[81px]">
           <div className="w-full mx-auto px-4 sm:px-8 flex overflow-x-auto gap-3 sm:gap-4 hide-scrollbar">
              {activeMenuCategories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => scrollToMenuCategory(cat.id)} 
                    className="whitespace-nowrap px-4 py-2 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-orange-400 hover:border-orange-500 hover:bg-orange-500/10 transition-all uppercase text-xs font-bold tracking-widest"
                  >
                      {cat.name}
                  </button>
              ))}
           </div>
        </div>

        <main className="w-full mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 py-12 md:py-20 relative z-10">
           {activeGallery.length > 0 && (
             <div className="mb-24">
                <div className="text-center mb-16">
                   <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-500 mb-4 drop-shadow-lg">Öne Çıkanlar</h1>
                   <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">En çok tercih edilen imza lezzetlerimiz.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-10">
                   {activeGallery.map((item, idx) => (
                      <div key={item.id || idx} onClick={() => setSelectedMenuItem(item)} className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all duration-500 group relative shadow-2xl h-80 md:h-96 cursor-pointer">
                         <img src={item.image} alt={item.name} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${item.isSoldOut ? 'opacity-30 grayscale' : 'opacity-80 group-hover:opacity-100'}`} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 lg:p-8">
                            {item.isSoldOut ? (
                               <span className="bg-red-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full w-max mb-3 flex items-center gap-1.5 shadow-lg">TÜKENDİ</span>
                            ) : item.tag && (
                               <span className="bg-orange-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full w-max mb-3 flex items-center gap-1.5 shadow-lg"><Star size={14}/> {item.tag}</span>
                            )}
                            <h3 className={`text-xl sm:text-2xl font-serif font-black tracking-wide drop-shadow-md ${item.isSoldOut ? 'text-slate-400' : 'text-white'}`}>{item.name}</h3>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           )}

           <div className="space-y-20">
              {activeMenuCategories.map(cat => {
                 const CatIcon = cat.Icon || UtensilsCrossed;
                 return (
                   <div id={`cat-${cat.id}`} key={cat.id} className="scroll-mt-44">
                      <div className="flex items-center gap-4 mb-8">
                         <div className="bg-gradient-to-br from-orange-500 to-yellow-600 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] shrink-0">
                           <CatIcon size={20} />
                         </div>
                         <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-wide">{cat.name}</h2>
                         <div className="h-[1px] flex-1 bg-gradient-to-r from-orange-500/50 to-transparent ml-4"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                         {cat.items.map((itemObj, idx) => {
                           if(itemObj.image) {
                             return (
                                <div key={idx} onClick={() => setSelectedMenuItem(itemObj)} className={`bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 group shadow-lg flex flex-col h-full min-h-[220px] cursor-pointer relative ${itemObj.isSoldOut ? 'opacity-60 grayscale' : ''}`}>
                                   {itemObj.badges && itemObj.badges.length > 0 && (
                                     <div className="absolute top-2 left-2 z-10 flex gap-1">
                                       {itemObj.badges.map(b => {
                                          const def = BADGE_OPTIONS.find(o=>o.id===b);
                                          return def ? <span key={b} className="bg-white/90 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">{def.icon}</span> : null;
                                       })}
                                     </div>
                                   )}
                                   {itemObj.isSoldOut && <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-widest">Tükendi</div>}
                                   <div className="relative w-full h-40 sm:h-48 bg-[#0a0a0a] flex items-center justify-center overflow-hidden shrink-0">
                                      <img src={itemObj.image} alt={itemObj.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 p-2" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                   </div>
                                   <div className="p-5 flex flex-col justify-between bg-[#111] grow">
                                      <div>
                                        <div className="flex justify-between items-start gap-4 mb-2"><span className="text-white font-bold text-sm sm:text-base tracking-wide leading-snug">{itemObj.name}</span>{itemObj.price && <span className="text-orange-400 font-black whitespace-nowrap text-sm">{itemObj.price} TL</span>}</div>
                                        {itemObj.description && <p className="text-slate-400 text-xs line-clamp-2 mb-3">{itemObj.description}</p>}
                                      </div>
                                      <div className="w-full flex justify-end mt-auto"><div className="w-1.5 h-1.5 rounded-full bg-orange-500/50 group-hover:bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0)] group-hover:shadow-[0_0_8px_rgba(249,115,22,0.8)] transition-all"></div></div>
                                   </div>
                                </div>
                             );
                           } else {
                             return (
                                <div key={idx} onClick={() => setSelectedMenuItem(itemObj)} className={`bg-[#111] border border-white/5 rounded-2xl p-5 flex flex-col justify-between group hover:border-orange-500/30 hover:bg-[#161616] transition-all h-full min-h-[90px] cursor-pointer relative ${itemObj.isSoldOut ? 'opacity-60 grayscale' : ''}`}>
                                   {itemObj.isSoldOut && <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-widest">Tükendi</div>}
                                   {itemObj.badges && itemObj.badges.length > 0 && (
                                     <div className="flex gap-1 mb-2">
                                       {itemObj.badges.map(b => {
                                          const def = BADGE_OPTIONS.find(o=>o.id===b);
                                          return def ? <span key={b} className="bg-white/10 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/5">{def.icon}</span> : null;
                                       })}
                                     </div>
                                   )}
                                   <div className="flex justify-between items-start gap-4">
                                     <span className="text-slate-300 font-medium group-hover:text-white transition-colors leading-snug text-sm sm:text-base">{itemObj.name}</span>
                                     {itemObj.price && <span className="text-orange-400 font-black whitespace-nowrap text-sm">{itemObj.price} TL</span>}
                                   </div>
                                   {itemObj.description && <p className="text-slate-500 text-xs mt-2 line-clamp-2">{itemObj.description}</p>}
                                </div>
                             );
                           }
                         })}
                      </div>
                   </div>
                 );
              })}
           </div>
           
           <div className="mt-24 text-center flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="https://m.1menu.com.tr/salaascafe/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest transition-transform hover:scale-105 shadow-[0_0_30px_rgba(249,115,22,0.4)] text-base lg:text-lg">
                Fiyatlı Dijital Menüye Git <ArrowRight size={20} />
              </a>
           </div>
        </main>
        {renderFooter()}
        {renderModals()}
      </div>
    );
  }

  // --- SAYFA RENDER: ADMİN PANELİ ---
  return (
    <div className={`min-h-screen font-sans text-slate-800 pb-12 print:bg-white print:pb-0 relative transition-colors duration-500 w-full overflow-x-hidden ${activeAdminTab === 'restoran' || activeAdminTab === 'menu' ? 'bg-slate-50' : (activeAdminTab === 'mac' ? 'bg-[#f0f4f8]' : 'bg-slate-100')}`}>
      {bulkMessage && <div className="fixed top-24 right-4 sm:right-10 z-[100] bg-slate-800 text-white p-4 sm:p-5 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm border border-slate-700 animate-in slide-in-from-right-8 duration-300"><CheckCircle size={24} className="text-emerald-400 shrink-0" /><p className="font-bold text-sm sm:text-base leading-snug">{bulkMessage}</p><button onClick={() => setBulkMessage('')} className="ml-auto text-slate-400 hover:text-white bg-slate-700 p-1.5 rounded-lg transition-colors shrink-0"><X size={18} /></button></div>}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }}></style>

      <header className={`${activeAdminTab === 'restoran' || activeAdminTab === 'menu' ? 'bg-[#0B3B2C]' : activeAdminTab === 'mac' ? 'bg-[#0a192f]' : 'bg-slate-900'} text-white shadow-lg sticky z-20 print:hidden transition-colors duration-500 w-full top-0`}>
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-20 py-3 sm:py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full lg:w-auto gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 sm:h-12 shrink-0 flex items-center justify-center overflow-visible drop-shadow-md bg-transparent cursor-pointer" onClick={() => setCurrentView('landing')}>
                <img src="/salaaslogobg.png" alt="Salaaş Cafe Logo" className="h-full w-auto object-contain bg-transparent" />
              </div>
              <div className="hidden sm:block"><h1 className={`text-base md:text-lg lg:text-xl font-black tracking-wide text-transparent bg-clip-text font-serif ${activeAdminTab === 'restoran' || activeAdminTab === 'menu' ? 'bg-gradient-to-r from-orange-400 to-yellow-300' : activeAdminTab === 'mac' ? 'bg-gradient-to-r from-blue-400 to-cyan-300' : 'bg-gradient-to-r from-slate-200 to-white'}`}>Yönetim Paneli</h1></div>
            </div>
            <div className="flex items-center bg-black/40 p-1.5 rounded-xl border border-white/10 shadow-inner ml-2 sm:ml-0 overflow-x-auto">
              <button onClick={() => setActiveAdminTab('restoran')} className={`px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg text-xs lg:text-sm font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activeAdminTab === 'restoran' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}><UtensilsCrossed size={16}/> RESTORAN</button>
              <button onClick={() => setActiveAdminTab('mac')} className={`px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg text-xs lg:text-sm font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activeAdminTab === 'mac' ? 'bg-blue-600 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}><MonitorPlay size={16}/> MAÇ</button>
              <button onClick={() => setActiveAdminTab('menu')} className={`px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg text-xs lg:text-sm font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activeAdminTab === 'menu' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}><MenuSquare size={16}/> MENÜ</button>
              <button onClick={() => setActiveAdminTab('talepler')} className={`relative px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg text-xs lg:text-sm font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activeAdminTab === 'talepler' ? 'bg-emerald-600 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}><Inbox size={16}/> TALEPLER {pendingRequests.length > 0 && (<span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-md">{pendingRequests.length}</span>)}</button>
              <button onClick={() => setActiveAdminTab('gecmis')} className={`px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg text-xs lg:text-sm font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activeAdminTab === 'gecmis' ? 'bg-purple-600 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}><History size={16}/> GEÇMİŞ</button>
            </div>
          </div>
          <div className="flex flex-row items-center justify-end gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
            {activeAdminTab !== 'talepler' && activeAdminTab !== 'gecmis' && activeAdminTab !== 'menu' && (
              <div className="flex shrink-0 items-center bg-white/10 rounded-xl px-4 py-2.5 lg:px-5 lg:py-3 border border-white/10 hover:bg-white/20 transition-colors w-full lg:w-auto justify-center">
                <CalendarDays className={`mr-2 ${activeAdminTab === 'restoran' ? 'text-orange-400' : 'text-cyan-400'}`} size={20} />
                <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest opacity-70 text-cyan-100 hidden lg:inline mr-3">Tarih Seç:</span>
                <input type="date" value={activeAdminTab === 'restoran' ? selectedFilterDate : selectedMatchDate} onChange={(e) => activeAdminTab === 'restoran' ? setSelectedFilterDate(e.target.value) : setSelectedMatchDate(e.target.value)} className="bg-transparent text-white outline-none font-bold cursor-pointer text-sm lg:text-base w-full lg:w-auto" />
              </div>
            )}
            <button onClick={() => {setIsAuthenticated(false); setLoginUser(''); setLoginPass(''); setCurrentView('landing');}} className="shrink-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 lg:px-5 lg:py-3 rounded-xl text-xs lg:text-sm font-black uppercase tracking-widest transition-colors shadow-md ml-auto lg:ml-0">ÇIKIŞ</button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-20 mt-8 lg:mt-10 relative z-10">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-32 relative z-10 w-full text-emerald-600"><Loader2 className="animate-spin mb-4" size={64} /><p className="font-bold text-lg tracking-widest animate-pulse uppercase">Sisteme Bağlanıyor...</p></div>
        ) : activeAdminTab === 'talepler' ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100 w-full">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
               <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3"><Inbox className="text-emerald-500"/> Talepler</h2>
               <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-black">{pendingRequests.length} Talep</span>
            </div>
            {pendingRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-400"><CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-400 opacity-50" /><p className="font-bold text-xl">Bekleyen talep yok.</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {pendingRequests.map(req => (
                   <div key={req.id} className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 flex flex-col relative overflow-hidden">
                     <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-1 rounded-bl-xl font-bold text-[10px] uppercase tracking-wider">{typeLabels[req.type]}</div>
                     <h3 className="text-xl font-black text-slate-800 mt-2">{req.name}</h3>
                     <p className="text-sm font-bold text-slate-500 flex items-center gap-2 mt-1 mb-4"><Phone size={14}/>{req.phone}</p>
                     <div className="flex gap-2 mb-4"><span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">{req.date}</span><span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">{req.peopleCount} Kişi</span></div>
                     {req.notes && <div className="bg-amber-50 p-3 rounded-xl mb-4 text-xs font-bold text-amber-800">"{req.notes}"</div>}
                     <div className="mt-auto flex flex-col gap-2">
                        <button onClick={() => handleApproveRequest(req, true)} className="bg-[#25D366] text-white py-2.5 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2"><MessageCircle size={16}/> Onayla & WA</button>
                        <div className="flex gap-2"><button onClick={() => handleApproveRequest(req, false)} className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors shadow-sm flex items-center justify-center gap-2 border border-emerald-200"><Check size={14} className="inline mr-1"/> Onayla</button><button onClick={() => handleRejectRequest(req.id)} className="bg-slate-200 hover:bg-red-500 text-slate-600 hover:text-white px-3 rounded-xl transition-colors"><Trash2 size={14}/></button></div>
                     </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        ) : (activeAdminTab === 'restoran' || activeAdminTab === 'mac') ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 w-full col-span-12">
            <div className="lg:col-span-4 xl:col-span-3 space-y-6 print:hidden w-full">
              <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border overflow-hidden transition-colors w-full ${activeAdminTab==='mac' ? (isMatchEditing?'border-blue-400':'border-slate-200') : (isEditing?'border-orange-400':'border-slate-200')}`}>
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-black">{activeAdminTab==='mac' ? (isMatchEditing?'Maç Düzelt':'Yeni Maç Kaydı') : (isEditing?'Kayıt Düzelt':'Yeni Rezervasyon')}</h2>
                  {(isEditing || isMatchEditing) && <button onClick={()=>activeAdminTab==='mac'?cancelEdit(true):cancelEdit(false)}><X size={18}/></button>}
                </div>
                <form onSubmit={(e) => handleFormSubmit(e, activeAdminTab==='mac')} className="p-6 space-y-4">
                  {activeAdminTab === 'restoran' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Türü</label>
                      <select name="type" value={formData.type} onChange={(e)=>setFormData({...formData, type: e.target.value})} className="w-full p-3 rounded-xl border-2 border-slate-200 font-bold outline-none"><option value="kahvalti">Kahvaltı</option><option value="yemek">Yemek</option><option value="dogum_gunu">Doğum Günü</option><option value="organizasyon">Organizasyon</option></select>
                    </div>
                  )}
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">İsim</label><input type="text" name="name" value={activeAdminTab==='mac'?matchFormData.name:formData.name} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, name:e.target.value}):setFormData({...formData, name:e.target.value})} className="w-full p-3 rounded-xl border-2 border-slate-200 font-bold" required /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Telefon</label><input type="tel" name="phone" value={activeAdminTab==='mac'?matchFormData.phone:formData.phone} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, phone:e.target.value}):setFormData({...formData, phone:e.target.value})} className="w-full p-3 rounded-xl border-2 border-slate-200 font-bold" /></div>
                  <div className="flex gap-3">
                    <div className="flex-[2]"><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Masa</label><input type="text" name="table" value={activeAdminTab==='mac'?matchFormData.table:formData.table} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, table:e.target.value}):setFormData({...formData, table:e.target.value})} className="w-full p-3 rounded-xl border-2 border-slate-200 font-bold uppercase" /></div>
                    <div className="flex-[1]"><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kişi</label><input type="number" name="peopleCount" min="1" value={activeAdminTab==='mac'?matchFormData.peopleCount:formData.peopleCount} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, peopleCount:parseInt(e.target.value)||1}):setFormData({...formData, peopleCount:parseInt(e.target.value)||1})} className="w-full p-3 rounded-xl border-2 border-slate-200 font-bold text-center" /></div>
                  </div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tarih</label><input type="date" name="date" value={activeAdminTab==='mac'?matchFormData.date:formData.date} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, date:e.target.value}):setFormData({...formData, date:e.target.value})} className="w-full p-3 rounded-xl border-2 border-slate-200 font-bold" required /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Not</label><textarea name="notes" value={activeAdminTab==='mac'?matchFormData.notes:formData.notes} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, notes:e.target.value}):setFormData({...formData, notes:e.target.value})} rows="2" className="w-full p-3 rounded-xl border-2 border-slate-200 font-medium resize-none"></textarea></div>
                  <button type="submit" className={`w-full text-white font-black py-4 rounded-xl shadow-lg hover:-translate-y-1 transition-transform ${activeAdminTab==='mac' ? 'bg-blue-600' : 'bg-orange-500'}`}>{activeAdminTab==='mac'?(isMatchEditing?'GÜNCELLE':'EKLE'):(isEditing?'GÜNCELLE':'EKLE')}</button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-8 xl:col-span-9 space-y-6 print:w-full print:block w-full">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 sm:p-8 min-h-[500px] w-full">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                  <h2 className="text-2xl font-black text-slate-800">{activeAdminTab==='mac' ? 'Maç Rezervasyonları' : 'Aktif Masalar'}</h2>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <input type="text" placeholder="Ara..." value={activeAdminTab==='mac'?matchSearchTerm:searchTerm} onChange={(e)=>activeAdminTab==='mac'?setMatchSearchTerm(e.target.value):setSearchTerm(e.target.value)} className="p-2 border-2 border-slate-200 rounded-lg outline-none font-medium w-full md:w-48" />
                    <span className="font-bold text-sm bg-slate-100 px-3 py-2 rounded-lg whitespace-nowrap">{(activeAdminTab==='mac'?sortedMatchReservations:sortedReservations).length} Kayıt</span>
                    <button onClick={()=>window.print()} className="bg-slate-800 text-white p-2 rounded-lg"><Printer size={20}/></button>
                  </div>
                </div>

                {(activeAdminTab==='mac'?sortedMatchReservations:sortedReservations).length === 0 ? (
                  <div className="p-12 text-center text-slate-400"><p className="font-bold text-xl">Kayıt bulunamadı.</p></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {(activeAdminTab==='mac'?sortedMatchReservations:sortedReservations).map(res => (
                      <div key={res.id} className={`bg-white border-2 p-5 rounded-2xl flex flex-col relative ${res.isArrived ? 'border-emerald-500 opacity-80' : 'border-slate-200'}`}>
                         <div className="flex justify-between items-start mb-3">
                           <div><h3 className="font-black text-lg text-slate-800">{res.name}</h3><p className="text-sm font-bold text-slate-500">{res.phone}</p></div>
                           <div className="text-right"><div className="bg-slate-100 text-slate-700 font-black px-3 py-1 rounded-lg text-sm">{res.table}</div><div className="text-xs font-bold text-slate-500 mt-1">{res.peopleCount} Kişi</div></div>
                         </div>
                         {res.notes && <p className="text-xs font-bold text-amber-600 bg-amber-50 p-2 rounded mb-3">Not: {res.notes}</p>}
                         <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                           <button onClick={()=>handleToggleArrived(res.id, res.isArrived, activeAdminTab==='mac'?'matchReservations':'reservations')} className={`text-xs font-black px-3 py-1.5 rounded-lg ${res.isArrived ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>{res.isArrived ? 'MASADA' : 'GELMEDİ'}</button>
                           <div className="flex gap-2">
                             <button onClick={()=>sendWhatsApp(res, activeAdminTab, false)} className="text-green-500 bg-green-50 p-1.5 rounded"><MessageCircle size={16}/></button>
                             <button onClick={()=>handleEditClick(res, activeAdminTab==='mac')} className="text-blue-500 bg-blue-50 p-1.5 rounded"><Edit2 size={16}/></button>
                             <button onClick={()=>executeDelete(res.id, activeAdminTab==='mac'?'matchReservations':'reservations')} className="text-red-500 bg-red-50 p-1.5 rounded"><Trash2 size={16}/></button>
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeAdminTab === 'menu' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 w-full col-span-12">
            <div className="lg:col-span-4 xl:col-span-3 space-y-6 w-full">
              {menuItems.length === 0 && (
                <div className="bg-orange-100 border border-orange-200 rounded-3xl p-6 text-center shadow-sm">
                  <p className="text-orange-800 font-bold mb-4 text-sm">Sisteminizde hiç menü öğesi yok.</p>
                  <button onClick={importDefaultMenu} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-black uppercase text-xs w-full transition-colors">Varsayılan Menüyü Aktar</button>
                </div>
              )}
              
              <div className={`bg-white rounded-3xl shadow-xl border w-full ${isMenuEditing ? 'border-[#8b5cf6]' : 'border-slate-200'}`}>
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isMenuEditing ? 'bg-[#8b5cf6]/10 text-[#8b5cf6]' : 'bg-slate-200 text-slate-600'}`}>{isMenuEditing ? <Edit2 size={20} /> : <Plus size={20} />}</div>
                    <h2 className="font-black text-lg text-slate-800">{isMenuEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
                  </div>
                  {isMenuEditing && <button type="button" onClick={()=>{setIsMenuEditing(null); setMenuItemData(initialMenuItemState); setMenuErrorMsg('');}} className="text-slate-400 p-1.5 hover:bg-slate-100 rounded-full transition-colors"><X size={18}/></button>}
                </div>
                <form onSubmit={handleMenuSubmit} className="p-6 space-y-4">
                  {menuErrorMsg && <div className="text-red-500 font-bold text-sm bg-red-50 p-3 rounded-xl flex items-center gap-2"><X size={16}/> {menuErrorMsg}</div>}
                  
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
                    <button type="button" onClick={() => setShowCategoryModal(true)} className="text-[10px] bg-[#8b5cf6]/10 text-[#8b5cf6] font-bold px-2 py-1 rounded hover:bg-[#8b5cf6]/20 transition-colors">+ Yeni</button>
                  </div>
                  <select name="category" value={menuItemData.category} onChange={handleMenuChange} className="w-full p-3 rounded-xl border border-slate-300 font-bold outline-none focus:ring-2 focus:ring-[#8b5cf6] bg-slate-50 text-slate-700">
                    {ALL_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Ürün Adı *</label>
                    <input type="text" name="name" value={menuItemData.name} onChange={handleMenuChange} className="w-full p-3 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#8b5cf6] outline-none" required placeholder="Örn: Karışık Tost" />
                  </div>
                  
                  <div className="flex gap-3">
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Fiyat</label>
                        <div className="relative">
                          <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" name="price" value={menuItemData.price} onChange={handleMenuChange} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#8b5cf6] outline-none" placeholder="150" />
                        </div>
                     </div>
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Hazırlama</label>
                        <div className="relative">
                          <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" name="prepTime" value={menuItemData.prepTime} onChange={handleMenuChange} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#8b5cf6] outline-none" placeholder="15 dk" />
                        </div>
                     </div>
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Kalori</label>
                        <div className="relative">
                          <Flame size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" name="calories" value={menuItemData.calories} onChange={handleMenuChange} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#8b5cf6] outline-none" placeholder="350 kcal" />
                        </div>
                     </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Durum & Etiket (Maks: 2)</label>
                    <div className="flex flex-wrap gap-2">
                      {BADGE_OPTIONS.map(badge => (
                        <label key={badge.id} className="flex items-center gap-1.5 cursor-pointer bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                          <input type="checkbox" checked={menuItemData.badges.includes(badge.id)} onChange={() => handleBadgeChange(badge.id)} className="w-3.5 h-3.5 text-[#8b5cf6] rounded border-gray-300 focus:ring-[#8b5cf6]" />
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1"><span>{badge.icon}</span> {badge.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Açıklama</label>
                    <div className="relative">
                      <AlignLeft size={18} className="absolute left-4 top-4 text-slate-400" />
                      <textarea name="description" value={menuItemData.description} onChange={handleMenuChange} rows={3} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 font-medium resize-y min-h-[80px] focus:ring-2 focus:ring-[#8b5cf6] outline-none" placeholder="Ürün içeriği..."></textarea>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Ürün Resim (Yükle)</label>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center justify-center px-4 py-2.5 bg-slate-100 border border-slate-300 rounded-xl cursor-pointer hover:bg-slate-200 transition-colors text-sm font-bold text-slate-700 w-full text-center">
                          {uploadingImage ? <Loader2 className="animate-spin mr-2" size={16} /> : <UploadCloud className="mr-2" size={16} />}
                          Dosya Seç
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Sıra</label>
                      <input type="number" name="order" value={menuItemData.order} onChange={handleMenuChange} className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#8b5cf6] outline-none" placeholder="999" />
                    </div>
                  </div>
                  
                  {menuItemData.image && (
                     <div className="relative inline-block mt-2">
                        <img src={menuItemData.image} alt="Preview" className="h-24 w-auto rounded-lg object-contain border border-slate-200 shadow-sm bg-[#0a0a0a]" />
                        <button type="button" onClick={removeMenuImage} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors" title="Resmi Kaldır">
                           <X size={14}/>
                        </button>
                     </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 mt-4">
                     <label className="flex items-center gap-3 cursor-pointer bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${menuItemData.isFeatured ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-slate-300'}`}>
                           {menuItemData.isFeatured && <Check size={14} />}
                        </div>
                        <input type="checkbox" checked={menuItemData.isFeatured} onChange={(e)=>setMenuItemData({...menuItemData, isFeatured: e.target.checked})} className="hidden" />
                        <div className="flex-1 select-none">
                           <span className="font-bold text-xs text-slate-700 block">Vitrin Göster</span>
                        </div>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${menuItemData.isSoldOut ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-slate-300'}`}>
                           {menuItemData.isSoldOut && <Check size={14} />}
                        </div>
                        <input type="checkbox" checked={menuItemData.isSoldOut} onChange={(e)=>setMenuItemData({...menuItemData, isSoldOut: e.target.checked})} className="hidden" />
                        <div className="flex-1 select-none">
                           <span className="font-bold text-xs text-slate-700 block">Tükendi Yap</span>
                        </div>
                     </label>
                  </div>
                  
                  <button type="submit" className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-black py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1 uppercase tracking-widest mt-2">
                    {isMenuEditing ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'}
                  </button>

                  {/* CANLI ÖNİZLEME ALANI */}
                  <div className="mt-6 border-t border-slate-200 pt-6">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><MonitorPlay size={14}/> Menü Görünümü (Önizleme)</h3>
                     <div className="bg-[#111] border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col min-h-[200px] max-w-sm mx-auto relative pointer-events-none">
                        {menuItemData.badges && menuItemData.badges.length > 0 && (
                          <div className="absolute top-2 left-2 z-10 flex gap-1">
                            {menuItemData.badges.map(b => {
                               const def = BADGE_OPTIONS.find(o=>o.id===b);
                               return def ? <span key={b} className="bg-white/90 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">{def.icon}</span> : null;
                            })}
                          </div>
                        )}
                        {menuItemData.isSoldOut && <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-widest">Tükendi</div>}
                        
                        {menuItemData.image ? (
                          <div className="relative w-full h-32 bg-[#0a0a0a] flex items-center justify-center overflow-hidden shrink-0">
                            <img src={menuItemData.image} alt={menuItemData.name} className={`w-full h-full object-contain p-2 ${menuItemData.isSoldOut ? 'opacity-40 grayscale' : ''}`} />
                          </div>
                        ) : (
                          <div className={`relative w-full h-24 bg-[#111] flex flex-col items-center justify-center border-b border-white/5 shrink-0 ${menuItemData.isSoldOut ? 'opacity-40 grayscale' : ''}`}>
                            <ImageIcon size={32} className="text-white/20"/>
                          </div>
                        )}
                        
                        <div className={`p-4 flex flex-col justify-between bg-[#111] grow ${menuItemData.isSoldOut ? 'opacity-60 grayscale' : ''}`}>
                           <div>
                             <div className="flex justify-between items-start gap-3 mb-1.5">
                                <span className="text-white font-bold text-sm tracking-wide leading-snug">{menuItemData.name || 'Örnek Ürün Adı'}</span>
                                {menuItemData.price && <span className="text-orange-400 font-black whitespace-nowrap text-sm">{menuItemData.price} TL</span>}
                             </div>
                             {menuItemData.description && <p className="text-slate-400 text-[11px] line-clamp-2 mb-2 leading-relaxed">{menuItemData.description}</p>}
                           </div>
                           <div className="w-full flex justify-end mt-auto pt-2 border-t border-white/5">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50"></div>
                           </div>
                        </div>
                     </div>
                  </div>

                </form>
              </div>
            </div>

            <div className="lg:col-span-8 xl:col-span-9 w-full">
               <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 sm:p-8 min-h-[500px] w-full">
                  <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                     <h2 className="text-2xl font-black flex items-center gap-3 text-slate-800"><MenuSquare className="text-[#8b5cf6]" size={28} /> Sistemdeki Menü Öğeleri</h2>
                     
                     <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                        <select value={menuFilterCategory} onChange={(e) => setMenuFilterCategory(e.target.value)} className="w-full sm:w-auto p-2.5 border border-slate-300 rounded-xl outline-none font-bold text-sm focus:border-[#8b5cf6]">
                           <option value="all">Tüm Kategoriler</option>
                           {ALL_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <div className="relative w-full sm:w-64">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                           <input type="text" placeholder="Ürün ara..." value={menuSearchTerm} onChange={(e) => setMenuSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#8b5cf6] text-sm font-medium outline-none transition-all" />
                        </div>
                        <span className="font-bold text-sm bg-slate-100 px-4 py-2.5 rounded-xl whitespace-nowrap shrink-0">{menuItems.length} Öğe</span>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                     {menuItems
                       .filter(m => menuFilterCategory === 'all' || m.category === menuFilterCategory)
                       .filter(m => !menuSearchTerm || m.name.toLowerCase().includes(menuSearchTerm.toLowerCase()) || m.category.toLowerCase().includes(menuSearchTerm.toLowerCase()))
                       .sort((a,b) => (a.order||999) - (b.order||999) || a.name.localeCompare(b.name))
                       .map((item) => (
                       
                       <div 
                          key={item.id} 
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, item)}
                          className={`border p-4 rounded-2xl flex flex-col bg-white ${isMenuEditing===item.id ? 'border-[#8b5cf6] shadow-md scale-[1.02] transition-all relative z-10' : 'border-slate-200 hover:border-[#8b5cf6]/50 hover:shadow-md transition-all cursor-move'}`}
                       >
                          <div className="flex justify-between items-start mb-2">
                             <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1">
                               <GripVertical size={12} className="text-slate-400"/>
                               {ALL_CATEGORIES.find(c=>c.id===item.category)?.name || item.category}
                             </span>
                             {item.isSoldOut && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded">Tükendi</span>}
                          </div>

                          <div className="flex gap-3 items-center mb-3">
                            {item.image ? (
                               <div className="w-16 h-16 rounded-xl bg-[#0a0a0a] shrink-0 flex items-center justify-center p-1 border border-slate-100">
                                 <img src={item.image} className={`w-full h-full object-contain ${item.isSoldOut ? 'opacity-40 grayscale' : ''}`} alt="" onError={(e)=>{e.currentTarget.style.display='none'}} />
                               </div>
                            ) : (
                               <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 shrink-0"><ImageIcon size={24}/></div>
                            )}
                            <div>
                              <h3 className={`font-bold leading-tight line-clamp-2 ${item.isSoldOut ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{item.name}</h3>
                              <span className="font-black text-[#8b5cf6] text-sm block mt-1">{item.price ? `${item.price} TL` : '-'}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-100">
                            <span className="text-xs font-bold text-slate-400">Sıra: {item.order || 999}</span>
                            <div className="flex gap-1.5">
                              <button onClick={() => toggleSoldOut(item)} className={`p-1.5 rounded transition-colors ${item.isSoldOut ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-red-50 text-red-500 hover:bg-red-100'}`} title={item.isSoldOut ? "Satışa Aç" : "Tükendi Yap"}>
                                 {item.isSoldOut ? <CheckCircle size={16}/> : <X size={16}/>}
                              </button>
                              <button onClick={() => duplicateMenuItem(item)} className="p-1.5 bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-600 rounded transition-colors" title="Kopyala">
                                 <Plus size={16}/>
                              </button>
                              <button onClick={()=>{setMenuItemData({category: item.category, name: item.name, price: item.price||'', description: item.description||'', image: item.image||'', isFeatured: item.isFeatured||false, order: item.order||'', badges: item.badges||[], isSoldOut: item.isSoldOut||false, prepTime: item.prepTime||'', calories: item.calories||''}); setIsMenuEditing(item.id); window.scrollTo(0,0);}} className="p-1.5 bg-slate-100 hover:bg-[#8b5cf6]/10 hover:text-[#8b5cf6] text-slate-600 rounded transition-colors" title="Düzenle">
                                 <Edit2 size={16}/>
                              </button>
                              <button onClick={()=>{if(window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) executeDelete(item.id, 'menuItems');}} className="p-1.5 bg-slate-100 hover:bg-red-100 hover:text-red-600 text-red-400 rounded transition-colors" title="Sil">
                                 <Trash2 size={16}/>
                              </button>
                            </div>
                          </div>
                       </div>
                     ))}
                     {menuItems.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 font-medium">Veritabanında henüz bir menü öğesi yok.</div>}
                  </div>
               </div>
            </div>
          </div>
        ) : activeAdminTab === 'gecmis' ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100 w-full">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
               <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3"><History className="text-purple-500"/> Geçmiş Kayıtlar</h2>
               <div className="flex gap-2"><input type="date" value={historyDateFilter} onChange={(e)=>setHistoryDateFilter(e.target.value)} className="p-2 border-2 border-slate-200 rounded-lg outline-none font-bold" /></div>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left">
                 <thead><tr className="border-b-2 border-slate-200"><th className="py-3 px-2 font-bold text-slate-400 text-sm">Tarih</th><th className="py-3 px-2 font-bold text-slate-400 text-sm">Müşteri</th><th className="py-3 px-2 font-bold text-slate-400 text-sm text-center">Kişi</th><th className="py-3 px-2 font-bold text-slate-400 text-sm text-center">Durum</th></tr></thead>
                 <tbody>
                    {historyStats.list.map(res => (
                       <tr key={res.id} className="border-b border-slate-100">
                          <td className="py-3 px-2 font-bold text-slate-700">{res.date} <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded ml-2">{res.eventType}</span></td>
                          <td className="py-3 px-2 font-bold text-slate-800">{res.name} <span className="block text-xs font-normal text-slate-500">{res.phone}</span></td>
                          <td className="py-3 px-2 text-center font-black">{res.peopleCount}</td>
                          <td className="py-3 px-2 text-center">{res.isArrived ? <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">Geldi</span> : <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded">Gelmedi</span>}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
