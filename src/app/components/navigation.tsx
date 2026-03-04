import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Menu, X, Phone, Mail, MapPin, Clock } from 'lucide-react';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    if (!isHomePage) {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReserve = () => {
    setMobileOpen(false);
    navigate('/reserve');
  };

  const handlePrivateEvents = () => {
    setMobileOpen(false);
    navigate('/private-events');
    window.scrollTo(0, 0);
  };

  const handleLogoClick = () => {
    setMobileOpen(false);
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const navLinkStyle = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    letterSpacing: '0.12em',
    color: 'rgba(243, 239, 234, 0.7)',
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled || mobileOpen ? 'rgba(24, 37, 34, 0.95)' : 'transparent',
          backdropFilter: scrolled || mobileOpen ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 4px 24px rgba(0, 0, 0, 0.3)' : 'none'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo / Restaurant Name */}
            <button
              onClick={handleLogoClick}
              className="transition-all duration-200 hover:opacity-80"
            >
              <h1
                className="text-2xl md:text-3xl tracking-wide"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontWeight: 300,
                  letterSpacing: '0.08em',
                  color: '#F3EFEA'
                }}
              >
                La Maison Dorée
              </h1>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 lg:gap-12">
              <button
                onClick={handlePrivateEvents}
                className="text-sm uppercase tracking-wider transition-all duration-200"
                style={navLinkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#B68A3A'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(243, 239, 234, 0.7)'; }}
              >
                Wydarzenia
              </button>

              <button
                onClick={() => scrollToSection('menu')}
                className="text-sm uppercase tracking-wider transition-all duration-200"
                style={navLinkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#B68A3A'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(243, 239, 234, 0.7)'; }}
              >
                Menu
              </button>

              <button
                onClick={() => scrollToSection('gallery')}
                className="text-sm uppercase tracking-wider transition-all duration-200"
                style={navLinkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#B68A3A'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(243, 239, 234, 0.7)'; }}
              >
                Galeria
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="text-sm uppercase tracking-wider transition-all duration-200"
                style={navLinkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#B68A3A'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(243, 239, 234, 0.7)'; }}
              >
                Kontakt
              </button>

              {/* Reserve CTA */}
              <button
                onClick={handleReserve}
                className="px-6 py-2.5 rounded-lg transition-all duration-200"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  fontSize: '13px',
                  backgroundColor: '#B68A3A',
                  color: '#1E1A16',
                  boxShadow: '0 4px 16px rgba(182, 138, 58, 0.25)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(182, 138, 58, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(182, 138, 58, 0.25)';
                }}
              >
                REZERWUJ
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg transition-colors duration-200"
              style={{ color: '#F3EFEA' }}
              aria-label={mobileOpen ? 'Zamknij menu' : 'Otwórz menu'}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: 'rgba(10, 18, 15, 0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className="fixed top-20 right-0 bottom-0 z-40 md:hidden w-[85vw] max-w-sm overflow-y-auto transition-transform duration-300 ease-in-out"
        style={{
          backgroundColor: 'rgba(24, 37, 34, 0.98)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(182, 138, 58, 0.15)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div className="flex flex-col px-8 py-8 gap-2">
          {/* Nav links */}
          {[
            { label: 'Strona główna', action: handleLogoClick },
            { label: 'Wydarzenia', action: handlePrivateEvents },
            { label: 'Menu', action: () => scrollToSection('menu') },
            { label: 'Galeria', action: () => scrollToSection('gallery') },
            { label: 'Kontakt', action: () => scrollToSection('contact') },
          ].map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="text-left py-3 text-sm uppercase tracking-wider transition-colors duration-200"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                letterSpacing: '0.12em',
                color: 'rgba(243, 239, 234, 0.7)',
                borderBottom: '1px solid rgba(243, 239, 234, 0.06)',
              }}
            >
              {link.label}
            </button>
          ))}

          {/* Reserve CTA */}
          <button
            onClick={handleReserve}
            className="mt-6 w-full py-3.5 rounded-lg text-sm uppercase tracking-wider transition-all duration-200"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              letterSpacing: '0.08em',
              backgroundColor: '#B68A3A',
              color: '#1E1A16',
              boxShadow: '0 4px 16px rgba(182, 138, 58, 0.25)',
            }}
          >
            ZAREZERWUJ STOLIK
          </button>

          {/* Contact info */}
          <div className="mt-8 pt-6 space-y-4" style={{ borderTop: '1px solid rgba(182, 138, 58, 0.15)' }}>
            <div className="flex items-center gap-3">
              <MapPin size={14} style={{ color: '#B68A3A' }} />
              <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(243, 239, 234, 0.5)' }}>
                ul. Nowy Świat 42, 00-363 Warszawa
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={14} style={{ color: '#B68A3A' }} />
              <a href="tel:+48223456789" className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(243, 239, 234, 0.5)' }}>
                +48 22 345 67 89
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={14} style={{ color: '#B68A3A' }} />
              <a href="mailto:info@lamaisondoree.pl" className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(243, 239, 234, 0.5)' }}>
                info@lamaisondoree.pl
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={14} style={{ color: '#B68A3A' }} />
              <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(243, 239, 234, 0.5)' }}>
                Wt–Sob: 18:00 – 22:30
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}