import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, Users, UtensilsCrossed, Armchair, Plus, Trash2, MoonStar, 
  ChefHat, Search, Edit2, X, Check, Loader2, Clock, CheckCircle, Phone, 
  Printer, MessageSquareText, MessageCircle, Map, Flame, BellRing, 
  MonitorPlay, Lock, ArrowRight, MapPin, Instagram, Wind, Coffee, 
  ChevronRight, Star, Inbox, CheckCircle2, AlertTriangle, History, MenuSquare,
  Image as ImageIcon, AlignLeft, DollarSign
} from 'lucide-react';
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
].sort((a, b) => new Date(a.date) - new Date(b.date));

const BASE_CATEGORIES = [
  { id: 'kahvalti', name: 'KAHVALTI', Icon: Coffee },
  { id: 'tostlar', name: 'TOSTLAR', Icon: UtensilsCrossed },
  { id: 'wrap', name: 'WRAP & QUESADILLA', Icon: UtensilsCrossed },
  { id: 'pizza', name: 'PİZZA', Icon: UtensilsCrossed },
  { id: 'burger', name: 'HAMBURGER', Icon: UtensilsCrossed },
  { id: 'kofte', name: 'KÖFTE LEZZETLERİ', Icon: ChefHat },
  { id: 'tavuk', name: 'TAVUK LEZZETLERİ', Icon: ChefHat },
  { id: 'et', name: 'ET LEZZETLERİ', Icon: ChefHat },
  { id: 'makarna', name: 'MAKARNA ÇEŞİTLERİ', Icon: UtensilsCrossed },
  { id: 'salata', name: 'SALATA ÇEŞİTLERİ', Icon: UtensilsCrossed },
  { id: 'tatli', name: 'SALAŞ TATLI', Icon: Star },
  { id: 'cay', name: 'ÇAYLAR', Icon: Coffee },
  { id: 'turk_kahvesi', name: 'TÜRK KAHVESİ', Icon: Coffee },
  { id: 'sicak_kahve', name: 'SICAK KAHVELER', Icon: Coffee },
  { id: 'sicak_diger', name: 'SICAK ÇİKOLATA - SAHLEP', Icon: Coffee },
  { id: 'soguk_kahve', name: 'SOĞUK KAHVELER', Icon: Coffee },
  { id: 'kokteyl', name: 'KOKTEYLLER', Icon: Coffee },
  { id: 'soguk_icecek', name: 'SOĞUK İÇECEKLER', Icon: Coffee },
  { id: 'vitamin', name: 'VİTAMİN BAR', Icon: Coffee },
  { id: 'eglence', name: 'EĞLENCE MENÜSÜ', Icon: Star },
  { id: 'nargile', name: 'NARGİLE ÇEŞİTLERİ', Icon: Wind }
];

const DEFAULT_MENU_GALLERY = [
  { id: '1', name: 'Salaaş Köy Kahvaltısı', image: '/salaskoy.jpg', tag: 'İmza Lezzet' },
  { id: '2', name: 'Patron Kahvaltısı', image: '/patronkahvaltisi.jpg' },
  { id: '3', name: 'Ispanak Yatağında Tavuk', image: '/ıspanakyatagındatavuk.jpg' },
  { id: '4', name: 'Etli Bowl Tabağı', image: '/etlibowltabagi.jpg' },
  { id: '5', name: 'Üç Renkli Tortellini', image: '/ucrenklitortellini.jpg' },
];

const DEFAULT_MENU_CATEGORIES = [
  { id: 'kahvalti', items: [ { name: 'Salaaş Köy Kahvaltısı', image: '/salaskoy.jpg' }, { name: 'Patron Kahvaltısı', image: '/patronkahvaltisi.jpg' }, { name: 'Kahvaltı Tabağı', image: '/kahvaltitabagi.jpg' }, { name: 'Menemen' }, { name: 'Sahanda Sucuklu Yumurta' }, { name: 'Muhlama' }, { name: 'Pankek' } ]},
  { id: 'tostlar', items: [ { name: 'Kaşarlı Tost' }, { name: 'Sucuklu Tost' }, { name: 'Karışık Tost' }, { name: 'Ayvalık Tostu' }, { name: 'Bazlama Tost' } ]},
  { id: 'wrap', items: [ { name: 'Etli Wrap' }, { name: 'Tavuklu Wrap' }, { name: 'Köfteli Wrap' }, { name: 'Tavuklu Quesadilla' }, { name: 'Etli Quesadilla' } ]},
  { id: 'pizza', items: [ { name: 'Margherita' }, { name: 'Karışık Pizza' }, { name: 'Sucuklu Pizza' }, { name: 'Ton Balıklı Pizza' }, { name: 'Meksika Ateşi' } ]},
  { id: 'burger', items: [ { name: 'Mantarlı Fırın Burger', image: '/mantarlıfırınburger.jpg' }, { name: 'Klasik Burger' }, { name: 'Cheeseburger' }, { name: 'Meksika Burger' }, { name: 'Tavuk Burger' } ]},
  { id: 'kofte', items: [ { name: 'Hünkar Köfte', image: '/hunkarkofte.jpg' }, { name: 'Izgara Köfte' }, { name: 'Kaşarlı Köfte' }, { name: 'Hünkar Beğendili Köfte' }, { name: 'Kiremitte Köfte' } ]},
  { id: 'tavuk', items: [ { name: 'Cafe de Paris Soslu Tavuk', image: '/cafedeparis.jpg' }, { name: 'Köz Patlıcanlı Tavuk', image: '/közpatlıcanlıtavukbnfile.jpg' }, { name: 'Ispanak Yatağında Tavuk', image: '/ıspanakyatagındatavuk.jpg' }, { name: 'Köri Soslu Tavuk' }, { name: 'Meksika Soslu Tavuk' }, { name: 'Barbekü Soslu Tavuk' }, { name: 'Kekikli Tavuk' }, { name: 'Tavuk Şinitzel' }, { name: 'Izgara Tavuk Göğüs' } ]},
  { id: 'et', items: [ { name: 'Etli Bowl Tabağı', image: '/etlibowltabagi.jpg' }, { name: 'Dana Lokum' }, { name: 'Çoban Kavurma' }, { name: 'Sac Kavurma' }, { name: 'Et Sote' }, { name: 'Izgara Antrikot' } ]},
  { id: 'makarna', items: [ { name: 'Üç Renkli Tortellini', image: '/ucrenklitortellini.jpg' }, { name: 'Cheddar Çıtır Makarna', image: '/chedarcitirmakarna.jpg' }, { name: 'Penne Arabiata' }, { name: 'Fettuccine Alfredo' }, { name: 'Spagetti Bolognese' }, { name: 'Mantı' }, { name: 'Noodle' } ]},
  { id: 'salata', items: [ { name: 'Sezar Salata' }, { name: 'Ton Balıklı Salata' }, { name: 'Izgara Tavuklu Salata' }, { name: 'Akdeniz Salata' }, { name: 'Hellim Peynirli Salata' } ]},
  { id: 'tatli', items: [ { name: 'Dubai Çikolatalı', image: '/dubai cikolatalı.jpg' }, { name: 'Lotus Dome', image: '/lotus dome.jpg' }, { name: 'Profiterol', image: '/profiterol.jpg' }, { name: 'Tiramisu', image: '/tiramisu.jpg' }, { name: 'Brownie', image: '/brownie.jpg' }, { name: 'San Sebastian' }, { name: 'Cheesecake Çeşitleri' }, { name: 'Sütlaç' }, { name: 'Magnolia' } ]},
  { id: 'cay', items: [ { name: 'Bardak Çay' }, { name: 'Fincan Çay' }, { name: 'Bitki Çayları' }, { name: 'Yeşil Çay' }, { name: 'Kış Çayı' }, { name: 'Ada Çayı' } ]},
  { id: 'turk_kahvesi', items: [ { name: 'Klasik Türk Kahvesi' }, { name: 'Damla Sakızlı Türk Kahvesi' }, { name: 'Sütlü Türk Kahvesi' }, { name: 'Dibek Kahvesi' }, { name: 'Menengiç Kahvesi' } ]},
  { id: 'sicak_kahve', items: [ { name: 'Caramel Macchiato', image: '/caramelmachiato.jpg' }, { name: 'Espresso' }, { name: 'Americano' }, { name: 'Latte' }, { name: 'Cappuccino' }, { name: 'Mocha' }, { name: 'Filtre Kahve' } ]},
  { id: 'sicak_diger', items: [ { name: 'Sıcak Çikolata' }, { name: 'Beyaz Sıcak Çikolata' }, { name: 'Sahlep' }, { name: 'Damla Sakızlı Sahlep' } ]},
  { id: 'soguk_kahve', items: [ { name: 'Ice Mocha', image: '/icemocha.jpg' }, { name: 'Ice Latte' }, { name: 'Ice Americano' }, { name: 'Frappe' }, { name: 'Cold Brew' } ]},
  { id: 'kokteyl', items: [ { name: 'Cool Lime', image: '/coollime.jpg' }, { name: 'Mojito' }, { name: 'Pina Colada' }, { name: 'Blue Lagoon' }, { name: 'Sex on the Beach' }, { name: 'Margarita' } ]},
  { id: 'soguk_icecek', items: [ { name: 'Kola' }, { name: 'Fanta' }, { name: 'Sprite' }, { name: 'Ayran' }, { name: 'Şalgam' }, { name: 'Limonata' }, { name: 'Meyve Suyu' }, { name: 'Su' }, { name: 'Soda' }, { name: 'Churchill' } ]},
  { id: 'vitamin', items: [ { name: 'Taze Sıkma Portakal Suyu' }, { name: 'Nar Suyu' }, { name: 'Havuç Suyu' }, { name: 'Elma Suyu' }, { name: 'Atom (Karışık Meyve Suyu)' }, { name: 'Detox Suları' } ]},
  { id: 'eglence', items: [ { name: 'Çerez Tabağı' }, { name: 'Meyve Tabağı' }, { name: 'Cips' }, { name: 'Patlamış Mısır' }, { name: 'Sigara Böreği' }, { name: 'Sosis Tabağı' }, { name: 'Patates Kızartması' } ]},
  { id: 'nargile', items: [ { name: 'Elma' }, { name: 'Nane' }, { name: 'Kavun' }, { name: 'Karpuz' }, { name: 'Şeftali' }, { name: 'Üzüm' }, { name: 'Çilek' }, { name: 'Cappuccino' }, { name: 'Çikolata' }, { name: 'Sakız' }, { name: 'Gül' }, { name: 'Özel Karışım (Spesiyal)' } ]},
];

