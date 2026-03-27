import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cinematic Scroll to Top on every route transition
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Instant is better for page transitions to avoid flickering
    });
  }, [pathname]);

  return null;
}
