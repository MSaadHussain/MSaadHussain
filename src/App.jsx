import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Github, Linkedin, Mail, Download, Star, Code, ArrowRight, Menu, X, ShoppingCart, LayoutDashboard, Newspaper, ArrowLeft, Trash2, Plus, Minus, Home as HomeIcon, List, Package, Paintbrush } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- CONSTANTS ---
const GITHUB_USERNAME = 'msaadhussain';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc`;
const NAV_LINKS = ['Home', 'About', 'Projects', 'Demos', 'Resume', 'Contact'];

const THEMES = {
  dark: "Dark",
  light: "Light",
  glass: "Glassmorphism",
  purple: "Purple",
  red: "Red",
  green: "Green",
  blue: "Blue",
  custom: "Custom",
};

// --- THEME MANAGEMENT ---
const ThemeContext = createContext();

// Helper function to generate a full color palette from a single base color
const generatePalette = (baseColor) => {
    // Basic function to convert hex to HSL
    const hexToHSL = (hex) => {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
        } else if (hex.length === 7) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
        }
        r /= 255; g /= 255; b /= 255;
        let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin, h = 0, s = 0, l = 0;
        if (delta === 0) h = 0;
        else if (cmax === r) h = ((g - b) / delta) % 6;
        else if (cmax === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        l = (cmax + cmin) / 2;
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);
        return { h, s, l };
    };

    const baseHSL = hexToHSL(baseColor);
    
    // Function to check brightness to determine text color
    const getContrastYIQ = (hex) => {
        const r = parseInt(hex.substr(1,2),16);
        const g = parseInt(hex.substr(3,2),16);
        const b = parseInt(hex.substr(5,2),16);
        const yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? '#111827' : '#f9fafb';
    }

    return {
        '--color-primary': baseColor,
        '--color-primary-hover': `hsl(${baseHSL.h}, ${baseHSL.s}%, ${Math.max(0, baseHSL.l - 5)}%)`,
        '--color-primary-text': getContrastYIQ(baseColor),
        '--color-primary-text-alt': `hsl(${baseHSL.h}, ${baseHSL.s}%, ${baseHSL.l > 50 ? baseHSL.l - 40 : baseHSL.l + 40}%)`,
        '--color-primary-light': `hsla(${baseHSL.h}, ${baseHSL.s}%, ${baseHSL.l}%, 0.2)`,
        '--color-background': `hsl(${baseHSL.h}, ${baseHSL.s - 10 < 0 ? 0 : baseHSL.s - 10}%, 10%)`,
        '--color-text-primary': `hsl(${baseHSL.h}, 15%, 95%)`,
        '--color-text-secondary': `hsl(${baseHSL.h}, 10%, 70%)`,
        '--color-ui-header': `hsla(${baseHSL.h}, ${baseHSL.s - 10 < 0 ? 0 : baseHSL.s - 10}%, 10%, 0.7)`,
        '--color-ui-header-accent': `hsl(${baseHSL.h}, ${baseHSL.s - 10 < 0 ? 0 : baseHSL.s - 10}%, 15%)`,
        '--color-ui-card': `hsl(${baseHSL.h}, ${baseHSL.s - 10 < 0 ? 0 : baseHSL.s - 10}%, 15%)`,
        '--color-ui-card-hover': `hsl(${baseHSL.h}, ${baseHSL.s - 10 < 0 ? 0 : baseHSL.s - 10}%, 20%)`,
        '--color-ui-card-deep': `hsl(${baseHSL.h}, ${baseHSL.s - 10 < 0 ? 0 : baseHSL.s - 10}%, 8%)`,
        '--color-ui-sidebar': `hsla(${baseHSL.h}, ${baseHSL.s - 10 < 0 ? 0 : baseHSL.s - 10}%, 15%, 0.5)`,
        '--color-ui-border': `hsl(${baseHSL.h}, ${baseHSL.s - 10 < 0 ? 0 : baseHSL.s - 10}%, 20%)`,
        '--color-ui-button': `hsl(${baseHSL.h}, ${baseHSL.s - 10 < 0 ? 0 : baseHSL.s - 10}%, 20%)`,
    };
};

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');
    const [customColor, setCustomColor] = useState('#8b5cf6');

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove(...Object.keys(THEMES));
        root.classList.add(theme);

        if (theme === 'custom') {
            const palette = generatePalette(customColor);
            for (const [key, value] of Object.entries(palette)) {
                root.style.setProperty(key, value);
            }
        } else {
            // Clear inline styles when not using custom theme
            root.style.cssText = '';
        }

    }, [theme, customColor]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, customColor, setCustomColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

const useTheme = () => useContext(ThemeContext);

// --- SVG WhatsApp Icon ---
const WhatsAppIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> );

// --- 3D Fluid Animation Component for Hero Section ---
const FluidAnimation = () => {
  const mountRef = useRef(null);
  const { theme, customColor } = useTheme();
  const rendererRef = useRef(null);
  const sphereRef = useRef(null);

  useEffect(() => {
    if (typeof THREE === 'undefined') return;
    const currentMount = mountRef.current;
    if (!currentMount) return;
    
    if (!rendererRef.current) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);
        rendererRef.current = { renderer, scene, camera };
        camera.position.z = 5;

        const material = new THREE.ShaderMaterial({
            uniforms: { time: { value: 1.0 }, colorA: { value: new THREE.Color(0x000000) }, colorB: { value: new THREE.Color(0x000000) } },
            vertexShader: `uniform float time; varying vec3 vNormal; void main() { vNormal = normal; float distortion = 0.5 * sin(position.y * 4.0 + time) * sin(position.x * 4.0 + time); vec3 newPosition = position + normal * distortion; gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0); }`,
            fragmentShader: `uniform vec3 colorA; uniform vec3 colorB; varying vec3 vNormal; void main() { gl_FragColor = vec4(mix(colorA, colorB, vNormal.z), 1.0); }`,
            wireframe: true
        });
        const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 20), material);
        scene.add(sphere);
        sphereRef.current = sphere;

        let clock = new THREE.Clock();
        const animate = () => { if (!rendererRef.current) return; requestAnimationFrame(animate); sphere.rotation.x += 0.001; sphere.rotation.y += 0.001; material.uniforms.time.value = clock.getElapsedTime(); renderer.render(scene, camera); };
        animate();

        const handleResize = () => { if (!rendererRef.current) return; camera.aspect = currentMount.clientWidth / currentMount.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(currentMount.clientWidth, currentMount.clientHeight); };
        window.addEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (sphereRef.current) {
        const rootStyle = getComputedStyle(document.documentElement);
        const colorA = new THREE.Color(rootStyle.getPropertyValue('--color-primary').trim());
        const colorB = new THREE.Color(rootStyle.getPropertyValue('--color-background').trim());
        
        sphereRef.current.material.uniforms.colorA.value.set(colorA);
        sphereRef.current.material.uniforms.colorB.value.set(colorB);
    }
  }, [theme, customColor]);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0 opacity-50" />;
};


// --- Components ---

const Header = ({ setPage, page }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [fluidStyle, setFluidStyle] = useState({});
  const navRef = useRef(null);
  const { theme, setTheme, customColor, setCustomColor } = useTheme();

  const updateFluidStyle = () => { const activeLink = navRef.current?.querySelector(`[data-page="${page}"]`); if (activeLink) { setFluidStyle({ left: activeLink.offsetLeft, width: activeLink.offsetWidth }); } };
  useEffect(() => { updateFluidStyle(); window.addEventListener('resize', updateFluidStyle); return () => window.removeEventListener('resize', updateFluidStyle); }, [page]);
  const handleNavClick = (name) => { setPage(name); setIsMenuOpen(false); };
  
  return (
    <header className="bg-ui-header text-text-primary sticky top-0 z-[51] shadow-lg glass-ui">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center"><span className="font-bold text-xl cursor-pointer" onClick={() => handleNavClick('Home')}>M Saad Hussain</span></div>
          <div className="hidden md:flex items-center">
            <nav ref={navRef} className="relative flex items-center">
              {NAV_LINKS.map((link) => (<button key={link} data-page={link} onClick={() => handleNavClick(link)} className={`relative z-10 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${page === link ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}>{link}</button>))}
              <span className="absolute bg-ui-header-accent h-full rounded-md transition-all duration-500 ease-in-out" style={{ ...fluidStyle, top: 0, zIndex: 0 }}/>
            </nav>
            <div className="relative ml-4">
              <button onClick={() => setIsThemeOpen(!isThemeOpen)} className="p-2 rounded-full hover:bg-ui-header-accent"><Paintbrush size={20}/></button>
              {isThemeOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-ui-card rounded-md shadow-lg py-1 z-50 glass-ui-card">
                  {Object.entries(THEMES).map(([key, value]) => (
                    <button key={key} onClick={() => { setTheme(key); setIsThemeOpen(false); }} className={`block w-full text-left px-4 py-2 text-sm ${theme === key ? 'bg-ui-header-accent text-text-primary' : 'text-text-secondary hover:bg-ui-header-accent hover:text-text-primary'}`}>{value}</button>
                  ))}
                  {theme === 'custom' && (
                    <div className="p-2 border-t border-ui-border mt-1">
                        <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="w-full h-8 p-1 bg-transparent border border-ui-border rounded-md cursor-pointer"/>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md hover:bg-ui-header-accent"><span className="sr-only">Open main menu</span>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
      </div>
      {isMenuOpen && (<div className="md:hidden"><div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">{NAV_LINKS.map((link) => (<button key={link} onClick={() => handleNavClick(link)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary hover:bg-ui-header-accent">{link}</button>))}</div></div>)}
    </header>
  );
};

