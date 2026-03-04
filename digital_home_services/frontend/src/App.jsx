import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaWrench, FaBroom, FaPaintRoller, FaUserShield, FaUser, FaTools, 
  FaArrowLeft, FaSignOutAlt, FaHistory, FaPlusCircle, 
  FaClipboardList, FaMoneyBillWave, FaUsers, FaChartLine, FaCogs, 
  FaCheckCircle, FaTimesCircle, FaPhoneAlt, FaClock, FaCalendarAlt, FaQrcode, FaCreditCard, FaMoneyCheckAlt, FaEye, FaMapMarkerAlt, FaEnvelope, FaChevronDown
} from 'react-icons/fa';
import axios from 'axios';

// --- HELPER: GET HIGH QUALITY IMAGES ---
const getServiceImage = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('plumb')) return 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600&auto=format&fit=crop';
  if (lowerName.includes('clean')) return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop';
  if (lowerName.includes('electric')) return 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop';
  return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop';
};

// --- ANIMATION VARIANTS ---
const popModalVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.8, y: -20, transition: { duration: 0.2 } }
};

const slideLeftVariants = {
  hidden: { opacity: 0, x: -150 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

const slideRightVariants = {
  hidden: { opacity: 0, x: 150 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

const flipCenterVariants = {
  hidden: { opacity: 0, scale: 0.5, rotateX: 90 },
  visible: { opacity: 1, scale: 1, rotateX: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

// --- REUSABLE SUCCESS/ERROR MODAL ---
const PopupModal = ({ popup, onClose }) => {
  if (!popup) return null;
  const isSuccess = popup.type === 'success';

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[200] backdrop-blur-sm">
        <motion.div variants={popModalVariants} initial="hidden" animate="visible" exit="exit" className={`bg-slate-900 p-8 rounded-2xl flex flex-col items-center max-w-sm border ${isSuccess ? 'border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.4)]' : 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]'} text-center`}>
          {isSuccess ? <FaCheckCircle className="text-green-400 text-6xl mb-4 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" /> : <FaTimesCircle className="text-red-500 text-6xl mb-4 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />}
          <h2 className="text-2xl font-bold text-white mb-2">{isSuccess ? 'Success!' : 'Oops!'}</h2>
          <p className="text-gray-300 mb-6">{popup.text}</p>
          <button onClick={onClose} className={`px-8 py-2 text-slate-900 font-bold rounded-lg transition ${isSuccess ? 'bg-green-400 hover:bg-green-300' : 'bg-red-500 hover:bg-red-400 text-white'}`}>Awesome!</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- HOMEPAGE ---
function Home() {
  
  // Smooth Scroll Function
  const scrollToServices = () => {
    document.getElementById('services-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#0b1320] pt-16 font-sans">
      
      {/* HERO SECTION */}
      <div className="bg-[#0f172a] text-white rounded-b-[4rem] border-b border-cyan-500 shadow-[0_10px_30px_rgba(34,211,238,0.1)] overflow-hidden relative pb-16">
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-cyan-600 rounded-full opacity-20 blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500 mb-6 leading-tight drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
              Digital Home Service Ecosystem
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Expert Services. Repair. Maintenance. All at your fingertips. We connect you with verified professionals to keep your home in perfect condition.
            </p>
            
            <motion.div whileHover={{ scale: 1.05 }} className="bg-slate-800 text-cyan-50 p-6 shadow-[0_0_15px_rgba(34,211,238,0.2)] transform -rotate-2 w-80 relative rounded-lg border border-cyan-400 mt-4">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
              <p className="italic text-lg leading-snug">"Quality service is not just an act, it is a habit. Let us take care of your home."</p>
              <p className="text-right text-sm text-cyan-400 font-bold mt-3 uppercase tracking-widest">- Digital Home</p>
            </motion.div>
          </motion.div>

          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="relative hidden md:block">
            <div className="absolute inset-0 bg-cyan-500 rounded-2xl transform rotate-3 scale-105 shadow-[0_0_30px_rgba(34,211,238,0.3)] opacity-50"></div>
            <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop" alt="Premium Services" className="relative z-10 rounded-2xl object-cover h-[450px] w-full border border-cyan-400" />
            
            {/* Bouncing Scroll Arrow (MOVED TO RIGHT SIDE BELOW IMAGE) */}
            <motion.div 
              animate={{ y: [0, 15, 0] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              onClick={scrollToServices}
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 cursor-pointer z-20 flex flex-col items-center group"
            >
              <span className="text-cyan-400 text-[10px] uppercase tracking-[0.3em] font-bold mb-1 group-hover:text-white transition">Scroll</span>
              <FaChevronDown className="text-cyan-400 text-3xl drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] group-hover:text-white transition" />
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile Fallback Scroll Arrow (Centers on phones only) */}
        <motion.div 
          animate={{ y: [0, 15, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          onClick={scrollToServices}
          className="md:hidden absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer z-20 flex flex-col items-center group"
        >
          <span className="text-cyan-400 text-[10px] uppercase tracking-[0.3em] font-bold mb-1 group-hover:text-white transition">Scroll</span>
          <FaChevronDown className="text-cyan-400 text-3xl drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] group-hover:text-white transition" />
        </motion.div>

      </div>

      {/* SERVICES SECTION */}
      <div id="services-section" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-12 uppercase tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          Available <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">Services</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {[
            { icon: <FaBroom />, title: "Cleaning", desc: "Top-to-bottom sanitization to leave your home sparkling." },
            { icon: <FaWrench />, title: "Plumbing", desc: "Leak repairs and immediate water emergency resolutions." },
            { icon: <FaPaintRoller />, title: "Renovation", desc: "Professional upgrades to breathe life into your space." }
          ].map((srv, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05, translateY: -10 }} className="group bg-slate-800 p-8 rounded-2xl shadow-lg flex flex-col items-center text-center border border-slate-700 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300">
              <div className="bg-slate-900 p-5 rounded-full mb-6 group-hover:bg-cyan-900/50 transition duration-300 border border-slate-700 group-hover:border-cyan-400">
                <div className="text-5xl text-gray-400 group-hover:text-cyan-400 transition duration-300 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">{srv.icon}</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{srv.title}</h3>
              <p className="text-gray-400 text-sm">{srv.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 border border-cyan-500/50 p-8 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.1)] text-center max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-white mb-3">Looking for more specialized services?</h3>
          <p className="text-gray-400 mb-6">Unlock our complete catalog of premium home care protocols. Log in to your secure portal to explore advanced electrical repairs, custom installations, pest control, and exclusive upgrades!</p>
          <Link to="/login" className="inline-block bg-cyan-500 text-slate-900 font-extrabold px-8 py-3 rounded-lg hover:bg-cyan-400 transition shadow-[0_0_15px_rgba(34,211,238,0.5)] uppercase tracking-wide">
            Access Portal to Discover More
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

// --- ABOUT US PAGE ---
function AboutUs() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#0b1320] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto bg-slate-900 p-10 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.1)] border-t-4 border-cyan-500">
        <h1 className="text-4xl font-extrabold text-white mb-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">About Digital Home</h1>
        <p className="text-lg text-gray-300 mb-6 leading-relaxed">
          Welcome to the Digital Home Service Ecosystem. We are dedicated to providing the best home maintenance and repair services by connecting you with verified, highly skilled professionals in your area.
        </p>
        <p className="text-lg text-gray-300 mb-6 leading-relaxed">
          Our platform operates on strict principles of transparency, security, and quality. We thoroughly vet every Service Man on our application to ensure that when you book a service, you are inviting a true professional into your home.
        </p>
        <div className="bg-slate-800 border-l-4 border-cyan-500 p-6 rounded-r-lg mt-8">
          <h3 className="text-xl font-bold text-cyan-400 mb-2">Our Mission</h3>
          <p className="text-gray-300">To provide a seamless, secure, and fully digital marketplace that elevates the standard of home maintenance worldwide.</p>
        </div>
      </div>
    </motion.div>
  );
}

// --- CONTACT PAGE ---
function Contact() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#0b1320] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto bg-slate-900 p-10 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.1)] border-t-4 border-cyan-500 flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-white mb-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Contact Us</h1>
          <p className="text-gray-300 mb-8">We are here to help with all your home service needs. Get in touch with our support team!</p>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-slate-800 border border-slate-700 p-3 rounded-full"><FaMapMarkerAlt className="text-xl text-cyan-400"/></div>
            <div><p className="font-bold text-white">Address</p><p className="text-gray-400">Bengaluru, India</p></div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-slate-800 border border-slate-700 p-3 rounded-full"><FaPhoneAlt className="text-xl text-cyan-400"/></div>
            <div><p className="font-bold text-white">Phone</p><p className="text-gray-400">+91 98765 43210</p></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-800 border border-slate-700 p-3 rounded-full"><FaEnvelope className="text-xl text-cyan-400"/></div>
            <div><p className="font-bold text-white">Email Us</p><p className="text-gray-400">support@digitalhome.com</p></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- SHARED FORM STYLES ---
const inputStyle = "bg-slate-800 border border-slate-600 text-white p-3 rounded-lg w-full focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition";

// --- REGISTRATION PAGE ---
function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', phone: '', role: 'User', category_name: '' });
  const [categories, setCategories] = useState([]);
  const [popup, setPopup] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { axios.get('http://127.0.0.1:8000/api/categories/').then(res => setCategories(res.data)); }, []);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      await axios.post('http://127.0.0.1:8000/api/users/', formData);
      setPopup({ type: 'success', text: `Registration Successful!`, action: () => navigate('/login') });
    } catch (error) { setPopup({ type: 'error', text: 'Error registering. Please try again.', action: () => setPopup(null) }); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#0b1320] flex flex-col items-center justify-center p-6 pt-24">
      <PopupModal popup={popup} onClose={popup?.action} />
      <motion.div variants={popModalVariants} initial="hidden" animate="visible" className="bg-slate-900 p-8 rounded-xl w-full max-w-md border border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.15)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-600"></div>
        <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Create Account</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          <select name="role" value={formData.role} onChange={handleChange} className={inputStyle}>
            <option value="User">Register as Customer</option>
            <option value="Service Man">Register as Professional</option>
          </select>
          {formData.role === 'Service Man' && (
            <motion.select initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} name="category_name" value={formData.category_name} onChange={handleChange} required className={inputStyle}>
              <option value="">-- Select Your Expertise --</option>
              {categories.map((c) => (<option key={c.id} value={c.name}>{c.name}</option>))}
            </motion.select>
          )}
          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required className={inputStyle} />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className={inputStyle} />
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile Number" required className={inputStyle} />
          
          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className={`${inputStyle} pr-12`} />
            <button type="button" onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)} onMouseLeave={() => setShowPassword(false)} onTouchStart={() => setShowPassword(true)} onTouchEnd={() => setShowPassword(false)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 outline-none">
              <FaEye size={20} />
            </button>
          </div>
          <button type="submit" className="bg-cyan-500 text-slate-900 font-extrabold py-3 rounded-lg mt-2 hover:bg-cyan-400 transition shadow-[0_0_15px_rgba(34,211,238,0.5)]">Register</button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// --- LOGIN PAGE WITH DYNAMIC ANIMATIONS ---
function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null); 
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [popup, setPopup] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', credentials);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('username', response.data.username);
      navigate('/dashboard'); 
    } catch (error) { setPopup({ type: 'error', text: 'Invalid Credentials!', action: () => setPopup(null) }); }
  };

  if (!role) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0b1320] flex flex-col items-center justify-center p-6 pt-24">
        <motion.h2 className="text-4xl font-extrabold text-white mb-8 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">System Access</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {[
            { r: 'User', icon: <FaUser/>, color: 'cyan', title: 'User Login' },
            { r: 'Service Man', icon: <FaTools/>, color: 'emerald', title: 'Service Man' },
            { r: 'Admin', icon: <FaUserShield/>, color: 'purple', title: 'Admin Login' }
          ].map(item => (
            <motion.div key={item.r} whileHover={{ scale: 1.05, translateY: -5 }} onClick={() => setRole(item.r)} className={`bg-slate-900 p-8 rounded-2xl shadow-lg flex flex-col items-center cursor-pointer border border-slate-700 hover:border-${item.color}-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition group`}>
              <div className={`bg-slate-800 p-5 rounded-full mb-4 border border-slate-600 group-hover:border-${item.color}-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition`}><div className={`text-4xl text-gray-400 group-hover:text-${item.color}-400`}>{item.icon}</div></div>
              <h3 className="text-2xl font-bold text-white">{item.title}</h3>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  let currentAnimation = slideLeftVariants; 
  if (role === 'Service Man') currentAnimation = flipCenterVariants; 
  if (role === 'Admin') currentAnimation = slideRightVariants; 

  return (
    <motion.div className="min-h-screen bg-[#0b1320] flex flex-col items-center justify-center p-6 pt-24">
      <PopupModal popup={popup} onClose={popup?.action} />
      
      <motion.div 
        key={role} 
        variants={currentAnimation} 
        initial="hidden" 
        animate="visible" 
        className="bg-slate-900 p-8 rounded-xl w-full max-w-md border border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.15)] relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-600"></div>
        <button onClick={() => setRole(null)} className="flex items-center text-gray-400 hover:text-cyan-400 mb-6 transition font-semibold"><FaArrowLeft className="mr-2" /> Back to roles</button>
        <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{role} Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="text" name="username" value={credentials.username} onChange={handleChange} placeholder="Username" required className={inputStyle} />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" value={credentials.password} onChange={handleChange} placeholder="Password" required className={`${inputStyle} pr-12`} />
            <button type="button" onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)} onMouseLeave={() => setShowPassword(false)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 outline-none"><FaEye size={20} /></button>
          </div>
          <button type="submit" className="bg-cyan-500 text-slate-900 font-extrabold py-3 rounded-lg hover:bg-cyan-400 transition shadow-[0_0_15px_rgba(34,211,238,0.4)] mt-2 uppercase tracking-wide">Authenticate</button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// --- DASHBOARDS ---
function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole') || 'User';
  const username = localStorage.getItem('username') || 'Guest';
  
  const [categories, setCategories] = useState([]);
  const [mySchedule, setMySchedule] = useState([]); 
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingAddress, setBookingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pay After Service');
  const [popup, setPopup] = useState(null); 
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminRevenueModalOpen, setIsAdminRevenueModalOpen] = useState(false);

  const todayDate = new Date().toISOString().split('T')[0];

  const fetchSchedule = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/my-schedule/', { username, role });
      setMySchedule(response.data.bookings || []);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categories/').then(res => setCategories(res.data));
    if (username !== 'Guest') fetchSchedule();
  }, [username, role]);

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };
  const handleUpdateStatus = async (bookingId, newStatus) => {
    await axios.post('http://127.0.0.1:8000/api/update-job-status/', { booking_id: bookingId, status: newStatus });
    fetchSchedule(); 
  };

  const initiateCheckout = (e) => {
    e.preventDefault();
    paymentMethod === 'Pay After Service' ? processPaymentAndBook() : setIsCheckoutOpen(true);
  };

  const processPaymentAndBook = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/book-service/', { username, category_id: selectedService.id, date: bookingDate, time: bookingTime, address: bookingAddress, payment_method: paymentMethod });
      setIsCheckoutOpen(false); setSelectedService(null); 
      setPopup({ type: 'success', text: `Operation Successful.`, action: () => { setPopup(null); fetchSchedule(); } });
    } catch (error) { setIsCheckoutOpen(false); setPopup({ type: 'error', text: 'Failed to process.', action: () => setPopup(null) }); }
  };

  const DashboardHeader = () => (
    <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4 bg-slate-900 p-6 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <div>
        <h1 className="text-3xl font-extrabold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">Welcome, {username}!</h1>
        <p className="text-sm text-cyan-400 mt-1 font-semibold drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">Role: {role}</p>
      </div>
      <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-800 text-red-400 px-6 py-2 rounded-lg font-bold hover:bg-slate-700 hover:text-red-300 transition border border-red-900 hover:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]"><FaSignOutAlt /> Logout</button>
    </div>
  );

  // --- CUSTOMER DASHBOARD ---
  if (role === 'User') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0b1320] p-8 pt-24 relative">
        <PopupModal popup={popup} onClose={popup?.action} />
        <div className="max-w-6xl mx-auto">
          <DashboardHeader />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl shadow-lg border border-slate-700 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute -right-10 -top-10 text-cyan-500 opacity-10"><FaPlusCircle size={150}/></div>
              <h2 className="text-3xl font-extrabold mb-2 text-white z-10">Need a Service?</h2>
              <p className="text-gray-400 font-medium z-10">Book a cleaner, plumber, or electrician instantly.</p>
            </div>
            
            <div className="bg-slate-900 p-8 rounded-xl shadow-lg border border-slate-700 overflow-y-auto max-h-72 custom-scrollbar">
              <div className="flex items-center gap-3 mb-6"><FaHistory className="text-2xl text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" /><h2 className="text-2xl font-bold text-white">Recent Bookings</h2></div>
              {mySchedule.length === 0 ? <p className="text-gray-500 italic">You haven't booked anything yet.</p> : (
                <ul className="divide-y divide-slate-800 text-gray-300">
                  {mySchedule.map(b => (
                    <li key={b.id} className="py-4 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-lg">{b.service}</span>
                        <span className={`text-xs px-3 py-1 rounded-sm uppercase tracking-widest font-bold ${b.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700' : b.status === 'CONFIRMED' ? 'bg-blue-900/50 text-blue-400 border border-blue-700' : 'bg-green-900/50 text-green-400 border border-green-700'}`}>{b.status}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-400">
                        <FaCalendarAlt className="inline mr-1 text-cyan-500" /> {b.date} | <FaClock className="inline mr-1 text-cyan-500" /> {b.time || 'TBD'}
                      </div>
                      <div className="text-sm bg-slate-800 p-3 rounded flex justify-between items-center border border-slate-700">
                        <span><span className="text-cyan-400 font-bold">Pro:</span> {b.professional} <FaPhoneAlt className="inline mx-1 text-gray-500" /> {b.pro_phone}</span>
                        <span className="text-emerald-400 text-xs bg-slate-900 px-2 py-1 rounded border border-slate-700">{b.payment_method}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-6 text-white uppercase tracking-widest border-b border-slate-800 pb-2">Available Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <motion.div whileHover={{ scale: 1.03 }} key={cat.id} className="border border-slate-700 rounded-xl bg-slate-900 overflow-hidden flex flex-col group hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all">
                <div className="h-48 w-full bg-cover bg-center opacity-80 group-hover:opacity-100 transition" style={{ backgroundImage: `url(${getServiceImage(cat.name)})` }}></div>
                <div className="p-6 flex flex-col flex-grow relative">
                  <div className="absolute -top-6 right-6 bg-slate-900 p-3 rounded-full border border-slate-700 group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition text-cyan-400"><FaTools/></div>
                  <h4 className="font-bold text-xl text-white mb-2">{cat.name}</h4>
                  <p className="text-gray-400 text-sm mb-6 flex-grow">{cat.description}</p>
                  <button onClick={() => setSelectedService(cat)} className="w-full bg-slate-800 text-cyan-400 border border-cyan-800 px-4 py-3 rounded-sm font-bold hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition uppercase tracking-widest">Book {cat.name}</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* BOOKING MODAL */}
        <AnimatePresence>
          {selectedService && !isCheckoutOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] backdrop-blur-sm">
              <motion.div variants={popModalVariants} initial="hidden" animate="visible" exit="exit" className="bg-slate-900 p-8 rounded-2xl w-full max-w-lg border border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)] relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-emerald-400"></div>
                <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 text-gray-500 hover:text-cyan-400 text-xl">&times;</button>
                <h2 className="text-2xl font-bold text-white mb-6">Book {selectedService.name}</h2>
                
                <form onSubmit={initiateCheckout} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs text-cyan-400 uppercase tracking-widest block mb-1">Date</label><input type="date" min={todayDate} value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className={inputStyle} /></div>
                    <div><label className="text-xs text-cyan-400 uppercase tracking-widest block mb-1">Time</label><input type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} required className={inputStyle} /></div>
                  </div>
                  <div><label className="text-xs text-cyan-400 uppercase tracking-widest block mb-1">Service Address</label><textarea value={bookingAddress} onChange={(e) => setBookingAddress(e.target.value)} required placeholder="123 Main St..." className={`${inputStyle} h-20`}></textarea></div>
                  
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <label className="text-xs text-cyan-400 uppercase tracking-widest block mb-3">Payment Method</label>
                    <div className="flex flex-col gap-2">
                      {['Pay After Service', 'Pay Online (QR)'].map(method => (
                        <label key={method} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${paymentMethod === method ? 'border-cyan-400 bg-cyan-900/20' : 'border-slate-600 hover:bg-slate-700'}`}>
                          <input type="radio" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="w-4 h-4 text-cyan-500 bg-slate-800 border-slate-500" />
                          <span className="text-white font-medium">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="bg-cyan-500 text-black font-extrabold py-4 rounded-lg flex justify-center items-center gap-2 hover:bg-cyan-400 transition shadow-[0_0_15px_rgba(34,211,238,0.4)] mt-2 uppercase tracking-wide">
                    {paymentMethod === 'Pay After Service' ? 'Confirm Booking' : 'Proceed to QR Payment'} <FaCheckCircle />
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR MODAL */}
        <AnimatePresence>
          {isCheckoutOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[150] backdrop-blur-md">
              <motion.div variants={popModalVariants} initial="hidden" animate="visible" exit="exit" className="bg-slate-900 p-8 rounded-2xl flex flex-col items-center max-w-sm border border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.3)] relative text-center">
                <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-emerald-400 text-xl">&times;</button>
                <FaQrcode className="text-emerald-400 text-6xl mb-4 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                <h2 className="text-2xl font-bold text-white mb-2">Secure Checkout</h2>
                <div className="bg-emerald-900/50 text-emerald-300 px-4 py-1 rounded text-xs font-bold mb-6 border border-emerald-500/50 uppercase tracking-widest">
                  Official Digital Home UPI
                </div>
                <div className="bg-white p-3 rounded-lg border-4 border-slate-700 mb-6 relative">
                  <div className="absolute inset-0 border border-emerald-400 rounded-lg animate-pulse pointer-events-none"></div>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=Digital_Home_Payment_${selectedService.name.replace(/\s+/g, '')}`} alt="QR" className="mx-auto" />
                </div>
                <div className="w-full bg-slate-800 p-4 rounded border border-slate-700 mb-6 flex justify-between items-center">
                   <span className="text-gray-400 uppercase text-xs font-bold tracking-widest">Total Amount</span>
                   <span className="text-2xl font-black text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">$89.99</span>
                </div>
                <button onClick={processPaymentAndBook} className="w-full bg-emerald-500 text-black font-extrabold py-3 rounded hover:bg-emerald-400 transition shadow-[0_0_15px_rgba(52,211,153,0.5)] flex justify-center items-center gap-2 uppercase">
                  <FaCheckCircle /> Confirm Payment Sent
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // --- ADMIN & SERVICE MAN DASHBOARD ---
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0b1320] p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <DashboardHeader />
        
        {/* STATS (Admin only) */}
        {role === 'Admin' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 border-l-4 border-l-purple-500 flex items-center gap-4 shadow-lg">
              <FaUsers className="text-4xl text-purple-500" /><div><p className="text-gray-400 text-sm uppercase">Total Bookings</p><h2 className="text-3xl font-bold text-white">{mySchedule.length}</h2></div>
            </div>
            <div onClick={() => setIsAdminRevenueModalOpen(true)} className="bg-slate-900 p-6 rounded-xl border border-slate-700 border-l-4 border-l-emerald-500 flex items-center gap-4 shadow-lg cursor-pointer hover:bg-slate-800 transition">
              <FaChartLine className="text-4xl text-emerald-500" /><div><p className="text-gray-400 text-sm uppercase">Total Revenue <span className="text-[10px] text-cyan-500 ml-1">(View Details)</span></p><h2 className="text-3xl font-bold text-white">${mySchedule.reduce((s, j) => s + parseFloat(j.amount || 0), 0).toFixed(2)}</h2></div>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 border-l-4 border-l-cyan-500 flex items-center gap-4 shadow-lg">
              <FaCogs className="text-4xl text-cyan-500" /><div><p className="text-gray-400 text-sm uppercase">Active Services</p><h2 className="text-3xl font-bold text-white">{categories.length}</h2></div>
            </div>
          </div>
        )}

        {/* MASTER LIST / ASSIGNED JOBS */}
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <FaClipboardList className={`text-3xl ${role === 'Admin' ? 'text-purple-500' : 'text-cyan-500'}`} />
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest">{role === 'Admin' ? 'Master Booking List' : 'Your Assigned Jobs'}</h2>
          </div>
          
          {role === 'Admin' ? (
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse text-sm">
                 <thead>
                   <tr className="bg-slate-800 text-gray-400 uppercase tracking-widest">
                     <th className="p-4 rounded-tl">ID</th><th className="p-4">Customer</th><th className="p-4">Service</th><th className="p-4">Professional</th><th className="p-4">Payment</th><th className="p-4 rounded-tr">Status</th>
                   </tr>
                 </thead>
                 <tbody className="text-gray-300">
                   {mySchedule.map(job => (
                     <tr key={job.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                       <td className="p-4 font-mono text-cyan-600">#{job.id}</td><td className="p-4 text-white font-bold">{job.customer}</td><td className="p-4">{job.service}</td><td className="p-4 text-cyan-400">{job.professional}</td>
                       <td className="p-4"><span className="text-emerald-400 font-bold">${job.amount}</span><br/><span className="text-xs text-gray-500">{job.payment_method}</span></td>
                       <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${job.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-500' : job.status === 'CONFIRMED' ? 'bg-blue-900/50 text-blue-400' : 'bg-green-900/50 text-green-400'}`}>{job.status}</span></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {mySchedule.map(job => (
                <li key={job.id} className="py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl font-bold text-white flex items-center gap-2"><FaUser className="text-cyan-500"/> {job.customer}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${job.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-400' : job.status === 'CONFIRMED' ? 'bg-blue-900/50 text-blue-400' : 'bg-green-900/50 text-green-400'}`}>{job.status}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1"><FaCalendarAlt className="inline text-cyan-500 mr-1"/> {job.date} | <FaClock className="inline text-cyan-500 mr-1 ml-2"/> {job.time}</p>
                    <p className="text-gray-400 text-sm mb-1"><FaMapMarkerAlt className="inline text-cyan-500 mr-1"/> {job.address}</p>
                    <p className="text-emerald-400 text-sm font-bold bg-emerald-900/20 inline-block px-2 py-1 rounded mt-2 border border-emerald-900/50">💳 {job.payment_method}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                     <span className="text-gray-300 font-bold bg-slate-800 px-3 py-1 rounded border border-slate-700 flex items-center gap-2"><FaPhoneAlt className="text-cyan-500"/> {job.customer_phone}</span>
                     {job.status === 'PENDING' && <button onClick={() => handleUpdateStatus(job.id, 'CONFIRMED')} className="bg-cyan-600 text-white px-6 py-2 rounded font-bold hover:bg-cyan-500 transition shadow-[0_0_15px_rgba(34,211,238,0.4)] uppercase text-sm">Accept</button>}
                     {job.status === 'CONFIRMED' && <button onClick={() => handleUpdateStatus(job.id, 'COMPLETED')} className="bg-emerald-600 text-white px-6 py-2 rounded font-bold hover:bg-emerald-500 transition shadow-[0_0_15px_rgba(52,211,153,0.4)] uppercase text-sm">Complete</button>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ADMIN REVENUE MODAL */}
        <AnimatePresence>
          {isAdminRevenueModalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[150] p-4 backdrop-blur-sm">
              <motion.div variants={popModalVariants} initial="hidden" animate="visible" exit="exit" className="bg-slate-900 p-8 rounded-xl w-full max-w-4xl relative max-h-[80vh] overflow-y-auto border border-emerald-500 shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                <button onClick={() => setIsAdminRevenueModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl">&times;</button>
                <div className="flex items-center gap-3 mb-6"><FaMoneyCheckAlt className="text-3xl text-emerald-500 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" /><h2 className="text-2xl font-bold text-white uppercase tracking-widest">Detailed Revenue Report</h2></div>
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-800 text-emerald-500 uppercase tracking-widest">
                      <th className="p-3 rounded-tl">ID</th><th className="p-3">Customer</th><th className="p-3">Payment Type</th><th className="p-3 text-right rounded-tr">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {mySchedule.map(job => (
                      <tr key={job.id} className="border-b border-slate-800">
                        <td className="p-3 font-mono">#{job.id}</td><td className="p-3 text-white font-bold">{job.customer}</td>
                        <td className="p-3"><span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${job.payment_method.includes('QR') ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-800' : 'bg-slate-800 text-gray-400 border border-slate-700'}`}>{job.payment_method}</span></td>
                        <td className="p-3 text-right font-black text-emerald-400">${job.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// --- MASTER NAVIGATION BAR ---
function NavBar() {
  return (
    <nav className="bg-[#0b1320]/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] fixed w-full top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black text-white flex items-center gap-3 tracking-widest uppercase">
          <FaUserShield className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"/> DIGITAL<span className="text-cyan-400">HOME</span>
        </Link>
        <div className="hidden md:flex gap-8 font-bold text-gray-400 items-center text-xs uppercase tracking-widest">
          <Link to="/" className="hover:text-cyan-400 transition hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">Home</Link>
          <Link to="/about" className="hover:text-cyan-400 transition hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">About Us</Link>
          <Link to="/contact" className="hover:text-cyan-400 transition hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">Contact</Link>
          <Link to="/register" className="hover:text-cyan-400 transition hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">Registration</Link>
          <Link to="/login" className="bg-cyan-500/10 text-cyan-400 border border-cyan-500 px-6 py-2 rounded hover:bg-cyan-500 hover:text-slate-900 transition shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]">Login</Link>
        </div>
      </div>
    </nav>
  );
}

// --- MAIN APP COMPONENT ---
function App() {
  return (
    <Router>
      <NavBar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;