const GLOBAL_CSS = `
#root { max-width: 100% !important; width: 100% !important; margin: 0 !important; padding: 0 !important; text-align: left !important; }
body, html { margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; overflow-x: hidden !important; background-color: #f8fafc !important; }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

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

  const typeLabels = { 
    kahvalti: 'Kahvaltı', 
    yemek: 'Yemek', 
    dogum_gunu: 'Doğum Günü', 
    organizasyon: 'Organizasyon', 
    mac: 'Maç Yayını' 
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bulkMessage, setBulkMessage] = useState('');
  
  const [activePage, setActivePage] = useState('restoran');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [showMenuPage, setShowMenuPage] = useState(false); 
  
  const initialRequestState = { 
    type: 'yemek', 
    name: '', 
    phone: '', 
    peopleCount: 2, 
    date: getToday(), 
    notes: '' 
  };
  const [requestData, setRequestData] = useState(initialRequestState);
  const [requestError, setRequestError] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const [reservations, setReservations] = useState([]);
  const [selectedFilterDate, setSelectedFilterDate] = useState(getToday());
  const [isEditing, setIsEditing] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [printSingleId, setPrintSingleId] = useState(null);
  const [showTableMap, setShowTableMap] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const initialFormState = { 
    type: 'yemek', 
    name: '', 
    phone: '', 
    notes: '', 
    peopleCount: 1, 
    table: '', 
    date: getToday() 
  };
  const [formData, setFormData] = useState(initialFormState);

  const [matchReservations, setMatchReservations] = useState([]);
  const [selectedMatchDate, setSelectedMatchDate] = useState(getToday());
  const [isMatchEditing, setIsMatchEditing] = useState(null);
  const [matchSearchTerm, setMatchSearchTerm] = useState('');
  
  const initialMatchFormState = { 
    type: 'mac', 
    name: '', 
    phone: '', 
    notes: '', 
    peopleCount: 1, 
    table: '', 
    date: getToday() 
  };
  const [matchFormData, setMatchFormData] = useState(initialMatchFormState);
  const [matchErrorMsg, setMatchErrorMsg] = useState('');
  const [matchDeleteConfirmId, setMatchDeleteConfirmId] = useState(null);

  const [pendingRequests, setPendingRequests] = useState([]);
  const [historyDateFilter, setHistoryDateFilter] = useState(''); 
  const [historyTypeFilter, setHistoryTypeFilter] = useState('all'); 

  // MENÜ YÖNETİMİ STATE
  const [menuItems, setMenuItems] = useState([]);
  const [isMenuEditing, setIsMenuEditing] = useState(null);
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  const initialMenuItemState = { 
    category: 'kahvalti', 
    name: '', 
    price: '', 
    description: '', 
    image: '', 
    isFeatured: false 
  };
  const [menuItemData, setMenuItemData] = useState(initialMenuItemState);
  const [menuErrorMsg, setMenuErrorMsg] = useState('');
  const [menuDeleteConfirmId, setMenuDeleteConfirmId] = useState(null);

  useEffect(() => {
    document.title = "Salaaş Cafe Restaurant";
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    if (window.location.pathname === '/menu') {
        setShowMenuPage(true);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleAfterPrint = () => setPrintSingleId(null);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  useEffect(() => {
    signInAnonymously(auth).catch((err) => console.error(err));
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
    
    return () => { 
      restoranUnsub(); 
      matchUnsub(); 
      reqUnsub(); 
      menuUnsub(); 
    };
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
        setRequestData(initialRequestState); 
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
    try { 
      await deleteDoc(doc(db, 'reservationRequests', id)); 
    } catch(err) {}
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

  const handleMenuChange = (e) => {
    const { name, value } = e.target;
    setMenuErrorMsg('');
    setMenuItemData(prev => ({ ...prev, [name]: value }));
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!menuItemData.name?.trim()) { 
      setMenuErrorMsg("Ürün adı zorunludur."); 
      return; 
    }
    
    try {
      if (isMenuEditing) {
        await updateDoc(doc(db, 'menuItems', isMenuEditing), { 
          ...menuItemData, 
          updatedAt: new Date().toISOString() 
        });
        setIsMenuEditing(null);
      } else {
        await addDoc(collection(db, 'menuItems'), { 
          ...menuItemData, 
          createdAt: new Date().toISOString() 
        });
      }
      setMenuItemData(initialMenuItemState);
    } catch (err) { 
      setMenuErrorMsg("Kayıt hatası."); 
    }
  };

  const importDefaultMenu = async () => {
    if (!user) return;
    if (window.confirm("Varsayılan menü veritabanına eklenecektir. Onaylıyor musunuz?")) {
      try {
        for (const cat of DEFAULT_MENU_CATEGORIES) {
          for (const item of cat.items) {
            await addDoc(collection(db, 'menuItems'), {
              category: cat.id,
              name: item.name,
              price: '',
              description: '',
              image: item.image || '',
              isFeatured: DEFAULT_MENU_GALLERY.some(g => g.name === item.name),
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
      } else if (colName === 'matchReservations') { 
        setMatchDeleteConfirmId(null); 
        if (isMatchEditing === id) cancelEdit(true); 
      } else if (colName === 'menuItems') { 
        setMenuDeleteConfirmId(null); 
        if (isMenuEditing === id) { setIsMenuEditing(null); setMenuItemData(initialMenuItemState); } 
      }
    } catch (err) {}
  };

  const sendWhatsApp = (res, type, isApproval = false) => {
    if (!res.phone) return;
    let cleanPhone = res.phone.replace(new RegExp('[^0-9]', 'g'), '');
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
        let cleanPhone = res.phone.replace(new RegExp('[^0-9]', 'g'), '');
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

  const handleNavToMenu = () => {
    setShowMenuPage(true); 
    window.scrollTo(0,0);
  };

  const handleNavToHome = () => {
    setShowMenuPage(false); 
    window.scrollTo(0,0);
  };

  const handleScrollToId = (id) => {
    setShowMenuPage(false);
    setTimeout(() => {
        const el = document.getElementById(id);
        if(el) { window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth'}); }
    }, 100);
  };

  const scrollToMenuCategory = (id) => {
    const el = document.getElementById(`cat-${id}`);
    if (el) { 
      const y = el.getBoundingClientRect().top + window.scrollY - 160; 
      window.scrollTo({ top: y, behavior: 'smooth' }); 
    }
  };

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
    acc.totalPeople += (parseInt(res.peopleCount, 10) || 0); 
    return acc; 
  }, { totalPeople: 0 });

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
    const arrivalRate = totalPeople > 0 ? Math.round((totalArrived * 100) / totalPeople) : 0;
    
    return { list: allData, totalPeople, totalArrived, arrivalRate };
  };

  const historyStats = getHistoryData();

  const getBtnClass = (type) => {
    if(requestData.type === type) {
        if(type==='kahvalti' || type==='yemek') return 'border-orange-500 bg-orange-50 text-orange-700 shadow-md';
        if(type==='mac') return 'border-blue-500 bg-blue-50 text-blue-700 shadow-md';
        if(type==='dogum_gunu') return 'border-purple-500 bg-purple-50 text-purple-700 shadow-md';
        if(type==='organizasyon') return 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md';
    }
    return 'border-slate-200 text-slate-500 hover:border-orange-200 bg-white';
  };

  const getReqTagBg = (type) => {
    if (type === 'mac') return 'bg-blue-600';
    if (type === 'dogum_gunu') return 'bg-purple-500';
    if (type === 'organizasyon') return 'bg-emerald-500';
    return 'bg-orange-500';
  };

  const activeMenuCategories = menuItems.length > 0 
    ? BASE_CATEGORIES.map(cat => ({ ...cat, items: menuItems.filter(item => item.category === cat.id) })).filter(cat => cat.items.length > 0)
    : BASE_CATEGORIES.map(cat => {
        const defaultCat = DEFAULT_MENU_CATEGORIES.find(c => c.id === cat.id);
        return { ...cat, items: defaultCat ? defaultCat.items : [] };
      }).filter(cat => cat.items.length > 0);

  const activeGallery = menuItems.length > 0 
    ? menuItems.filter(item => item.isFeatured) 
    : DEFAULT_MENU_GALLERY;

  // =======================================================================
  // DİJİTAL MENÜ (AYRI SAYFA - /menu)
  // =======================================================================
  if (showMenuPage && !isAuthenticated) {
     return (
        <div className="min-h-screen bg-[#0a0a0a] font-sans text-slate-200 relative w-full overflow-x-hidden">
          <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
          
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #FBE18D 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-yellow-600/10 rounded-full blur-[150px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>

          <header className="relative z-20 border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0">
             <div className="w-full mx-auto px-6 py-4 flex items-center justify-between">
                <button 
                  onClick={handleNavToHome} 
                  className="flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors font-bold uppercase tracking-widest text-xs sm:text-sm"
                >
                   <ArrowRight size={16} className="rotate-180" /> Ana Sayfa
                </button>
                <img src="/salaaslogobg.png" alt="Salaaş Logo" className="h-10 sm:h-12 object-contain filter drop-shadow-md brightness-200" />
                <div className="w-20"></div>
             </div>
          </header>

          <div className="sticky top-[73px] sm:top-[81px] z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl">
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
                     <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-500 mb-4 drop-shadow-lg">
                       Öne Çıkanlar
                     </h1>
                     <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">En çok tercih edilen imza lezzetlerimiz.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-10">
                     {activeGallery.map((item, idx) => (
                        <div key={item.id || idx} className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all duration-500 group relative shadow-2xl h-80 md:h-96">
                           <img 
                             src={encodeURI(item.image)} 
                             alt={item.name} 
                             className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                             onError={(e) => { e.currentTarget.style.display = 'none'; }}
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 lg:p-8">
                              {item.tag && (
                                <span className="bg-orange-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full w-max mb-3 flex items-center gap-1.5 shadow-lg">
                                  <Star size={14}/> {item.tag}
                                </span>
                              )}
                              <h3 className="text-xl sm:text-2xl font-serif font-black text-white tracking-wide drop-shadow-md">
                                {item.name}
                              </h3>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
             )}

             <div className="space-y-20">
                {activeMenuCategories.map(cat => (
                   <div id={`cat-${cat.id}`} key={cat.id} className="scroll-mt-36">
                      <div className="flex items-center gap-4 mb-8">
                         <div className="bg-gradient-to-br from-orange-500 to-yellow-600 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] shrink-0">
                            <cat.Icon size={20} />
                         </div>
                         <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-wide">{cat.name}</h2>
                         <div className="h-[1px] flex-1 bg-gradient-to-r from-orange-500/50 to-transparent ml-4"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                         {cat.items.map((itemObj, idx) => {
                           const itemName = typeof itemObj === 'string' ? itemObj : itemObj.name;
                           const itemImage = typeof itemObj === 'string' ? null : itemObj.image;
                           const itemPrice = typeof itemObj === 'string' ? null : itemObj.price;
                           const itemDesc = typeof itemObj === 'string' ? null : itemObj.description;

                           if(itemImage) {
                             return (
                                <div key={idx} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 group shadow-lg flex flex-col h-full min-h-[220px]">
                                   <div className="relative w-full h-36 sm:h-40 overflow-hidden shrink-0">
                                      <img 
                                        src={encodeURI(itemImage)} 
                                        alt={itemName} 
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                                      />
                                   </div>
                                   <div className="p-5 flex flex-col justify-between bg-[#111] grow">
                                      <div>
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                           <span className="text-white font-bold text-sm sm:text-base tracking-wide leading-snug">{itemName}</span>
                                           {itemPrice && <span className="text-orange-400 font-black whitespace-nowrap text-sm">{itemPrice} TL</span>}
                                        </div>
                                        {itemDesc && <p className="text-slate-400 text-xs line-clamp-2 mb-3">{itemDesc}</p>}
                                      </div>
                                      <div className="w-full flex justify-end mt-auto">
                                         <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50 group-hover:bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0)] group-hover:shadow-[0_0_8px_rgba(249,115,22,0.8)] transition-all"></div>
                                      </div>
                                   </div>
                                </div>
                             );
                           } else {
                             return (
                                <div key={idx} className="bg-[#111] border border-white/5 rounded-2xl p-5 flex flex-col justify-between group hover:border-orange-500/30 hover:bg-[#161616] transition-all h-full min-h-[90px]">
                                   <div className="flex justify-between items-start gap-4">
                                     <span className="text-slate-300 font-medium group-hover:text-white transition-colors leading-snug text-sm sm:text-base">{itemName}</span>
                                     {itemPrice && <span className="text-orange-400 font-black whitespace-nowrap text-sm">{itemPrice} TL</span>}
                                   </div>
                                   {itemDesc && <p className="text-slate-500 text-xs mt-2 line-clamp-2">{itemDesc}</p>}
                                </div>
                             );
                           }
                         })}
                      </div>
                   </div>
                ))}
             </div>
             
             <div className="mt-24 text-center flex flex-col sm:flex-row items-center justify-center gap-6">
                <a 
                  href="https://m.1menu.com.tr/salaascafe/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest transition-transform hover:scale-105 shadow-[0_0_30px_rgba(249,115,22,0.4)] text-base lg:text-lg"
                >
                  Fiyatlı Dijital Menüye Git <ArrowRight size={20} />
                </a>
             </div>
          </main>
          
          <footer className="w-full bg-black py-10 border-t border-white/10 text-center relative z-20 mt-12">
             <p className="text-slate-500 font-medium text-sm">© 2026 Salaaş Cafe Restaurant. Tüm hakları saklıdır.</p>
          </footer>
        </div>
     );
  }

  // =======================================================================
  // 1. MÜŞTERİ / ZİYARETÇİ EKRANI (PREMIUM LANDING PAGE)
  // =======================================================================
  if (!isAuthenticated && !showMenuPage) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 relative flex flex-col scroll-smooth w-full overflow-x-hidden">
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
          <nav className={`w-full pointer-events-auto transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200' : 'bg-transparent py-5 sm:py-6'}`}>
            <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-24 flex items-center justify-between">
              
              <div className={`transition-all duration-500 cursor-pointer flex items-center justify-center bg-transparent shrink-0 ${isScrolled ? 'h-10 sm:h-12' : 'h-12 sm:h-16'}`} onClick={() => window.scrollTo(0,0)}>
                <img src="/salaaslogobg.png" alt="Salaaş Logo" className="h-full w-auto object-contain bg-transparent" />
              </div>
              
              <div className={`hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-12 font-bold text-sm xl:text-base transition-colors duration-500 ${isScrolled ? 'text-slate-700' : 'text-white drop-shadow-md'}`}>
                <button onClick={() => handleScrollToId('hakkimizda')} className="hover:text-orange-500 transition-colors whitespace-nowrap">Biz Kimiz?</button>
                <button onClick={() => handleScrollToId('lezzetler')} className="hover:text-orange-500 transition-colors whitespace-nowrap">Lezzetler</button>
                <button onClick={() => handleScrollToId('iletisim')} className="hover:text-orange-500 transition-colors whitespace-nowrap">İletişim</button>
              </div>
              
              <div className="shrink-0 flex items-center justify-end gap-3 sm:gap-4">
                <button 
                  onClick={() => setShowRequestModal(true)} 
                  className={`hidden sm:flex items-center gap-2 px-4 py-2.5 xl:px-6 xl:py-3 rounded-full text-xs xl:text-sm font-bold tracking-widest uppercase transition-all shadow-md ${isScrolled ? 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50' : 'bg-emerald-700/80 backdrop-blur-sm text-white hover:bg-emerald-600 border border-emerald-500/50'}`}
                >
                  <CalendarDays size={16} /> Rezervasyon
                </button>
                
                <button 
                  onClick={handleNavToMenu} 
                  className="shine-effect bg-black/80 text-[#FBE18D] border border-[#FBE18D]/30 px-5 py-2.5 sm:px-6 sm:py-3 xl:px-8 xl:py-3.5 rounded-full text-xs sm:text-sm font-black tracking-widest uppercase hover:bg-black hover:border-[#FBE18D] hover:scale-105 transition-all shadow-lg whitespace-nowrap flex items-center gap-2"
                >
                  <MenuSquare size={16} /> Dijital Menü
                </button>
                
                <a 
                  href="https://m.1menu.com.tr/salaascafe/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="shine-effect bg-orange-500 text-white px-5 py-2.5 sm:px-6 sm:py-3 xl:px-8 xl:py-3.5 rounded-full text-xs sm:text-sm font-black tracking-widest uppercase hover:bg-orange-600 hover:scale-105 transition-all shadow-lg whitespace-nowrap hidden md:block"
                >
                  Hızlı Sipariş
                </a>
              </div>
            </div>
          </nav>
        </div>

        <header className="relative w-full min-h-[500px] h-[75vh] lg:h-[85vh] max-h-[1000px] bg-slate-900 flex items-center justify-center overflow-hidden pt-16">
           <div className="absolute inset-0 z-0 w-full h-full">
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
                 <button 
                   onClick={() => setShowRequestModal(true)} 
                   className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 lg:px-10 lg:py-5 rounded-full font-black uppercase tracking-widest transition-transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2 lg:text-lg"
                 >
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
                    onClick={handleNavToMenu} 
                    className="lg:col-span-2 sm:col-span-2 rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 transition-all duration-500 relative group h-80 sm:h-96 md:h-[450px] cursor-pointer border border-slate-100 bg-white"
                  >
                    <img src={encodeURI(item.image)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent flex flex-col justify-end p-8 lg:p-10">
                       <span className="bg-orange-500 text-white text-xs lg:text-sm font-black uppercase tracking-widest px-4 py-1.5 lg:px-5 lg:py-2 rounded-full w-max mb-4 lg:mb-6 flex items-center gap-1.5 shadow-lg">
                         <Star size={16}/> {item.tag || 'Öne Çıkan'}
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

        <footer id="iletisim" className="w-full bg-slate-950 text-slate-400 py-20 lg:py-24 relative z-10 border-t border-slate-800">
          <div className="w-full mx-auto px-6 sm:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <img src="/salaaslogobg.png" alt="Salaaş Logo" className="h-24 lg:h-32 object-contain mb-8 opacity-90" />
              <p className="text-base lg:text-lg leading-relaxed mb-6 max-w-sm font-medium text-slate-300">Şehrin kalbinde, lezzet ve muhabbetin kesişme noktası. Sizi ağırlamaktan mutluluk duyarız.</p>
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
                   <a href="tel:+902626421413" className="hover:text-orange-400 transition-colors flex items-center justify-center md:justify-start gap-3">
                     <Phone size={20} className="text-orange-500 shrink-0"/> 
                     <span className="text-white font-bold">📞 Telefon</span>
                     <span className="ml-2">0262 642 14 13</span>
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
                      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4"><CheckCircle2 size={48} /></div>
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

                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Rezervasyon Türü</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <button 
                            type="button" 
                            onClick={() => setRequestData({...requestData, type: 'kahvalti'})} 
                            className={`py-3.5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all flex items-center justify-center gap-2 ${getBtnClass('kahvalti')}`}
                          >
                             <Coffee size={18}/> Kahvaltı
                          </button>
                          
                          <button 
                            type="button" 
                            onClick={() => setRequestData({...requestData, type: 'yemek'})} 
                            className={`py-3.5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all flex items-center justify-center gap-2 ${getBtnClass('yemek')}`}
                          >
                             <UtensilsCrossed size={18}/> Yemek
                          </button>
                          
                          <button 
                            type="button" 
                            onClick={() => setRequestData({...requestData, type: 'mac'})} 
                            className={`py-3.5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all flex items-center justify-center gap-2 ${getBtnClass('mac')}`}
                          >
                             <MonitorPlay size={18}/> Maç
                          </button>
                          
                          <button 
                            type="button" 
                            onClick={() => setRequestData({...requestData, type: 'dogum_gunu'})} 
                            className={`py-3.5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all flex items-center justify-center gap-2 ${getBtnClass('dogum_gunu')}`}
                          >
                             <Star size={18}/> Doğum Günü
                          </button>
                          
                          <button 
                            type="button" 
                            onClick={() => setRequestData({...requestData, type: 'organizasyon'})} 
                            className={`py-3.5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all flex items-center justify-center gap-2 md:col-span-2 ${getBtnClass('organizasyon')}`}
                          >
                             <Users size={18}/> Organizasyon
                          </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="flex-[2]">
                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Ad Soyad</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={requestData.name} 
                          onChange={handleRequestChange} 
                          className={`w-full bg-white px-5 py-4 rounded-2xl border-2 focus:ring-4 outline-none font-bold text-slate-800 transition-all text-lg ${requestData.type === 'mac' ? 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500' : 'border-slate-200 focus:ring-orange-500/10 focus:border-orange-500'}`} 
                          required 
                          placeholder="Adınız Soyadınız" 
                        />
                      </div>
                      <div className="flex-[1]">
                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Kişi Sayısı</label>
                        <input 
                          type="number" 
                          name="peopleCount" 
                          min="1" 
                          value={requestData.peopleCount} 
                          onChange={handleRequestChange} 
                          className={`w-full bg-white px-5 py-4 rounded-2xl border-2 focus:ring-4 outline-none font-bold text-slate-800 transition-all text-center text-lg ${requestData.type === 'mac' ? 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500' : 'border-slate-200 focus:ring-orange-500/10 focus:border-orange-500'}`} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5">
                       <div className="flex-1">
                          <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Telefon</label>
                          <input 
                            type="tel" 
                            name="phone" 
                            value={requestData.phone} 
                            onChange={handleRequestChange} 
                            className={`w-full bg-white px-5 py-4 rounded-2xl border-2 focus:ring-4 outline-none font-bold text-slate-800 transition-all text-lg ${requestData.type === 'mac' ? 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500' : 'border-slate-200 focus:ring-orange-500/10 focus:border-orange-500'}`} 
                            required 
                            placeholder="05XX..." 
                          />
                       </div>
                       <div className="flex-1">
                          <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Tarih</label>
                          <input 
                            type="date" 
                            name="date" 
                            value={requestData.date} 
                            onChange={handleRequestChange} 
                            className={`w-full bg-white px-5 py-4 rounded-2xl border-2 focus:ring-4 outline-none font-bold text-slate-800 transition-all text-lg ${requestData.type === 'mac' ? 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500' : 'border-slate-200 focus:ring-orange-500/10 focus:border-orange-500'}`} 
                            required 
                          />
                       </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                        {(requestData.type === 'dogum_gunu' || requestData.type === 'organizasyon') ? 'Detaylı Açıklama (Zorunlu)' : 'Notunuz (İsteğe Bağlı)'}
                      </label>
                      <textarea 
                        name="notes" 
                        value={requestData.notes} 
                        onChange={handleRequestChange} 
                        rows="3" 
                        required={(requestData.type === 'dogum_gunu' || requestData.type === 'organizasyon')}
                        className={`w-full bg-white px-5 py-4 rounded-2xl border-2 focus:ring-4 outline-none font-medium text-slate-800 transition-all resize-none text-base ${(requestData.type === 'dogum_gunu' || requestData.type === 'organizasyon') ? 'border-slate-200 focus:ring-purple-500/10 focus:border-purple-500' : 'border-slate-200 focus:ring-orange-500/10 focus:border-orange-500'}`} 
                        placeholder={(requestData.type === 'dogum_gunu' || requestData.type === 'organizasyon') ? "Lütfen organizasyonunuzun konsepti, pasta, vb. özel isteklerinizi detaylıca yazın." : "Örn: Mama sandalyesi istiyoruz vb."}
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className={`w-full bg-white px-5 py-4 rounded-2xl border-2 focus:ring-4 outline-none font-medium text-slate-800 transition-all resize-none text-base ${
  (requestData.type === 'dogum_gunu' || requestData.type === 'organizasyon') 
    ? 'border-slate-200 focus:ring-purple-500/10 focus:border-purple-500' 
    : 'border-slate-200 focus:ring-orange-500/10 focus:border-orange-500'
}`}
                    >
                      Talebi Gönder <ArrowRight size={24} />
                    </button>
                  </form>
                </div>
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
                {loginError && (
                  <div className="bg-red-50 text-red-600 text-sm font-bold p-3 sm:p-4 rounded-xl border border-red-100 flex items-center gap-2">
                    <X size={16}/> {loginError}
                  </div>
                )}
                
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
                
                <button 
                  type="submit" 
                  className="w-full bg-[#0B3B2C] hover:bg-emerald-900 text-white font-black tracking-widest uppercase py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-xl mt-4 sm:mt-6 flex items-center justify-center gap-2 sm:gap-3 hover:-translate-y-0.5 text-base sm:text-lg"
                >
                  Giriş Yap <ArrowRight size={20} />
                </button>
              </form>
            </div>
          </div>
        )}
        
        {/* WHATSAPP FLOATING BUTTON */}
        <a 
          href="https://wa.me/905360170208?text=Merhaba%20Salaas%20Cafe,%20rezervasyon%20yapmak%20istiyorum." 
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

  // =======================================================================
  // 2. PERSONEL / ADMİN YÖNETİM EKRANI
  // =======================================================================
  return (
    <div className={`min-h-screen font-sans text-slate-800 pb-12 print:bg-white print:pb-0 relative transition-colors duration-500 w-full overflow-x-hidden ${activePage === 'restoran' || activePage === 'menu' ? 'bg-slate-50' : (activePage === 'mac' ? 'bg-[#f0f4f8]' : 'bg-slate-100')}`}>
      
      {/* BULK MESSAGE UI */}
      {bulkMessage && (
        <div className="fixed top-24 right-4 sm:right-10 z-[100] bg-slate-800 text-white p-4 sm:p-5 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm border border-slate-700 animate-in slide-in-from-right-8 duration-300">
          <CheckCircle size={24} className="text-emerald-400 shrink-0" />
          <p className="font-bold text-sm sm:text-base leading-snug">{bulkMessage}</p>
          <button 
            onClick={() => setBulkMessage('')} 
            className="ml-auto text-slate-400 hover:text-white bg-slate-700 p-1.5 rounded-lg transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* CSS KEYFRAMES FOR CUSTOM ANIMATIONS & VITE RESET */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }}></style>

      {/* RESTORAN DESEN */}
      {activePage === 'restoran' && (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] print:hidden w-full h-full" style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      )}
      
      {/* MAÇ DESENİ */}
      {activePage === 'mac' && (
        <div className="fixed top-20 right-10 z-0 pointer-events-none opacity-[0.03] text-blue-900 rotate-12 print:hidden">
          <MonitorPlay size={400} strokeWidth={1} />
        </div>
      )}

      {/* Genel Yazdırma Modu İçin Gizli Başlık */}
      <div className={`hidden ${!printSingleId ? 'print:block' : ''} text-center mb-4 border-b-2 border-black pb-2 relative z-10 w-full`}>
        <h1 className="text-xl font-bold font-sans uppercase">
          {activePage === 'restoran' ? 'Salaaş Cafe' : 'Salaaş Cafe Maç'}
        </h1>
        <p className="text-sm mt-1 font-bold text-black">
          Tarih: {activePage === 'restoran' ? selectedFilterDate : selectedMatchDate}
        </p>
      </div>

      <header className={`${activePage === 'restoran' || activePage === 'menu' ? 'bg-[#0B3B2C]' : activePage === 'mac' ? 'bg-[#0a192f]' : 'bg-slate-900'} text-white shadow-lg sticky z-20 print:hidden transition-colors duration-500 w-full top-0`}>
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-20 py-3 sm:py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center justify-between w-full lg:w-auto gap-4">
            
            <div className="flex items-center gap-4">
              <div className="h-10 sm:h-12 shrink-0 flex items-center justify-center overflow-visible drop-shadow-md bg-transparent">
                <img src="/salaaslogobg.png" alt="Salaaş Cafe Logo" className="h-full w-auto object-contain bg-transparent" />
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-base md:text-lg lg:text-xl font-black tracking-wide text-transparent bg-clip-text font-serif ${activePage === 'restoran' || activePage === 'menu' ? 'bg-gradient-to-r from-orange-400 to-yellow-300' : activePage === 'mac' ? 'bg-gradient-to-r from-blue-400 to-cyan-300' : 'bg-gradient-to-r from-slate-200 to-white'}`}>
                  Yönetim Paneli
                </h1>
              </div>
            </div>

            <div className="flex items-center bg-black/40 p-1.5 rounded-xl border border-white/10 shadow-inner ml-2 sm:ml-0 overflow-x-auto">
              <button 
                onClick={() => setActivePage('restoran')} 
                className={`px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg text-xs lg:text-sm font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activePage === 'restoran' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                <UtensilsCrossed size={16} className={activePage === 'restoran' ? '' : 'opacity-50'}/> RESTORAN
              </button>
              
              <button 
                onClick={() => setActivePage('mac')} 
                className={`px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg text-xs lg:text-sm font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activePage === 'mac' ? 'bg-blue-600 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                <MonitorPlay size={16} className={activePage === 'mac' ? '' : 'opacity-50'}/> MAÇ
              </button>

              <button 
                onClick={() => setActivePage('menu')} 
                className={`px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg text-xs lg:text-sm font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activePage === 'menu' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                <MenuSquare size={16} className={activePage === 'menu' ? '' : 'opacity-50'}/> MENÜ
              </button>
              
              <button 
                onClick={() => setActivePage('talepler')} 
                className={`relative px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg text-xs lg:text-sm font-black tracking-widest uppercase transition-all flex items-center gap-2 shrink-0 ${activePage === 'talepler' ? 'bg-emerald-600 text-white shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                <Inbox size={16} className={activePage === 'talepler' ? '' : 'opacity-50'}/> TALEPLER 
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-md">
                    {pendingRequests.length}
                  </span>
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
            {activePage !== 'talepler' && activePage !== 'gecmis' && activePage !== 'menu' && (
              <div className={`flex shrink-0 items-center bg-white/10 rounded-xl px-4 py-2.5 lg:px-5 lg:py-3 border border-white/10 hover:bg-white/20 transition-colors w-full lg:w-auto justify-center`}>
                <CalendarDays className={`mr-2 ${activePage === 'restoran' ? 'text-orange-400' : 'text-cyan-400'}`} size={20} />
                <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest opacity-70 text-cyan-100 hidden lg:inline mr-3">Tarih Seç:</span>
                <input 
                  type="date" 
                  value={activePage === 'restoran' ? selectedFilterDate : selectedMatchDate} 
                  onChange={(e) => activePage === 'restoran' ? setSelectedFilterDate(e.target.value) : setSelectedMatchDate(e.target.value)} 
                  className="bg-transparent text-white outline-none font-bold cursor-pointer text-sm lg:text-base w-full lg:w-auto" 
                />
              </div>
            )}
            
            <button 
              onClick={() => {setIsAuthenticated(false); setLoginUser(''); setLoginPass('');}} 
              className="shrink-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 lg:px-5 lg:py-3 rounded-xl text-xs lg:text-sm font-black uppercase tracking-widest transition-colors shadow-md ml-auto lg:ml-0" 
              title="Güvenli Çıkış"
            >
              ÇIKIŞ
            </button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className={`flex flex-col items-center justify-center mt-32 relative z-10 w-full ${activePage === 'restoran' || activePage === 'menu' ? 'text-orange-600' : 'text-blue-600'}`}>
          <Loader2 className="animate-spin mb-4" size={64} />
          <p className="font-bold text-lg tracking-widest animate-pulse uppercase">Sisteme Bağlanıyor...</p>
        </div>
      ) : (
        <main className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-20 mt-8 lg:mt-10 relative z-10">
          
          {/* TALEPLER EKRANI */}
          {activePage === 'talepler' && (
            <div className="lg:col-span-12 space-y-6 w-full">
               <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-100 w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 pb-6 border-b border-slate-100 gap-4">
                     <h2 className="text-2xl lg:text-3xl font-black flex items-center gap-3 text-slate-800">
                       <Inbox className="text-emerald-500" size={36} /> Müşteri Rezervasyon Talepleri
                     </h2>
                     <span className="bg-emerald-100 text-emerald-800 px-6 py-3 rounded-full text-sm font-black shrink-0 shadow-sm">
                       {pendingRequests.length} Bekleyen Talep
                     </span>
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
                           
                           <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-2xl font-black text-xs uppercase tracking-widest text-white shadow-md ${req.type === 'mac' ? 'bg-blue-600' : req.type === 'dogum_gunu' ? 'bg-purple-500' : req.type === 'organizasyon' ? 'bg-emerald-500' : 'bg-orange-500'}`}>
                             {typeLabels[req.type] || 'REZERVASYON'}
                           </div>

                           <div className="mt-4 mb-6">
                              <h3 className="text-2xl font-black text-slate-800 truncate">{req.name}</h3>
                              <p className="text-base font-bold text-slate-500 flex items-center gap-2 mt-2">
                                <Phone size={16} className="text-slate-400"/> {req.phone}
                              </p>
                           </div>

                           <div className="flex items-center gap-4 mb-6">
                              <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-700 shadow-sm">
                                <CalendarDays size={16} className="text-slate-400"/> {req.date}
                              </div>
                              <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-700 shadow-sm">
                                <Users size={16} className="text-slate-400"/> {req.peopleCount} Kişi
                              </div>
                           </div>

                           {req.notes && (
                              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl mb-6">
                                 <p className="text-sm font-bold text-amber-800 line-clamp-4">" {req.notes} "</p>
                              </div>
                           )}

                           <div className="flex flex-col gap-3 pt-6 border-t border-slate-200 mt-auto">
                              <button 
                                onClick={() => handleApproveRequest(req, true)} 
                                className="w-full bg-[#25D366] hover:bg-[#20b858] text-white py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-transform hover:scale-[1.02] shadow-md flex items-center justify-center gap-2"
                              >
                                 <MessageCircle size={20}/> Onayla & WA Gönder
                              </button>
                              
                              <div className="flex gap-3">
                                 <button 
                                   onClick={() => handleApproveRequest(req, false)} 
                                   className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors shadow-sm flex items-center justify-center gap-2 border border-emerald-200"
                                 >
                                    <Check size={18}/> Sadece Onayla
                                 </button>
                                 
                                 <button 
                                   onClick={() => handleRejectRequest(req.id)} 
                                   className="flex-none bg-slate-200 hover:bg-red-500 hover:text-white text-slate-600 px-4 py-3 rounded-2xl transition-colors shadow-sm" 
                                   title="Reddet / Sil"
                                 >
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


          {/* RESTORAN EKRANI */}
          {activePage === 'restoran' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 w-full col-span-12">
              {/* SOL KOLON - FORM */}
              <div className="lg:col-span-4 xl:col-span-3 space-y-6 print:hidden w-full">
                <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border overflow-hidden transition-colors w-full ${isEditing ? 'border-orange-400 shadow-orange-500/20' : 'border-slate-200/60'}`}>
                  
                  <div className={`px-6 py-5 flex items-center justify-between ${isEditing ? 'bg-orange-50 border-b border-orange-100' : 'bg-gradient-to-r from-slate-50 to-white border-b border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isEditing ? 'bg-orange-100 text-orange-600' : 'bg-[#0B3B2C]/10 text-[#0B3B2C]'}`}>
                        <Edit2 size={20} />
                      </div>
                      <h2 className={`text-lg lg:text-xl font-black tracking-wide ${isEditing ? 'text-orange-800' : 'text-[#0B3B2C]'}`}>
                        {isEditing ? 'Kayıt Düzenle' : 'Yeni Rezervasyon'}
                      </h2>
                    </div>
                    {isEditing && (
                      <button onClick={() => cancelEdit(false)} className="text-slate-400 p-1.5 hover:bg-white rounded-full shadow-sm border border-slate-200">
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  
                  <form onSubmit={(e) => handleFormSubmit(e, false)} className="p-6 lg:p-8 space-y-5">
                    {errorMsg && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2 shadow-sm">
                        <X size={16} /> {errorMsg}
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Rezervasyon Türü
                      </label>
                      <select 
                        name="type" 
                        value={formData.type || 'yemek'} 
                        onChange={handleChange} 
                        className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 bg-slate-50/50 font-bold text-lg text-slate-700 outline-none"
                      >
                         <option value="kahvalti">Kahvaltı</option>
                         <option value="yemek">Yemek</option>
                         <option value="dogum_gunu">Doğum Günü</option>
                         <option value="organizasyon">Organizasyon</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">İsim</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                          className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 bg-slate-50/50 font-bold text-lg" 
                          placeholder="Müşteri İsmi" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Telefon</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="tel" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            className="w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 bg-slate-50/50 font-bold text-lg" 
                            placeholder="05XX..." 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-inner">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Masa Seçimi</label>
                        <button 
                          type="button" 
                          onClick={() => setShowTableMap(!showTableMap)} 
                          className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-orange-200 transition-colors"
                        >
                          <Map size={14} /> {showTableMap ? 'Krokiden Gizle' : 'Krokiden Seç'}
                        </button>
                      </div>
                      
                      {showTableMap && (
                        <div className="mb-5 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                          <div className="relative w-full aspect-[4/5] min-h-[300px] bg-[#e6e2d8] border-[10px] border-slate-700/80 rounded-xl overflow-hidden shadow-inner font-sans">
                            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, #000 20px, #000 21px)' }}></div>
                            {TABLE_MAP.map(table => {
                               const status = getTableStatus(table.id);
                               let surf = "bg-[#d4a373] border-[#bc8a5f] text-amber-950"; 
                               if (status === 'reserved') surf = "bg-emerald-500 border-emerald-600 text-white"; 
                               else if (status === 'full') surf = "bg-red-500 border-red-600 text-white";
                               return (
                                  <button 
                                    key={table.id} 
                                    type="button" 
                                    disabled={status !== 'empty'} 
                                    onClick={() => setFormData({...formData, table: table.id})} 
                                    className={`absolute group flex items-center justify-center transition-all duration-300 z-20 ${status === 'empty' ? 'hover:scale-110 cursor-pointer' : 'opacity-95 cursor-not-allowed'}`} 
                                    style={{ top: table.top, left: table.left, width: table.width, height: table.height }}
                                  >
                                     <div className={`relative w-full h-full flex items-center justify-center rounded shadow-lg border-b-4 border-r-2 ${surf}`}>
                                       <span className="font-black text-[8px] sm:text-[10px] drop-shadow-sm">{table.id}</span>
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
                            <Armchair className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                              type="text" 
                              name="table" 
                              value={formData.table} 
                              onChange={handleChange} 
                              className="w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 bg-white font-black uppercase text-[#0B3B2C] shadow-sm text-lg" 
                              placeholder="Masa" 
                            />
                          </div>
                        </div>
                        <div className="flex-[1]">
                          <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                              type="number" 
                              inputMode="numeric" 
                              name="peopleCount" 
                              min="1" 
                              value={formData.peopleCount} 
                              onChange={handleChange} 
                              className="w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 bg-white font-black text-[#0B3B2C] shadow-sm text-lg" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <CalendarDays size={14} className="text-orange-500"/> Tarih
                        </label>
                        <input 
                          type="date" 
                          name="date" 
                          value={formData.date} 
                          onChange={handleChange} 
                          className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 bg-slate-50/50 font-bold text-[#0B3B2C] text-lg" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <MessageSquareText size={14}/> Not / Açıklama
                        </label>
                        <textarea 
                          name="notes" 
                          value={formData.notes} 
                          onChange={handleChange} 
                          rows={2} 
                          className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-amber-500/10 bg-amber-50/50 placeholder:text-amber-400 font-medium text-lg resize-none" 
                          placeholder="Özel istekler..."
                        ></textarea>
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className={`w-full font-black tracking-widest uppercase py-5 mt-6 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 text-white hover:scale-[1.02] active:scale-95 text-lg ${isEditing ? 'bg-gradient-to-r from-[#0B3B2C] to-emerald-900' : 'bg-gradient-to-r from-orange-500 to-orange-600'}`}
                    >
                      {isEditing ? <Check size={24} /> : <Plus size={24} />} 
                      {isEditing ? 'Kaydet' : 'Ekle'}
                    </button>
                  </form>
                </div>
              </div>

              {/* SAĞ KOLON - RESTORAN LİSTESİ */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-6 print:w-full print:block print:space-y-4 w-full">
                
                <div className={`bg-gradient-to-br from-[#0B3B2C] to-emerald-900 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col gap-6 relative overflow-hidden w-full ${printSingleId ? 'print:hidden' : 'print:bg-white print:from-white print:to-white print:border-b-2 print:border-black print:rounded-none print:shadow-none print:p-2 print:mb-4'}`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full border-b border-emerald-700/50 pb-6 z-10 print:border-black print:pb-2 gap-4">
                    
                    <div className="flex items-center gap-5 text-[#FBE18D] w-full sm:w-auto">
                      <div className="bg-white/10 p-4 rounded-2xl print:hidden shrink-0">
                        <UtensilsCrossed size={36} />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-widest text-orange-400 print:text-black">Günlük Katılım Özeti</p>
                        <p className="text-3xl sm:text-4xl font-black text-white mt-1 print:text-black">Toplam: <span className="text-orange-400 print:text-black">{dailySummary.totalPeople}</span> Kişi</p>
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
                  
                  <div className="pt-2 flex justify-end print:hidden relative z-10">
                    <button 
                      onClick={() => sendBulkWhatsApp(filteredReservations, 'restoran')} 
                      className="bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                    >
                      <MessageCircle size={18} /> Tümüne Hatırlatma Gönder
                    </button>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/60 p-6 sm:p-8 lg:p-10 min-h-[500px] print:p-0 print:border-none print:shadow-none print:bg-white w-full">
                  <div className={`flex flex-col md:flex-row items-start md:items-center justify-between mb-10 pb-6 border-b border-slate-100 gap-5 ${printSingleId ? 'print:hidden' : 'print:border-b-2 print:border-black print:pb-2 print:mb-3'}`}>
                    
                    <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-3 text-[#0B3B2C]">
                      <Armchair className="text-orange-500 print:hidden" size={32} /> Aktif Masalar
                    </h2>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                      <div className="relative w-full sm:w-80 print:hidden">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          type="text" 
                          placeholder="İsim, masa veya telefon ara..." 
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                          className="w-full pl-12 pr-5 py-3 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-base font-medium shadow-sm outline-none bg-slate-50 transition-all" 
                        />
                      </div>
                      
                      <span className="bg-orange-100 text-orange-800 px-5 py-3 rounded-full text-sm font-black print:hidden shrink-0">
                        {sortedReservations.length} Kayıt
                      </span>
                      
                      <button 
                        onClick={() => window.print()} 
                        className="w-full sm:w-auto bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors print:hidden shrink-0"
                      >
                        <Printer size={18} /> YAZDIR
                      </button>
                    </div>
                  </div>
                  
                  {sortedReservations.length === 0 ? (
                    <div className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-24 text-center text-slate-400 print:hidden w-full">
                      <Search size={56} className="opacity-50 text-orange-400 mx-auto mb-5" />
                      <p className="font-black text-2xl">Kayıt bulunamadı.</p>
                    </div>
                  ) : (
                    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 sm:gap-8 w-full ${printSingleId ? 'print:grid-cols-1 print:gap-0' : 'print:grid-cols-2 print:gap-4'}`}>
                      {sortedReservations.map((res) => renderReservationCard(res, 'restoran'))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MAÇ EKRANI */}
          {activePage === 'mac' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 w-full col-span-12">
              {/* MAÇ SOL KOLON - FORM */}
              <div className="lg:col-span-4 xl:col-span-3 space-y-6 print:hidden w-full">
                <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border overflow-hidden transition-colors w-full ${isMatchEditing ? 'border-blue-400 shadow-blue-500/20' : 'border-slate-200/60'}`}>
                  
                  <div className={`px-6 py-5 flex items-center justify-between ${isMatchEditing ? 'bg-blue-50 border-b border-blue-100' : 'bg-gradient-to-r from-slate-50 to-white border-b border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isMatchEditing ? 'bg-blue-100 text-blue-600' : 'bg-[#0a192f]/10 text-[#0a192f]'}`}>
                        <MonitorPlay size={20} />
                      </div>
                      <h2 className={`text-lg lg:text-xl font-black tracking-wide ${isMatchEditing ? 'text-blue-800' : 'text-[#0a192f]'}`}>
                        {isMatchEditing ? 'Rezervasyonu Düzenle' : 'Maç Rezervasyonu'}
                      </h2>
                    </div>
                    {isMatchEditing && (
                      <button onClick={() => cancelMatchEdit()} className="text-slate-400 p-1.5 hover:bg-white rounded-full shadow-sm border border-slate-200">
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  
                  <form onSubmit={(e) => handleFormSubmit(e, true)} className="p-6 lg:p-8 space-y-6">
                    {matchErrorMsg && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2 shadow-sm">
                        <X size={16} /> {matchErrorMsg}
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">İsim</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={matchFormData.name} 
                          onChange={handleMatchChange} 
                          className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-slate-50/50 font-bold text-lg" 
                          placeholder="Müşteri İsmi" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Telefon</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="tel" 
                            name="phone" 
                            value={matchFormData.phone} 
                            onChange={handleMatchChange} 
                            className="w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-slate-50/50 font-bold text-lg" 
                            placeholder="05XX..." 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-[2]">
                        <div className="relative">
                          <Armchair className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="text" 
                            name="table" 
                            value={matchFormData.table} 
                            onChange={handleMatchChange} 
                            className="w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/50 font-black uppercase text-[#0a192f] text-lg" 
                            placeholder="Masa Kodu" 
                          />
                        </div>
                      </div>
                      <div className="flex-[1]">
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="number" 
                            inputMode="numeric" 
                            name="peopleCount" 
                            min="1" 
                            value={matchFormData.peopleCount} 
                            onChange={handleMatchChange} 
                            className="w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/50 font-black text-[#0a192f] text-lg" 
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <CalendarDays size={14} className="text-blue-500"/> Maç Tarihi
                      </label>
                      <input 
                        type="date" 
                        name="date" 
                        value={matchFormData.date} 
                        onChange={handleMatchChange} 
                        className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/50 font-bold text-[#0a192f] text-lg" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <MessageSquareText size={14}/> Özel Not (Opsiyonel)
                      </label>
                      <textarea 
                        name="notes" 
                        value={matchFormData.notes} 
                        onChange={handleMatchChange} 
                        rows={2} 
                        className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/50 font-medium text-lg resize-none" 
                        placeholder="Örn: Forma ile gelecek..."
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      className={`w-full font-black tracking-widest uppercase py-5 mt-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 text-white hover:scale-[1.02] active:scale-95 text-lg ${isMatchEditing ? 'bg-gradient-to-r from-[#0a192f] to-blue-900' : 'bg-gradient-to-r from-blue-500 to-cyan-600'}`}
                    >
                      {isMatchEditing ? <Check size={24} /> : <Plus size={24} />} 
                      {isMatchEditing ? 'Güncelle' : 'Ekle'}
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
                  
                  <div className="mt-2 pt-4 border-t border-blue-800/50 flex justify-end print:hidden">
                    <button 
                      onClick={() => sendBulkWhatsApp(filteredMatchReservations, 'mac')} 
                      className="bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                    >
                      <MessageCircle size={18} /> Tümüne Hatırlatma Gönder
                    </button>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/60 p-6 sm:p-8 lg:p-10 min-h-[500px] print:p-0 print:border-none print:shadow-none print:bg-white w-full">
                  <div className={`flex flex-col md:flex-row items-start md:items-center justify-between mb-10 pb-6 border-b border-slate-100 gap-5 ${printSingleId ? 'print:hidden' : 'print:border-b-2 print:border-black print:pb-2 print:mb-3'}`}>
                    
                    <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-3 text-[#0a192f]">
                      <MonitorPlay className="text-blue-500 print:hidden" size={32} /> Maç Rezervasyonları
                    </h2>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                      <div className="relative w-full sm:w-80 print:hidden">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          type="text" 
                          placeholder="İsim, masa veya telefon ara..." 
                          value={matchSearchTerm} 
                          onChange={(e) => setMatchSearchTerm(e.target.value)} 
                          className="w-full pl-12 pr-5 py-3 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-base font-medium shadow-sm outline-none bg-slate-50 transition-all" 
                        />
                      </div>
                      
                      <span className="bg-blue-100 text-blue-800 px-5 py-3 rounded-full text-sm font-black print:hidden shrink-0">
                        {sortedMatchReservations.length} Kayıt
                      </span>
                      
                      <button 
                        onClick={() => window.print()} 
                        className="w-full sm:w-auto bg-[#0a192f] text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors print:hidden shrink-0"
                      >
                        <Printer size={18} /> YAZDIR
                      </button>
                    </div>
                  </div>
                  
                  {sortedMatchReservations.length === 0 ? (
                    <div className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-24 text-center text-slate-400 print:hidden w-full">
                      <Search size={56} className="opacity-50 text-blue-400 mx-auto mb-5" />
                      <p className="font-black text-2xl">Bu maça ait kayıt bulunamadı.</p>
                    </div>
                  ) : (
                    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 sm:gap-8 w-full ${printSingleId ? 'print:grid-cols-1 print:gap-0' : 'print:grid-cols-2 print:gap-4'}`}>
                      {sortedMatchReservations.map((res) => renderReservationCard(res, 'mac'))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* GEÇMİŞ EKRANI */}
          {activePage === 'gecmis' && (
            <div className="lg:col-span-12 space-y-6 w-full">
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
                        <span className="text-3xl font-black text-emerald-400">
                          {historyStats.totalArrived} <span className="text-sm text-purple-200 font-medium">(%{historyStats.arrivalRate})</span>
                        </span>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-100 w-full min-h-[500px]">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 pb-6 border-b border-slate-100 gap-5">
                     <h3 className="text-xl sm:text-2xl font-black text-slate-800">Geçmiş Kayıtlar</h3>
                     <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <select 
                          value={historyTypeFilter} 
                          onChange={(e) => setHistoryTypeFilter(e.target.value)} 
                          className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none focus:border-purple-500"
                        >
                           <option value="all">Tümü (Restoran + Maç)</option>
                           <option value="restoran">Sadece Restoran</option>
                           <option value="mac">Sadece Maç</option>
                        </select>
                        <input 
                          type="date" 
                          value={historyDateFilter} 
                          onChange={(e) => setHistoryDateFilter(e.target.value)} 
                          className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none focus:border-purple-500 cursor-pointer" 
                        />
                        {historyDateFilter && (
                          <button 
                            onClick={() => setHistoryDateFilter('')} 
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-3 rounded-xl font-bold transition-colors"
                          >
                            Tarihi Sıfırla
                          </button>
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
                                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${res.eventType === 'Maç' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {res.eventType}
                                      </span>
                                    </td>
                                    <td className="py-4 px-4 font-bold text-slate-800">{res.name}</td>
                                    <td className="py-4 px-4 text-slate-500 font-medium">{res.phone}</td>
                                    <td className="py-4 px-4 text-center font-black text-slate-700">{res.peopleCount}</td>
                                    <td className="py-4 px-4 text-center">
                                      {res.isArrived ? (
                                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-xs font-bold">
                                          <CheckCircle2 size={14}/> Geldi
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold">
                                          <X size={14}/> Gelmedi
                                        </span>
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

          {/* MENÜ YÖNETİMİ EKRANI (ADMIN) */}
          {activePage === 'menu' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 w-full col-span-12">
              
              <div className="lg:col-span-4 xl:col-span-3 space-y-6 w-full">
                
                {menuItems.length === 0 && (
                  <div className="bg-orange-100 border border-orange-200 rounded-3xl p-6 text-center shadow-sm">
                    <p className="text-orange-800 font-bold mb-4 text-sm">Sisteminizde hiç menü öğesi yok. Başlangıç için varsayılan menüyü yükleyebilirsiniz.</p>
                    <button 
                      onClick={importDefaultMenu} 
                      className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-colors w-full"
                    >
                      Varsayılan Menüyü İçe Aktar
                    </button>
                  </div>
                )}

                <div className={`bg-white rounded-3xl shadow-xl border overflow-hidden transition-colors w-full ${isMenuEditing ? 'border-orange-400 shadow-orange-500/20' : 'border-slate-200'}`}>
                  <div className={`px-6 py-5 flex items-center justify-between ${isMenuEditing ? 'bg-orange-50 border-b border-orange-100' : 'bg-slate-50 border-b border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isMenuEditing ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 text-slate-600'}`}>
                        {isMenuEditing ? <Edit2 size={20} /> : <Plus size={20} />}
                      </div>
                      <h2 className={`text-lg font-black tracking-wide ${isMenuEditing ? 'text-orange-800' : 'text-slate-800'}`}>
                        {isMenuEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                      </h2>
                    </div>
                    {isMenuEditing && (
                      <button onClick={() => {setIsMenuEditing(null); setMenuItemData(initialMenuItemState); setMenuErrorMsg('');}} className="text-slate-400 p-1.5 hover:bg-white rounded-full shadow-sm border border-slate-200">
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  
                  <form onSubmit={handleMenuSubmit} className="p-6 space-y-5">
                    {menuErrorMsg && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2 shadow-sm">
                        <X size={16} /> {menuErrorMsg}
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kategori</label>
                      <select 
                        name="category" 
                        value={menuItemData.category} 
                        onChange={handleMenuChange} 
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 bg-slate-50 font-bold text-slate-700 outline-none"
                      >
                        {BASE_CATEGORIES.map(c => (
                           <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ürün Adı *</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={menuItemData.name} 
                        onChange={handleMenuChange} 
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 bg-slate-50 font-bold" 
                        placeholder="Örn: Serpme Kahvaltı" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fiyat (İsteğe Bağlı)</label>
                      <div className="relative">
                         <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input 
                           type="text" 
                           name="price" 
                           value={menuItemData.price} 
                           onChange={handleMenuChange} 
                           className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 bg-slate-50 font-bold" 
                           placeholder="Örn: 250" 
                         />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">İçerik Açıklaması</label>
                      <div className="relative">
                         <AlignLeft size={18} className="absolute left-4 top-4 text-slate-400" />
                         <textarea 
                           name="description" 
                           value={menuItemData.description} 
                           onChange={handleMenuChange} 
                           rows={2}
                           className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 bg-slate-50 font-medium resize-none" 
                           placeholder="Ürün içeriği..." 
                         ></textarea>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Görsel URL (İsteğe Bağlı)</label>
                      <div className="relative">
                         <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input 
                           type="text" 
                           name="image" 
                           value={menuItemData.image} 
                           onChange={handleMenuChange} 
                           className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 bg-slate-50 font-medium text-sm" 
                           placeholder="/salaskoy.jpg veya https://..." 
                         />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 cursor-pointer" onClick={() => setMenuItemData(prev => ({...prev, isFeatured: !prev.isFeatured}))}>
                       <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${menuItemData.isFeatured ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-slate-300'}`}>
                          {menuItemData.isFeatured && <Check size={16} />}
                       </div>
                       <div className="flex-1 select-none">
                          <p className="font-bold text-slate-700 text-sm">Öne Çıkanlarda Göster</p>
                          <p className="text-xs text-slate-500">Müşteri ekranında en üst galeride çıkar.</p>
                       </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className={`w-full font-black tracking-widest uppercase py-4 mt-6 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-white hover:-translate-y-1 text-sm ${isMenuEditing ? 'bg-gradient-to-r from-slate-800 to-slate-700' : 'bg-gradient-to-r from-orange-500 to-orange-600'}`}
                    >
                      {isMenuEditing ? <Check size={20} /> : <Plus size={20} />} 
                      {isMenuEditing ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'}
                    </button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-8 xl:col-span-9 w-full">
                 <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 sm:p-8 min-h-[500px] w-full">
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-5">
                       <h2 className="text-2xl font-black flex items-center gap-3 text-slate-800">
                         <MenuSquare className="text-orange-500" size={28} /> Sistemdeki Menü Öğeleri
                       </h2>
                       <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="relative w-full sm:w-64">
                             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                             <input 
                               type="text" 
                               placeholder="Ürün veya kategori ara..." 
                               value={menuSearchTerm} 
                               onChange={(e) => setMenuSearchTerm(e.target.value)} 
                               className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-sm font-medium shadow-sm outline-none bg-slate-50 transition-all" 
                             />
                          </div>
                          <span className="bg-orange-100 text-orange-800 px-4 py-2.5 rounded-xl text-sm font-black shrink-0">
                            {menuItems.length} Öğeler
                          </span>
                       </div>
                    </div>

                    <div className="overflow-x-auto w-full">
                       <table className="w-full text-left border-collapse">
                          <thead>
                             <tr className="border-b-2 border-slate-200">
                                <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-slate-400 w-16">Görsel</th>
                                <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-slate-400">Ürün Adı</th>
                                <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-slate-400">Kategori</th>
                                <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-slate-400 text-center">Fiyat</th>
                                <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-slate-400 text-center">Öne Çıkan</th>
                                <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-slate-400 text-right">İşlemler</th>
                             </tr>
                          </thead>
                          <tbody>
                             {menuItems
                               .filter(m => !menuSearchTerm || m.name.toLowerCase().includes(menuSearchTerm.toLowerCase()) || m.category.toLowerCase().includes(menuSearchTerm.toLowerCase()))
                               .sort((a,b) => a.category.localeCompare(b.category))
                               .map((item) => (
                                <tr key={item.id} className={`border-b border-slate-100 transition-colors ${isMenuEditing === item.id ? 'bg-orange-50' : 'hover:bg-slate-50'}`}>
                                   <td className="py-3 px-4">
                                      {item.image ? (
                                        <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                                           <img src={encodeURI(item.image)} alt="" className="w-full h-full object-cover" onError={(e)=>{e.currentTarget.style.display='none'}} />
                                        </div>
                                      ) : (
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 border border-slate-200"><ImageIcon size={20}/></div>
                                      )}
                                   </td>
                                   <td className="py-3 px-4 font-bold text-slate-800">{item.name}</td>
                                   <td className="py-3 px-4">
                                      <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-slate-200 text-slate-600">
                                         {BASE_CATEGORIES.find(c => c.id === item.category)?.name || item.category}
                                      </span>
                                   </td>
                                   <td className="py-3 px-4 text-center font-black text-orange-500">
                                      {item.price ? `${item.price} TL` : '-'}
                                   </td>
                                   <td className="py-3 px-4 text-center">
                                      {item.isFeatured ? <Star size={18} className="text-yellow-400 fill-yellow-400 mx-auto" /> : <span className="text-slate-300">-</span>}
                                   </td>
                                   <td className="py-3 px-4 text-right">
                                      {menuDeleteConfirmId === item.id ? (
                                         <div className="flex items-center justify-end gap-2">
                                            <span className="text-xs font-bold text-red-500 mr-2">Sil?</span>
                                            <button onClick={() => executeDelete(item.id, 'menuItems')} className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600"><Check size={16}/></button>
                                            <button onClick={() => setMenuDeleteConfirmId(null)} className="bg-slate-200 text-slate-700 p-1.5 rounded hover:bg-slate-300"><X size={16}/></button>
                                         </div>
                                      ) : (
                                         <div className="flex items-center justify-end gap-2">
                                            <button 
                                              onClick={() => {
                                                setMenuItemData({ category: item.category, name: item.name, price: item.price || '', description: item.description || '', image: item.image || '', isFeatured: item.isFeatured || false });
                                                setIsMenuEditing(item.id);
                                                window.scrollTo({top: 0, behavior: 'smooth'});
                                              }} 
                                              className="p-2 text-slate-400 hover:text-orange-500 bg-white border border-slate-200 rounded-lg hover:bg-orange-50 transition-colors"
                                            >
                                               <Edit2 size={16} />
                                            </button>
                                            <button 
                                              onClick={() => setMenuDeleteConfirmId(item.id)} 
                                              className="p-2 text-slate-400 hover:text-red-500 bg-white border border-slate-200 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                               <Trash2 size={16} />
                                            </button>
                                         </div>
                                      )}
                                   </td>
                                </tr>
                             ))}
                             {menuItems.length === 0 && (
                                <tr>
                                   <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">Veritabanında henüz bir menü öğesi yok.</td>
                                </tr>
                             )}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
            </div>
          )}

        </main>
      )}
    </div>
  );
}
