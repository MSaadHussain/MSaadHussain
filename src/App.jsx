import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Download, Star, Code, ArrowRight, Menu, X, ShoppingCart, LayoutDashboard, Newspaper, ArrowLeft, Trash2, Plus, Minus, Home as HomeIcon, List, Package } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './index.css';

// --- Helper Functions & Data ---
const GITHUB_USERNAME = 'msaadhussain';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc`;
const NAV_LINKS = ['Home', 'About', 'Projects', 'Demos', 'Resume', 'Contact'];

// --- 3D Fluid Animation Component for Hero Section ---
const FluidAnimation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (typeof THREE === 'undefined') {
      console.error("Three.js is not loaded. Please add the script tag to your index.html.");
      return;
    }

    const currentMount = mountRef.current;
    if (!currentMount) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    camera.position.z = 5;

    const geometry = new THREE.IcosahedronGeometry(2, 20);
    const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 1.0 }, colorA: { value: new THREE.Color(0x7E3AF2) }, colorB: { value: new THREE.Color(0x27272a) } },
        vertexShader: `uniform float time; varying vec3 vNormal; void main() { vNormal = normal; float distortion = 0.5 * sin(position.y * 4.0 + time) * sin(position.x * 4.0 + time); vec3 newPosition = position + normal * distortion; gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0); }`,
        fragmentShader: `uniform vec3 colorA; uniform vec3 colorB; varying vec3 vNormal; void main() { gl_FragColor = vec4(mix(colorA, colorB, vNormal.z), 1.0); }`,
        wireframe: true
    });

    const fluidSphere = new THREE.Mesh(geometry, material);
    scene.add(fluidSphere);

    let clock = new THREE.Clock();
    const animate = () => {
      if (!mountRef.current) return;
      requestAnimationFrame(animate);
      fluidSphere.rotation.x += 0.001;
      fluidSphere.rotation.y += 0.001;
      material.uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!currentMount) return;
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) { currentMount.removeChild(renderer.domElement); }
    };
  }, []);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0 opacity-50" />;
};


// --- Components ---

// Header / Navigation Component with Fluid Effect
const Header = ({ setPage, page }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fluidStyle, setFluidStyle] = useState({});
  const navRef = useRef(null);

  const updateFluidStyle = () => {
    const activeLink = navRef.current?.querySelector(`[data-page="${page}"]`);
    if (activeLink) { setFluidStyle({ left: activeLink.offsetLeft, width: activeLink.offsetWidth }); }
  };

  useEffect(() => {
    updateFluidStyle();
    window.addEventListener('resize', updateFluidStyle);
    return () => window.removeEventListener('resize', updateFluidStyle);
  }, [page]);

  const handleNavClick = (name) => { setPage(name); setIsMenuOpen(false); };

  return (
    <header className="bg-gray-800/80 backdrop-blur-sm text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center"><span className="font-bold text-xl cursor-pointer" onClick={() => handleNavClick('Home')}>M Saad Hussain</span></div>
          <div className="hidden md:block">
            <nav ref={navRef} className="relative ml-10 flex items-center">
              {NAV_LINKS.map((link) => (<button key={link} data-page={link} onClick={() => handleNavClick(link)} className={`relative z-10 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${page === link ? 'text-white' : 'text-gray-300 hover:text-white'}`}>{link}</button>))}
              <span className="absolute bg-gray-900 h-full rounded-md transition-all duration-500 ease-in-out" style={{ ...fluidStyle, top: 0, zIndex: 0 }}/>
            </nav>
          </div>
          <div className="md:hidden flex items-center"><button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"><span className="sr-only">Open main menu</span>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button></div>
        </div>
      </div>
      {isMenuOpen && (<div className="md:hidden"><div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">{NAV_LINKS.map((link) => (<button key={link} onClick={() => handleNavClick(link)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">{link}</button>))}</div></div>)}
    </header>
  );
};

// Home Page Component
const Home = ({ setPage }) => (<div className="relative min-h-full flex items-center justify-center bg-gray-900 text-white overflow-hidden"><FluidAnimation /><div className="relative text-center p-8 z-10"><h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 animate-fade-in-down">M Saad Hussain</h1><p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 animate-fade-in-up delay-300">Experienced website developer skilled in JavaScript & Python, creating dynamic and responsive web solutions.</p><div className="flex justify-center items-center gap-4 flex-wrap animate-fade-in-up delay-500"><button onClick={() => setPage('Projects')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-indigo-500/50 flex items-center gap-2">View My Work <ArrowRight size={20} /></button><button onClick={() => setPage('Contact')} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-gray-500/50">Get In Touch</button></div></div></div>);

// About Page Component
const About = () => { const skills = ['JavaScript', 'React', 'Python', 'Django', 'Flutter', 'WordPress', 'Shopify', 'Tailwind CSS']; const timeline = [{title: "Python Internship", company: "Giants Solution", description: "Focused on data-related tasks, including data cleaning, processing, and automation scripting with Python."}, {title: "Flutter Development", company: "Self-learning", description: "Embarked on a self-taught journey into mobile development with Flutter, building apps to grasp cross-platform principles."}, {title: "CMS & E-commerce", company: "Freelance", description: "Developed and customized websites using WordPress and Shopify, from themes and plugins to store management."}]; return (<div className="bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8 w-full h-full overflow-y-auto"><div className="container mx-auto"><h2 className="text-4xl font-bold text-center text-white mb-16">About Me</h2><div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mb-20"><div className="lg:col-span-1 flex justify-center"><img className="rounded-full h-64 w-64 object-cover shadow-2xl border-4 border-indigo-500 transform hover:scale-105 transition-transform duration-500" src="https://placehold.co/256x256/7E3AF2/FFFFFF?text=MSH" alt="M Saad Hussain"/></div><div className="lg:col-span-2"><p className="text-lg text-gray-300 mb-6">I'm a passionate developer with a diverse skill set spanning web and mobile development. My journey in tech started with an internship where I honed my Python skills on data-centric projects. Driven by curiosity, I explored mobile development with Flutter and gained proficiency in building e-commerce solutions with WordPress and Shopify. I thrive on learning new technologies and applying them to solve real-world problems.</p><h3 className="text-2xl font-semibold text-white mb-4">Key Skills</h3><div className="flex flex-wrap gap-3">{skills.map((skill, i) => (<span key={skill} className="bg-indigo-900 text-indigo-200 text-sm font-medium px-4 py-2 rounded-full transform hover:scale-110 transition-transform" style={{animationDelay: `${i*50}ms`}}>{skill}</span>))}</div></div></div><div><h3 className="text-3xl font-bold text-center text-white mb-12">My Journey</h3><div className="relative border-l-4 border-indigo-400 ml-6">{timeline.map((item, index) => (<div key={index} className="mb-12 ml-10 transition-all duration-300 hover:bg-gray-800/50 p-4 rounded-lg"><span className="absolute flex items-center justify-center w-10 h-10 bg-indigo-900 rounded-full -left-5 ring-8 ring-gray-900"><Code className="w-5 h-5 text-indigo-300" /></span><h4 className="flex items-center mb-1 text-xl font-semibold text-white">{item.title} <span className="text-sm font-medium ml-3 text-gray-400">@ {item.company}</span></h4><p className="text-base font-normal text-gray-400">{item.description}</p></div>))}</div></div></div></div>);};

// Projects Page Component
const Projects = () => { const [repos, setRepos] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(null); useEffect(() => { const fetchRepos = async () => { try { setLoading(true); const response = await fetch(GITHUB_API_URL); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); const data = await response.json(); setRepos(data.filter(repo => !repo.fork)); } catch (e) { setError(e.message); } finally { setLoading(false); } }; fetchRepos(); }, []); const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); if (loading) return <div className="w-full h-full flex flex-col justify-center items-center bg-gray-900"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div><p className="mt-4 text-gray-300">Fetching GitHub Repositories...</p></div>; if (error) return <div className="w-full h-full flex flex-col justify-center items-center bg-red-900/20"><p className="text-red-300">Error: {error}</p></div>; return (<div className="bg-gray-900 py-20 px-4 sm:px-6 lg:px-8 w-full h-full overflow-y-auto"><div className="container mx-auto"><h2 className="text-4xl font-bold text-center text-white mb-12">My Projects</h2><p className="text-center text-lg text-gray-400 mb-16 max-w-2xl mx-auto">Here are some of my public projects from GitHub, showcasing my work across various technologies.</p><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{repos.map((repo) => (<div key={repo.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group flex flex-col"><div className="p-6 flex-grow"><h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{repo.name}</h3><p className="text-gray-400 text-sm mb-4 h-20 overflow-auto">{repo.description || 'No description provided.'}</p><div className="flex items-center justify-between text-sm text-gray-300"><span className="flex items-center gap-1.5"><Code size={16} className="text-indigo-500" /> {repo.language || 'N/A'}</span><span className="flex items-center gap-1.5"><Star size={16} className="text-yellow-500" /> {repo.stargazers_count}</span></div></div><div className="px-6 py-4 bg-gray-700/50 flex justify-between items-center"><span className="text-xs text-gray-400">Updated: {formatDate(repo.updated_at)}</span><a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all transform group-hover:scale-105">View on GitHub</a></div></div>))}</div></div></div>);};

// --- E-commerce Demo Component (UPDATED with sidebar nav and cart page) ---
const EcommerceDemo = ({ onClose }) => {
    const [cart, setCart] = useState([]);
    const [page, setPage] = useState('products'); // 'products', 'cart', 'categories', 'orders'
    
    const products = [{ id: 1, name: 'Quantum Hoodie', price: 59.99, image: 'https://placehold.co/400x400/7E3AF2/FFFFFF?text=Hoodie' }, { id: 2, name: 'Nebula T-Shirt', price: 24.99, image: 'https://placehold.co/400x400/7E3AF2/FFFFFF?text=T-Shirt' }, { id: 3, name: 'Galaxy Cap', price: 19.99, image: 'https://placehold.co/400x400/7E3AF2/FFFFFF?text=Cap' }, { id: 4, name: 'Starlight Sneakers', price: 89.99, image: 'https://placehold.co/400x400/7E3AF2/FFFFFF?text=Sneakers' },];
    
    const updateQuantity = (productId, amount) => {
        setCart(cart.map(item => item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item).filter(item => item.quantity > 0));
    };
    
    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            updateQuantity(product.id, 1);
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };
    
    const removeFromCart = (productId) => { setCart(cart.filter(item => item.id !== productId)); };
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const PageContent = () => {
        switch(page) {
            case 'products':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <div key={product.id} className="bg-gray-700 rounded-lg p-4 flex flex-col items-center text-center transition-transform transform hover:scale-105">
                                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-4"/>
                                <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                                <p className="text-indigo-400 font-bold my-2">${product.price}</p>
                                <button onClick={() => addToCart(product)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 w-full mt-auto">Add to Cart</button>
                            </div>
                        ))}
                    </div>
                );
            case 'cart':
                return (
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-white mb-6">Your Cart</h2>
                        {cart.length === 0 ? <p className="text-gray-400">Your cart is empty. Go add some products!</p> : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                                        <div className="flex items-center gap-4"><img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover"/><div><h4 className="font-semibold text-white">{item.name}</h4><p className="text-sm text-gray-400">${item.price}</p></div></div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 bg-gray-600 p-1 rounded-md">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="p-1"><Minus size={16}/></button>
                                                <span className="w-8 text-center font-bold">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="p-1"><Plus size={16}/></button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300"><Trash2 size={20}/></button>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-6 border-t border-gray-700 flex justify-end items-center">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">Total: ${total.toFixed(2)}</p>
                                        <button className="mt-4 bg-indigo-600 py-3 px-8 rounded-lg hover:bg-indigo-700">Proceed to Checkout</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            default:
                return <div className="text-center text-gray-400"><h2 className="text-2xl font-bold text-white mb-4">Coming Soon!</h2><p>This section is under construction.</p></div>;
        }
    };

    const NavLink = ({ icon, label, pageName }) => (
        <button onClick={() => setPage(pageName)} className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-colors ${page === pageName ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700'}`}>
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-gray-800 rounded-2xl shadow-2xl w-[90vw] h-[90vh] flex overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-900/50 p-4 flex-col flex text-white">
                    <div className="flex items-center gap-3 mb-8">
                        <Code size={28} className="text-indigo-400" />
                        <h2 className="text-xl font-bold">Store Demo</h2>
                    </div>
                    <nav className="space-y-2">
                        <NavLink icon={<HomeIcon size={20}/>} label="Products" pageName="products"/>
                        <NavLink icon={<List size={20}/>} label="Categories" pageName="categories"/>
                        <NavLink icon={<Package size={20}/>} label="My Orders" pageName="orders"/>
                    </nav>
                    <button onClick={onClose} className="mt-auto w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-800/50 bg-gray-700/50">
                        <X size={20}/> Exit Demo
                    </button>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <header className="flex items-center justify-end p-4 border-b border-gray-700 flex-shrink-0">
                        <button onClick={() => setPage('cart')} className="relative p-2 rounded-full hover:bg-gray-700">
                            <ShoppingCart className="text-white" />
                            {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{totalItems}</span>}
                        </button>
                    </header>
                    <main className="flex-grow p-6 overflow-y-auto text-white">
                        <PageContent />
                    </main>
                </div>
            </div>
        </div>
    );
};


