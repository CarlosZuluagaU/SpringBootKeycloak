import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import styles from './Header.module.css';

const Header = () => {
  const { keycloak, initialized } = useKeycloak();
  const [currentTime, setCurrentTime] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.headerNav}>
        {/* Logo y Hamburger Menu */}
        <div className={styles.logoContainer}>
          <button 
            className={styles.menuButton}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          
          <div className={styles.logo}>
            <span className={styles.logoText}>Carlos Zuluaga</span>
            <span className={styles.logoSubtext}>Gestión de Usuarios</span>
          </div>
        </div>

        {/* User Info and Navigation */}
        <div className={`${styles.userSection} ${isMenuOpen ? styles.menuOpen : ''}`}>
          {initialized && keycloak.authenticated ? (
            <>
              <div className={styles.userInfo}>
                <div className={styles.timeBadge}>
                  <span className={styles.timeIcon}>🕒</span>
                  {currentTime}
                </div>
                
                <div className={styles.userGreeting}>
                  <span className={styles.welcomeText}>
                    Hola, <strong>{keycloak.tokenParsed?.given_name || keycloak.tokenParsed?.preferred_username || 'Usuario'}</strong>
                  </span>
                  <span className={styles.userRole}>
                    {keycloak.tokenParsed?.roles?.join(', ') || 'Administrador'}
                  </span>
                </div>

                <div className={styles.userAvatar}>
                  {keycloak.tokenParsed?.given_name?.charAt(0) || 'U'}
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  onClick={() => keycloak.accountManagement()}
                  className={styles.profileButton}
                  title="Configuración de cuenta"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M19.4 15C19.2669 14.4662 19.1338 13.9324 19.0007 13.3986C18.8676 12.8649 18.7345 12.3311 18.6014 11.7973C18.5207 11.4602 18.44 11.1231 18.3593 10.786C18.2786 10.4489 18.1979 10.1118 18.1171 9.77468C17.933 9.066 17.7489 8.35731 17.5648 7.64863C17.3807 6.93994 17.1966 6.23126 17.0125 5.52257C16.8284 4.81389 16.6443 4.1052 16.4602 3.39652C16.2761 2.68783 16.092 1.97915 15.9079 1.27046C15.7238 0.561776 15.5397 -0.146913 15.3556 -0.855601L12 1.27046L8.64439 -0.855601C8.46028 -0.146913 8.27617 0.561776 8.09206 1.27046C7.90795 1.97915 7.72384 2.68783 7.53973 3.39652C7.35562 4.1052 7.17151 4.81389 6.9874 5.52257C6.80329 6.23126 6.61918 6.93994 6.43507 7.64863C6.25096 8.35731 6.06685 9.066 5.88274 9.77468C5.80204 10.1118 5.72134 10.4489 5.64064 10.786C5.55994 11.1231 5.47924 11.4602 5.39854 11.7973C5.26544 12.3311 5.13234 12.8649 4.99924 13.3986C4.86614 13.9324 4.73304 14.4662 4.59994 15L12 15H19.4Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M4.60006 15C4.73316 15.5338 4.86626 16.0676 4.99936 16.6014C5.13246 17.1351 5.26556 17.6689 5.39866 18.2027C5.47936 18.5398 5.56006 18.8769 5.64076 19.214C5.72146 19.5511 5.80216 19.8882 5.88286 20.2253C6.06697 20.934 6.25108 21.6427 6.43519 22.3514C6.6193 23.0601 6.80341 23.7687 6.98752 24.4774C7.17163 25.1861 7.35574 25.8948 7.53985 26.6035C7.72396 27.3122 7.90807 28.0209 8.09218 28.7295C8.27629 29.4382 8.4604 30.1469 8.64451 30.8556L12 28.7295L15.3556 30.8556C15.5397 30.1469 15.7238 29.4382 15.9079 28.7295C16.092 28.0209 16.2761 27.3122 16.4602 26.6035C16.6443 25.8948 16.8284 25.1861 17.0125 24.4774C17.1966 23.7687 17.3807 23.0601 17.5648 22.3514C17.7489 21.6427 17.933 20.934 18.1171 20.2253C18.1978 19.8882 18.2785 19.5511 18.3592 19.214C18.4399 18.8769 18.5206 18.5398 18.6013 18.2027C18.7344 17.6689 18.8675 17.1351 19.0006 16.6014C19.1337 16.0676 19.2668 15.5338 19.3999 15H12H4.60006Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
                
                <button
                  onClick={() => keycloak.logout()}
                  className={styles.logoutButton}
                  title="Cerrar sesión"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className={styles.buttonText}>Salir</span>
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => keycloak.login()}
              className={styles.loginButton}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={styles.buttonText}>Iniciar Sesión</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;