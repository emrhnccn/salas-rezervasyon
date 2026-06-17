import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, Users, UtensilsCrossed, Armchair, Plus, Trash2, MoonStar, 
  ChefHat, Search, Edit2, X, Check, Loader2, Clock, CheckCircle, Phone, 
  Printer, MessageSquareText, MessageCircle, Map, Flame, BellRing, 
  MonitorPlay, Lock, ArrowRight, MapPin, Instagram, Wind, Coffee, 
  ChevronRight, Star, Inbox, CheckCircle2, AlertTriangle, History, MenuSquare,
  Image as ImageIcon, AlignLeft, DollarSign, UploadCloud, GripVertical, UserSquare, Menu
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// --- ZORUNLU MOBİL UYUMLULUK (VIEWPORT) ---
if (typeof document !== 'undefined') {
  let viewportMeta = document.querySelector('meta[name="viewport"]');
  if (!viewportMeta) {
    viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    document.head.appendChild(viewportMeta);
  }
  viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
}

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

const GLOBAL_CSS = ``;

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestData, setRequestData] = useState({ type: 'yemek', name: '', phone: '', peopleCount: 2, date: getToday(), notes: '' });
  const [requestError, setRequestError] = useState('');

  const [reservations, setReservations] = useState([]);
  const [matchReservations, setMatchReservations] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  
  const [menuItems, setMenuItems] = useState([]);
  const [dbCategories, setDbCategories] = useState([]); 

  // --- PERSONEL STATE ---
  const [personnelList, setPersonnelList] = useState([]);
  const [isPersonnelEditing, setIsPersonnelEditing] = useState(null);
  const initialPersonnelState = { name: '', surname: '', nickname: '', skills: '', image: '', order: '', reviews: [] };
  const [personnelData, setPersonnelData] = useState(initialPersonnelState);
  const [personnelErrorMsg, setPersonnelErrorMsg] = useState('');
  const [uploadingPersonnelImage, setUploadingPersonnelImage] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null); 
  const [reviewData, setReviewData] = useState({ name: '', isAnonymous: false, rating: 5, comment: '' }); 
  
  const [managingReviewsFor, setManagingReviewsFor] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});

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
  const [personnelDeleteConfirmId, setPersonnelDeleteConfirmId] = useState(null);
  const [printSingleId, setPrintSingleId] = useState(null);
  const [showTableMap, setShowTableMap] = useState(false);

  // --- TOAST NOTIFICATION STATE ---
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error'|'info' }
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const [historyDateFilter, setHistoryDateFilter] = useState(''); 
  const [historyTypeFilter, setHistoryTypeFilter] = useState('all'); 

  // --- MENÜ YÖNETİMİ STATE ---
  const [isMenuEditing, setIsMenuEditing] = useState(null);
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  const [menuFilterCategory, setMenuFilterCategory] = useState('all');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [draggedItem, setDraggedItem] = useState(null);

  const initialMenuItemState = { category: 'kahvalti', name: '', price: '', description: '', image: '', isFeatured: false, order: '', badges: [], isSoldOut: false, prepTime: '', calories: '' };
  const [menuItemData, setMenuItemData] = useState(initialMenuItemState);
  const [menuErrorMsg, setMenuErrorMsg] = useState('');
  const [menuDeleteConfirmId, setMenuDeleteConfirmId] = useState(null);

  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  // --- DERIVED STATE CALCULATIONS ---
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

  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    if (!activeCategory && activeMenuCategories.length > 0) {
      setActiveCategory(activeMenuCategories[0].id);
    }
  }, [activeMenuCategories, activeCategory]);

  useEffect(() => {
    if (currentView !== 'menu') return;

    let timeoutId;
    const handleScrollSpy = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
          const scrollPosition = window.scrollY + 160; 
          
          for (let i = activeMenuCategories.length - 1; i >= 0; i--) {
            const cat = activeMenuCategories[i];
            const el = document.getElementById(`cat-${cat.id}`);
            if (el && el.offsetTop <= scrollPosition) {
              setActiveCategory(cat.id);
              const btn = document.getElementById(`btn-${cat.id}`);
              if (btn && btn.parentNode) {
                const container = btn.parentNode;
                const scrollLeft = btn.offsetLeft - (container.offsetWidth / 2) + (btn.offsetWidth / 2);
                container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
              }
              break;
            }
          }
      }, 50); 
    };

    window.addEventListener('scroll', handleScrollSpy);
    return () => {
      window.removeEventListener('scroll', handleScrollSpy);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentView, activeMenuCategories]);

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

    const personnelUnsub = onSnapshot(collection(db, 'personnel'), (snapshot) => {
      setPersonnelList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    
    return () => { 
      restoranUnsub(); 
      matchUnsub(); 
      reqUnsub(); 
      menuUnsub(); 
      catUnsub();
      personnelUnsub();
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

  const handleNavToPersonnel = () => {
    setCurrentView('personnel');
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
    setActiveCategory(id); 
    const el = document.getElementById(`cat-${id}`);
    if (el) { 
      const y = el.getBoundingClientRect().top + window.scrollY - 140; 
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

  const compressImageToBase64 = (file, maxWidth = 800) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    setMenuErrorMsg('');
    
    try {
      const base64Image = await compressImageToBase64(file, 800);
      setMenuItemData(prev => ({ ...prev, image: base64Image }));
    } catch (error) {
      console.error(error);
      setMenuErrorMsg("Resim işlenirken hata oluştu: " + (error.message || "Bilinmeyen hata"));
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

  const handleAddCategory = async (e) => {
    if (e) e.preventDefault();
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

  // --- PERSONEL YÖNETİMİ FONKSİYONLARI ---
  const handlePersonnelChange = (e) => {
    const { name, value } = e.target;
    setPersonnelErrorMsg('');
    setPersonnelData(prev => ({ 
      ...prev, 
      [name]: name === 'order' ? (value === '' ? '' : parseInt(value, 10)) : value 
    }));
  };

  const handlePersonnelImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPersonnelImage(true);
    setPersonnelErrorMsg('');
    
    try {
      const base64Image = await compressImageToBase64(file, 800);
      setPersonnelData(prev => ({ ...prev, image: base64Image }));
    } catch (error) {
      console.error(error);
      setPersonnelErrorMsg("Resim işlenirken hata oluştu.");
    } finally {
      setUploadingPersonnelImage(false);
    }
  };

  const removePersonnelImage = () => {
    setPersonnelData(prev => ({ ...prev, image: '' }));
  };

  const handlePersonnelSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!personnelData.name?.trim() || !personnelData.surname?.trim()) { 
      setPersonnelErrorMsg("İsim ve Soyisim zorunludur."); 
      return; 
    }
    
    const dataToSave = {
      ...personnelData,
      order: personnelData.order === '' ? 999 : personnelData.order,
      reviews: personnelData.reviews || [] 
    };

    try {
      if (isPersonnelEditing) {
        await updateDoc(doc(db, 'personnel', isPersonnelEditing), { 
          ...dataToSave, 
          updatedAt: new Date().toISOString() 
        });
        setIsPersonnelEditing(null);
      } else {
        await addDoc(collection(db, 'personnel'), { 
          ...dataToSave, 
          createdAt: new Date().toISOString() 
        });
      }
      setPersonnelData(initialPersonnelState); 
      setPersonnelErrorMsg('');
    } catch (err) { 
      setPersonnelErrorMsg("Personel kaydedilirken hata oluştu."); 
    }
  };

  const executeDeletePersonnel = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'personnel', id));
      if (isPersonnelEditing === id) { 
        setIsPersonnelEditing(null); 
        setPersonnelData(initialPersonnelState); 
      }
      setPersonnelDeleteConfirmId(null);
      showToast('Personel başarıyla silindi.', 'success');
    } catch (err) { 
      console.error(err);
      showToast('Personel silinirken hata oluştu.', 'error');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewData.comment.trim()) return;
    if (!reviewData.isAnonymous && !reviewData.name.trim()) {
      showToast('Lütfen adınızı girin veya Anonim olarak işaretleyin.', 'error');
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      name: reviewData.isAnonymous ? 'Anonim' : reviewData.name.trim(),
      rating: reviewData.rating,
      comment: reviewData.comment.trim(),
      date: new Date().toISOString()
    };

    try {
      const personRef = doc(db, 'personnel', selectedPersonnel.id);
      const updatedReviews = [...(selectedPersonnel.reviews || []), newReview];
      await updateDoc(personRef, { reviews: updatedReviews });
      
      setSelectedPersonnel(prev => ({ ...prev, reviews: updatedReviews }));
      setReviewData({ name: '', isAnonymous: false, rating: 5, comment: '' });
      showToast('Yorumunuz başarıyla eklendi! Teşekkür ederiz. 🙏', 'success');
    } catch (error) {
      console.error(error);
      showToast('Yorum eklenirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    }
  };

  const handleDeleteReview = async (personId, reviewId) => {
    try {
      const person = personnelList.find(p => p.id === personId);
      const updatedReviews = person.reviews.filter(r => r.id !== reviewId);
      await updateDoc(doc(db, 'personnel', personId), { reviews: updatedReviews });
      
      if (managingReviewsFor && managingReviewsFor.id === personId) {
        setManagingReviewsFor(prev => ({ ...prev, reviews: updatedReviews }));
      }
      if (selectedPersonnel && selectedPersonnel.id === personId) {
        setSelectedPersonnel(prev => ({ ...prev, reviews: updatedReviews }));
      }
      showToast('Yorum silindi.', 'info');
    } catch (err) {
      console.error(err);
      showToast('Yorum silinirken bir hata oluştu.', 'error');
    }
  };

  const handleReplyReview = async (personId, reviewId) => {
    const replyText = replyTexts[reviewId];
    if (!replyText?.trim()) return;
    try {
      const person = personnelList.find(p => p.id === personId);
      const updatedReviews = person.reviews.map(r => r.id === reviewId ? { ...r, reply: replyText.trim() } : r);
      await updateDoc(doc(db, 'personnel', personId), { reviews: updatedReviews });
      
      if (managingReviewsFor && managingReviewsFor.id === personId) {
        setManagingReviewsFor(prev => ({ ...prev, reviews: updatedReviews }));
      }
      if (selectedPersonnel && selectedPersonnel.id === personId) {
        setSelectedPersonnel(prev => ({ ...prev, reviews: updatedReviews }));
      }
      setReplyTexts(prev => ({ ...prev, [reviewId]: '' }));
    } catch (err) {
      console.error(err);
      alert("Cevap gönderilirken hata oluştu.");
    }
  };

  const handleDeleteReply = async (personId, reviewId) => {
    try {
      const person = personnelList.find(p => p.id === personId);
      const updatedReviews = person.reviews.map(r => r.id === reviewId ? { ...r, reply: '' } : r);
      await updateDoc(doc(db, 'personnel', personId), { reviews: updatedReviews });
      
      if (managingReviewsFor && managingReviewsFor.id === personId) {
        setManagingReviewsFor(prev => ({ ...prev, reviews: updatedReviews }));
      }
      if (selectedPersonnel && selectedPersonnel.id === personId) {
        setSelectedPersonnel(prev => ({ ...prev, reviews: updatedReviews }));
      }
      showToast('Cevap silindi.', 'info');
    } catch (err) {
      console.error(err);
      showToast('Cevap silinirken bir hata oluştu.', 'error');
    }
  };

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

  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const importDefaultMenu = async () => {
    if (!user) return;
    setShowImportConfirm(false);
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
      showToast('Varsayılan menü başarıyla aktarıldı! ✅', 'success');
    } catch (err) { 
      showToast('Menü aktarımı sırasında hata oluştu.', 'error');
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
    <>
      <div className={`fixed top-0 left-0 w-full z-50 flex flex-col transition-all duration-700 ${isScrolled || isDark ? 'glass py-2' : 'bg-transparent py-4'} border-b ${isScrolled || isDark ? 'border-white/10' : 'border-transparent'}`}>
        <nav className="w-full transition-all duration-500 flex flex-col items-center">
          
          <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-wrap items-center justify-between gap-y-3">
            <div className={`transition-all duration-500 cursor-pointer flex items-center justify-center shrink-0 ${isScrolled || isDark ? 'h-10' : 'h-14 sm:h-16'}`} onClick={handleNavToHome}>
              <img src="/salaaslogobg.png" alt="Salaaş Logo" className={`h-full w-auto object-contain transition-all duration-500 ${isDark ? 'filter drop-shadow-md brightness-200' : 'drop-shadow-xl'}`} />
            </div>
            
            <div className={`hidden lg:flex flex-1 justify-center items-center gap-10 xl:gap-14 font-bold text-sm uppercase tracking-[0.15em] transition-colors duration-500 ${isScrolled || isDark ? 'text-slate-200' : 'text-white drop-shadow-md'}`}>
              <button onClick={() => { if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('hakkimizda'), 100); }} className="hover:text-[#c2784f] transition-all hover:-translate-y-0.5">Biz Kimiz?</button>
              <button onClick={() => { if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('lezzetler'), 100); }} className="hover:text-[#c2784f] transition-all hover:-translate-y-0.5">Lezzetler</button>
              <button onClick={handleNavToPersonnel} className={`hover:text-[#c2784f] transition-all hover:-translate-y-0.5 ${currentView === 'personnel' ? 'text-[#c2784f]' : ''}`}>Ekibimiz</button>
              <button onClick={() => { if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('iletisim'), 100); }} className="hover:text-[#c2784f] transition-all hover:-translate-y-0.5">İletişim</button>
            </div>
            
            <div className="shrink-0 flex items-center justify-end gap-3 sm:gap-5">
              <button 
                onClick={() => setShowRequestModal(true)} 
                className="btn-outline-premium px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase shadow-lg flex items-center gap-2"
              >
                <CalendarDays size={16} /> <span className="hidden sm:inline">Rezervasyon</span><span className="sm:hidden">Rezv.</span>
              </button>
              <button 
                onClick={handleNavToMenu} 
                className="btn-premium shine-effect px-5 py-2 sm:px-8 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase shadow-2xl flex items-center gap-2"
              >
                <MenuSquare size={16} /> <span className="hidden sm:inline">Menü</span>
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className={`lg:hidden flex items-center justify-center p-2 rounded-lg transition-colors ${isScrolled || isDark ? 'text-slate-200 hover:text-white' : 'text-white drop-shadow-md hover:text-[#c2784f]'}`}
              >
                <Menu size={32} />
              </button>
            </div>
            
            <div className={`lg:hidden w-full flex items-center justify-center gap-6 overflow-x-auto hide-scrollbar text-[10px] font-black tracking-widest uppercase mt-2 pb-1 transition-colors duration-500 ${isScrolled || isDark ? 'text-slate-300' : 'text-white drop-shadow-md'}`}>
              <button onClick={() => { if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('hakkimizda'), 100); }} className="whitespace-nowrap hover:text-[#c2784f] transition-colors">Biz Kimiz</button>
              <button onClick={() => { if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('lezzetler'), 100); }} className="whitespace-nowrap hover:text-[#c2784f] transition-colors">Lezzetler</button>
              <button onClick={handleNavToPersonnel} className={`whitespace-nowrap hover:text-[#c2784f] transition-colors ${currentView === 'personnel' ? 'text-[#c2784f]' : ''}`}>Ekibimiz</button>
            </div>
            
          </div>
        </nav>
      </div>

      {/* MOBİL MENÜ ALANI */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] glass flex flex-col p-8 animate-in fade-in duration-300 lg:hidden">
          <div className="flex justify-between items-center w-full mb-12">
            <img src="/salaaslogobg.png" alt="Salaaş Logo" className="h-12 object-contain filter drop-shadow-xl brightness-200" />
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-3 border border-white/20 rounded-full hover:bg-white/10 transition-colors"><X size={28} /></button>
          </div>
          <div className="flex flex-col items-start gap-8 flex-1 text-2xl font-black text-white tracking-widest font-serif">
            <button className="hover:text-[#c2784f] transition-colors" onClick={() => { setIsMobileMenuOpen(false); if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('hakkimizda'), 100); }}>Hikayemiz</button>
            <button className="hover:text-[#c2784f] transition-colors" onClick={() => { setIsMobileMenuOpen(false); if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('lezzetler'), 100); }}>Lezzetler</button>
            <button className={`hover:text-[#c2784f] transition-colors ${currentView === 'personnel' ? 'text-[#c2784f]' : ''}`} onClick={() => { setIsMobileMenuOpen(false); handleNavToPersonnel(); }}>Ekibimiz</button>
            <button className="hover:text-[#c2784f] transition-colors" onClick={() => { setIsMobileMenuOpen(false); if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('iletisim'), 100); }}>İletişim</button>
            <hr className="w-full border-white/10 my-4" />
            <button onClick={() => { setIsMobileMenuOpen(false); setShowRequestModal(true); }} className="w-full btn-premium py-4 rounded-xl flex items-center justify-center gap-3 uppercase text-sm tracking-[0.2em] font-sans"><CalendarDays size={20}/> Rezervasyon Yap</button>
          </div>
        </div>
      )}
    </>
  );

  const renderFooter = () => (
    <footer id="iletisim" className="w-full bg-[#0a0908] text-slate-400 py-24 lg:py-32 relative z-10 border-t border-white/5 overflow-hidden">
      {/* Footer Arkaplan Süslemeleri */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c2784f]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>
      
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 relative z-10">
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img src="/salaaslogobg.png" alt="Salaaş Logo" className="h-28 lg:h-36 object-contain mb-8 filter brightness-150 drop-shadow-[0_0_15px_rgba(194,120,79,0.3)]" />
          <p className="text-base lg:text-lg leading-relaxed mb-6 max-w-sm font-light text-slate-400">
            Şehrin kalbinde, lüks ve samimiyetin kesişme noktası. Sizi ağırlamaktan mutluluk duyarız.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-gradient-copper font-black uppercase tracking-[0.3em] mb-10 text-sm lg:text-base">İletişim</h4>
          <ul className="space-y-6 text-sm lg:text-base font-light text-slate-300">
            <li>
               <div className="flex flex-col items-center md:items-start gap-3">
                 <div className="flex items-center justify-center md:justify-start gap-4">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 shrink-0"><MapPin size={18} className="text-[#c2784f]"/></div>
                    <span className="text-white font-medium tracking-wide">Konum</span>
                 </div>
                 <p className="ml-0 md:ml-14 text-slate-400">Gebze, Kocaeli</p>
                 <a 
                   href="https://www.google.com/maps/dir/?api=1&destination=Salaaş+Cafe+Restaurant+Gebze" 
                   target="_blank" 
                   rel="noreferrer" 
                   className="btn-outline-premium px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase mt-3 ml-0 md:ml-14 inline-flex items-center gap-2 w-max"
                 >
                    Yol Tarifi <ArrowRight size={14}/>
                 </a>
               </div>
            </li>
            <li>
               <a href={`tel:+${WHATSAPP_NO}`} className="hover:text-[#c2784f] transition-all flex items-center justify-center md:justify-start gap-4 group">
                 <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 shrink-0 group-hover:border-[#c2784f]/50 transition-colors"><Phone size={18} className="text-[#c2784f]"/></div>
                 <span className="text-white font-medium tracking-wide">Telefon: </span>
                 <span className="ml-1 font-light tracking-wider">0536 017 02 08</span>
               </a>
            </li>
            <li>
               <a href="https://www.instagram.com/salascaferestaurant/" target="_blank" rel="noreferrer" className="hover:text-[#c2784f] transition-all flex items-center justify-center md:justify-start gap-4 group">
                 <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 shrink-0 group-hover:border-[#c2784f]/50 transition-colors"><Instagram size={18} className="text-[#c2784f]"/></div>
                 <span className="text-white font-medium tracking-wide">Instagram: </span>
                 <span className="ml-1 font-light tracking-wider">@salascaferestaurant</span>
               </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-gradient-copper font-black uppercase tracking-[0.3em] mb-10 text-sm lg:text-base">Keşfedin</h4>
          <ul className="space-y-6 text-sm lg:text-base font-medium mb-10 text-slate-300">
            <li>
              <button 
                onClick={handleNavToMenu} 
                className="hover:text-[#c2784f] transition-colors flex items-center justify-center md:justify-start gap-3 tracking-widest uppercase text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-[#c2784f]"></div> Dijital Menü
              </button>
            </li>
            <li>
              <button 
                onClick={handleNavToPersonnel} 
                className="hover:text-[#c2784f] transition-colors flex items-center justify-center md:justify-start gap-3 tracking-widest uppercase text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-[#c2784f]"></div> Personel Ekibi
              </button>
            </li>
          </ul>
          
          <button 
            onClick={() => setShowLoginModal(true)} 
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 lg:px-8 lg:py-4 rounded-2xl text-sm lg:text-base font-black uppercase tracking-widest flex items-center gap-3 transition-all border border-slate-700 hover:border-slate-600 shadow-lg hover:shadow-xl hover:-translate-y-1 mt-auto"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a0908] rounded-3xl shadow-[0_0_50px_rgba(194,120,79,0.15)] border border-white/10 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
            <div className="glass-panel p-6 sm:p-8 flex items-center justify-between text-white shrink-0 z-10 border-b border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#c2784f]/20 to-transparent opacity-50"></div>
              <h3 className="font-black tracking-widest uppercase flex items-center gap-3 text-lg lg:text-xl relative z-10"><CalendarDays size={24} className="text-[#c2784f]"/> Rezervasyon Talebi</h3>
              <button type="button" onClick={() => setShowRequestModal(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors relative z-10"><X size={24}/></button>
            </div>
            
            <div className="overflow-y-auto bg-transparent flex-1 relative custom-scrollbar">
              {requestSuccess ? (
                 <div className="p-16 flex flex-col items-center justify-center text-center space-y-6 h-full min-h-[400px]">
                    <div className="w-24 h-24 bg-[#c2784f]/20 text-[#c2784f] border border-[#c2784f]/30 rounded-full flex items-center justify-center mb-4"><CheckCircle2 size={48} /></div>
                    <h3 className="text-3xl font-black text-white tracking-wide">Talebiniz Alındı!</h3>
                    <p className="text-lg text-slate-400 font-light leading-relaxed">Rezervasyon talebiniz işletmemize başarıyla iletilmiştir. En kısa sürede sizinle iletişime geçip onay verilecektir.</p>
                 </div>
              ) : (
                <form onSubmit={submitRequest} className="p-8 sm:p-10 space-y-6">
                  {requestError && (
                    <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm font-bold border border-red-500/20 flex items-center gap-3">
                      <AlertTriangle size={20} className="shrink-0" /> {requestError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Rezervasyon Türü</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <button type="button" onClick={() => setRequestData({...requestData, type: 'kahvalti'})} className={`py-3.5 rounded-2xl font-bold text-sm border transition-all flex items-center justify-center gap-2 ${requestData.type === 'kahvalti' ? 'border-[#c2784f] bg-[#c2784f]/10 text-[#c2784f] shadow-[0_0_15px_rgba(194,120,79,0.2)]' : 'border-white/10 text-slate-400 hover:border-white/20 bg-white/5 hover:bg-white/10'}`}>
                           <Coffee size={16}/> Kahvaltı
                        </button>
                        <button type="button" onClick={() => setRequestData({...requestData, type: 'yemek'})} className={`py-3.5 rounded-2xl font-bold text-sm border transition-all flex items-center justify-center gap-2 ${requestData.type === 'yemek' ? 'border-[#c2784f] bg-[#c2784f]/10 text-[#c2784f] shadow-[0_0_15px_rgba(194,120,79,0.2)]' : 'border-white/10 text-slate-400 hover:border-white/20 bg-white/5 hover:bg-white/10'}`}>
                           <UtensilsCrossed size={16}/> Yemek
                        </button>
                        <button type="button" onClick={() => setRequestData({...requestData, type: 'mac'})} className={`py-3.5 rounded-2xl font-bold text-sm border transition-all flex items-center justify-center gap-2 ${requestData.type === 'mac' ? 'border-[#c2784f] bg-[#c2784f]/10 text-[#c2784f] shadow-[0_0_15px_rgba(194,120,79,0.2)]' : 'border-white/10 text-slate-400 hover:border-white/20 bg-white/5 hover:bg-white/10'}`}>
                           <MonitorPlay size={16}/> Maç
                        </button>
                        <button type="button" onClick={() => setRequestData({...requestData, type: 'dogum_gunu'})} className={`py-3.5 rounded-2xl font-bold text-sm border transition-all flex items-center justify-center gap-2 ${requestData.type === 'dogum_gunu' ? 'border-[#c2784f] bg-[#c2784f]/10 text-[#c2784f] shadow-[0_0_15px_rgba(194,120,79,0.2)]' : 'border-white/10 text-slate-400 hover:border-white/20 bg-white/5 hover:bg-white/10'}`}>
                           <Star size={16}/> Doğum Günü
                        </button>
                        <button type="button" onClick={() => setRequestData({...requestData, type: 'organizasyon'})} className={`py-3.5 rounded-2xl font-bold text-sm border transition-all flex items-center justify-center gap-2 md:col-span-2 ${requestData.type === 'organizasyon' ? 'border-[#c2784f] bg-[#c2784f]/10 text-[#c2784f] shadow-[0_0_15px_rgba(194,120,79,0.2)]' : 'border-white/10 text-slate-400 hover:border-white/20 bg-white/5 hover:bg-white/10'}`}>
                           <Users size={16}/> Organizasyon
                        </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex-[2]">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Ad Soyad</label>
                      <input type="text" name="name" value={requestData.name} onChange={handleRequestChange} className="w-full bg-white/5 text-white px-5 py-4 rounded-2xl border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none font-medium transition-all text-base placeholder-slate-600" required placeholder="Adınız Soyadınız" />
                    </div>
                    <div className="flex-[1]">
                       <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Kişi Sayısı</label>
                       <input type="number" name="peopleCount" min="1" value={requestData.peopleCount} onChange={handleRequestChange} onClick={e => e.target.select()} className="w-full bg-white/5 text-white px-5 py-4 rounded-2xl border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none font-medium transition-all text-center text-base" required />
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5">
                     <div className="flex-1">
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Telefon</label>
                        <input type="tel" name="phone" value={requestData.phone} onChange={handleRequestChange} className="w-full bg-white/5 text-white px-5 py-4 rounded-2xl border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none font-medium transition-all text-base placeholder-slate-600" required placeholder="05XX..." />
                     </div>
                     <div className="flex-1">
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Tarih</label>
                        <input type="date" name="date" value={requestData.date} onChange={handleRequestChange} className="w-full bg-white/5 text-white px-5 py-4 rounded-2xl border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none font-medium transition-all text-base color-scheme-dark" required />
                     </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                      {(requestData.type === 'dogum_gunu' || requestData.type === 'organizasyon') ? 'Detaylı Açıklama (Zorunlu)' : 'Notunuz (İsteğe Bağlı)'}
                    </label>
                    <textarea name="notes" value={requestData.notes} onChange={handleRequestChange} rows="3" required={(requestData.type === 'dogum_gunu' || requestData.type === 'organizasyon')} className="w-full bg-white/5 text-white px-5 py-4 rounded-2xl border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none font-medium transition-all resize-none text-sm placeholder-slate-600" placeholder="Özel isteklerinizi yazın."></textarea>
                  </div>

                  <button type="submit" className="w-full btn-premium shine-effect font-black tracking-[0.2em] uppercase py-5 rounded-2xl mt-6 flex items-center justify-center gap-3 text-sm">
                    Talebi Gönder <ArrowRight size={20} />
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
              <button type="button" onClick={() => {setShowLoginModal(false); setLoginError('');}} className="p-3 hover:bg-white/20 rounded-xl transition-colors"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4 sm:space-y-6 bg-white">
              {loginError && (
                <div className="bg-red-50 text-red-600 text-sm font-bold p-3 sm:p-4 rounded-xl border border-red-100 flex items-center gap-2">
                  <X size={16}/> {loginError}
                </div>
              )}
              
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Kullanıcı Adı</label>
                <input type="text" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} autoComplete="username" className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-[#0B3B2C]/10 focus:border-[#0B3B2C] outline-none bg-slate-50 font-bold text-slate-800 transition-all text-base sm:text-lg" placeholder="Kullanıcı adınızı girin" autoFocus />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Şifre</label>
                <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} autoComplete="current-password" className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-[#0B3B2C]/10 focus:border-[#0B3B2C] outline-none bg-slate-50 font-bold text-slate-800 transition-all text-base sm:text-lg" placeholder="••••••••" />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#120f0d] rounded-3xl shadow-[0_0_50px_rgba(194,120,79,0.15)] border border-white/10 w-full max-w-md sm:max-w-lg overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
            <button type="button" onClick={() => setSelectedMenuItem(null)} className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white p-3 w-10 h-10 rounded-full transition-colors flex items-center justify-center border border-white/10">
              <X size={20} />
            </button>
            
            <div className="w-full bg-[#0a0908] relative flex justify-center items-center border-b border-white/5 min-h-[12rem]">
              {selectedMenuItem.image ? (
                 <img src={selectedMenuItem.image} alt={selectedMenuItem.name} className={`w-full h-auto max-h-[45vh] object-contain ${selectedMenuItem.isSoldOut ? 'opacity-40 grayscale' : ''}`} />
              ) : (
                 <div className="w-full h-48 flex items-center justify-center text-slate-600"><ImageIcon size={48} /></div>
              )}
              {selectedMenuItem.isSoldOut && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <span className="bg-red-900/80 text-white px-6 py-2 rounded-xl font-black text-xl tracking-widest uppercase shadow-2xl border border-red-500/30">TÜKENDİ</span>
                 </div>
              )}
            </div>
            
            <div className="p-6 sm:p-8 flex flex-col gap-4">
               <div className="flex justify-between items-start gap-4">
                  <h3 className={`text-2xl font-serif font-light tracking-wide leading-tight ${selectedMenuItem.isSoldOut ? 'text-slate-500' : 'text-white'}`}>{selectedMenuItem.name}</h3>
                  {selectedMenuItem.price && <span className={`text-xl font-serif whitespace-nowrap ${selectedMenuItem.isSoldOut ? 'text-slate-500' : 'text-[#c2784f]'}`}>{selectedMenuItem.price} TL</span>}
               </div>
               
               {(selectedMenuItem.badges?.length > 0 || selectedMenuItem.prepTime || selectedMenuItem.calories) && (
                 <div className="flex flex-wrap gap-2 items-center border-b border-white/5 pb-5">
                   {selectedMenuItem.badges?.map(b => {
                     const badgeDef = BADGE_OPTIONS.find(opt => opt.id === b);
                     return badgeDef ? (
                       <span key={b} className={`bg-[#c2784f]/10 text-[#c2784f] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-md flex items-center gap-1.5 border border-[#c2784f]/20 ${selectedMenuItem.isSoldOut ? 'opacity-50' : ''}`}>
                         <span>{badgeDef.icon}</span> {badgeDef.label}
                       </span>
                     ) : null;
                   })}
                   {selectedMenuItem.prepTime && <span className="flex items-center gap-1.5 text-slate-400 font-medium text-xs ml-2 uppercase tracking-widest"><Clock size={14} className="text-[#c2784f]"/> {selectedMenuItem.prepTime}</span>}
                   {selectedMenuItem.calories && <span className="flex items-center gap-1.5 text-slate-400 font-medium text-xs ml-2 uppercase tracking-widest"><Flame size={14} className="text-orange-500"/> {selectedMenuItem.calories}</span>}
                 </div>
               )}
               
               {selectedMenuItem.description && (
                 <p className={`text-sm leading-relaxed font-light ${selectedMenuItem.isSoldOut ? 'text-slate-500' : 'text-slate-300'}`}>
                   {selectedMenuItem.description}
                 </p>
               )}
               
               <button type="button" onClick={() => setSelectedMenuItem(null)} className="w-full mt-6 btn-premium shine-effect py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs">
                 Kapat
               </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAYLI PERSONEL MODALI VE YORUM ALANI */}
      {selectedPersonnel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a0908] rounded-3xl shadow-[0_0_50px_rgba(194,120,79,0.15)] border border-white/10 w-full max-w-md sm:max-w-lg overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300 max-h-[85vh] sm:max-h-[90vh]">
            <button type="button" onClick={() => {setSelectedPersonnel(null); setReviewData({ name: '', isAnonymous: false, rating: 5, comment: '' });}} className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white p-3 w-10 h-10 rounded-full transition-colors flex items-center justify-center border border-white/10">
              <X size={20} />
            </button>
            
            <div className="w-full bg-[#120f0d] relative flex justify-center items-end shrink-0 border-b border-white/5 overflow-hidden">
              {selectedPersonnel.image ? (
                 <img src={selectedPersonnel.image} alt={selectedPersonnel.name} className="w-full h-auto max-h-[40vh] object-contain p-4 pb-16 opacity-90" />
              ) : (
                 <div className="w-full h-48 flex items-center justify-center text-slate-600 bg-[#120f0d]"><UserSquare size={64} /></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/50 to-transparent pointer-events-none"></div>
              
              <div className="absolute bottom-0 left-0 p-5 sm:p-6 text-white w-full">
                 <div className="flex justify-between items-end gap-3">
                   <div className="flex-1">
                     <h3 className="text-2xl sm:text-3xl font-serif font-light leading-tight drop-shadow-md text-white">{selectedPersonnel.name} <span className="font-black italic text-[#c2784f]">{selectedPersonnel.surname}</span></h3>
                     {selectedPersonnel.nickname && <p className="text-[#e09f7a] font-light tracking-wide text-sm mt-1 drop-shadow-md">"{selectedPersonnel.nickname}"</p>}
                   </div>
                   <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex flex-col items-center shrink-0 shadow-lg">
                     <span className="flex items-center gap-1 text-[#e09f7a] font-black text-lg sm:text-xl"><Star size={16} className="text-[#c2784f]"/> {selectedPersonnel.reviews?.length > 0 ? (selectedPersonnel.reviews.reduce((a,c)=>a+c.rating,0)/selectedPersonnel.reviews.length).toFixed(1) : '5.0'}</span>
                     <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">{selectedPersonnel.reviews?.length || 0} Yorum</span>
                   </div>
                 </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-7 bg-transparent custom-scrollbar pb-24 sm:pb-8">
               {selectedPersonnel.skills && (
                 <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm text-center">
                   <h4 className="text-[10px] sm:text-xs font-black text-[#c2784f] uppercase tracking-widest mb-2 flex items-center justify-center gap-2"><div className="w-4 h-[1px] bg-[#c2784f]"></div> Yetenekler & Uzmanlık <div className="w-4 h-[1px] bg-[#c2784f]"></div></h4>
                   <p className="text-sm font-light text-slate-300 leading-relaxed italic">"{selectedPersonnel.skills}"</p>
                 </div>
               )}

               <div className="mb-8">
                 <h4 className="font-serif font-light text-xl text-white mb-4 border-b border-white/5 pb-3 flex items-center gap-3"><MessageSquareText size={20} className="text-[#c2784f]"/> Müşteri Yorumları</h4>
                 {(!selectedPersonnel.reviews || selectedPersonnel.reviews.length === 0) ? (
                    <p className="text-sm text-slate-500 italic text-center py-6 font-light">Bu personel için henüz yorum yapılmamış. İlk değerlendiren siz olun!</p>
                 ) : (
                    <div className="space-y-4">
                      {selectedPersonnel.reviews.sort((a,b) => new Date(b.date) - new Date(a.date)).map(rev => (
                        <div key={rev.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <span className="font-bold text-sm text-slate-200">{rev.name}</span>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={i < rev.rating ? "text-[#c2784f]" : "text-slate-700"} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-slate-300 font-light leading-relaxed">{rev.comment}</p>
                          <span className="text-[10px] font-black tracking-widest uppercase text-slate-500 mt-3 block">{new Date(rev.date).toLocaleDateString('tr-TR')}</span>
                          
                          {rev.reply && (
                            <div className="mt-4 bg-[#1a1512] p-4 rounded-xl border border-[#c2784f]/20 relative ml-4">
                              <div className="absolute -left-2 top-4 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-[#1a1512] border-b-[6px] border-b-transparent"></div>
                              <span className="text-[10px] font-black text-[#e09f7a] uppercase tracking-widest flex items-center gap-2 mb-2"><MessageCircle size={12}/> Salaaş Cafe Yönetimi</span>
                              <p className="text-sm text-slate-300 font-light leading-relaxed">{rev.reply}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                 )}
               </div>
               
               {/* Yorum Ekleme Formu */}
               <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 shadow-lg">
                 <h4 className="font-serif font-light text-xl text-white mb-5 text-center">Puan Verin</h4>
                 <form onSubmit={handleReviewSubmit} className="space-y-5">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="flex gap-2 mx-auto sm:mx-0">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} type="button" onClick={() => setReviewData({...reviewData, rating: star})} className="hover:scale-110 transition-transform">
                            <Star size={24} className={reviewData.rating >= star ? "text-[#c2784f]" : "text-slate-600"} />
                          </button>
                        ))}
                      </div>
                      <label className="flex items-center justify-center gap-3 cursor-pointer text-xs font-black tracking-widest uppercase text-slate-400 bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 shadow-sm transition-colors hover:bg-white/10">
                        <input type="checkbox" checked={reviewData.isAnonymous} onChange={(e) => setReviewData({...reviewData, isAnonymous: e.target.checked, name: e.target.checked ? '' : reviewData.name})} className="w-4 h-4 text-[#c2784f] rounded border-white/20 bg-transparent focus:ring-[#c2784f]" />
                        Gizli İsim
                      </label>
                   </div>
                   
                   {!reviewData.isAnonymous && (
                     <div>
                       <input type="text" placeholder="Adınız Soyadınız" value={reviewData.name} onChange={(e) => setReviewData({...reviewData, name: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none font-medium transition-all text-sm bg-white/5 text-white placeholder-slate-500" required />
                     </div>
                   )}
                   
                   <div>
                     <textarea placeholder="Personelimiz hakkındaki görüşlerinizi yazın..." value={reviewData.comment} onChange={(e) => setReviewData({...reviewData, comment: e.target.value})} rows="3" className="w-full px-5 py-4 rounded-xl border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none font-medium transition-all resize-none text-sm bg-white/5 text-white placeholder-slate-500" required></textarea>
                   </div>
                   
                   <button type="submit" className="w-full btn-premium shine-effect py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-lg mt-2">Yorumu Gönder</button>
                 </form>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* YÖNETİM PANELİ YORUM CEVAPLAMA MODALI */}
      {managingReviewsFor && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                <div>
                   <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
                     <MessageSquareText className="text-blue-500" /> 
                     Yorum Yönetimi
                   </h3>
                   <p className="text-sm font-medium text-slate-500 mt-1">{managingReviewsFor.name} {managingReviewsFor.surname}</p>
                </div>
                <button type="button" onClick={()=>setManagingReviewsFor(null)} className="p-3 bg-white hover:bg-slate-200 rounded-full transition-colors shadow-sm w-10 h-10 flex items-center justify-center"><X size={24}/></button>
              </div>
              
              <div className="overflow-y-auto flex-1 p-6 space-y-4 bg-white">
                {(!managingReviewsFor.reviews || managingReviewsFor.reviews.length === 0) ? (
                  <div className="text-center text-slate-400 py-12 flex flex-col items-center">
                    <MessageCircle size={48} className="mb-4 opacity-30" />
                    <p className="text-lg font-bold">Henüz yorum yapılmamış.</p>
                  </div>
                ) : (
                  managingReviewsFor.reviews.sort((a,b) => new Date(b.date) - new Date(a.date)).map(rev => (
                    <div key={rev.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="font-bold text-sm text-slate-800 block">{rev.name}</span>
                          <div className="flex gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} className={i < rev.rating ? "fill-orange-400 text-orange-400" : "fill-slate-200 text-slate-200"} />
                            ))}
                          </div>
                        </div>
                        <button type="button" onClick={() => handleDeleteReview(managingReviewsFor.id, rev.id)} className="text-red-500 bg-red-50 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold" title="Yorumu Sil"><Trash2 size={14}/> Sil</button>
                      </div>
                      <p className="text-sm text-slate-700 mb-2">{rev.comment}</p>
                      <span className="text-[10px] font-bold text-slate-400">{new Date(rev.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      
                      {rev.reply ? (
                        <div className="mt-4 bg-blue-50 p-3.5 rounded-xl border border-blue-100 relative group">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Cevabınız</span>
                            <button type="button" onClick={() => handleDeleteReply(managingReviewsFor.id, rev.id)} className="text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded transition-colors flex items-center gap-1 text-[10px] font-bold opacity-0 group-hover:opacity-100" title="Cevabı Sil">
                              <Trash2 size={12}/> Sil
                            </button>
                          </div>
                          <p className="text-sm text-slate-700">{rev.reply}</p>
                        </div>
                      ) : (
                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                          <input 
                            type="text" 
                            placeholder="Müşteriye yanıt yazın..." 
                            value={replyTexts[rev.id] || ''} 
                            onChange={(e) => setReplyTexts({...replyTexts, [rev.id]: e.target.value})}
                            className="flex-1 text-sm p-3 rounded-xl border border-slate-300 focus:border-blue-500 outline-none font-medium bg-white text-slate-800"
                          />
                          <button 
                            type="button"
                            onClick={() => handleReplyReview(managingReviewsFor.id, rev.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-md"
                          >
                            <MessageCircle size={14}/> Cevapla
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
           </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6">
              <h3 className="font-black text-lg mb-4 text-slate-800">Yeni Kategori Ekle</h3>
              <input type="text" placeholder="Örn: Tatlılar" value={newCategoryName} onChange={(e)=>setNewCategoryName(e.target.value)} className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none font-bold mb-6 text-slate-800 bg-white" autoFocus />
              <div className="flex gap-3">
                 <button type="button" onClick={()=>setShowCategoryModal(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">İptal</button>
                 <button type="button" onClick={handleAddCategory} className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-colors">Ekle</button>
              </div>
           </div>
        </div>
      )}

      {/* PERSONEL SİLME ONAY MODALI */}
      {personnelDeleteConfirmId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Personeli Sil</h3>
                <p className="text-slate-500 font-medium">Bu personeli silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
              </div>
              <div className="flex gap-3 w-full">
                <button type="button" onClick={() => setPersonnelDeleteConfirmId(null)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-black hover:bg-slate-50 transition-colors">İptal</button>
                <button type="button" onClick={() => executeDeletePersonnel(personnelDeleteConfirmId)} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black transition-colors shadow-md">Evet, Sil</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VARSAYILAN MENÜ AKTAR ONAY MODALI */}
      {showImportConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <MenuSquare size={28} className="text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Varsayılan Menüyü Aktar</h3>
                <p className="text-slate-500 font-medium">Varsayılan menü öğeleri veritabanına eklenecektir. Onaylıyor musunuz?</p>
              </div>
              <div className="flex gap-3 w-full">
                <button type="button" onClick={() => setShowImportConfirm(false)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-black hover:bg-slate-50 transition-colors">İptal</button>
                <button type="button" onClick={importDefaultMenu} className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black transition-colors shadow-md">Aktar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          className={`fixed bottom-24 right-4 sm:right-6 z-[300] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl max-w-xs sm:max-w-sm border ${
            toast.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' :
            toast.type === 'error'   ? 'bg-red-600 border-red-500 text-white' :
                                       'bg-slate-700 border-slate-600 text-white'
          }`}
          style={{ animation: 'toastIn 0.35s cubic-bezier(.21,1.02,.73,1) both' }}
        >
          <span className="text-xl shrink-0">
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <p className="font-bold text-sm leading-snug">{toast.message}</p>
          <button type="button" onClick={() => setToast(null)} className="ml-2 shrink-0 opacity-70 hover:opacity-100 transition-opacity">
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );

  // --- SAYFA RENDER: VİTRİN ---
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 relative flex flex-col scroll-smooth w-full">
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        {renderNavbar(false)}

        <header className="relative w-full min-h-[600px] h-[85vh] max-h-[1100px] flex items-center justify-center overflow-hidden pt-24 sm:pt-20 bg-[#0a0908] bg-[url('/salaasarkaplan.jpeg')] bg-cover bg-center bg-no-repeat">
           <div className="absolute inset-0 z-0 bg-black/50">
             <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908]/90 via-black/40 to-[#0a0908] w-full"></div>
             <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #c2784f 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }}></div>
           </div>
           
           <div className="relative z-10 text-center px-4 sm:px-6 w-full flex flex-col items-center justify-center h-full pb-16">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-wide text-white font-serif mb-6 drop-shadow-2xl animate-fade-in-up delay-100 leading-tight">
                Lezzet ve <span className="text-gradient-copper italic font-light">Muhabbetin</span> Adresi
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto font-light tracking-wide mb-12 drop-shadow-lg animate-fade-in-up delay-200">
                Şehrin gürültüsünden uzak, samimi atmosferimizde unutulmaz tatlar ve anılar biriktirin.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 animate-fade-in-scale delay-300 w-full max-w-md lg:max-w-lg mx-auto mb-16">
                 <button onClick={() => setShowRequestModal(true)} className="w-full sm:w-auto btn-premium px-8 py-4 lg:px-10 lg:py-5 rounded-full font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 lg:text-base">
                   <CalendarDays size={20} /> Rezervasyon Talebi
                 </button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-10 text-[10px] sm:text-xs lg:text-sm font-black tracking-widest uppercase text-slate-200 animate-fade-in-up delay-400">
                 <span className="flex items-center gap-2 glass px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full shadow-xl">
                   <Coffee size={18} className="text-[#c2784f]"/> Kahvaltı
                 </span>
                 <span className="flex items-center gap-2 glass px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full shadow-xl">
                   <UtensilsCrossed size={18} className="text-[#c2784f]"/> Izgara
                 </span>
                 <span className="flex items-center gap-2 glass px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full shadow-xl">
                   <Wind size={18} className="text-[#c2784f]"/> Nargile
                 </span>
              </div>
           </div>
           
           <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce cursor-pointer z-20 hover:text-[#c2784f] transition-colors" onClick={() => handleScrollToId('hakkimizda')}>
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-bold block mb-3 opacity-70 text-center">Keşfet</span>
              <div className="w-6 h-10 lg:w-8 lg:h-12 border-2 border-white/20 rounded-full flex justify-center p-1 mx-auto">
                <div className="w-1 h-2 lg:h-3 bg-[#c2784f] rounded-full"></div>
              </div>
           </div>
        </header>

        <main className="w-full relative z-10 flex-1 flex flex-col">
          <section id="hakkimizda" className="w-full mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 py-24 md:py-36 text-center bg-[#1c1917] text-white">
            <div className="animate-float inline-block mb-8">
              <div className="w-20 h-20 rounded-full bg-[#c2784f]/10 flex items-center justify-center border border-[#c2784f]/20 shadow-[0_0_30px_rgba(194,120,79,0.15)]">
                <MoonStar size={40} className="text-[#c2784f]" />
              </div>
            </div>
            <h2 className="text-[10px] sm:text-xs lg:text-sm font-black tracking-[0.4em] text-[#e09f7a] uppercase mb-4">Hikayemiz</h2>
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-white mb-10 leading-tight">Sıcak, Samimi ve <span className="text-gradient-copper font-black italic">Lezzetli</span></h3>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed font-light max-w-4xl mx-auto px-4">
              Salaaş Cafe Restaurant olarak, misafirlerimize kendilerini evlerinde hissedecekleri sıcak bir ortam sunuyoruz. Özenle seçilmiş malzemelerle hazırladığımız zengin menümüz, imza ızgaralarımız, serpme kahvaltımız ve keyifli nargile köşemizle günün her saatinde kaliteli bir deneyim yaşatmayı hedefliyoruz.
            </p>
            <div className="w-20 h-1 bg-[#c2784f] mx-auto mt-16 rounded-full opacity-50"></div>
          </section>

          <section id="lezzetler" className="w-full py-24 md:py-36 bg-[#0a0908] relative">
            {/* Background elements */}
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-[#c2784f]/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[150px]"></div>

            <div className="w-full mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 relative z-10">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-8">
                <div>
                  <h2 className="text-[10px] sm:text-xs lg:text-sm font-black tracking-[0.4em] text-[#e09f7a] uppercase mb-4">Vitrinimiz</h2>
                  <h3 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-white">Bunu <span className="text-gradient-copper italic font-black">Denediniz mi?</span></h3>
                </div>
                <button 
                  onClick={handleNavToMenu} 
                  className="group flex items-center gap-4 text-xs font-black text-slate-400 hover:text-[#c2784f] transition-all uppercase tracking-[0.2em]"
                >
                  Tüm Menüyü Gör 
                  <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-[#c2784f] group-hover:bg-[#c2784f]/10 transition-colors">
                    <ChevronRight size={18} className="text-white group-hover:text-[#c2784f]"/>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-10">
                {activeGallery.slice(0, 4).map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedMenuItem(item)} 
                    className="glass-card rounded-[2rem] overflow-hidden relative group h-80 sm:h-96 md:h-[450px] cursor-pointer"
                  >
                    <img src={item.image} alt={item.name} className={`w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000 ${item.isSoldOut ? 'opacity-40 grayscale' : 'opacity-80 group-hover:opacity-100'}`} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8 lg:p-10">
                       <span className={`text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full w-max mb-6 flex items-center gap-2 backdrop-blur-md border ${item.isSoldOut ? 'bg-red-900/80 border-red-500/50 text-red-200' : 'bg-black/60 border-white/20 text-[#e09f7a]'}`}>
                         {item.isSoldOut ? 'TÜKENDİ' : <><Star size={12} className="text-[#c2784f]"/> {item.tag || 'Öne Çıkan'}</>}
                       </span>
                       <h4 className="text-white font-serif font-light text-3xl lg:text-4xl drop-shadow-md mb-2 group-hover:text-[#c2784f] transition-colors">{item.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full py-28 md:py-40 bg-[#12100e] text-white relative overflow-hidden border-t border-white/5">
             <div className="absolute inset-0 opacity-[0.03] w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
             <div className="absolute -left-32 top-0 opacity-10 text-[#c2784f] hidden md:block"><Star size={600}/></div>
             
             <div className="w-full mx-auto px-6 sm:px-10 lg:px-16 text-center relative z-10">
               <h2 className="text-[10px] lg:text-xs font-black tracking-[0.4em] text-[#e09f7a] uppercase mb-6">Davet & Organizasyon</h2>
               <h3 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-light mb-8 drop-shadow-lg text-white">Özel Günleriniz İçin <br/> <span className="text-gradient-copper font-black italic">Yanınızdayız</span></h3>
               <p className="text-base sm:text-lg lg:text-2xl text-slate-400 font-light mb-16 max-w-3xl mx-auto leading-relaxed">
                 Doğum günü partileri, şirket yemekleri, toplu iftarlar ve tüm özel kutlamalarınız için 300 kişilik kapasitemiz ve size özel menülerimizle hizmetinizdeyiz.
               </p>
               <button 
                 onClick={() => {setRequestData({...requestData, type: 'organizasyon'}); setShowRequestModal(true);}} 
                 className="btn-premium px-10 py-5 lg:px-12 lg:py-6 rounded-full font-black uppercase tracking-[0.2em] shadow-2xl inline-flex items-center gap-3 text-sm lg:text-base"
               >
                 <CalendarDays size={20}/> Organizasyon Talebi
               </button>
             </div>
          </section>

        </main>

        {renderFooter()}
        {renderModals()}
        
        {/* WHATSAPP FLOATING BUTTON */}
        <a 
          href={`https://wa.me/${WHATSAPP_NO}?text=Merhaba%20Salaas%20Cafe,%20`} 
          target="_blank" 
          rel="noreferrer" 
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-3.5 rounded-full font-black shadow-2xl flex items-center justify-center gap-2 transition-transform hover:scale-110 border-4 border-white"
        >
          <span className="text-xl">💬</span>
          <span className="hidden sm:block text-sm uppercase tracking-widest">WhatsApp</span>
        </a>
      </div>
    );
  }

  if (currentView === 'menu') {
    return (
      <div className="min-h-screen bg-[#0a0908] font-sans text-slate-200 relative w-full">
        
        {/* Background Accents */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#c2784f]/5 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-white/5 rounded-full blur-[150px]"></div>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #c2784f 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        {renderNavbar(true)}
        
        <div className="sticky top-[72px] sm:top-[80px] z-[45] glass border-b border-white/5 py-3 sm:py-4 shadow-xl w-full">
           <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 flex overflow-x-auto gap-3 sm:gap-4 hide-scrollbar items-center">
              {activeMenuCategories.map(cat => (
                  <button 
                    id={`btn-${cat.id}`}
                    key={cat.id} 
                    onClick={() => scrollToMenuCategory(cat.id)} 
                    className={`whitespace-nowrap px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all uppercase text-[10px] sm:text-xs font-black tracking-[0.2em] flex-shrink-0 ${
                      activeCategory === cat.id 
                        ? 'btn-premium' 
                        : 'btn-outline-premium bg-white/5'
                    }`}
                  >
                      {cat.name}
                  </button>
              ))}
           </div>
        </div>

        <main className="w-full mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 pt-12 md:pt-24 pb-16 md:pb-24 relative z-10">
           {activeGallery.length > 0 && (
             <div className="mb-28">
                <div className="text-center mb-16">
                   <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-white mb-4 drop-shadow-lg"><span className="text-gradient-copper italic font-black">Öne</span> Çıkanlar</h1>
                   <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg font-light tracking-wide uppercase">En çok tercih edilen imza lezzetlerimiz.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-10">
                   {activeGallery.map((item, idx) => (
                      <div key={item.id || idx} onClick={() => setSelectedMenuItem(item)} className="glass-card rounded-3xl overflow-hidden group relative shadow-2xl h-80 md:h-96 cursor-pointer">
                         <img src={item.image} alt={item.name} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${item.isSoldOut ? 'opacity-30 grayscale' : 'opacity-80 group-hover:opacity-100'}`} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6 lg:p-8">
                            {item.isSoldOut ? (
                               <span className="bg-red-900/80 border border-red-500/50 text-red-200 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full w-max mb-4 flex items-center gap-2 backdrop-blur-md">TÜKENDİ</span>
                            ) : item.tag && (
                               <span className="bg-black/60 border border-white/20 text-[#e09f7a] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full w-max mb-4 flex items-center gap-2 backdrop-blur-md"><Star size={12} className="text-[#c2784f]"/> {item.tag}</span>
                            )}
                            <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-wide drop-shadow-md group-hover:text-[#c2784f] transition-colors ${item.isSoldOut ? 'text-slate-400' : 'text-white'}`}>{item.name}</h3>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           )}

           <div className="space-y-28">
              {activeMenuCategories.map(cat => {
                 const CatIcon = cat.Icon || UtensilsCrossed;
                 return (
                   <div id={`cat-${cat.id}`} key={cat.id} className="scroll-mt-[200px]">
                      <div className="flex items-center gap-6 mb-12">
                         <div className="bg-[#1c1917] border border-white/10 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shrink-0">
                           <CatIcon size={24} className="text-[#c2784f]" />
                         </div>
                         <h2 className="text-3xl sm:text-4xl font-serif font-light text-white tracking-wide"><span className="text-gradient-copper font-black italic">{cat.name}</span></h2>
                         <div className="h-[1px] flex-1 bg-gradient-to-r from-[#c2784f]/50 to-transparent ml-6"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                         {cat.items.map((itemObj, idx) => {
                           if(itemObj.image) {
                             return (
                                <div key={idx} onClick={() => setSelectedMenuItem(itemObj)} className={`glass-card rounded-2xl overflow-hidden group shadow-lg flex flex-col h-full min-h-[220px] cursor-pointer relative ${itemObj.isSoldOut ? 'opacity-60 grayscale' : ''}`}>
                                   {itemObj.badges && itemObj.badges.length > 0 && (
                                     <div className="absolute top-3 left-3 z-10 flex gap-2">
                                       {itemObj.badges.map(b => {
                                          const def = BADGE_OPTIONS.find(o=>o.id===b);
                                          return def ? <span key={b} className="bg-white/90 text-slate-900 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-lg backdrop-blur-md">{def.icon}</span> : null;
                                       })}
                                     </div>
                                   )}
                                   {itemObj.isSoldOut && <div className="absolute top-3 right-3 z-10 bg-red-900/90 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-[0.2em] backdrop-blur-md border border-red-500/50">Tükendi</div>}
                                   <div className="relative w-full h-44 sm:h-52 bg-white/5 flex items-center justify-center overflow-hidden shrink-0 border-b border-white/5">
                                      <img src={itemObj.image} alt={itemObj.name} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000 opacity-90 group-hover:opacity-100" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                   </div>
                                   <div className="p-6 flex flex-col justify-between bg-transparent grow">
                                      <div>
                                        <div className="flex justify-between items-start gap-4 mb-3"><span className="text-white font-serif font-light text-lg sm:text-xl tracking-wide leading-snug group-hover:text-[#c2784f] transition-colors">{itemObj.name}</span>{itemObj.price && <span className="text-[#e09f7a] font-bold whitespace-nowrap text-sm sm:text-base border border-[#c2784f]/30 px-3 py-1 rounded-full bg-[#c2784f]/10">{itemObj.price} TL</span>}</div>
                                        {itemObj.description && <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 font-light">{itemObj.description}</p>}
                                      </div>
                                   </div>
                                </div>
                             );
                           } else {
                             return (
                                <div key={idx} onClick={() => setSelectedMenuItem(itemObj)} className={`glass-card rounded-2xl p-6 flex flex-col justify-between group transition-all h-full min-h-[100px] cursor-pointer relative ${itemObj.isSoldOut ? 'opacity-60 grayscale' : ''}`}>
                                   {itemObj.isSoldOut && <div className="absolute top-3 right-3 z-10 bg-red-900/90 text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg uppercase tracking-widest backdrop-blur-md border border-red-500/50">Tükendi</div>}
                                   {itemObj.badges && itemObj.badges.length > 0 && (
                                     <div className="flex gap-2 mb-3">
                                       {itemObj.badges.map(b => {
                                          const def = BADGE_OPTIONS.find(o=>o.id===b);
                                          return def ? <span key={b} className="bg-white/10 text-slate-200 text-[9px] font-black tracking-wider px-2 py-1 rounded border border-white/10 backdrop-blur-sm">{def.icon}</span> : null;
                                       })}
                                     </div>
                                   )}
                                   <div className="flex justify-between items-start gap-4">
                                     <span className="text-slate-200 font-serif font-light text-lg group-hover:text-[#c2784f] transition-colors leading-snug">{itemObj.name}</span>
                                     {itemObj.price && <span className="text-[#e09f7a] font-bold whitespace-nowrap text-sm border border-[#c2784f]/30 px-3 py-1 rounded-full bg-[#c2784f]/10">{itemObj.price} TL</span>}
                                   </div>
                                   {itemObj.description && <p className="text-slate-400 text-xs mt-3 line-clamp-2 font-light">{itemObj.description}</p>}
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

        {/* WHATSAPP FLOATING BUTTON */}
        <a 
          href={`https://wa.me/${WHATSAPP_NO}?text=Merhaba%20Salaas%20Cafe,%20`} 
          target="_blank" 
          rel="noreferrer" 
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-3.5 rounded-full font-black shadow-2xl flex items-center justify-center gap-2 transition-transform hover:scale-110 border-4 border-white"
        >
          <span className="text-xl">💬</span>
          <span className="hidden sm:block text-sm uppercase tracking-widest">WhatsApp</span>
        </a>
      </div>
    );
  }

  // --- SAYFA RENDER: PERSONELLERİMİZ ---
  if (currentView === 'personnel') {
    return (
      <div className="min-h-screen bg-[#0a0908] font-sans text-slate-200 relative w-full overflow-x-hidden">
        {renderNavbar(false)}
        
        <header className="w-full pt-36 pb-20 lg:pt-44 lg:pb-32 bg-aurora text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/50 z-0"></div>
          <div className="absolute inset-0 opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #c2784f 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="relative z-10 px-4">
             <h2 className="text-[10px] sm:text-xs lg:text-sm font-black tracking-[0.4em] text-[#e09f7a] uppercase mb-4">Takımımız</h2>
             <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light mb-6 text-white drop-shadow-2xl">Ekibimizin <span className="text-gradient-copper italic font-black">Kalbi</span></h1>
             <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto font-light tracking-wide">Salaaş Restaurant'ın lüksünü ve samimiyetini var eden, her gün özveriyle hizmet sunan değerlerimiz.</p>
          </div>
        </header>

        <main className="w-full mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 py-20 md:py-32 relative z-10">
           {personnelList.length === 0 ? (
             <div className="text-center text-slate-500 py-24 flex flex-col items-center">
                <Users size={72} className="mb-6 opacity-40 text-[#c2784f]" />
                <h3 className="text-2xl font-light font-serif text-slate-400 mb-2">Henüz kimse eklenmedi</h3>
                <p className="text-sm font-light tracking-wide uppercase">Ekibimizi çok yakında burada görebileceksiniz.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
               {personnelList.sort((a,b) => (a.order || 999) - (b.order || 999)).map(person => {
                 const avgRating = person.reviews?.length > 0 ? (person.reviews.reduce((a,c)=>a+c.rating,0)/person.reviews.length).toFixed(1) : 'Yeni';
                 return (
                   <div key={person.id} onClick={() => setSelectedPersonnel(person)} className="glass-card rounded-[2.5rem] overflow-hidden transition-all duration-700 group cursor-pointer relative shadow-2xl">
                      <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/10">
                        <Star size={12} className="text-[#c2784f]" />
                        <span className="font-bold text-white text-[10px] tracking-widest">{avgRating}</span>
                      </div>
                      <div className="h-72 sm:h-80 w-full bg-[#111] relative overflow-hidden">
                         {person.image ? (
                           <img src={person.image} alt={`${person.name} ${person.surname}`} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000 opacity-90 group-hover:opacity-100" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center bg-[#111] text-slate-700"><UserSquare size={64}/></div>
                         )}
                         <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/60 to-transparent"></div>
                         <div className="absolute bottom-0 left-0 w-full p-8 text-white z-10">
                            <h3 className="text-3xl font-serif font-light leading-tight drop-shadow-md group-hover:text-[#c2784f] transition-colors">{person.name} <span className="font-black italic text-gradient-copper">{person.surname}</span></h3>
                            {person.nickname && <p className="text-[#e09f7a] font-light tracking-wide text-sm mt-2">"{person.nickname}"</p>}
                         </div>
                      </div>
                      <div className="p-8 bg-transparent min-h-[140px] flex flex-col justify-center">
                         <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><div className="w-4 h-[1px] bg-[#c2784f]"></div> Uzmanlık</h4>
                         {person.skills ? (
                           <p className="text-sm font-light text-slate-300 leading-relaxed line-clamp-3">{person.skills}</p>
                         ) : (
                           <p className="text-sm font-light text-slate-600 italic">Belirtilmedi</p>
                         )}
                      </div>
                   </div>
                 );
               })}
             </div>
           )}
        </main>
        
        {renderFooter()}
        {renderModals()}

        {/* WHATSAPP FLOATING BUTTON */}
        <a 
          href={`https://wa.me/${WHATSAPP_NO}?text=Merhaba%20Salaas%20Cafe,%20`} 
          target="_blank" 
          rel="noreferrer" 
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-3.5 rounded-full font-black shadow-2xl flex items-center justify-center gap-2 transition-transform hover:scale-110 border-4 border-white"
        >
          <span className="text-xl">💬</span>
          <span className="hidden sm:block text-sm uppercase tracking-widest">WhatsApp</span>
        </a>
      </div>
    );
  }

  // --- SAYFA RENDER: ADMİN PANELİ ---
  return (
    <div className={`min-h-screen font-sans text-slate-800 pb-12 print:bg-white print:pb-0 relative transition-colors duration-500 w-full ${activeAdminTab === 'restoran' || activeAdminTab === 'menu' || activeAdminTab === 'personel' ? 'bg-[#fafafa]' : (activeAdminTab === 'mac' ? 'bg-slate-50' : 'bg-[#fafafa]')}`}>
      {bulkMessage && <div className="fixed top-24 right-4 sm:right-10 z-[100] bg-white text-slate-800 p-4 sm:p-5 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm border border-slate-200 animate-in slide-in-from-right-8 duration-300"><CheckCircle size={24} className="text-[#c2784f] shrink-0" /><p className="font-medium text-sm sm:text-base leading-snug">{bulkMessage}</p><button type="button" onClick={() => setBulkMessage('')} className="ml-auto text-slate-400 hover:text-slate-800 bg-slate-100 p-1.5 rounded-lg transition-colors shrink-0"><X size={18} /></button></div>}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }}></style>

      <header className={`bg-white text-slate-800 shadow-sm border-b border-slate-200 sticky z-20 print:hidden transition-colors duration-500 w-full top-0`}>
        {/* Üst satır: Logo + Başlık + Tarih + Çıkış */}
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-20 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 shrink-0">
            <div className="h-8 sm:h-10 shrink-0 flex items-center justify-center cursor-pointer" onClick={() => setCurrentView('landing')}>
              <img src="/salaaslogobg.png" alt="Salaaş Cafe Logo" className="h-full w-auto object-contain filter invert opacity-80" />
            </div>
            <div className="hidden sm:block border-l border-slate-300 pl-4">
              <h1 className={`text-sm md:text-base lg:text-lg font-black tracking-widest uppercase text-slate-700 font-sans`}>Yönetim Paneli</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            {(activeAdminTab === 'restoran' || activeAdminTab === 'mac') && (
              <div className="flex shrink-0 items-center bg-slate-50 rounded-xl px-4 py-2 border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm">
                <CalendarDays className={`mr-2 text-[#c2784f]`} size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden lg:inline mr-2">Tarih:</span>
                <input type="date" value={activeAdminTab === 'restoran' ? selectedFilterDate : selectedMatchDate} onChange={(e) => activeAdminTab === 'restoran' ? setSelectedFilterDate(e.target.value) : setSelectedMatchDate(e.target.value)} className="bg-transparent text-white outline-none font-bold cursor-pointer text-sm w-auto" />
              </div>
            )}
            <button onClick={() => {setIsAuthenticated(false); setLoginUser(''); setLoginPass(''); setCurrentView('landing');}} className="shrink-0 bg-red-500 hover:bg-red-600 text-white px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-md whitespace-nowrap">ÇIKIŞ</button>
          </div>
        </div>
        {/* Alt satır: Sekmeler — tam genişlik, her cihazda görünür */}
        <div className="w-full border-t border-slate-200">
          <div className="w-full overflow-x-auto hide-scrollbar">
            <div className="flex items-center min-w-max px-4 sm:px-8 lg:px-12 xl:px-20 py-2.5 gap-2">
              <button onClick={() => setActiveAdminTab('restoran')} className={`px-4 sm:px-6 py-2.5 rounded-xl text-[11px] sm:text-xs font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activeAdminTab === 'restoran' ? 'bg-[#c2784f] text-white shadow-lg shadow-[#c2784f]/20' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}><UtensilsCrossed size={16}/> <span>Restoran</span></button>
              <button onClick={() => setActiveAdminTab('mac')} className={`px-4 sm:px-6 py-2.5 rounded-xl text-[11px] sm:text-xs font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activeAdminTab === 'mac' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}><MonitorPlay size={16}/> <span>Maç</span></button>
              <button onClick={() => setActiveAdminTab('menu')} className={`px-4 sm:px-6 py-2.5 rounded-xl text-[11px] sm:text-xs font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activeAdminTab === 'menu' ? 'bg-[#c2784f] text-white shadow-lg shadow-[#c2784f]/20' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}><MenuSquare size={16}/> <span>Menü</span></button>
              <button onClick={() => setActiveAdminTab('personel')} className={`px-4 sm:px-6 py-2.5 rounded-xl text-[11px] sm:text-xs font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activeAdminTab === 'personel' ? 'bg-[#c2784f] text-white shadow-lg shadow-[#c2784f]/20' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}><Users size={16}/> <span>Personel</span></button>
              <button onClick={() => setActiveAdminTab('talepler')} className={`relative px-4 sm:px-6 py-2.5 rounded-xl text-[11px] sm:text-xs font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activeAdminTab === 'talepler' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}>
                <Inbox size={16}/> <span>Talepler</span>
                {pendingRequests.length > 0 && (<span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full shadow-md font-black border border-white">{pendingRequests.length}</span>)}
              </button>
              <button onClick={() => setActiveAdminTab('gecmis')} className={`px-4 sm:px-6 py-2.5 rounded-xl text-[11px] sm:text-xs font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activeAdminTab === 'gecmis' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}><History size={16}/> <span>Geçmiş</span></button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-4 sm:px-8 lg:px-12 xl:px-20 mt-8 lg:mt-10 relative z-10">
        
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
              <div className={`bg-white rounded-3xl shadow-sm border overflow-hidden transition-colors w-full ${activeAdminTab==='mac' ? (isMatchEditing?'border-blue-400':'border-slate-200') : (isEditing?'border-[#c2784f]':'border-slate-200')}`}>
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-800">{activeAdminTab==='mac' ? (isMatchEditing?'Maç Düzelt':'Yeni Maç Kaydı') : (isEditing?'Kayıt Düzelt':'Yeni Rezervasyon')}</h2>
                  {(isEditing || isMatchEditing) && <button type="button" onClick={()=>activeAdminTab==='mac'?cancelEdit(true):cancelEdit(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>}
                </div>
                <form onSubmit={(e) => handleFormSubmit(e, activeAdminTab==='mac')} className="p-6 space-y-5 bg-slate-50/50">
                  {activeAdminTab === 'restoran' && (
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 tracking-widest uppercase mb-2">Türü</label>
                      <select name="type" value={formData.type} onChange={(e)=>setFormData({...formData, type: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 shadow-sm font-bold outline-none bg-white text-slate-800 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all"><option value="kahvalti">Kahvaltı</option><option value="yemek">Yemek</option><option value="dogum_gunu">Doğum Günü</option><option value="organizasyon">Organizasyon</option></select>
                    </div>
                  )}
                  <div><label className="block text-[10px] font-black text-slate-500 tracking-widest uppercase mb-2">İsim</label><input type="text" name="name" value={activeAdminTab==='mac'?matchFormData.name:formData.name} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, name:e.target.value}):setFormData({...formData, name:e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 shadow-sm font-bold bg-white text-slate-800 outline-none focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all" required /></div>
                  <div><label className="block text-[10px] font-black text-slate-500 tracking-widest uppercase mb-2">Telefon</label><input type="tel" name="phone" value={activeAdminTab==='mac'?matchFormData.phone:formData.phone} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, phone:e.target.value}):setFormData({...formData, phone:e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 shadow-sm font-bold bg-white text-slate-800 outline-none focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all" /></div>
                  <div className="flex gap-4">
                    <div className="flex-[2]"><label className="block text-[10px] font-black text-slate-500 tracking-widest uppercase mb-2">Masa</label><input type="text" name="table" value={activeAdminTab==='mac'?matchFormData.table:formData.table} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, table:e.target.value}):setFormData({...formData, table:e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 shadow-sm font-bold uppercase bg-white text-slate-800 outline-none focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all" /></div>
                    <div className="flex-[1]"><label className="block text-[10px] font-black text-slate-500 tracking-widest uppercase mb-2">Kişi</label><input type="number" name="peopleCount" min="1" value={activeAdminTab==='mac'?matchFormData.peopleCount:formData.peopleCount} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, peopleCount:parseInt(e.target.value)||1}):setFormData({...formData, peopleCount:parseInt(e.target.value)||1})} className="w-full p-3 rounded-xl border border-slate-200 shadow-sm font-bold text-center bg-white text-slate-800 outline-none focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all" /></div>
                  </div>
                  <div><label className="block text-[10px] font-black text-slate-500 tracking-widest uppercase mb-2">Tarih</label><input type="date" name="date" value={activeAdminTab==='mac'?matchFormData.date:formData.date} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, date:e.target.value}):setFormData({...formData, date:e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 shadow-sm font-bold bg-white text-slate-800 outline-none focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all" required /></div>
                  <div><label className="block text-[10px] font-black text-slate-500 tracking-widest uppercase mb-2">Not</label><textarea name="notes" value={activeAdminTab==='mac'?matchFormData.notes:formData.notes} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, notes:e.target.value}):setFormData({...formData, notes:e.target.value})} rows="2" className="w-full p-3 rounded-xl border border-slate-200 shadow-sm font-medium resize-none bg-white text-slate-800 outline-none focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all"></textarea></div>
                  <button type="submit" className={`w-full text-white font-black py-4 rounded-xl shadow-lg hover:-translate-y-1 transition-transform tracking-widest uppercase ${activeAdminTab==='mac' ? 'bg-blue-600' : 'bg-[#c2784f]'}`}>{activeAdminTab==='mac'?(isMatchEditing?'GÜNCELLE':'EKLE'):(isEditing?'GÜNCELLE':'EKLE')}</button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-8 xl:col-span-9 space-y-6 print:w-full print:block w-full">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 min-h-[500px] w-full">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                  <h2 className="text-2xl font-black text-slate-800 tracking-wide">{activeAdminTab==='mac' ? 'Maç Rezervasyonları' : 'Aktif Masalar'}</h2>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <input type="text" placeholder="Ara..." value={activeAdminTab==='mac'?matchSearchTerm:searchTerm} onChange={(e)=>activeAdminTab==='mac'?setMatchSearchTerm(e.target.value):setSearchTerm(e.target.value)} className="p-2 border border-slate-200 shadow-sm rounded-xl outline-none font-medium w-full md:w-48 bg-slate-50 text-slate-800 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all" />
                    <span className="font-black text-xs text-slate-500 bg-slate-100 px-4 py-2.5 rounded-xl whitespace-nowrap uppercase tracking-widest border border-slate-200">{(activeAdminTab==='mac'?sortedMatchReservations:sortedReservations).length} Kayıt</span>
                    <button onClick={()=>window.print()} className="bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 p-2.5 rounded-xl shadow-sm transition-all"><Printer size={20}/></button>
                  </div>
                </div>

                {(activeAdminTab==='mac'?sortedMatchReservations:sortedReservations).length === 0 ? (
                  <div className="p-16 text-center text-slate-400 flex flex-col items-center"><Inbox size={48} className="mb-4 opacity-30 text-slate-400" /><p className="font-light font-serif text-2xl tracking-wide">Kayıt bulunamadı.</p></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {(activeAdminTab==='mac'?sortedMatchReservations:sortedReservations).map(res => (
                      <div key={res.id} className={`bg-white border p-6 rounded-2xl flex flex-col relative shadow-sm hover:shadow-md transition-shadow group ${res.isArrived ? 'border-emerald-500 opacity-80' : 'border-slate-200 hover:border-[#c2784f]/50'}`}>
                         <div className="flex justify-between items-start mb-4">
                           <div><h3 className="font-bold text-lg text-slate-800 leading-none mb-1 group-hover:text-[#c2784f] transition-colors">{res.name}</h3><p className="text-xs font-bold text-slate-400 tracking-widest">{res.phone}</p></div>
                           <div className="text-right"><div className="bg-[#c2784f]/10 text-[#c2784f] border border-[#c2784f]/20 font-black px-3 py-1.5 rounded-lg text-sm shadow-sm">{res.table}</div><div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-2">{res.peopleCount} Kişi</div></div>
                         </div>
                         {res.notes && <p className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-xl mb-4 italic leading-relaxed">Not: {res.notes}</p>}
                         <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                           <button onClick={()=>handleToggleArrived(res.id, res.isArrived, activeAdminTab==='mac'?'matchReservations':'reservations')} className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl shadow-sm transition-colors ${res.isArrived ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{res.isArrived ? 'MASADA' : 'GELMEDİ'}</button>
                           <div className="flex gap-2">
                             <button onClick={()=>sendWhatsApp(res, activeAdminTab, false)} className="text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/20 p-2 rounded-xl hover:bg-[#25D366] hover:text-white transition-colors shadow-sm"><MessageCircle size={16}/></button>
                             <button onClick={()=>handleEditClick(res, activeAdminTab==='mac')} className="text-[#c2784f] bg-[#c2784f]/10 border border-[#c2784f]/20 p-2 rounded-xl hover:bg-[#c2784f] hover:text-white transition-colors shadow-sm"><Edit2 size={16}/></button>
                             <button onClick={()=>executeDelete(res.id, activeAdminTab==='mac'?'matchReservations':'reservations')} className="text-red-500 bg-red-50 border border-red-100 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-colors shadow-sm"><Trash2 size={16}/></button>
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
                  <button type="button" onClick={() => setShowImportConfirm(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-black uppercase text-xs w-full transition-colors">Varsayılan Menüyü Aktar</button>
                </div>
              )}
              <div className={`bg-white rounded-3xl shadow-sm border overflow-hidden transition-colors w-full ${isMenuEditing ? 'border-[#c2784f]' : 'border-slate-200'}`}>
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isMenuEditing ? 'bg-[#c2784f]/10 text-[#c2784f]' : 'bg-slate-100 text-slate-500'}`}>{isMenuEditing ? <Edit2 size={20} /> : <Plus size={20} />}</div>
                    <h2 className="font-black text-lg text-slate-800">{isMenuEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
                  </div>
                  {isMenuEditing && <button type="button" onClick={()=>{setIsMenuEditing(null); setMenuItemData(initialMenuItemState); setMenuErrorMsg('');}} className="text-slate-400 p-1.5 hover:bg-slate-100 rounded-full transition-colors"><X size={18}/></button>}
                </div>
                <form onSubmit={handleMenuSubmit} className="p-6 space-y-5 bg-slate-50/50">
                  {menuErrorMsg && <div className="text-red-500 font-bold text-sm bg-red-50 p-3 rounded-xl flex items-center gap-2 border border-red-100"><X size={16}/> {menuErrorMsg}</div>}
                  
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Kategori</label>
                    <button type="button" onClick={(e) => { e.preventDefault(); setShowCategoryModal(true); }} className="text-[10px] bg-[#c2784f]/10 text-[#c2784f] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-[#c2784f]/20 transition-colors shadow-sm border border-[#c2784f]/20">+ Yeni</button>
                  </div>
                  <select name="category" value={menuItemData.category} onChange={handleMenuChange} className="w-full p-3 rounded-xl border border-slate-200 shadow-sm font-bold outline-none focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] bg-white text-slate-800 transition-all">
                    {ALL_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Ürün Adı *</label>
                    <input type="text" name="name" value={menuItemData.name} onChange={handleMenuChange} className="w-full p-3 rounded-xl border border-slate-200 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white text-slate-800 transition-all" required placeholder="Örn: Karışık Tost" />
                  </div>
                  
                  <div className="flex gap-4">
                     <div className="flex-1">
                        <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Fiyat</label>
                        <div className="relative">
                          <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" name="price" value={menuItemData.price} onChange={handleMenuChange} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white text-slate-800 transition-all" placeholder="150" />
                        </div>
                     </div>
                     <div className="flex-1">
                        <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Hazırlama</label>
                        <div className="relative">
                          <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" name="prepTime" value={menuItemData.prepTime} onChange={handleMenuChange} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white text-slate-800 transition-all" placeholder="15 dk" />
                        </div>
                     </div>
                     <div className="flex-1">
                        <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Kalori</label>
                        <div className="relative">
                          <Flame size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" name="calories" value={menuItemData.calories} onChange={handleMenuChange} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white text-slate-800 transition-all" placeholder="350 kcal" />
                        </div>
                     </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Durum & Etiket (Maks: 2)</label>
                    <div className="flex flex-wrap gap-2">
                      {BADGE_OPTIONS.map(badge => (
                        <label key={badge.id} className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
                          <input type="checkbox" checked={menuItemData.badges.includes(badge.id)} onChange={() => handleBadgeChange(badge.id)} className="w-3.5 h-3.5 text-[#c2784f] rounded border-slate-300 focus:ring-[#c2784f]" />
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><span>{badge.icon}</span> {badge.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Açıklama</label>
                    <div className="relative">
                      <AlignLeft size={18} className="absolute left-3 top-4 text-slate-400" />
                      <textarea name="description" value={menuItemData.description} onChange={handleMenuChange} rows={5} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm font-medium resize-y min-h-[120px] focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white text-slate-800 transition-all" placeholder="Örn İçerik: Beyaz peynir, Taze kaşar..."></textarea>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Ürün Resim (Yükle)</label>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center justify-center px-4 py-3 bg-white border border-slate-200 shadow-sm rounded-xl cursor-pointer hover:bg-slate-50 transition-colors text-xs font-bold text-slate-700 w-full text-center">
                          {uploadingImage ? <Loader2 className="animate-spin mr-2" size={16} /> : <UploadCloud className="mr-2 text-[#c2784f]" size={16} />}
                          Dosya Seç
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Sıra</label>
                      <input type="number" name="order" value={menuItemData.order} onChange={handleMenuChange} className="w-full p-3 rounded-xl border border-slate-200 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white text-slate-800 transition-all" placeholder="999" />
                    </div>
                  </div>
                  
                  {menuItemData.image && (
                     <div className="relative inline-block mt-2">
                        <img src={menuItemData.image} alt="Preview" className="h-24 w-auto rounded-lg object-contain border border-slate-200 shadow-sm bg-slate-50" />
                        <button type="button" onClick={removeMenuImage} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors" title="Resmi Kaldır">
                           <X size={14}/>
                        </button>
                     </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                     <label className="flex items-center gap-3 cursor-pointer bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-[#c2784f]/30 transition-all">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${menuItemData.isFeatured ? 'bg-[#c2784f] border-[#c2784f] text-white shadow-sm' : 'bg-slate-50 border-slate-300'}`}>
                           {menuItemData.isFeatured && <Check size={14} />}
                        </div>
                        <input type="checkbox" checked={menuItemData.isFeatured} onChange={(e)=>setMenuItemData({...menuItemData, isFeatured: e.target.checked})} className="hidden" />
                        <div className="flex-1 select-none">
                           <span className="font-bold text-xs text-slate-700 block tracking-wide">Vitrin Göster</span>
                        </div>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-red-500/30 transition-all">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${menuItemData.isSoldOut ? 'bg-red-500 border-red-500 text-white shadow-sm' : 'bg-slate-50 border-slate-300'}`}>
                           {menuItemData.isSoldOut && <Check size={14} />}
                        </div>
                        <input type="checkbox" checked={menuItemData.isSoldOut} onChange={(e)=>setMenuItemData({...menuItemData, isSoldOut: e.target.checked})} className="hidden" />
                        <div className="flex-1 select-none">
                           <span className="font-bold text-xs text-slate-700 block tracking-wide">Tükendi Yap</span>
                        </div>
                     </label>
                  </div>
                  
                  <button type="submit" className="w-full bg-[#c2784f] hover:bg-[#a16241] text-white font-black py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1 uppercase tracking-widest mt-4">
                    {isMenuEditing ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'}
                  </button>

                  {/* CANLI ÖNİZLEME ALANI */}
                  <div className="mt-6 border-t border-slate-200 pt-6">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><MonitorPlay size={14}/> Menü Görünümü (Önizleme)</h3>
                     <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-lg flex flex-col min-h-[200px] max-w-sm mx-auto relative pointer-events-none">
                        {menuItemData.badges && menuItemData.badges.length > 0 && (
                          <div className="absolute top-3 left-3 z-10 flex gap-1">
                            {menuItemData.badges.map(b => {
                               const def = BADGE_OPTIONS.find(o=>o.id===b);
                               return def ? <span key={b} className="bg-white/95 text-slate-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-slate-100">{def.icon}</span> : null;
                            })}
                          </div>
                        )}
                        {menuItemData.isSoldOut && <div className="absolute top-3 right-3 z-10 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm uppercase tracking-widest">Tükendi</div>}
                        
                        {menuItemData.image ? (
                          <div className="relative w-full h-40 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border-b border-slate-100">
                            <img src={menuItemData.image} alt={menuItemData.name} className={`w-full h-full object-contain p-2 ${menuItemData.isSoldOut ? 'opacity-40 grayscale' : ''}`} />
                          </div>
                        ) : (
                          <div className={`relative w-full h-24 bg-slate-50 flex flex-col items-center justify-center border-b border-slate-100 shrink-0 ${menuItemData.isSoldOut ? 'opacity-40 grayscale' : ''}`}>
                            <ImageIcon size={32} className="text-slate-300"/>
                          </div>
                        )}
                        
                        <div className={`p-5 flex flex-col justify-between bg-white grow ${menuItemData.isSoldOut ? 'opacity-60 grayscale' : ''}`}>
                           <div>
                             <div className="flex justify-between items-start gap-4 mb-2">
                                <span className={`font-bold text-sm sm:text-base tracking-wide leading-snug ${menuItemData.isSoldOut ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{menuItemData.name || 'Örnek Ürün Adı'}</span>
                                {menuItemData.price && <span className="text-orange-500 font-black whitespace-nowrap text-sm sm:text-base">{menuItemData.price} TL</span>}
                             </div>
                             {menuItemData.description && <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{menuItemData.description}</p>}
                           </div>
                        </div>
                     </div>
                  </div>

                </form>
              </div>
            </div>

            <div className="lg:col-span-8 xl:col-span-9 w-full">
               <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 min-h-[500px] w-full">
                  <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                     <h2 className="text-2xl font-black flex items-center gap-3 text-slate-800 tracking-wide"><MenuSquare className="text-[#c2784f]" size={28} /> Sistemdeki Menü Öğeleri</h2>
                     
                     <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                        <select value={menuFilterCategory} onChange={(e) => setMenuFilterCategory(e.target.value)} className="w-full sm:w-auto p-2.5 border border-slate-200 shadow-sm rounded-xl outline-none font-bold text-sm focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] bg-slate-50 text-slate-800 transition-all">
                           <option value="all">Tüm Kategoriler</option>
                           {ALL_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <div className="relative w-full sm:w-64">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                           <input type="text" placeholder="Ürün ara..." value={menuSearchTerm} onChange={(e) => setMenuSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 shadow-sm focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] text-sm font-medium outline-none transition-all bg-slate-50 text-slate-800" />
                        </div>
                        <span className="font-black text-xs text-slate-500 bg-slate-100 px-4 py-2.5 rounded-xl whitespace-nowrap uppercase tracking-widest border border-slate-200 shrink-0">{menuItems.length} Öğe</span>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                          className={`border p-5 rounded-2xl flex flex-col bg-white ${isMenuEditing===item.id ? 'border-[#c2784f] shadow-lg scale-[1.02] transition-all relative z-10' : 'border-slate-200 hover:border-[#c2784f]/50 hover:shadow-md transition-all cursor-move shadow-sm group'}`}
                       >
                          <div className="flex justify-between items-start mb-3">
                             <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-[#c2784f]/10 text-[#c2784f] border border-[#c2784f]/20 px-3 py-1 rounded flex items-center gap-1.5 shadow-sm">
                               <GripVertical size={12} className="text-[#c2784f]/50"/>
                               {ALL_CATEGORIES.find(c=>c.id===item.category)?.name || item.category}
                             </span>
                             {item.isSoldOut && <span className="bg-red-50 text-red-600 border border-red-200 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-sm">Tükendi</span>}
                          </div>

                          <div className="flex gap-4 items-center mb-4">
                            {item.image ? (
                               <div className="w-16 h-16 rounded-xl bg-slate-50 shrink-0 flex items-center justify-center p-1 border border-slate-100 shadow-sm">
                                 <img src={item.image} className={`w-full h-full object-contain ${item.isSoldOut ? 'opacity-40 grayscale' : ''}`} alt="" onError={(e)=>{e.currentTarget.style.display='none'}} />
                               </div>
                            ) : (
                               <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 shrink-0 shadow-sm border border-slate-100"><ImageIcon size={24}/></div>
                            )}
                            <div>
                              <h3 className={`font-bold leading-tight line-clamp-2 transition-colors group-hover:text-[#c2784f] ${item.isSoldOut ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{item.name}</h3>
                              <span className="font-black text-[#c2784f] text-sm block mt-1">{item.price ? `${item.price} TL` : '-'}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sıra: {item.order || 999}</span>
                            <div className="flex gap-1.5">
                              <button type="button" onClick={() => toggleSoldOut(item)} className={`p-2 rounded-xl transition-colors shadow-sm border ${item.isSoldOut ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border-emerald-100' : 'bg-white text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 border-slate-200'}`} title={item.isSoldOut ? "Satışa Aç" : "Tükendi Yap"}>
                                 {item.isSoldOut ? <CheckCircle size={16}/> : <X size={16}/>}
                              </button>
                              <button type="button" onClick={() => duplicateMenuItem(item)} className="p-2 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-400 border border-slate-200 rounded-xl transition-colors shadow-sm" title="Kopyala">
                                 <Plus size={16}/>
                              </button>
                              <button type="button" onClick={()=>{setMenuItemData({category: item.category, name: item.name, price: item.price||'', description: item.description||'', image: item.image||'', isFeatured: item.isFeatured||false, order: item.order||999, badges: item.badges||[], isSoldOut: item.isSoldOut||false, prepTime: item.prepTime||'', calories: item.calories||''}); setIsMenuEditing(item.id); window.scrollTo(0,0);}} className="p-2 bg-white hover:bg-[#c2784f]/10 hover:text-[#c2784f] hover:border-[#c2784f]/30 text-slate-400 border border-slate-200 rounded-xl transition-colors shadow-sm" title="Düzenle">
                                 <Edit2 size={16}/>
                              </button>
                              <button type="button" onClick={()=>{if(window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) executeDelete(item.id, 'menuItems');}} className="p-2 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-400 border border-slate-200 rounded-xl transition-colors shadow-sm" title="Sil">
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
        ) : activeAdminTab === 'personel' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 w-full col-span-12">
            <div className="lg:col-span-4 xl:col-span-3 space-y-6 w-full">
              <div className={`bg-white rounded-3xl shadow-sm border w-full transition-colors overflow-hidden ${isPersonnelEditing ? 'border-[#c2784f]' : 'border-slate-200'}`}>
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isPersonnelEditing ? 'bg-[#c2784f]/10 text-[#c2784f]' : 'bg-slate-100 text-slate-500'}`}>{isPersonnelEditing ? <Edit2 size={20} /> : <Plus size={20} />}</div>
                    <h2 className="font-black text-lg text-slate-800">{isPersonnelEditing ? 'Personel Düzenle' : 'Yeni Personel'}</h2>
                  </div>
                  {isPersonnelEditing && <button type="button" onClick={()=>{setIsPersonnelEditing(null); setPersonnelData(initialPersonnelState); setPersonnelErrorMsg('');}} className="text-slate-400 p-1.5 hover:bg-slate-100 rounded-full transition-colors"><X size={18}/></button>}
                </div>
                <form onSubmit={handlePersonnelSubmit} className="p-6 space-y-5 bg-slate-50/50">
                  {personnelErrorMsg && <div className="text-red-500 font-bold text-sm bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-2"><X size={16}/> {personnelErrorMsg}</div>}
                  
                  <div className="flex gap-4">
                     <div className="flex-1">
                        <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Ad *</label>
                        <input type="text" name="name" value={personnelData.name} onChange={handlePersonnelChange} className="w-full p-3 rounded-xl border border-slate-200 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white text-slate-800 transition-all" required placeholder="Örn: Ahmet" />
                     </div>
                     <div className="flex-1">
                        <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Soyad *</label>
                        <input type="text" name="surname" value={personnelData.surname} onChange={handlePersonnelChange} className="w-full p-3 rounded-xl border border-slate-200 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white text-slate-800 transition-all" required placeholder="Örn: Yılmaz" />
                     </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Lakap (Opsiyonel)</label>
                    <input type="text" name="nickname" value={personnelData.nickname} onChange={handlePersonnelChange} className="w-full p-3 rounded-xl border border-slate-200 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white text-slate-800 transition-all" placeholder="Örn: Hızlı Şef" />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Yetenekler & Uzmanlık</label>
                    <textarea name="skills" value={personnelData.skills} onChange={handlePersonnelChange} rows={3} className="w-full p-3 rounded-xl border border-slate-200 shadow-sm font-medium resize-y focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white text-slate-800 transition-all" placeholder="Örn: Dünya mutfağında 10 yıllık deneyim..."></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Fotoğraf</label>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center justify-center px-4 py-3 bg-white border border-slate-200 shadow-sm rounded-xl cursor-pointer hover:bg-slate-50 transition-colors text-xs font-bold text-slate-700 w-full text-center">
                          {uploadingPersonnelImage ? <Loader2 className="animate-spin mr-2" size={16} /> : <UploadCloud className="mr-2 text-[#c2784f]" size={16} />}
                          Dosya Seç
                          <input type="file" accept="image/*" onChange={handlePersonnelImageUpload} className="hidden" disabled={uploadingPersonnelImage} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Sıra</label>
                      <input type="number" name="order" value={personnelData.order} onChange={handlePersonnelChange} className="w-full p-3 rounded-xl border border-slate-200 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white text-slate-800 transition-all" placeholder="999" />
                    </div>
                  </div>
                  
                  {personnelData.image && (
                     <div className="relative inline-block mt-2">
                        <img src={personnelData.image} alt="Preview" className="h-24 w-24 rounded-full object-cover border-2 border-slate-200 shadow-sm bg-slate-50" />
                        <button type="button" onClick={removePersonnelImage} className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors" title="Resmi Kaldır">
                           <X size={12}/>
                        </button>
                     </div>
                  )}
                  
                  <button type="submit" className="w-full bg-[#c2784f] hover:bg-[#a16241] text-white font-black py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1 uppercase tracking-widest mt-6">
                    {isPersonnelEditing ? 'Güncelle' : 'Personel Ekle'}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-8 xl:col-span-9 w-full">
               <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 min-h-[500px] w-full">
                  <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
                     <h2 className="text-2xl font-black flex items-center gap-3 text-slate-800 tracking-wide"><Users className="text-[#c2784f]" size={28} /> Ekibimiz ({personnelList.length})</h2>
                  </div>
                  
                  {personnelList.length === 0 ? (
                     <div className="text-center py-16 text-slate-400 flex flex-col items-center"><Users size={48} className="mb-4 opacity-30 text-slate-400" /><p className="font-light font-serif text-2xl tracking-wide">Henüz personel eklenmedi.</p><span className="text-sm mt-2">Sol taraftan kayıt oluşturabilirsiniz.</span></div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                       {personnelList.sort((a,b) => (a.order||999) - (b.order||999)).map((person) => {
                         const avg = person.reviews?.length > 0 ? (person.reviews.reduce((acc,curr)=>acc+curr.rating,0)/person.reviews.length).toFixed(1) : 0;
                         return (
                           <div key={person.id} className={`border p-6 rounded-2xl flex flex-col bg-white hover:shadow-md transition-shadow relative shadow-sm group ${isPersonnelEditing === person.id ? 'border-[#c2784f] shadow-lg scale-[1.02]' : 'border-slate-200 hover:border-[#c2784f]/50'}`}>
                              <div className="flex gap-4 items-start mb-4">
                                <div className="w-16 h-16 rounded-full bg-slate-50 shrink-0 overflow-hidden border border-slate-200 shadow-sm">
                                  {person.image ? <img src={person.image} className="w-full h-full object-cover" alt={person.name} /> : <UserSquare size={40} className="w-full h-full p-3 text-slate-300" />}
                                </div>
                                <div>
                                  <h3 className="font-bold text-slate-800 text-lg leading-none mb-1 group-hover:text-[#c2784f] transition-colors">{person.name} {person.surname}</h3>
                                  {person.nickname && <p className="text-[#c2784f] font-black text-[10px] tracking-widest uppercase mt-1">"{person.nickname}"</p>}
                                  <span className="text-[10px] font-bold text-slate-400 block mt-2 uppercase tracking-widest">
                                    Sıra: {person.order || 999} • <Star size={10} className="inline fill-[#c2784f] text-[#c2784f] -mt-0.5 ml-1"/> {avg} ({person.reviews?.length || 0} Yorum)
                                  </span>
                                </div>
                              </div>
                              {person.skills && (
                                <p className="text-[11px] text-slate-600 line-clamp-2 mb-5 italic font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">{person.skills}</p>
                              )}
                              <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setManagingReviewsFor(person)} className="p-2 bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-500 border border-blue-100 rounded-xl transition-colors font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 flex-1 shadow-sm"><MessageSquareText size={14}/> Yorumlar ({person.reviews?.length || 0})</button>
                                <button type="button" onClick={()=>{setPersonnelData({name: person.name, surname: person.surname, nickname: person.nickname||'', skills: person.skills||'', image: person.image||'', order: person.order||'', reviews: person.reviews||[]}); setIsPersonnelEditing(person.id); window.scrollTo(0,0);}} className="p-2 bg-white hover:bg-[#c2784f] hover:text-white hover:border-[#c2784f] border border-slate-200 text-slate-400 rounded-xl transition-colors flex items-center justify-center shadow-sm"><Edit2 size={16}/></button>
                                <button type="button" onClick={() => setPersonnelDeleteConfirmId(person.id)} className="p-2 bg-white hover:bg-red-500 hover:text-white hover:border-red-500 border border-slate-200 text-slate-400 rounded-xl transition-colors flex items-center justify-center shadow-sm"><Trash2 size={16}/></button>
                              </div>
                           </div>
                         );
                       })}
                    </div>
                  )}
               </div>
            </div>
          </div>
        ) : activeAdminTab === 'gecmis' ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 w-full min-h-[500px]">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-slate-100 gap-4">
               <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-wide"><History className="text-[#c2784f]" size={28}/> Geçmiş Kayıtlar</h2>
               <div className="flex gap-2 w-full md:w-auto"><input type="date" value={historyDateFilter} onChange={(e)=>setHistoryDateFilter(e.target.value)} className="p-3 w-full md:w-auto border border-slate-200 shadow-sm rounded-xl outline-none font-bold text-sm focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all bg-slate-50 text-slate-800" /></div>
            </div>
            
            {historyStats.list.length === 0 ? (
               <div className="py-16 text-center text-slate-400 flex flex-col items-center"><History size={48} className="mb-4 opacity-30 text-slate-400" /><p className="font-light font-serif text-2xl tracking-wide">Kayıt bulunamadı.</p></div>
            ) : (
            <div className="overflow-x-auto w-full border border-slate-100 rounded-2xl shadow-sm">
              <table className="w-full text-left bg-white">
                 <thead><tr className="border-b border-slate-200 bg-slate-50"><th className="py-4 px-4 font-black text-[10px] text-slate-500 uppercase tracking-widest">Tarih</th><th className="py-4 px-4 font-black text-[10px] text-slate-500 uppercase tracking-widest">Müşteri</th><th className="py-4 px-4 font-black text-[10px] text-slate-500 uppercase tracking-widest text-center">Kişi</th><th className="py-4 px-4 font-black text-[10px] text-slate-500 uppercase tracking-widest text-center">Durum</th></tr></thead>
                 <tbody>
                    {historyStats.list.map((res, i) => (
                       <tr key={res.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i%2===0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                          <td className="py-4 px-4 font-bold text-slate-700 text-sm">{res.date} <span className="text-[9px] uppercase tracking-widest bg-slate-200 text-slate-600 px-2 py-1 rounded-md ml-2 font-black">{res.eventType}</span></td>
                          <td className="py-4 px-4 font-bold text-slate-800 text-sm">{res.name} <span className="block text-[11px] font-medium text-slate-500 tracking-widest mt-1">{res.phone}</span></td>
                          <td className="py-4 px-4 text-center font-black text-slate-700">{res.peopleCount}</td>
                          <td className="py-4 px-4 text-center">{res.isArrived ? <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm">Geldi</span> : <span className="bg-white border border-slate-200 shadow-sm text-slate-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">Gelmedi</span>}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
            </div>
            )}
          </div>
        ) : null}
      </main>
      
      {renderModals()}
    </div>
  );
}
