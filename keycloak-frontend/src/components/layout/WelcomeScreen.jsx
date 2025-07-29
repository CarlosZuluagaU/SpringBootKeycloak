import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import styles from './WelcomeScreen.module.css';

// Componente de icono animado
const AnimatedShieldIcon = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <svg 
      className={`${styles.securityIcon} ${isAnimating ? styles.pulse : ''}`}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      onMouseEnter={() => setIsAnimating(true)}
      onAnimationEnd={() => setIsAnimating(false)}
    >
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <path
        fill="url(#shieldGradient)"
        stroke="#ffffff"
        strokeWidth="0.5"
        d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18L20 6v5.8c0 2.68-1.66 5.19-4 6.38V12h-2v8.18c-2.34-1.19-4-3.7-4-6.38V6l8-2.82z"
      />
      <path
        className={styles.checkmark}
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        d="M7 12l3 3 7-7"
      />
    </svg>
  );
};

// Componente de partículas flotantes
const FloatingParticles = ({ count = 15 }) => {
  const particles = Array.from({ length: count }, (_, i) => {
    const size = Math.random() * 0.5 + 0.3;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * -20;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;

    return (
      <div
        key={i}
        className={styles.particle}
        style={{
          '--size': `${size}rem`,
          '--duration': `${duration}s`,
          '--delay': `${delay}s`,
          '--posX': `${posX}%`,
          '--posY': `${posY}%`,
          '--opacity': Math.random() * 0.3 + 0.1,
        }}
      />
    );
  });

  return <div className={styles.particlesContainer}>{particles}</div>;
};

const WelcomeScreen = () => {
  const { keycloak } = useKeycloak();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.background}>
      <FloatingParticles />
      
      <div className={styles.welcomeCard}>
        <div className={styles.header}>
          <AnimatedShieldIcon />
          <div className={styles.timeBadge}>{currentTime}</div>
        </div>
        
        <h1 className={styles.title}>
          <span className={styles.titleHighlight}>Secure</span> Admin Portal
        </h1>
        
        <p className={styles.subtitle}>
          Enterprise-grade security meets intuitive design. 
          <span className={styles.subtitleHighlight}> Authenticate once</span>, access everything.
        </p>
        
        <div className={styles.featureGrid}>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}></span>
            <span>Role-based Access</span>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}></span>
            <span>Lightning Fast</span>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureIcon}></span>
            <span>Global Availability</span>
          </div>
        </div>
        
        <button
          onClick={() => keycloak.login()}
          className={styles.loginButton}
        >
          <span className={styles.buttonText}>Secure Login</span>
          <span className={styles.buttonArrow}>→</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;