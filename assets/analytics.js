(() => {
  const consentKey = "d4sn3st.analytics-consent";
  const endpoint = "https://d4sn3st.dev/api/analytics/pageview";
  const sessionKey = "d4sn3st.analytics-session";

  const sendPageview = () => {
    try {
      let sessionId = window.localStorage.getItem(sessionKey);
      if (!sessionId) {
        sessionId = window.crypto && typeof window.crypto.randomUUID === "function"
          ? window.crypto.randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36);
        window.localStorage.setItem(sessionKey, sessionId);
      }
      const payload = JSON.stringify({
        site_key: "hunter",
        path: window.location.pathname + window.location.search,
        referrer: document.referrer,
        session_id: sessionId,
      });
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon && navigator.sendBeacon(endpoint, blob)) return;
      void fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: payload, keepalive: true, credentials: "omit" });
    } catch {
      // Tracking must never interfere with the page.
    }
  };

  const choice = window.localStorage.getItem(consentKey);
  if (choice === "granted") {
    sendPageview();
    return;
  }
  if (choice === "denied") return;

  const panel = document.createElement("aside");
  panel.setAttribute("aria-label", "Datenschutz-Einstellungen");
  panel.style.cssText = "position:fixed;z-index:50;left:20px;right:20px;bottom:20px;display:flex;gap:16px;align-items:center;justify-content:space-between;padding:16px 18px;background:#121515;color:#f0f1ee;border:1px solid #343a3a;font:14px Inter,Arial,sans-serif;box-shadow:0 14px 40px #0008";
  panel.innerHTML = '<div><strong>ANALYTICS // OPTIONAL</strong><p style="margin:6px 0 0;color:#aeb4af">Anonyme Nutzungsdaten helfen uns, den Build Log zu verbessern.</p></div><div style="display:flex;gap:8px;flex-shrink:0"><button type="button" data-consent="denied">Ablehnen</button><button type="button" data-consent="granted">Akzeptieren</button></div>';
  panel.addEventListener("click", (event) => {
    const button = event.target.closest("[data-consent]");
    if (!button) return;
    const value = button.dataset.consent;
    window.localStorage.setItem(consentKey, value);
    panel.remove();
    if (value === "granted") sendPageview();
  });
  document.body.appendChild(panel);
})();
