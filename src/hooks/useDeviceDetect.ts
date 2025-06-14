// hooks/useDeviceDetect.ts
import { useState, useEffect } from 'react';

// Función para obtener las dimensiones solo en el cliente
const getWindowDimensions = () => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }; // Valores por defecto para el servidor
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export function useDeviceDetect() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true); // Default a desktop para evitar FOUC

  useEffect(() => {
    // Esta función solo se ejecuta en el cliente
    const handleResize = () => {
      const { width } = getWindowDimensions();
      setIsMobile(width <= 767);
      setIsTablet(width > 767 && width <= 1024);
      setIsDesktop(width > 1024);
    };

    // Llama al handler una vez al montar para establecer el estado inicial
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // El array vacío asegura que se ejecute solo una vez al montar en el cliente

  return { isMobile, isTablet, isDesktop };
}