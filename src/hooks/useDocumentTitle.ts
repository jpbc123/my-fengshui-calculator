// src/hooks/useDocumentTitle.ts
import { useEffect } from 'react';

const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const defaultTitle = 'Feng Shui & Beyond';
    const fullTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
    
    document.title = fullTitle;
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = defaultTitle;
    };
  }, [title]);
};

export default useDocumentTitle;