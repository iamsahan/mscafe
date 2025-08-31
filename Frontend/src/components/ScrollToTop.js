import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ScrollToTop listens to route changes and scrolls the window to the top.
// If a hash is present (e.g. /page#section), it will attempt to scroll to that element.
const ScrollToTop = ({ children }) => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, try to scroll to the element with that id first
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // smooth feels nicer for anchor navigation
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Otherwise, scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return children;
};

export default ScrollToTop;