// --- Blog Demo Component ---
const BlogDemo = ({ onClose }) => {
    const [posts] = useState([
        { id: 1, title: 'Building a Portfolio with React', author: 'M Saad Hussain', date: '2025-06-20', content: 'In this article, we explore the step-by-step process of creating a dynamic personal portfolio using React, Tailwind CSS, and Three.js for stunning 3D animations. We cover component structure, state management, and fetching data from APIs. The result is a fast, modern, and visually appealing web application that you can use to showcase your skills to potential employers.' },
        { id: 2, title: 'The Power of Interactive Demos', author: 'Jane Doe', date: '2025-06-18', content: 'Static images of projects are a thing of the past. Learn how to engage potential employers and clients by building interactive, in-browser demos of your applications. We will look at modals, isolated component rendering, and creating a seamless user experience that highlights your front-end capabilities.' },
        { id: 3, title: 'Python for Data Science', author: 'John Smith', date: '2025-06-15', content: 'Python has become the de facto language for data science, and for good reason. Its simple syntax, powerful libraries like Pandas, NumPy, and Scikit-learn, and vibrant community make it an ideal choice for everything from data cleaning and analysis to machine learning model development. This post serves as a primer for getting started.' },
        { id: 4, title: 'A Deep Dive into React State Management', author: 'M Saad Hussain', date: '2025-06-12', content: 'When should you use Context API over Redux? This is a common question for React developers. We will explore the pros and cons of each, looking at boilerplate, performance, and scalability. We will build small example apps to demonstrate the core concepts of both state management solutions.' },
        { id: 5, title: 'Getting Started with Flutter', author: 'Emily White', date: '2025-06-10', content: 'Flutter allows you to build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase. This tutorial will guide you through setting up your development environment, creating your first "Hello World" app, and understanding the core principles of widgets and layouts.' },
        { id: 6, title: 'Web Performance Optimization 101', author: 'Alex Green', date: '2025-06-05', content: 'A slow website can kill user engagement. In this post, we cover the fundamentals of web performance, including image optimization, code splitting, lazy loading, and caching strategies. Learn how to use browser developer tools to diagnose and fix performance bottlenecks in your applications.' },
    ]);
    const [activePost, setActivePost] = useState(null);

    if (activePost) {
        return (<div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"><div className="bg-gray-800 rounded-2xl shadow-2xl w-[90vw] h-[90vh] flex flex-col overflow-hidden">
            <header className="flex items-center justify-between p-4 border-b border-gray-700"><button onClick={() => setActivePost(null)} className="flex items-center gap-2 text-white hover:text-indigo-400"><ArrowLeft size={20} />Back to Posts</button><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700"><X size={24} className="text-white" /></button></header>
            <main className="p-8 text-white overflow-y-auto"><h1 className="text-4xl font-bold mb-4">{activePost.title}</h1><div className="flex items-center gap-4 text-gray-400 mb-8"><p>By {activePost.author}</p><span>&bull;</span><p>{activePost.date}</p></div><p className="text-lg leading-relaxed">{activePost.content}</p></main>
        </div></div>);
    }
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"><div className="bg-gray-800 rounded-2xl shadow-2xl w-[90vw] h-[90vh] flex flex-col overflow-hidden">
            <header className="flex items-center justify-between p-4 border-b border-gray-700"><div className="flex items-center gap-3"><Newspaper size={28} className="text-indigo-400" /><h2 className="text-xl font-bold text-white">Blog Platform Demo</h2></div><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700"><X size={24} className="text-white" /></button></header>
            <main className="p-6 overflow-y-auto space-y-6">{posts.map(post => (<div key={post.id} onClick={() => setActivePost(post)} className="bg-gray-700 p-6 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"><h3 className="text-2xl font-bold text-white mb-2">{post.title}</h3><p className="text-gray-400">By {post.author} on {post.date}</p></div>))}</main>
        </div></div>
    );
}