const Home = ({ setPage }) => (<div className="relative min-h-full flex items-center justify-center bg-ui-background text-text-primary overflow-hidden"><FluidAnimation /><div className="relative text-center p-8 z-10"><h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 animate-fade-in-down">M Saad Hussain</h1><p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-8 animate-fade-in-up delay-300">Experienced website developer skilled in JavaScript & Python, creating dynamic and responsive web solutions.</p><div className="flex justify-center items-center gap-4 flex-wrap animate-fade-in-up delay-500"><button onClick={() => setPage('Projects')} className="bg-primary hover:bg-primary-hover text-primary-text font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-primary/50 flex items-center gap-2">View My Work <ArrowRight size={20} /></button><button onClick={() => setPage('Contact')} className="bg-ui-button text-text-primary font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-primary/30">Get In Touch</button></div></div></div>);
const About = () => { const skills = ['JavaScript', 'React', 'Python', 'Django', 'Flutter', 'WordPress', 'Shopify', 'Tailwind CSS']; const timeline = [{title: "Python Internship", company: "Giants Solution", description: "Focused on data-related tasks, including data cleaning, processing, and automation scripting with Python."}, {title: "Flutter Development", company: "Self-learning", description: "Embarked on a self-taught journey into mobile development with Flutter, building apps to grasp cross-platform principles."}, {title: "CMS & E-commerce", company: "Freelance", description: "Developed and customized websites using WordPress and Shopify, from themes and plugins to store management."}]; return (<div className="bg-ui-background text-text-primary py-20 px-4 sm:px-6 lg:px-8 w-full h-full overflow-y-auto"><div className="container mx-auto"><h2 className="text-4xl font-bold text-center mb-16">About Me</h2><div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mb-20"><div className="lg:col-span-1 flex justify-center"><img className="rounded-full h-64 w-64 object-cover shadow-2xl border-4 border-primary" src="https://placehold.co/256x256/7E3AF2/FFFFFF?text=MSH" alt="M Saad Hussain"/></div><div className="lg:col-span-2"><p className="text-lg text-text-secondary mb-6">I'm a passionate developer with a diverse skill set spanning web and mobile development. My journey in tech started with an internship where I honed my Python skills on data-centric projects. Driven by curiosity, I explored mobile development with Flutter and gained proficiency in building e-commerce solutions with WordPress and Shopify. I thrive on learning new technologies and applying them to solve real-world problems.</p><h3 className="text-2xl font-semibold mb-4">Key Skills</h3><div className="flex flex-wrap gap-3">{skills.map((skill, i) => (<span key={skill} className="bg-primary-light text-primary-text-alt text-sm font-medium px-4 py-2 rounded-full transform hover:scale-110 transition-transform" style={{animationDelay: `${i*50}ms`}}>{skill}</span>))}</div></div></div><div><h3 className="text-3xl font-bold text-center mb-12">My Journey</h3><div className="relative border-l-4 border-primary ml-6">{timeline.map((item, index) => (<div key={index} className="mb-12 ml-10 transition-all duration-300 hover:bg-ui-card-hover p-4 rounded-lg glass-ui-card"><span className="absolute flex items-center justify-center w-10 h-10 bg-primary-light rounded-full -left-5 ring-8 ring-ui-background"><Code className="w-5 h-5 text-primary" /></span><h4 className="flex items-center mb-1 text-xl font-semibold">{item.title} <span className="text-sm font-medium ml-3 text-text-secondary">@ {item.company}</span></h4><p className="text-base font-normal text-text-secondary">{item.description}</p></div>))}</div></div></div></div>);};
const Projects = () => { const [repos, setRepos] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(null); useEffect(() => { const fetchRepos = async () => { try { setLoading(true); const response = await fetch(GITHUB_API_URL); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); const data = await response.json(); setRepos(data.filter(repo => !repo.fork)); } catch (e) { setError(e.message); } finally { setLoading(false); } }; fetchRepos(); }, []); const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); if (loading) return <div className="w-full h-full flex flex-col justify-center items-center bg-ui-background"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div><p className="mt-4 text-text-secondary">Fetching GitHub Repositories...</p></div>; if (error) return <div className="w-full h-full flex flex-col justify-center items-center bg-red-900/20"><p className="text-red-300">Error: {error}</p></div>; return (<div className="bg-ui-background py-20 px-4 sm:px-6 lg:px-8 w-full h-full overflow-y-auto"><div className="container mx-auto"><h2 className="text-4xl font-bold text-center text-text-primary mb-12">My Projects</h2><p className="text-center text-lg text-text-secondary mb-16 max-w-2xl mx-auto">Here are some of my public projects from GitHub, showcasing my work across various technologies.</p><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{repos.map((repo) => (<div key={repo.id} className="bg-ui-card rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group flex flex-col glass-ui-card"><div className="p-6 flex-grow"><h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">{repo.name}</h3><p className="text-text-secondary text-sm mb-4 h-20 overflow-auto">{repo.description || 'No description provided.'}</p><div className="flex items-center justify-between text-sm text-text-secondary"><span className="flex items-center gap-1.5"><Code size={16} className="text-primary" /> {repo.language || 'N/A'}</span><span className="flex items-center gap-1.5"><Star size={16} className="text-yellow-500" /> {repo.stargazers_count}</span></div></div><div className="px-6 py-4 bg-ui-header-accent flex justify-between items-center"><span className="text-xs text-text-secondary">Updated: {formatDate(repo.updated_at)}</span><a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-primary-hover text-primary-text font-semibold px-4 py-2 rounded-full transition-all transform group-hover:scale-105 text-xs">View on GitHub</a></div></div>))}</div></div></div>);};
const EcommerceDemo = ({ onClose }) => { const [cart, setCart] = useState([]); const [page, setPage] = useState('products'); const products = [{ id: 1, name: 'Quantum Hoodie', price: 59.99, image: 'https://placehold.co/400x400/7E3AF2/FFFFFF?text=Hoodie' }, { id: 2, name: 'Nebula T-Shirt', price: 24.99, image: 'https://placehold.co/400x400/7E3AF2/FFFFFF?text=T-Shirt' }, { id: 3, name: 'Galaxy Cap', price: 19.99, image: 'https://placehold.co/400x400/7E3AF2/FFFFFF?text=Cap' }, { id: 4, name: 'Starlight Sneakers', price: 89.99, image: 'https://placehold.co/400x400/7E3AF2/FFFFFF?text=Sneakers' },]; const updateQuantity = (productId, amount) => { setCart(cart.map(item => item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item).filter(item => item.quantity > 0)); }; const addToCart = (product) => { const existing = cart.find(item => item.id === product.id); if (existing) { updateQuantity(product.id, 1); } else { setCart([...cart, { ...product, quantity: 1 }]); } }; const removeFromCart = (productId) => { setCart(cart.filter(item => item.id !== productId)); }; const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); const PageContent = () => { switch(page) { case 'products': return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{products.map(product => (<div key={product.id} className="bg-ui-card rounded-lg p-4 flex flex-col items-center text-center transition-transform transform hover:scale-105 glass-ui-card"><img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-4"/><h3 className="text-lg font-semibold text-text-primary">{product.name}</h3><p className="text-primary font-bold my-2">${product.price}</p><button onClick={() => addToCart(product)} className="bg-primary text-primary-text px-4 py-2 rounded-lg hover:bg-primary-hover w-full mt-auto">Add to Cart</button></div>))}</div>); case 'cart': return (<div className="space-y-4"><h2 className="text-3xl font-bold text-text-primary mb-6">Your Cart</h2>{cart.length === 0 ? <p className="text-text-secondary">Your cart is empty. Go add some products!</p> : (<div className="space-y-4">{cart.map(item => (<div key={item.id} className="flex items-center justify-between bg-ui-card p-4 rounded-lg glass-ui-card"><div className="flex items-center gap-4"><img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover"/><div><h4 className="font-semibold text-text-primary">{item.name}</h4><p className="text-sm text-text-secondary">${item.price}</p></div></div><div className="flex items-center gap-4"><div className="flex items-center gap-2 bg-ui-header-accent p-1 rounded-md"><button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-text-primary"><Minus size={16}/></button><span className="w-8 text-center font-bold text-text-primary">{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-text-primary"><Plus size={16}/></button></div><button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300"><Trash2 size={20}/></button></div></div>))} <div className="pt-6 border-t border-ui-border flex justify-end items-center"><div className="text-right"><p className="text-2xl font-bold text-text-primary">Total: ${total.toFixed(2)}</p><button className="mt-4 bg-primary py-3 px-8 rounded-lg hover:bg-primary-hover text-primary-text">Proceed to Checkout</button></div></div></div>)}</div>); default: return <div className="text-center text-text-secondary"><h2 className="text-2xl font-bold text-text-primary mb-4">Coming Soon!</h2><p>This section is under construction.</p></div>; } }; const NavLink = ({ icon, label, pageName }) => (<button onClick={() => setPage(pageName)} className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-colors ${page === pageName ? 'bg-primary text-primary-text' : 'text-text-primary hover:bg-ui-card'}`}>{icon}<span>{label}</span></button>); return (<div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center animate-fade-in"><div className="bg-ui-card-deep rounded-2xl shadow-2xl w-[90vw] h-[90vh] flex overflow-hidden glass-ui"><aside className="w-64 bg-ui-sidebar p-4 flex-col flex text-text-primary"><div className="flex items-center gap-3 mb-8"><Code size={28} className="text-primary" /><h2 className="text-xl font-bold">Store Demo</h2></div><nav className="space-y-2"><NavLink icon={<HomeIcon size={20}/>} label="Products" pageName="products"/><NavLink icon={<List size={20}/>} label="Categories" pageName="categories"/><NavLink icon={<Package size={20}/>} label="My Orders" pageName="orders"/></nav><button onClick={onClose} className="mt-auto w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-800/50 bg-ui-card-deep/50 text-text-primary"><X size={20}/> Exit Demo</button></aside><div className="flex-1 flex flex-col"><header className="flex items-center justify-end p-4 border-b border-ui-border flex-shrink-0"><button onClick={() => setPage('cart')} className="relative p-2 rounded-full hover:bg-ui-header-accent text-text-primary"><ShoppingCart />{totalItems > 0 && <span className="absolute -top-2 -right-2 bg-primary text-primary-text text-xs rounded-full h-5 w-5 flex items-center justify-center">{totalItems}</span>}</button></header><main className="flex-grow p-6 overflow-y-auto text-text-primary"><PageContent /></main></div></div></div>); };
const BlogDemo = ({ onClose }) => { const [posts] = useState([ { id: 1, title: 'Building a Portfolio with React', author: 'M Saad Hussain', date: '2025-06-20', content: 'In this article, we explore the step-by-step process of creating a dynamic personal portfolio using React, Tailwind CSS, and Three.js for stunning 3D animations. We cover component structure, state management, and fetching data from APIs. The result is a fast, modern, and visually appealing web application that you can use to showcase your skills to potential employers.' }, { id: 2, title: 'The Power of Interactive Demos', author: 'Jane Doe', date: '2025-06-18', content: 'Static images of projects are a thing of the past. Learn how to engage potential employers and clients by building interactive, in-browser demos of your applications. We will look at modals, isolated component rendering, and creating a seamless user experience that highlights your front-end capabilities.' }, { id: 3, title: 'Python for Data Science', author: 'John Smith', date: '2025-06-15', content: 'Python has become the de facto language for data science, and for good reason. Its simple syntax, powerful libraries like Pandas, NumPy, and Scikit-learn, and vibrant community make it an ideal choice for everything from data cleaning and analysis to machine learning model development. This post serves as a primer for getting started.' }, { id: 4, title: 'A Deep Dive into React State Management', author: 'M Saad Hussain', date: '2025-06-12', content: 'When should you use Context API over Redux? This is a common question for React developers. We will explore the pros and cons of each, looking at boilerplate, performance, and scalability. We will build small example apps to demonstrate the core concepts of both state management solutions.' }, { id: 5, title: 'Getting Started with Flutter', author: 'Emily White', date: '2025-06-10', content: 'Flutter allows you to build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase. This tutorial will guide you through setting up your development environment, creating your first "Hello World" app, and understanding the core principles of widgets and layouts.' }, { id: 6, title: 'Web Performance Optimization 101', author: 'Alex Green', date: '2025-06-05', content: 'A slow website can kill user engagement. In this post, we cover the fundamentals of web performance, including image optimization, code splitting, lazy loading, and caching strategies. Learn how to use browser developer tools to diagnose and fix performance bottlenecks in your applications.' }, ]); const [activePost, setActivePost] = useState(null); if (activePost) { return (<div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center animate-fade-in"><div className="bg-ui-card-deep rounded-2xl shadow-2xl w-[90vw] h-[90vh] flex flex-col overflow-hidden glass-ui-card"><header className="flex items-center justify-between p-4 border-b border-ui-border"><button onClick={() => setActivePost(null)} className="flex items-center gap-2 text-text-primary hover:text-primary"><ArrowLeft size={20} />Back to Posts</button><button onClick={onClose} className="p-2 rounded-full hover:bg-ui-header-accent text-text-primary"><X size={24} /></button></header><main className="p-8 text-text-primary overflow-y-auto"><h1 className="text-4xl font-bold mb-4">{activePost.title}</h1><div className="flex items-center gap-4 text-text-secondary mb-8"><p>By {activePost.author}</p><span>&bull;</span><p>{activePost.date}</p></div><p className="text-lg leading-relaxed">{activePost.content}</p></main></div></div>); } return (<div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center animate-fade-in"><div className="bg-ui-card-deep rounded-2xl shadow-2xl w-[90vw] h-[90vh] flex flex-col overflow-hidden glass-ui-card"><header className="flex items-center justify-between p-4 border-b border-ui-border"><div className="flex items-center gap-3"><Newspaper size={28} className="text-primary" /><h2 className="text-xl font-bold text-text-primary">Blog Platform Demo</h2></div><button onClick={onClose} className="p-2 rounded-full hover:bg-ui-header-accent text-text-primary"><X size={24} /></button></header><main className="p-6 overflow-y-auto space-y-6">{posts.map(post => (<div key={post.id} onClick={() => setActivePost(post)} className="bg-ui-card p-6 rounded-lg cursor-pointer hover:bg-ui-header-accent transition-colors"><h3 className="text-2xl font-bold text-text-primary mb-2">{post.title}</h3><p className="text-text-secondary">By {post.author} on {post.date}</p></div>))}</main></div></div>); };
const DashboardDemo = ({ onClose }) => { const kpiData = [{ title: 'Total Users', value: '1,425', change: '+12.5%' }, { title: 'Revenue', value: '$23,890', change: '+8.1%' }, { title: 'Engagement', value: '64.8%', change: '-2.3%' },]; const userTrendData = [ { name: 'Jan', users: 400 }, { name: 'Feb', users: 300 }, { name: 'Mar', users: 500 }, { name: 'Apr', users: 450 }, { name: 'May', users: 600 }, { name: 'Jun', users: 800 }, ]; const trafficSourceData = [ { source: 'Google', value: 45 }, { source: 'Facebook', value: 25 }, { source: 'Direct', value: 20 }, { source: 'Other', value: 10 }, ]; return (<div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center animate-fade-in"><div className="bg-ui-card-deep rounded-2xl shadow-2xl w-[90vw] h-[90vh] flex flex-col overflow-hidden glass-ui-card"><header className="flex items-center justify-between p-4 border-b border-ui-border"><div className="flex items-center gap-3"><LayoutDashboard size={28} className="text-primary" /><h2 className="text-xl font-bold text-text-primary">Dashboard Demo</h2></div><button onClick={onClose} className="p-2 rounded-full hover:bg-ui-header-accent text-text-primary"><X size={24} /></button></header><main className="flex-grow p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6">{kpiData.map(kpi => (<div key={kpi.title} className="bg-ui-card p-6 rounded-lg"><h4 className="text-text-secondary text-sm">{kpi.title}</h4><p className="text-3xl font-bold text-text-primary my-2">{kpi.value}</p><p className={`text-sm ${kpi.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{kpi.change}</p></div>))} <div className="lg:col-span-2 bg-ui-card p-6 rounded-lg"><h4 className="text-text-primary font-bold mb-4">User Trends</h4><ResponsiveContainer width="100%" height={300}><LineChart data={userTrendData}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-ui-border)"/><XAxis dataKey="name" stroke="var(--color-text-secondary)"/><YAxis stroke="var(--color-text-secondary)"/><Tooltip contentStyle={{ backgroundColor: 'var(--color-ui-card-deep)' }}/><Legend /><Line type="monotone" dataKey="users" stroke="var(--color-primary)" strokeWidth={2}/></LineChart></ResponsiveContainer></div><div className="lg:col-span-1 bg-ui-card p-6 rounded-lg"><h4 className="text-text-primary font-bold mb-4">Traffic Sources (%)</h4><ResponsiveContainer width="100%" height={300}><BarChart data={trafficSourceData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="var(--color-ui-border)"/><XAxis type="number" stroke="var(--color-text-secondary)"/><YAxis type="category" dataKey="source" stroke="var(--color-text-secondary)" width={80}/><Tooltip contentStyle={{ backgroundColor: 'var(--color-ui-card-deep)' }}/><Bar dataKey="value" fill="var(--color-primary)" /></BarChart></ResponsiveContainer></div></main></div></div>); };
const Demos = () => { const [activeDemo, setActiveDemo] = useState(null); const projectBubbles = [{ id: 'ecommerce', title: 'E-commerce Demo', size: '180px', top: '20%', left: '15%', delay: '0s' }, { id: 'blog', title: 'Blog Platform', size: '150px', top: '60%', left: '30%', delay: '2s' }, { id: 'dashboard', title: 'Data Dashboard', size: '200px', top: '40%', left: '65%', delay: '4s' }]; return ( <div className="bg-ui-background w-full h-full overflow-hidden relative"> <div className="text-center pt-20 z-10 relative"><h2 className="text-4xl font-bold text-text-primary">Interactive Demos</h2><p className="text-lg text-text-secondary mt-4">Click on a bubble to launch a functional demo.</p></div> <div className="absolute inset-0 z-0">{projectBubbles.map(bubble => (<div key={bubble.id} className="absolute rounded-full bg-primary-light flex items-center justify-center text-center p-4 cursor-pointer hover:bg-ui-card-hover transition-all duration-300 animate-float" style={{ width: bubble.size, height: bubble.size, top: bubble.top, left: bubble.left, animationDuration: `${Math.random() * 10 + 15}s`, animationDelay: bubble.delay }} onClick={() => setActiveDemo(bubble.id)}><span className="font-bold text-primary-text-alt text-xl">{bubble.title}</span></div>))}</div> {activeDemo === 'ecommerce' && <EcommerceDemo onClose={() => setActiveDemo(null)} />} {activeDemo === 'blog' && <BlogDemo onClose={() => setActiveDemo(null)} />} {activeDemo === 'dashboard' && <DashboardDemo onClose={() => setActiveDemo(null)} />} </div> ); };
const Resume = () => (<div className="bg-ui-background py-20 px-4 sm:px-6 lg:px-8 w-full h-full overflow-y-auto"><div className="container mx-auto text-center"><h2 className="text-4xl font-bold text-text-primary mb-8">My Resume</h2><p className="text-text-secondary mb-12 max-w-2xl mx-auto">Preview my resume below or download the full PDF for a detailed look at my experience.</p><div className="mb-12"><div className="max-w-4xl mx-auto bg-ui-card p-4 rounded-lg shadow-2xl border border-ui-border glass-ui-card"><img src="https://placehold.co/800x1131/4A5568/E2E8F0?text=Resume+Preview\n(Replace+with+an+image+of+your+resume)" alt="Resume Preview" className="w-full h-auto rounded-md"/></div></div><a href="/path/to/your/resume.pdf" download="M-Saad-Hussain-Resume.pdf" className="inline-flex items-center gap-3 bg-primary hover:bg-primary-hover text-primary-text font-bold py-4 px-10 rounded-lg transition-transform transform hover:scale-105 shadow-lg hover:shadow-primary/50"><Download size={22} />Download PDF</a><p className="text-sm mt-4 text-text-secondary">(Remember to replace the placeholder link)</p></div></div>);
const Contact = () => (<div className="bg-ui-background text-text-primary py-24 px-4 sm:px-6 lg:px-8 w-full h-full flex items-center justify-center"><div className="container mx-auto max-w-3xl text-center"><h2 className="text-4xl font-bold mb-4">Get In Touch</h2><p className="text-lg text-text-secondary mb-12">I'm open to new projects and collaboration. The fastest way to reach me is on WhatsApp.</p><div className="bg-ui-card rounded-lg shadow-xl p-8 max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500 glass-ui-card"><div className="space-y-4"><a href="https://wa.me/923350398828" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg shadow-lg hover:shadow-green-500/50"><WhatsAppIcon />Chat on WhatsApp (+92 335...)</a><a href="https://wa.me/923196999038" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg shadow-lg hover:shadow-green-500/50"><WhatsAppIcon />Chat on WhatsApp (+92 319...)</a></div></div><div className="mt-16"><p className="text-text-secondary mb-6">You can also find me on other platforms:</p><div className="flex justify-center gap-8"><a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-transform transform hover:scale-125"><Github size={32} /></a><a href="https://www.linkedin.com/in/msaadhussain/" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-transform transform hover:scale-125"><Linkedin size={32} /></a></div></div></div></div>);
const Footer = () => (<footer className="bg-ui-header text-text-secondary py-6 px-4 sm:px-6 lg:px-8 glass-ui"><div className="container mx-auto text-center"><p>&copy; {new Date().getFullYear()} M Saad Hussain. All Rights Reserved.</p><p className="text-sm mt-1">Designed & Built with React, Three.js & Tailwind CSS.</p></div></footer>);

function AppWrapper() { return ( <ThemeProvider> <App /> </ThemeProvider> ); }

function App() {
  const [page, setPage] = useState('Home');
  const [prevPageKey, setPrevPageKey] = useState(null);
  const [direction, setDirection] = useState('right');

  const handleSetPage = (newPage) => { if (newPage === page) return; const oldIndex = NAV_LINKS.indexOf(page); const newIndex = NAV_LINKS.indexOf(newPage); setDirection(newIndex > oldIndex ? 'right' : 'left'); setPrevPageKey(page); setPage(newPage); };
  useEffect(() => { if (prevPageKey === null) return; const timer = setTimeout(() => setPrevPageKey(null), 500); return () => clearTimeout(timer); }, [prevPageKey]);

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
    <div className="min-h-screen bg-ui-background font-sans flex flex-col h-screen">
      <style>{`
        :root { --color-primary: #4f46e5; --color-primary-hover: #4338ca; --color-primary-text: #ffffff; --color-primary-text-alt: #c7d2fe; --color-primary-light: rgba(79, 70, 229, 0.1); --color-background: #111827; --color-text-primary: #f9fafb; --color-text-secondary: #9ca3af; --color-ui-header: rgba(17, 24, 39, 0.7); --color-ui-header-accent: #1f2937; --color-ui-card: #1f2937; --color-ui-card-hover: #374151; --color-ui-card-deep: #111827; --color-ui-sidebar: rgba(31, 41, 55, 0.5); --color-ui-border: #374151; --color-ui-button: #374151; }
        html.light { --color-primary: #4f46e5; --color-primary-hover: #4338ca; --color-primary-text: #ffffff; --color-primary-text-alt: #4f46e5; --color-primary-light: #e0e7ff; --color-background: #f9fafb; --color-text-primary: #111827; --color-text-secondary: #4b5563; --color-ui-header: rgba(255, 255, 255, 0.7); --color-ui-header-accent: #e5e7eb; --color-ui-card: #ffffff; --color-ui-card-hover: #f3f4f6; --color-ui-card-deep: #f9fafb; --color-ui-sidebar: rgba(229, 231, 235, 0.5); --color-ui-border: #d1d5db; --color-ui-button: #e5e7eb; }
        html.glass { --color-primary: #818cf8; --color-primary-hover: #6366f1; --color-primary-text: #ffffff; --color-primary-text-alt: #e0e7ff; --color-primary-light: rgba(129, 140, 248, 0.2); --color-background: #111827; --color-text-primary: #ffffff; --color-text-secondary: #d1d5db; --color-ui-header: rgba(17, 24, 39, 0.5); --color-ui-header-accent: rgba(255, 255, 255, 0.1); --color-ui-card: rgba(255, 255, 255, 0.1); --color-ui-card-hover: rgba(255, 255, 255, 0.2); --color-ui-card-deep: rgba(17, 24, 39, 0.5); --color-ui-sidebar: rgba(255, 255, 255, 0.1); --color-ui-border: rgba(255, 255, 255, 0.2); --color-ui-button: rgba(255, 255, 255, 0.1); background-image: linear-gradient(to bottom right, #1e3a8a, #4c1d95); }
        .glass .glass-ui { backdrop-filter: blur(10px); } .glass .glass-ui-card { backdrop-filter: blur(10px); border: 1px solid var(--color-ui-border); }
        html.purple { --color-primary: #8b5cf6; --color-primary-hover: #7c3aed; --color-primary-text: #ffffff; --color-primary-text-alt: #ddd6fe; --color-primary-light: rgba(139, 92, 246, 0.2); --color-background: #2e1065; --color-text-primary: #f5f3ff; --color-text-secondary: #a78bfa; --color-ui-header: rgba(46, 16, 101, 0.7); --color-ui-header-accent: #5b21b6; --color-ui-card: #4c1d95; --color-ui-card-hover: #5b21b6; --color-ui-card-deep: #3b0764; --color-ui-sidebar: rgba(91, 33, 182, 0.5); --color-ui-border: #5b21b6; --color-ui-button: #5b21b6; }
        html.red { --color-primary: #ef4444; --color-primary-hover: #dc2626; --color-primary-text: #ffffff; --color-primary-text-alt: #fecaca; --color-primary-light: rgba(239, 68, 68, 0.2); --color-background: #450a0a; --color-text-primary: #fef2f2; --color-text-secondary: #fca5a5; --color-ui-header: rgba(69, 10, 10, 0.7); --color-ui-header-accent: #991b1b; --color-ui-card: #7f1d1d; --color-ui-card-hover: #991b1b; --color-ui-card-deep: #531010; --color-ui-sidebar: rgba(153, 27, 27, 0.5); --color-ui-border: #991b1b; --color-ui-button: #991b1b; }
        html.green { --color-primary: #22c55e; --color-primary-hover: #16a34a; --color-primary-text: #ffffff; --color-primary-text-alt: #dcfce7; --color-primary-light: rgba(34, 197, 94, 0.2); --color-background: #052e16; --color-text-primary: #f0fdf4; --color-text-secondary: #86efac; --color-ui-header: rgba(5, 46, 22, 0.7); --color-ui-header-accent: #166534; --color-ui-card: #14532d; --color-ui-card-hover: #166534; --color-ui-card-deep: #0d3d21; --color-ui-sidebar: rgba(22, 101, 52, 0.5); --color-ui-border: #166534; --color-ui-button: #166534; }
        html.blue { --color-primary: #3b82f6; --color-primary-hover: #2563eb; --color-primary-text: #ffffff; --color-primary-text-alt: #dbeafe; --color-primary-light: rgba(59, 130, 246, 0.2); --color-background: #0c2447; --color-text-primary: #eff6ff; --color-text-secondary: #93c5fd; --color-ui-header: rgba(12, 36, 71, 0.7); --color-ui-header-accent: #1e40af; --color-ui-card: #1d4ed8; --color-ui-card-hover: #1e40af; --color-ui-card-deep: #193e9a; --color-ui-sidebar: rgba(30, 64, 175, 0.5); --color-ui-border: #1e40af; --color-ui-button: #1e40af; }
        .bg-ui-background { background-color: var(--color-background); } .text-text-primary { color: var(--color-text-primary); } .text-text-secondary { color: var(--color-text-secondary); } .bg-ui-header { background-color: var(--color-ui-header); } .bg-ui-header-accent { background-color: var(--color-ui-header-accent); } .bg-ui-card { background-color: var(--color-ui-card); } .hover\\:bg-ui-card-hover:hover { background-color: var(--color-ui-card-hover); } .bg-ui-card-deep { background-color: var(--color-ui-card-deep); } .bg-ui-sidebar { background-color: var(--color-ui-sidebar); } .border-ui-border { border-color: var(--color-ui-border); } .bg-ui-button { background-color: var(--color-ui-button); } .bg-primary { background-color: var(--color-primary); } .hover\\:bg-primary-hover:hover { background-color: var(--color-primary-hover); } .text-primary-text { color: var(--color-primary-text); } .text-primary-text-alt { color: var(--color-primary-text-alt); } .bg-primary-light { background-color: var(--color-primary-light); } .text-primary { color: var(--color-primary); } .border-primary { border-color: var(--color-primary); } .hover\\:text-primary:hover { color: var(--color-primary); }
        .bg-primary\\/20 { background-color: hsla(var(--color-primary-hsl), 0.2); } .hover\\:bg-primary\\/40:hover { background-color: hsla(var(--color-primary-hsl), 0.4); } .hover\\:shadow-primary\\/50:hover { box-shadow: 0 10px 15px -3px hsla(var(--color-primary-hsl), 0.5), 0 4px 6px -2px hsla(var(--color-primary-hsl), 0.5); } .hover\\:shadow-primary\\/30:hover { box-shadow: 0 10px 15px -3px hsla(var(--color-primary-hsl), 0.3), 0 4px 6px -2px hsla(var(--color-primary-hsl), 0.3); }
        @keyframes fade-in-down { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } } .animate-fade-in-down { animation: fade-in-down 0.6s ease-out forwards; }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .delay-300 { animation-delay: 300ms; } .delay-500 { animation-delay: 500ms; }
        @keyframes slide-out-left { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-100%); opacity: 0; } } .animate-slide-out-left { animation: slide-out-left 0.5s forwards ease-in-out; }
        @keyframes slide-in-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slide-in-right { animation: slide-in-right 0.5s forwards ease-in-out; }
        @keyframes slide-out-right { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } } .animate-slide-out-right { animation: slide-out-right 0.5s forwards ease-in-out; }
        @keyframes slide-in-left { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slide-in-left { animation: slide-in-left 0.5s forwards ease-in-out; }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } } .animate-fade-in { animation: fade-in 0.3s ease-in-out forwards; }
        @keyframes float { 0% { transform: translateY(0px) translateX(0px) rotate(0deg); } 25% { transform: translateY(-20px) translateX(10px) rotate(10deg); } 50% { transform: translateY(10px) translateX(-20px) rotate(-15deg); } 75% { transform: translateY(-15px) translateX(20px) rotate(5deg); } 100% { transform: translateY(0px) translateX(0px) rotate(0deg); } } .animate-float { animation: float 20s ease-in-out infinite; }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; } input[type="color"]::-webkit-color-swatch { border: none; border-radius: 0.25rem; }
      `}</style>
      <Header setPage={handleSetPage} page={page} />
      <main className="relative flex-1 overflow-hidden bg-ui-background">
        <div key={page} className={`absolute w-full h-full ${prevPageKey ? (direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left') : 'animate-fade-in'}`}>{renderPage(page)}</div>
        {prevPageKey && (<div key={prevPageKey} className={`absolute w-full h-full ${direction === 'right' ? 'animate-slide-out-left' : 'animate-slide-out-right'}`}>{renderPage(prevPageKey)}</div>)}
      </main>
      <Footer />
    </div>
  );
}

// Default export the wrapper
export default AppWrapper;
