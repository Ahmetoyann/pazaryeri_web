import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import './App.css';

// Animasyon Kapsayıcı Bileşenleri
const AnimatedSectionHeader = ({ children }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <div ref={ref} className={`section-header ${inView ? 'animate-slide-up' : 'hidden-for-scroll'}`}>
      {children}
    </div>
  );
};

const AnimatedFeatureCard = ({ children, highlight, delay }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const highlightClass = highlight ? 'highlight-card' : '';
  const animationClasses = inView ? `animate-slide-up ${delay || ''}` : 'hidden-for-scroll';

  return (
    <div ref={ref} className={`feature-card ${highlightClass} ${animationClasses}`}>
      {children}
    </div>
  );
};

const AnimatedPill = ({ children, delay }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <div ref={ref} className={`tech-pill ${inView ? `animate-slide-up ${delay || ''}` : 'hidden-for-scroll'}`}>
      {children}
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState('light');
  const [currentImage, setCurrentImage] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Ekran görüntüleri dizisi (Dosya isimlerini ve uzantılarını kendi resimlerinize göre güncelleyebilirsiniz)
  const screenshots = [
    '/pazaryeri_ekran_resimleri/ekran1.jpg', /* Eğer resimleriniz .jpg ise burayı ekran1.jpg olarak değiştirin */
    '/pazaryeri_ekran_resimleri/ekran2.jpg', /* Eğer resimleriniz .jpg ise burayı ekran2.jpg olarak değiştirin */
    '/pazaryeri_ekran_resimleri/ekran3.jpg'  /* Eğer resimleriniz .jpg ise burayı ekran3.jpg olarak değiştirin */
  ];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % screenshots.length);
    }, 3000); // Her 3 saniyede bir görsel değişir
    return () => clearInterval(timer);
  }, [screenshots.length]);

  // Kaydırma (Swipe & Sürükleme) İşlemleri
  const handleTouchStart = (clientX) => {
    setTouchStart(clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (clientX) => {
    setTouchEnd(clientX);
  };

  const handleSwipeEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50; // Sola kaydırma (Sonraki resim)
    const isRightSwipe = distance < -50; // Sağa kaydırma (Önceki resim)

    if (isLeftSwipe) setCurrentImage((prev) => (prev + 1) % screenshots.length);
    if (isRightSwipe) setCurrentImage((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <div className={`App ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      {/* Navbar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="28" height="28"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
          Pazaryeri
        </div>
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li><a href="#musteri" onClick={() => setIsMenuOpen(false)}>Müşteri Paneli</a></li>
          <li><a href="#satici" onClick={() => setIsMenuOpen(false)}>Satıcı Paneli</a></li>
          <li><a href="#ozellikler" onClick={() => setIsMenuOpen(false)}>Genel Özellikler</a></li>
        </ul>
        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Tema Değiştir">
            {theme === 'light' 
              ? <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg> 
              : <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>}
          </button>
          <button className="cta-button">Hemen İndir</button>
        </div>
        <button className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menüyü aç/kapat">
          <div className="line line1"></div>
          <div className="line line2"></div>
          <div className="line line3"></div>
        </button>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="badge animate-slide-up">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.45m.31-.31c.02-.104.04-.208.06-.312m-12.47 5.09 3.92-3.92m5.09-12.47-3.92 3.92" /></svg>
            Yeni Nesil Pazar Deneyimi
          </div>
          <h1 className="animate-slide-up delay-1">
            Pazar Alışverişinin <br /> <span className="gradient-text">En Modern Hali</span>
          </h1>
          <p className="animate-slide-up delay-2">
            Konumunuza en yakın pazarları keşfedin, favori satıcılarınızı takip edin,
            stokları ve doluluk oranlarını anında öğrenin. Alışverişin yeni adresi!
          </p>
          <div className="hero-buttons animate-slide-up delay-3">
            <button className="btn-primary">
              <svg viewBox="0 0 384 512" fill="currentColor" width="20" height="20"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
              App Store
            </button>
            <button className="btn-secondary">
              <svg viewBox="0 0 512 512" fill="currentColor" width="20" height="20"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
              Google Play
            </button>
          </div>
        </div>
        <div className="hero-image animate-float">
          <div className="mockup-phone s24-mockup">
            <div className="s24-camera"></div>
            <div 
              className="mockup-screen"
              onTouchStart={(e) => handleTouchStart(e.targetTouches[0].clientX)}
              onTouchMove={(e) => handleTouchMove(e.targetTouches[0].clientX)}
              onTouchEnd={handleSwipeEnd}
              onMouseDown={(e) => handleTouchStart(e.clientX)}
              onMouseMove={(e) => touchStart !== null && handleTouchMove(e.clientX)}
              onMouseUp={handleSwipeEnd}
              onMouseLeave={handleSwipeEnd}
            >
              {screenshots.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  alt={`Pazaryeri Ekran Görüntüsü ${index + 1}`}
                  className={`mockup-image ${index === currentImage ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
          {/* Slayt Noktaları (Pagination Dots) */}
          <div className="carousel-indicators">
            {screenshots.map((_, index) => (
              <button 
                key={index} 
                className={`dot ${index === currentImage ? 'active' : ''}`}
                onClick={() => setCurrentImage(index)}
                aria-label={`Slayt ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </header>

      {/* Müşteri Paneli Özellikleri */}
      <section id="musteri" className="features-section">
        <AnimatedSectionHeader>
          <h2 className="section-title">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="40" height="40"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
            Müşteri Paneli
          </h2>
          <p className="section-subtitle">Alışverişinizi planlayın ve en iyi pazar deneyimini yaşayın.</p>
        </AnimatedSectionHeader>
        <div className="feature-grid">
          <AnimatedFeatureCard delay="delay-1">
            <div className="feature-icon">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--primary)" width="32" height="32"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            </div>
            <h3>Pazaryeri Keşfi</h3>
            <p>Konuma dayalı en yakın pazarları listeleyin. İl/ilçe bazlı filtreleme yapın ve açık olduğu günleri anında görün.</p>
          </AnimatedFeatureCard>
          <AnimatedFeatureCard delay="delay-2">
            <div className="feature-icon">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--primary)" width="32" height="32"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>
            </div>
            <h3>Etkileşim & Değerlendirme</h3>
            <p>Pazarlara ve ürünlere yorum yapın, puan verin. Satıcılara ürün hakkında soru sorun ve yanıtları takip edin.</p>
          </AnimatedFeatureCard>
          <AnimatedFeatureCard delay="delay-3">
            <div className="feature-icon">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--primary)" width="32" height="32"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
            </div>
            <h3>Favoriler & Arama</h3>
            <p>İstediğiniz pazar ve satıcıyı arayın. Sevdiğiniz ürünleri favorilere ekleyerek alışverişinizi hızlandırın.</p>
          </AnimatedFeatureCard>
          <AnimatedFeatureCard highlight delay="delay-1">
            <div className="feature-icon">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--primary)" width="32" height="32"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
            </div>
            <h3>Canlı Doluluk Oranları</h3>
            <p>Gitmek istediğiniz pazarın anlık doluluk yüzdelerini görüntüleyerek kalabalıktan kaçının.</p>
          </AnimatedFeatureCard>
        </div>
      </section>

      {/* Satıcı Paneli Özellikleri */}
      <section id="satici" className="features-section bg-light">
        <AnimatedSectionHeader>
          <h2 className="section-title">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="40" height="40"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" /></svg>
            Satıcı Paneli
          </h2>
          <p className="section-subtitle">Tezgahınızı dijitale taşıyın, satışlarınızı katlayın.</p>
        </AnimatedSectionHeader>
        <div className="feature-grid">
          <AnimatedFeatureCard delay="delay-1">
            <div className="feature-icon">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--primary)" width="32" height="32"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>
            </div>
            <h3>Gelişmiş Ürün Yönetimi</h3>
            <p>Fotoğraflı ürün ekleyin, fiyat ve stok takibi yapın. Kategori bazlı sistem ile ürünlerinizi kolayca yönetin.</p>
          </AnimatedFeatureCard>
          <AnimatedFeatureCard delay="delay-2">
            <div className="feature-icon">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--primary)" width="32" height="32"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>
            </div>
            <h3>İstatistikler & Analiz</h3>
            <p>Toplam görüntülenme, satış ve gelir takibini grafiksel verilerle detaylı bir şekilde analiz edin.</p>
          </AnimatedFeatureCard>
          <AnimatedFeatureCard delay="delay-3">
            <div className="feature-icon">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--primary)" width="32" height="32"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
            </div>
            <h3>Müşteri İlişkileri</h3>
            <p>Gelen değerlendirmeleri görüntüleyin, soruları anında yanıtlayarak müşteri memnuniyetini artırın.</p>
          </AnimatedFeatureCard>
          <AnimatedFeatureCard delay="delay-1">
            <div className="feature-icon">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--primary)" width="32" height="32"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
            </div>
            <h3>Profil & Tezgah Yönetimi</h3>
            <p>Tezgah adı, çalışma saatleri, pazar yeri seçimi ve sosyal medya hesaplarınızı tek ekrandan düzenleyin.</p>
          </AnimatedFeatureCard>
        </div>
      </section>

      {/* Genel Özellikler */}
      <section id="ozellikler" className="general-features">
        <h2 className="section-title">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="40" height="40"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
          Teknik & Genel Özellikler
        </h2>
        <div className="pill-container">
          <AnimatedPill delay="delay-1">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
            Anlık Bildirim Sistemi (Firebase)
          </AnimatedPill>
          <AnimatedPill delay="delay-2">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18c4.97 0 9-4.03 9-9s-4.03-9-9-9z" /></svg>
            Dark & Light Tema Desteği
          </AnimatedPill>
          <AnimatedPill delay="delay-3">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>
            Türkçe & İngilizce Dil Desteği
          </AnimatedPill>
          <AnimatedPill delay="delay-1">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" /></svg>
            Google Haritalar & Yol Tarifi
          </AnimatedPill>
          <AnimatedPill delay="delay-2">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" /></svg>
            Akıllı Çevrimdışı Bağlantı Kontrolü
          </AnimatedPill>
          <AnimatedPill delay="delay-3">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
            Google ile Güvenli Giriş & Misafir Modu
          </AnimatedPill>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="28" height="28"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
            Pazaryeri
          </div>
          <div className="footer-center">
            <div className="typewriter-wrapper">
              <div className="typewriter-content">
                <span className="ghost-text">Yeni nesil dijital pazar deneyimi.</span>
                <span className="typewriter-text">Yeni nesil dijital pazar deneyimi.</span>
              </div>
            </div>
          </div>
          <div className="social-links">
            <a href="#!">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              Twitter
            </a>
            <a href="#!">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              Instagram
            </a>
            <a href="#!">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Pazaryeri. Tüm hakları saklıdır.</p>
          <a href="/privacy.html" className="privacy-link">Gizlilik Politikası</a>
        </div>
      </footer>
    </div>
  );
}

export default App;