import React, { useEffect } from 'react';

const WIDGET_SCRIPT_ID = 'leadconnector-chat-widget-script';

const Chat = () => {
  useEffect(() => {
    const handleCrossOriginScriptError = (event) => {
      if (event.message === 'Script error.') {
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleCrossOriginScriptError);

    if (window.__leadConnectorWidgetLoaded || document.getElementById(WIDGET_SCRIPT_ID)) {
      return;
    }

    const script = document.createElement('script');
    script.id = WIDGET_SCRIPT_ID;
    script.src = 'https://widgets.leadconnectorhq.com/loader.js';
    script.async = true;
    script.setAttribute(
      'data-resources-url',
      'https://widgets.leadconnectorhq.com/chat-widget/loader.js'
    );
    script.setAttribute('data-widget-id', '6999e50295fbc53b77ac5e85');
    script.onload = () => {
      window.__leadConnectorWidgetLoaded = true;
    };

    document.body.appendChild(script);

    return () => {
      window.removeEventListener('error', handleCrossOriginScriptError);
    };
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-white via-purple-50 to-purple-100">
      {/* Decorative background circles */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl" />

      {/* Main content card */}
      <div className="relative z-10 mx-4 max-w-lg animate-fade-in rounded-2xl bg-white/80 px-8 py-12 text-center shadow-xl backdrop-blur-sm sm:px-12">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
          <svg className="h-8 w-8 text-purple-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </div>

        <h1 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
          Book Your Appointment
        </h1>
        <p className="mb-2 text-base text-gray-600">
          Ready to get started? We're just a message away.
        </p>
        <p className="text-sm text-gray-500">
          Tap the <span className="inline-flex items-center font-semibold text-purple-700">chat icon&nbsp;
            <svg className="inline h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg></span> in
          the bottom‑right corner to schedule instantly.
        </p>
      </div>

      {/* Animated hand-drawn style curved arrow pointing to bottom-right */}
      <div className="pointer-events-none absolute bottom-48 right-40 sm:bottom-60 sm:right-56">
        <svg
          className="h-40 w-40 sm:h-52 sm:w-52 animate-bounce-gentle text-purple-500"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <marker id="arrowEnd" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
              <path d="M0,0 L10,4 L0,8" fill="currentColor" />
            </marker>
          </defs>
          {/* Curved arrow path */}
          <path
            d="M30,20 C60,30 80,80 120,120 C140,140 160,155 180,180"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6 4"
            markerEnd="url(#arrowEnd)"
          />
        </svg>
      </div>

      {/* Small floating label near the arrow tip */}
      <span className="pointer-events-none absolute bottom-40 right-60 sm:bottom-52 sm:right-72 animate-bounce-gentle rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
        Click here ↘
      </span>
    </section>
  );
};

export default Chat;