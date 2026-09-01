import React, { useEffect } from 'react';

const BARK_SCRIPT_SRC =
  'https://www.bark.com/assets/js/frontend-v2/widgets-v2.c7060586f35dc633be850f13499455c9.v2.js';

// The Bark widget script wires its badge rendering to a single `DOMContentLoaded`
// listener and never exposes that bootstrap. In this single-page app that event
// has already fired by the time the badge mounts, so:
//   - first load: append the script, then dispatch a `DOMContentLoaded` so its
//     listener runs (it fetches the seller data and renders the badge).
//   - later mounts (client-side navigation): the anchor is a fresh DOM node but
//     the script's data cache is warm, so calling `Bark.renderBadges()` redraws
//     the badge into it.
const rerenderBadges = (attempts = 20) => {
  const api = window.Bark || window.bark;
  if (api && typeof api.renderBadges === 'function') {
    api.renderBadges();
    return;
  }
  if (attempts > 0) {
    setTimeout(() => rerenderBadges(attempts - 1), 250);
  }
};

const loadBarkWidget = () => {
  if (document.querySelector(`script[src="${BARK_SCRIPT_SRC}"]`)) {
    rerenderBadges();
    return;
  }

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = BARK_SCRIPT_SRC;
  script.async = true;
  script.onload = () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    rerenderBadges();
  };
  document.body.appendChild(script);
};

/**
 * Official Bark "verified Pro" badge for Money Solution Cafe.
 */
const BarkBadge = ({ className = '' }) => {
  useEffect(() => {
    loadBarkWidget();
  }, []);

  return (
    <div className={className}>
      <a
        href="https://www.bark.com/en/us/company/money-solution-cafe/VV1XMk/"
        target="_blank"
        rel="noopener noreferrer"
        className="bark-widget"
        data-type="pro"
        data-id="VV1XMk"
        data-image="medium-gold"
        data-version="3.0"
      >
        Money Solution Cafe
      </a>
    </div>
  );
};

export default BarkBadge;