// --- Dashboard Demo Component ---
const DashboardDemo = ({ onClose }) => {
    const kpiData = [{ title: 'Total Users', value: '1,425', change: '+12.5%' }, { title: 'Revenue', value: '$23,890', change: '+8.1%' }, { title: 'Engagement', value: '64.8%', change: '-2.3%' },];
    const userTrendData = [ { name: 'Jan', users: 400 }, { name: 'Feb', users: 300 }, { name: 'Mar', users: 500 }, { name: 'Apr', users: 450 }, { name: 'May', users: 600 }, { name: 'Jun', users: 800 }, ];
    const trafficSourceData = [ { source: 'Google', value: 45 }, { source: 'Facebook', value: 25 }, { source: 'Direct', value: 20 }, { source: 'Other', value: 10 }, ];

    return (<div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"><div className="bg-gray-800 rounded-2xl shadow-2xl w-[90vw] h-[90vh] flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-gray-700"><div className="flex items-center gap-3"><LayoutDashboard size={28} className="text-indigo-400" /><h2 className="text-xl font-bold text-white">Dashboard Demo</h2></div><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700"><X size={24} className="text-white" /></button></header>
        <main className="flex-grow p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">{kpiData.map(kpi => (<div key={kpi.title} className="bg-gray-700 p-6 rounded-lg"><h4 className="text-gray-400 text-sm">{kpi.title}</h4><p className="text-3xl font-bold text-white my-2">{kpi.value}</p><p className={`text-sm ${kpi.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{kpi.change}</p></div>))}</div>
            <div className="lg:col-span-2 bg-gray-700 p-6 rounded-lg"><h4 className="text-white font-bold mb-4">User Trends</h4><ResponsiveContainer width="100%" height={300}><LineChart data={userTrendData}><CartesianGrid strokeDasharray="3 3" stroke="#4A5568"/><XAxis dataKey="name" stroke="#A0AEC0"/><YAxis stroke="#A0AEC0"/><Tooltip contentStyle={{ backgroundColor: '#1A202C' }}/><Legend /><Line type="monotone" dataKey="users" stroke="#818CF8" strokeWidth={2}/></LineChart></ResponsiveContainer></div>
            <div className="lg:col-span-1 bg-gray-700 p-6 rounded-lg"><h4 className="text-white font-bold mb-4">Traffic Sources (%)</h4><ResponsiveContainer width="100%" height={300}><BarChart data={trafficSourceData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#4A5568"/><XAxis type="number" stroke="#A0AEC0"/><YAxis type="category" dataKey="source" stroke="#A0AEC0" width={80}/><Tooltip contentStyle={{ backgroundColor: '#1A202C' }}/><Bar dataKey="value" fill="#818CF8" /></BarChart></ResponsiveContainer></div>
        </main>
    </div></div>);
}

// Demos Page Component
const Demos = () => {
  const [activeDemo, setActiveDemo] = useState(null);
  const projectBubbles = [{ id: 'ecommerce', title: 'E-commerce Demo', size: '180px', top: '20%', left: '15%', delay: '0s' }, { id: 'blog', title: 'Blog Platform', size: '150px', top: '60%', left: '30%', delay: '2s' }, { id: 'dashboard', title: 'Data Dashboard', size: '200px', top: '40%', left: '65%', delay: '4s' }];

  return (
    <div className="bg-gray-900 w-full h-full overflow-hidden relative">
      <div className="text-center pt-20 z-10 relative"><h2 className="text-4xl font-bold text-white">Interactive Demos</h2><p className="text-lg text-gray-400 mt-4">Click on a bubble to launch a functional demo.</p></div>
      <div className="absolute inset-0 z-0">{projectBubbles.map(bubble => (<div key={bubble.id} className="absolute rounded-full bg-indigo-900/50 flex items-center justify-center text-center p-4 cursor-pointer hover:bg-indigo-900/80 transition-all duration-300 animate-float" style={{ width: bubble.size, height: bubble.size, top: bubble.top, left: bubble.left, animationDuration: `${Math.random() * 10 + 15}s`, animationDelay: bubble.delay }} onClick={() => setActiveDemo(bubble.id)}><span className="font-bold text-white text-xl">{bubble.title}</span></div>))}</div>
      {activeDemo === 'ecommerce' && <EcommerceDemo onClose={() => setActiveDemo(null)} />}
      {activeDemo === 'blog' && <BlogDemo onClose={() => setActiveDemo(null)} />}
      {activeDemo === 'dashboard' && <DashboardDemo onClose={() => setActiveDemo(null)} />}
    </div>
  );
};

// Resume Page Component
const Resume = () => (<div className="bg-gray-900 py-20 px-4 sm:px-6 lg:px-8 w-full h-full overflow-y-auto"><div className="container mx-auto text-center"><h2 className="text-4xl font-bold text-white mb-8">My Resume</h2><p className="text-gray-300 mb-12 max-w-2xl mx-auto">Preview my resume below or download the full PDF for a detailed look at my experience.</p><div className="mb-12"><div className="max-w-4xl mx-auto bg-gray-800 p-4 rounded-lg shadow-2xl border border-gray-700 transition-all duration-300 hover:shadow-indigo-500/20"><img src="https://placehold.co/800x1131/4A5568/E2E8F0?text=Resume+Preview\n(Replace+with+an+image+of+your+resume)" alt="Resume Preview" className="w-full h-auto rounded-md"/></div></div><a href="/path/to/your/resume.pdf" download="M-Saad-Hussain-Resume.pdf" className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-lg transition-transform transform hover:scale-105 shadow-lg hover:shadow-indigo-500/50"><Download size={22} />Download PDF</a><p className="text-sm mt-4 text-gray-400">(Remember to replace the placeholder link)</p></div></div>);

// Contact Page Component
const Contact = () => (<div className="bg-gray-900 text-white py-24 px-4 sm:px-6 lg:px-8 w-full h-full flex items-center justify-center"><div className="container mx-auto max-w-3xl text-center"><h2 className="text-4xl font-bold mb-4">Get In Touch</h2><p className="text-lg text-gray-300 mb-12">I'm open to new projects and collaboration. Let's build something amazing together.</p><div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500"><p className="text-center text-gray-400 mb-6">The best way to reach me is by email. Click the button below to get in touch.</p><a href="mailto:msaadhussain300@gmail.com" className="w-full inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg shadow-lg hover:shadow-indigo-500/50"><Mail size={22} />Contact Me</a></div><div className="mt-16"><p className="text-gray-400 mb-6">Find me on other platforms:</p><div className="flex justify-center gap-8"><a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-transform transform hover:scale-125"><Github size={32} /></a><a href="https://www.linkedin.com/in/msaadhussain/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-transform transform hover:scale-125"><Linkedin size={32} /></a></div></div></div></div>);

// Footer Component
const Footer = () => (<footer className="bg-gray-800 text-white"><div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-400"><p>&copy; {new Date().getFullYear()} M Saad Hussain. All Rights Reserved.</p><p className="text-sm mt-1">Designed & Built with React, Three.js & Tailwind CSS.</p></div></footer>);

// Main App Component
export default function App() {
  const [page, setPage] = useState('Home');
  const [prevPageKey, setPrevPageKey] = useState(null);
  const [direction, setDirection] = useState('right');

  const handleSetPage = (newPage) => {
    if (newPage === page) return;
    const oldIndex = NAV_LINKS.indexOf(page);
    const newIndex = NAV_LINKS.indexOf(newPage);
    setDirection(newIndex > oldIndex ? 'right' : 'left');
    setPrevPageKey(page);
    setPage(newPage);
  };

  useEffect(() => {
    if (prevPageKey === null) return;
    const timer = setTimeout(() => setPrevPageKey(null), 500);
    return () => clearTimeout(timer);
  }, [prevPageKey]);

  const renderPage = (pageKey) => {
    if (!pageKey) return null;
    switch (pageKey) {
      case 'Home': return <Home setPage={handleSetPage} />;
      case 'About': return <About />;
      case 'Projects': return <Projects />;
      case 'Demos': return <Demos />;
      case 'Resume': return <Resume />;
      case 'Contact': return <Contact />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans flex flex-col h-screen">
      <style>{`
        @keyframes fade-in-down { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } } .animate-fade-in-down { animation: fade-in-down 0.6s ease-out forwards; }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .delay-300 { animation-delay: 300ms; } .delay-500 { animation-delay: 500ms; }
        @keyframes slide-out-left { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-100%); opacity: 0; } } .animate-slide-out-left { animation: slide-out-left 0.5s forwards ease-in-out; }
        @keyframes slide-in-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slide-in-right { animation: slide-in-right 0.5s forwards ease-in-out; }
        @keyframes slide-out-right { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } } .animate-slide-out-right { animation: slide-out-right 0.5s forwards ease-in-out; }
        @keyframes slide-in-left { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slide-in-left { animation: slide-in-left 0.5s forwards ease-in-out; }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out forwards; }
        @keyframes float { 0% { transform: translateY(0px) translateX(0px) rotate(0deg); } 25% { transform: translateY(-20px) translateX(10px) rotate(10deg); } 50% { transform: translateY(10px) translateX(-20px) rotate(-15deg); } 75% { transform: translateY(-15px) translateX(20px) rotate(5deg); } 100% { transform: translateY(0px) translateX(0px) rotate(0deg); } } .animate-float { animation: float 20s ease-in-out infinite; }
      `}</style>
      <Header setPage={handleSetPage} page={page} />
      <main className="relative flex-1 overflow-hidden bg-gray-900">
        <div key={page} className={`absolute w-full h-full ${prevPageKey ? (direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left') : 'animate-fade-in'}`}>{renderPage(page)}</div>
        {prevPageKey && (<div key={prevPageKey} className={`absolute w-full h-full ${direction === 'right' ? 'animate-slide-out-left' : 'animate-slide-out-right'}`}>{renderPage(prevPageKey)}</div>)}
      </main>
      <Footer />
    </div>
  );
}
