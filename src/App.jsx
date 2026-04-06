import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, Users, UtensilsCrossed, Armchair, Plus, Trash2, MoonStar, 
  ChefHat, Search, Edit2, X, Check, Loader2, Clock, CheckCircle, Phone, 
  Printer, MessageSquareText, MessageCircle, Map, Flame, BellRing, 
  MonitorPlay, Lock, ArrowRight, MapPin, Instagram, Wind, Coffee, 
  ChevronRight, Star, Inbox, CheckCircle2, AlertTriangle, History, MenuSquare
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

const MENU_GALLERY = [
  { id: '1', name: 'Salaaş Köy Kahvaltısı', image: '/salaskoy.jpg', tag: 'İmza Lezzet' },
  { id: '2', name: 'Patron Kahvaltısı', image: '/patronkahvaltisi.jpg' },
  { id: '3', name: 'Ispanak Yatağında Tavuk', image: '/ıspanakyatagındatavuk.jpg' },
  { id: '4', name: 'Etli Bowl Tabağı', image: '/etlibowltabagi.jpg' },
  { id: '5', name: 'Üç Renkli Tortellini', image: '/ucrenklitortellini.jpg' },
];

const MENU_CATEGORIES = [
  { id: 'kahvalti', name: 'KAHVALTI', Icon: Coffee, items: ['Serpme Kahvaltı', 'Kahvaltı Tabağı', 'Menemen', 'Sahanda Sucuklu Yumurta', 'Muhlama', 'Pankek'] },
  { id: 'tostlar', name: 'TOSTLAR', Icon: UtensilsCrossed, items: ['Kaşarlı Tost', 'Sucuklu Tost', 'Karışık Tost', 'Ayvalık Tostu', 'Bazlama Tost'] },
  { id: 'wrap', name: 'WRAP & QUESADILLA', Icon: UtensilsCrossed, items: ['Etli Wrap', 'Tavuklu Wrap', 'Köfteli Wrap', 'Tavuklu Quesadilla', 'Etli Quesadilla'] },
  { id: 'pizza', name: 'PİZZA', Icon: UtensilsCrossed, items: ['Margherita', 'Karışık Pizza', 'Sucuklu Pizza', 'Ton Balıklı Pizza', 'Meksika Ateşi'] },
  { id: 'burger', name: 'HAMBURGER', Icon: UtensilsCrossed, items: ['Mantarlı Fırın Burger', 'Klasik Burger', 'Cheeseburger', 'Meksika Burger', 'Tavuk Burger'] },
  { id: 'kofte', name: 'KÖFTE LEZZETLERİ', Icon: ChefHat, items: ['Hünkar Köfte', 'Izgara Köfte', 'Kaşarlı Köfte', 'Hünkar Beğendili Köfte', 'Kiremitte Köfte'] },
  { id: 'tavuk', name: 'TAVUK LEZZETLERİ', Icon: ChefHat, items: ['Cafe de Paris Soslu Tavuk', 'Köz Patlıcanlı Tavuk', 'Ispanak Yatağında Tavuk', 'Köri Soslu Tavuk', 'Meksika Soslu Tavuk', 'Barbekü Soslu Tavuk', 'Kekikli Tavuk', 'Tavuk Şinitzel', 'Izgara Tavuk Göğüs'] },
  { id: 'et', name: 'ET LEZZETLERİ', Icon: ChefHat, items: ['Etli Bowl Tabağı', 'Dana Lokum', 'Çoban Kavurma', 'Sac Kavurma', 'Et Sote', 'Izgara Antrikot'] },
  { id: 'makarna', name: 'MAKARNA ÇEŞİTLERİ', Icon: UtensilsCrossed, items: ['Üç Renkli Tortellini', 'Cheddar Çıtır Makarna', 'Penne Arabiata', 'Fettuccine Alfredo', 'Spagetti Bolognese', 'Mantı', 'Noodle'] },
  { id: 'salata', name: 'SALATA ÇEŞİTLERİ', Icon: UtensilsCrossed, items: ['Sezar Salata', 'Ton Balıklı Salata', 'Izgara Tavuklu Salata', 'Akdeniz Salata', 'Hellim Peynirli Salata'] },
  { id: 'tatli', name: 'SALAŞ TATLI', Icon: Star, items: ['Dubai Çikolatalı', 'Lotus Dome', 'Profiterol', 'Tiramisu', 'Brownie', 'San Sebastian', 'Cheesecake Çeşitleri', 'Sütlaç', 'Magnolia'] },
  { id: 'cay', name: 'ÇAYLAR', Icon: Coffee, items: ['Bardak Çay', 'Fincan Çay', 'Bitki Çayları', 'Yeşil Çay', 'Kış Çayı', 'Ada Çayı'] },
  { id: 'turk_kahvesi', name: 'TÜRK KAHVESİ', Icon: Coffee, items: ['Klasik Türk Kahvesi', 'Damla Sakızlı Türk Kahvesi', 'Sütlü Türk Kahvesi', 'Dibek Kahvesi', 'Menengiç Kahvesi'] },
  { id: 'sicak_kahve', name: 'SICAK KAHVELER', Icon: Coffee, items: ['Caramel Macchiato', 'Espresso', 'Americano', 'Latte', 'Cappuccino', 'Mocha', 'Filtre Kahve'] },
  { id: 'sicak_diger', name: 'SICAK ÇİKOLATA - SAHLEP', Icon: Coffee, items: ['Sıcak Çikolata', 'Beyaz Sıcak Çikolata', 'Sahlep', 'Damla Sakızlı Sahlep'] },
  { id: 'soguk_kahve', name: 'SOĞUK KAHVELER', Icon: Coffee, items: ['Ice Mocha', 'Ice Latte', 'Ice Americano', 'Frappe', 'Cold Brew'] },
  { id: 'kokteyl', name: 'KOKTEYLLER', Icon: Coffee, items: ['Cool Lime', 'Mojito', 'Pina Colada', 'Blue Lagoon', 'Sex on the Beach', 'Margarita'] },
  { id: 'soguk_icecek', name: 'SOĞUK İÇECEKLER', Icon: Coffee, items: ['Kola', 'Fanta', 'Sprite', 'Ayran', 'Şalgam', 'Limonata', 'Meyve Suyu', 'Su', 'Soda', 'Churchill'] },
  { id: 'vitamin', name: 'VİTAMİN BAR', Icon: Coffee, items: ['Taze Sıkma Portakal Suyu', 'Nar Suyu', 'Havuç Suyu', 'Elma Suyu', 'Atom (Karışık Meyve Suyu)', 'Detox Suları'] },
  { id: 'eglence', name: 'EĞLENCE MENÜSÜ', Icon: Star, items: ['Çerez Tabağı', 'Meyve Tabağı', 'Cips', 'Patlamış Mısır', 'Sigara Böreği', 'Sosis Tabağı', 'Patates Kızartması'] },
  { id: 'nargile', name: 'NARGİLE ÇEŞİTLERİ', Icon: Wind, items: ['Elma', 'Nane', 'Kavun', 'Karpuz', 'Şeftali', 'Üzüm', 'Çilek', 'Cappuccino', 'Çikolata', 'Sakız', 'Gül', 'Özel Karışım (Spesiyal)'] },
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
    return () => { 
      restoranUnsub(); 
      matchUnsub(); 
      reqUnsub(); 
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
      } else { 
        setMatchDeleteConfirmId(null); 
        if (isMatchEditing === id) cancelEdit(true); 
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

  const handleScrollToId = (id) => {
    const el = document.getElementById(id);
    if(el) { 
      window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth'}); 
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

  const renderReservationCard = (res, type) => {
    const isArrived = res.isArrived || false;
    const isPrinting = printSingleId === res.id;
    const isMac = type === 'mac';
    const isEdit = (isMac ? isMatchEditing : isEditing) === res.id;
    const dateStr = isMac ? selectedMatchDate : selectedFilterDate;
    
    let tBorder = isMac ? 'border-blue-400 bg-blue-50/30' : 'border-orange-400 bg-orange-50/30';
    let tHover = isMac ? 'hover:border-blue-200' : 'hover:border-orange-200';
    let tText = isMac ? 'text-blue-400' : 'text-orange-400';
    let tBg = isMac ? 'bg-blue-50 text-blue-800' : 'bg-orange-50 text-orange-800';
    let tGrad = isMac ? 'from-blue-400 to-blue-600' : 'from-orange-400 to-orange-500';

    return (
      <div 
        key={res.id} 
        className={`p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 relative group print:border-black print:border-dashed print:p-4 print:mb-2 w-full flex flex-col ${printSingleId && !isPrinting ? 'hidden print:hidden' : ''} ${isEdit ? tBorder + ' scale-[1.02] shadow-xl' : isArrived ? 'border-emerald-500 bg-emerald-50/50 opacity-80' : 'border-slate-100 bg-white ' + tHover + ' hover:shadow-lg'}`}
      >
        {isPrinting && (
          <div className="hidden print:block text-center font-bold text-[14px] uppercase mb-4 border-b border-black">
            Salaaş Cafe {isMac ? 'MAÇ' : ''}<br/>{dateStr}
          </div>
        )}
        
        <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-sm ${res.type === 'mac' ? 'bg-blue-600' : res.type === 'dogum_gunu' ? 'bg-purple-500' : res.type === 'organizasyon' ? 'bg-emerald-500' : 'bg-orange-500'}`}>
          {typeLabels[res.type] || 'REZERVASYON'}
        </div>
        
        {(isMac ? matchDeleteConfirmId : deleteConfirmId) === res.id && (
          <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-6 border border-red-200 rounded-3xl print:hidden backdrop-blur-sm">
            <p className="font-black text-slate-800 mb-5 text-xl">Silinsin mi?</p>
            <div className="flex gap-4">
              <button 
                onClick={() => executeDelete(res.id, isMac ? 'matchReservations' : 'reservations')} 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl text-base font-bold shadow-md transition-colors"
              >
                Evet, Sil
              </button>
              <button 
                onClick={() => isMac ? setMatchDeleteConfirmId(null) : setDeleteConfirmId(null)} 
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-8 py-3 rounded-xl text-base font-bold transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-4 mt-2">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full flex items-center justify-center font-black text-base shadow-inner print:hidden ${isArrived ? 'bg-emerald-100 text-emerald-700' : 'bg-gradient-to-br ' + tGrad + ' text-white'}`}>
            {getInitials(res.name)}
          </div>
          <h3 className={`text-2xl font-black truncate print:text-black ${isArrived ? 'line-through text-emerald-900' : 'text-[#0B3B2C]'}`}>
            {res.name || 'İsimsiz'}
          </h3>
        </div>
        
        {res.phone && (
          <div className="flex items-center gap-3 mt-2">
            <p className="text-base font-semibold flex items-center gap-2 text-slate-500 print:text-black">
              <Phone size={16} className={`print:hidden ${tText}`} /> {res.phone}
            </p>
            <button 
              onClick={() => sendWhatsApp(res, type)} 
              className="print:hidden bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white p-2 rounded-full transition-colors"
            >
              <MessageCircle size={18} />
            </button>
          </div>
        )}
        
        <div className="flex items-center gap-3 mt-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black print:p-0 print:text-black ${isArrived ? 'bg-emerald-100 text-emerald-800' : tBg}`}>
            <Users size={18} className="print:hidden" /> {res.peopleCount} Kişi
          </div>
          {res.table && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-black bg-slate-100 text-slate-700 print:p-0">
              <Armchair size={18} className="print:hidden" /> {res.table}
            </div>
          )}
        </div>
        
        {res.notes && (
          <div className="mt-4 text-sm sm:text-base font-bold text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 print:border-black print:bg-white">
            Not: {res.notes}
          </div>
        )}
        
        <div className="flex flex-wrap items-center justify-between gap-4 mt-auto pt-6 border-t border-slate-200 print:hidden">
          <button 
            onClick={() => handleToggleArrived(res.id, isArrived, isMac ? 'matchReservations' : 'reservations')} 
            className={`px-6 py-3 rounded-xl flex items-center gap-3 text-sm font-black transition-colors ${isArrived ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
          >
            <CheckCircle size={20} /> {isArrived ? "MASADA" : "GELMEDİ"}
          </button>
          <div className="flex gap-3">
            <button 
              onClick={() => handlePrintSingle(res.id)} 
              className="p-3 text-slate-500 bg-slate-50 hover:text-[#0B3B2C] hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
            >
              <Printer size={20} />
            </button>
            <button 
              onClick={() => handleEditClick(res, isMac)} 
              className={`p-3 text-slate-500 bg-slate-50 hover:${tText} rounded-xl border border-slate-200 transition-colors`}
            >
              <Edit2 size={20} />
            </button>
            <button 
              onClick={() => isMac ? setMatchDeleteConfirmId(res.id) : setDeleteConfirmId(res.id)} 
              className="p-3 text-slate-500 bg-slate-50 hover:text-red-600 hover:bg-red-100 rounded-xl border border-slate-200 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAdminForm = (isMac) => {
    const cForm = isMac ? matchFormData : formData;
    const cEdit = isMac ? isMatchEditing : isEditing;
    const cError = isMac ? matchErrorMsg : errorMsg;
    
    return (
      <div className="lg:col-span-4 xl:col-span-3 space-y-6 print:hidden w-full">
        <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border overflow-hidden transition-colors w-full ${cEdit ? (isMac ? 'border-blue-400 shadow-blue-500/20' : 'border-orange-400 shadow-orange-500/20') : 'border-slate-200/60'}`}>
          <div className={`px-6 py-5 flex items-center justify-between ${cEdit ? (isMac ? 'bg-blue-50 border-b border-blue-100' : 'bg-orange-50 border-b border-orange-100') : 'bg-gradient-to-r from-slate-50 to-white border-b border-slate-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${cEdit ? (isMac ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600') : (isMac ? 'bg-[#0a192f]/10 text-[#0a192f]' : 'bg-[#0B3B2C]/10 text-[#0B3B2C]')}`}>
                {isMac ? <MonitorPlay size={20} /> : <Edit2 size={20} />}
              </div>
              <h2 className={`text-lg lg:text-xl font-black tracking-wide ${cEdit ? (isMac ? 'text-blue-800' : 'text-orange-800') : (isMac ? 'text-[#0a192f]' : 'text-[#0B3B2C]')}`}>
                {cEdit ? 'Rezervasyonu Düzenle' : (isMac ? 'Maç Rezervasyonu' : 'Yeni Rezervasyon')}
              </h2>
            </div>
            {cEdit && (
              <button 
                type="button" 
                onClick={() => isMac ? cancelMatchEdit() : cancelEdit()} 
                className="text-slate-400 p-1.5 hover:bg-white rounded-full shadow-sm border border-slate-200"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <form onSubmit={(e) => handleFormSubmit(e, isMac)} className="p-6 lg:p-8 space-y-5">
            {cError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2 shadow-sm">
                <X size={16} /> {cError}
              </div>
            )}
            
            {!isMac && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Rezervasyon Türü
                </label>
                <select 
                  name="type" 
                  value={cForm.type || 'yemek'} 
                  onChange={(e) => isMac ? handleMatchChange(e) : handleChange(e)} 
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 bg-slate-50/50 font-bold text-lg text-slate-700 outline-none"
                >
                   <option value="kahvalti">Kahvaltı</option>
                   <option value="yemek">Yemek</option>
                   <option value="dogum_gunu">Doğum Günü</option>
                   <option value="organizasyon">Organizasyon</option>
                </select>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">İsim</label>
                <input 
                  type="text" 
                  name="name" 
                  value={cForm.name} 
                  onChange={(e) => isMac ? handleMatchChange(e) : handleChange(e)} 
                  className={`w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 ${isMac ? 'focus:ring-blue-500/10 focus:border-blue-500' : 'focus:ring-orange-500/10 focus:border-orange-500'} bg-slate-50/50 font-bold text-lg`} 
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
                    value={cForm.phone} 
                    onChange={(e) => isMac ? handleMatchChange(e) : handleChange(e)} 
                    className={`w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 ${isMac ? 'focus:ring-blue-500/10 focus:border-blue-500' : 'focus:ring-orange-500/10 focus:border-orange-500'} bg-slate-50/50 font-bold text-lg`} 
                    placeholder="05XX..." 
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Masa Seçimi</label>
                {!isMac && (
                  <button 
                    type="button" 
                    onClick={() => setShowTableMap(!showTableMap)} 
                    className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-orange-200 transition-colors"
                  >
                    <Map size={14} /> {showTableMap ? 'Krokiden Gizle' : 'Krokiden Seç'}
                  </button>
                )}
              </div>
              
              {!isMac && showTableMap && (
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
                      value={cForm.table} 
                      onChange={(e) => isMac ? handleMatchChange(e) : handleChange(e)} 
                      className={`w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 ${isMac ? 'focus:ring-blue-500/10 text-[#0a192f]' : 'focus:ring-orange-500/10 text-[#0B3B2C]'} bg-white font-black uppercase shadow-sm text-lg`} 
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
                      value={cForm.peopleCount} 
                      onChange={(e) => isMac ? handleMatchChange(e) : handleChange(e)} 
                      className={`w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 ${isMac ? 'focus:ring-blue-500/10 text-[#0a192f]' : 'focus:ring-orange-500/10 text-[#0B3B2C]'} bg-white font-black shadow-sm text-lg`} 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <CalendarDays size={14} className={isMac ? "text-blue-500" : "text-orange-500"}/> Tarih
                </label>
                <input 
                  type="date" 
                  name="date" 
                  value={cForm.date} 
                  onChange={(e) => isMac ? handleMatchChange(e) : handleChange(e)} 
                  className={`w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 ${isMac ? 'focus:ring-blue-500/10 text-[#0a192f]' : 'focus:ring-orange-500/10 text-[#0B3B2C]'} bg-slate-50/50 font-bold text-lg`} 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MessageSquareText size={14}/> Not / Açıklama
                </label>
                <textarea 
                  name="notes" 
                  value={cForm.notes} 
                  onChange={(e) => isMac ? handleMatchChange(e) : handleChange(e)} 
                  rows={2} 
                  className={`w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 focus:ring-4 ${isMac ? 'focus:ring-blue-500/10' : 'focus:ring-amber-500/10'} bg-amber-50/50 font-medium text-lg resize-none`} 
                  placeholder="Özel istekler..."
                ></textarea>
              </div>
            </div>
            <button 
              type="submit" 
              className={`w-full font-black tracking-widest uppercase py-5 mt-6 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 text-white hover:scale-[1.02] active:scale-95 text-lg ${cEdit ? (isMac ? 'bg-gradient-to-r from-[#0a192f] to-blue-900' : 'bg-gradient-to-r from-[#0B3B2C] to-emerald-900') : (isMac ? 'bg-gradient-to-r from-blue-500 to-cyan-600' : 'bg-gradient-to-r from-orange-500 to-orange-600')}`}
            >
              {cEdit ? <Check size={24} /> : <Plus size={24} />} 
              {cEdit ? 'Kaydet' : 'Ekle'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderAdminList = (isMac) => {
    const cList = isMac ? sortedMatchReservations : sortedReservations;
    const cSearch = isMac ? matchSearchTerm : searchTerm;
    const setCSearch = isMac ? setMatchSearchTerm : setSearchTerm;
    const tPeople = isMac ? totalMatchPeople : dailySummary.totalPeople;
    const occRate = Math.min(100, Math.round((tPeople * 100) / 300));
    const title = isMac ? "Maç Günü Katılım Özeti" : "Günlük Katılım Özeti";

    return (
      <div className="lg:col-span-8 xl:col-span-9 space-y-6 print:w-full print:block print:space-y-4 w-full">
        <div className={`bg-gradient-to-br ${isMac ? 'from-[#0a192f] to-blue-900' : 'from-[#0B3B2C] to-emerald-900'} rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col gap-6 relative overflow-hidden w-full ${printSingleId ? 'print:hidden' : 'print:bg-white print:from-white print:to-white print:border-b-2 print:border-black print:rounded-none print:shadow-none print:p-2 print:mb-4'}`}>
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between w-full ${isMac ? 'border-blue-800/50' : 'border-emerald-700/50'} border-b pb-6 z-10 print:border-black print:pb-2 gap-4`}>
            <div className={`flex items-center gap-5 ${isMac ? 'text-cyan-200' : 'text-[#FBE18D]'} w-full sm:w-auto`}>
              <div className="bg-white/10 p-4 rounded-2xl print:hidden shrink-0">
                {isMac ? <MonitorPlay size={36} /> : <UtensilsCrossed size={36} />}
              </div>
              <div>
                <p className={`text-sm font-black uppercase tracking-widest ${isMac ? 'text-cyan-400' : 'text-orange-400'} print:text-black`}>
                  {title}
                </p>
                <p className="text-3xl sm:text-4xl font-black text-white mt-1 print:text-black">
                  Toplam: <span className={`${isMac ? 'text-cyan-400' : 'text-orange-400'} print:text-black`}>{tPeople}</span> Kişi
                </p>
              </div>
            </div>
            <div className="w-full sm:w-1/3 pt-2 print:hidden">
               <div className="flex justify-between items-end mb-2 px-1">
                 <span className={`text-xs font-bold ${isMac ? 'text-cyan-200' : 'text-emerald-200'} uppercase`}>Kapasite: 300</span>
                 <span className={`text-xs font-black ${occRate >= 90 ? 'text-red-400' : (isMac ? 'text-cyan-300' : 'text-emerald-300')}`}>DOLULUK: %{occRate}</span>
               </div>
               <div className={`w-full ${isMac ? 'bg-blue-950/60' : 'bg-emerald-950/60'} rounded-full h-3 shadow-inner overflow-hidden`}>
                 <div className={`h-3 rounded-full transition-all duration-1000 ${occRate >= 90 ? 'bg-red-500' : (isMac ? 'bg-cyan-500' : 'bg-emerald-500')}`} style={{ width: `${occRate}%` }}></div>
               </div>
            </div>
          </div>
          <div className="pt-2 flex justify-end print:hidden relative z-10">
            <button 
              onClick={() => sendBulkWhatsApp(isMac ? filteredMatchReservations : filteredReservations, isMac ? 'mac' : 'restoran')} 
              className="bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
            >
              <MessageCircle size={18} /> Tümüne Hatırlatma Gönder
            </button>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/60 p-6 sm:p-8 lg:p-10 min-h-[500px] print:p-0 print:border-none print:shadow-none print:bg-white w-full">
          <div className={`flex flex-col md:flex-row items-start md:items-center justify-between mb-10 pb-6 border-b border-slate-100 gap-5 ${printSingleId ? 'print:hidden' : 'print:border-b-2 print:border-black print:pb-2 print:mb-3'}`}>
            <h2 className={`text-2xl sm:text-3xl font-black flex items-center gap-3 ${isMac ? 'text-[#0a192f]' : 'text-[#0B3B2C]'}`}>
              {isMac ? <MonitorPlay className="text-blue-500 print:hidden" size={32} /> : <Armchair className="text-orange-500 print:hidden" size={32} />} 
              {isMac ? 'Maç Rezervasyonları' : 'Aktif Masalar'}
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-80 print:hidden">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="İsim, masa veya telefon ara..." 
                  value={cSearch} 
                  onChange={(e) => setCSearch(e.target.value)} 
                  className={`w-full pl-12 pr-5 py-3 rounded-xl border-2 border-slate-200 focus:ring-4 ${isMac ? 'focus:ring-blue-500/10 focus:border-blue-500' : 'focus:ring-orange-500/10 focus:border-orange-500'} text-base font-medium shadow-sm outline-none bg-slate-50 transition-all`} 
                />
              </div>
              <span className={`${isMac ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'} px-5 py-3 rounded-full text-sm font-black print:hidden shrink-0`}>
                {cList.length} Kayıt
              </span>
              <button 
                onClick={() => window.print()} 
                className={`w-full sm:w-auto ${isMac ? 'bg-[#0a192f] hover:bg-blue-900' : 'bg-slate-800 hover:bg-slate-700'} text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors print:hidden shrink-0`}
              >
                <Printer size={18} /> YAZDIR
              </button>
            </div>
          </div>
          
          {cList.length === 0 ? (
            <div className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-24 text-center text-slate-400 print:hidden w-full">
              <Search size={56} className={`opacity-50 ${isMac ? 'text-blue-400' : 'text-orange-400'} mx-auto mb-5`} />
              <p className="font-black text-2xl">Kayıt bulunamadı.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 sm:gap-8 w-full ${printSingleId ? 'print:grid-cols-1 print:gap-0' : 'print:grid-cols-2 print:gap-4'}`}>
              {cList.map((res) => renderReservationCard(res, isMac ? 'mac' : 'restoran'))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAdminContent = () => {
    if (activePage === 'talepler') {
      return (
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
                  <p className="font-medium text-lg mt-3">Bekleyen rezervasyon talebi bulunmuyor.</p>
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
                              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                              <Check size={18}/> Sadece Onayla
                            </button>
                            <button 
                              onClick={() => handleRejectRequest(req.id)} 
                              className="flex-none bg-slate-200 hover:bg-red-500 hover:text-white text-slate-600 px-4 py-3 rounded-2xl transition-colors shadow-sm"
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
      );
    }

    if (activePage === 'gecmis') {
      return (
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
      );
    }

    const isMac = activePage === 'mac';
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 w-full col-span-12">
        {renderAdminForm(isMac)}
        {renderAdminList(isMac)}
      </div>
    );
  };

  return (
    <div className={`min-h-screen font-sans text-slate-800 pb-12 print:bg-white print:pb-0 relative transition-colors duration-500 w-full overflow-x-hidden ${activePage === 'restoran' ? 'bg-slate-50' : activePage === 'mac' ? 'bg-[#f0f4f8]' : 'bg-slate-100'}`}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      
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

      {activePage === 'restoran' && (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] print:hidden w-full h-full" style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      )}
      
      {activePage === 'mac' && (
        <div className="fixed top-20 right-10 z-0 pointer-events-none opacity-[0.03] text-blue-900 rotate-12 print:hidden">
          <MonitorPlay size={400} strokeWidth={1} />
        </div>
      )}

      <div className={`hidden ${!printSingleId ? 'print:block' : ''} text-center mb-4 border-b-2 border-black pb-2 relative z-10 w-full`}>
        <h1 className="text-xl font-bold font-sans uppercase">
          {activePage === 'restoran' ? 'Salaaş Cafe' : 'Salaaş Cafe Maç'}
        </h1>
        <p className="text-sm mt-1 font-bold text-black">
          Tarih: {activePage === 'restoran' ? selectedFilterDate : selectedMatchDate}
        </p>
      </div>

      <header className={`${activePage === 'restoran' ? 'bg-[#0B3B2C]' : activePage === 'mac' ? 'bg-[#0a192f]' : 'bg-slate-900'} text-white shadow-lg sticky z-20 print:hidden transition-colors duration-500 w-full top-0`}>
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-20 py-3 sm:py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center justify-between w-full lg:w-auto gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 sm:h-12 shrink-0 flex items-center justify-center overflow-visible drop-shadow-md bg-transparent">
                <img src="/salaaslogobg.png" alt="Salaaş Cafe Logo" className="h-full w-auto object-contain bg-transparent" />
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-base md:text-lg lg:text-xl font-black tracking-wide text-transparent bg-clip-text font-serif ${activePage === 'restoran' ? 'bg-gradient-to-r from-orange-400 to-yellow-300' : activePage === 'mac' ? 'bg-gradient-to-r from-blue-400 to-cyan-300' : 'bg-gradient-to-r from-slate-200 to-white'}`}>
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
            {activePage !== 'talepler' && activePage !== 'gecmis' && (
              <div className="flex shrink-0 items-center bg-white/10 rounded-xl px-4 py-2.5 lg:px-5 lg:py-3 border border-white/10 hover:bg-white/20 transition-colors w-full lg:w-auto justify-center">
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
        <div className={`flex flex-col items-center justify-center mt-32 relative z-10 w-full ${activePage === 'restoran' ? 'text-orange-600' : 'text-blue-600'}`}>
          <Loader2 className="animate-spin mb-4" size={64} />
          <p className="font-bold text-lg tracking-widest animate-pulse uppercase">Sisteme Bağlanıyor...</p>
        </div>
      ) : (
        <main className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-20 mt-8 lg:mt-10 relative z-10">
          {renderAdminContent()}
        </main>
      )}
    </div>
  );
}
