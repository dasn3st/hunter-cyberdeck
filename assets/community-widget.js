(() => {
  if (window.__d4CommunityWidget) return;
  window.__d4CommunityWidget = true;

  const host = location.hostname.toLowerCase();
  const siteKey = host.startsWith('mockup-paint.') ? 'mockup-paint'
    : host.startsWith('hunter-cyberdeck.') ? 'hunter-cyberdeck'
    : host.startsWith('meshtastic.') || host.startsWith('mesh.') || host.startsWith('meshgame.') ? 'meshtastic'
    : host.startsWith('violet-talon.') ? 'violet-talon' : 'd4sn3st';
  const api = 'https://d4sn3st.dev/api/community/shared';
  const english = document.documentElement.lang.toLowerCase().startsWith('en') || new URLSearchParams(location.search).get('lang') === 'en';
  const t = english
    ? { like: 'LIKE', comments: 'COMMENTS', write: 'Write a comment…', send: 'POST', login: 'Sign in with Google to react or comment ↗', empty: 'Start the discussion.', error: 'Community is temporarily unavailable.', saved: 'Comment posted.' }
    : { like: 'LIKE', comments: 'KOMMENTARE', write: 'Schreib einen Kommentar …', send: 'ABSENDEN', login: 'Mit Google anmelden, um zu liken oder zu kommentieren ↗', empty: 'Sei der Erste und starte das Gespräch.', error: 'Die Community ist gerade nicht erreichbar.', saved: 'Kommentar veröffentlicht.' };

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  const currentScript = document.currentScript || document.querySelector('script[data-site-community],script[src$="/community-widget.js"]');
  style.href = new URL('community-widget.css', currentScript?.src || `${location.origin}/community-widget.js`).href;
  document.head.append(style);

  const digest = (value) => {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
    return (hash >>> 0).toString(16).padStart(8, '0').slice(-8) + (Math.imul(hash, 2246822519) >>> 0).toString(16).padStart(8, '0').slice(-4);
  };
  const cleanText = (node) => (node?.innerText || node?.textContent || '').replace(/\s+/g, ' ').trim();
  const excluded = 'header, nav, footer, aside, form, dialog, [role="dialog"], .project-nodes, .community-widget, .community-feedback__actions, [data-community-ignore], #searchOverlay';
  const visible = (node) => node instanceof HTMLElement && !node.closest(excluded) && node.getClientRects().length > 0;
  const currentPageKey = () => location.pathname.replace(/\/{2,}/g, '/').slice(0, 240) || '/';
  const itemFor = (node, kind, index) => {
    if (node.dataset.communityId) return `auto-${digest(`${siteKey}|${currentPageKey()}|named|${node.dataset.communityId}`)}`;
    const heading = cleanText(node.querySelector('h1,h2,h3,h4,figcaption,[data-community-label]'));
    const image = node.querySelector('img');
    const description = cleanText(node.querySelector('p,figcaption,[data-community-label]')) || image?.alt || '';
    const label = `${heading}|${description}|${image?.getAttribute('src') || ''}|${index}`.slice(0, 1400);
    return `auto-${digest(`${siteKey}|${currentPageKey()}|${kind}|${label}`)}`;
  };

  function addTarget(node, index, scope = 'all') {
    if (!(node instanceof HTMLElement) || node.querySelector(':scope > .community-widget') || node.closest('.community-widget')) return;
    node.dataset.communityBound = 'true';
    const label = cleanText(node.querySelector('h1,h2,h3,h4,figcaption,[data-community-label]')) || document.title;
    const pageKey = currentPageKey();
    const itemId = itemFor(node, scope === 'comments' ? 'discussion' : 'content', index);
    const widget = document.createElement('section');
    widget.className = 'community-widget';
    widget.dataset.scope = scope;
    widget.setAttribute('aria-label', english ? `Community for ${label}` : `Community: ${label}`);
    const actions = document.createElement('div');
    actions.className = 'community-widget__actions';
    const likeButton = document.createElement('button');
    likeButton.type = 'button';
    likeButton.className = 'community-widget__button community-widget__like';
    likeButton.setAttribute('aria-pressed', 'false');
    likeButton.setAttribute('aria-label', english ? 'Like' : 'Gefällt mir');
    likeButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg><span class="community-widget__count">0</span>';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'community-widget__button community-widget__toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', english ? 'Read or write comments' : 'Kommentare lesen oder schreiben');
    toggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-3.5-.7L4 20l1.2-3.5A7 7 0 0 1 4 12c0-4.1 3.6-7.5 8-7.5s8 3.1 8 7Z"/></svg><span class="community-widget__count">0</span>';
    actions.append(likeButton, toggle);
    widget.append(actions);
    const dialog = document.createElement('dialog');
    dialog.className = 'community-widget__dialog';
    dialog.id = `community-dialog-${itemId}`;
    dialog.setAttribute('aria-label', english ? `Comments for ${label}` : `Kommentare zu ${label}`);
    toggle.setAttribute('aria-controls', dialog.id);
    toggle.setAttribute('aria-haspopup', 'dialog');
    const dialogHeader = document.createElement('header');
    dialogHeader.className = 'community-widget__dialog-header';
    const dialogTitle = document.createElement('h2');
    dialogTitle.textContent = english ? 'COMMENTS' : 'KOMMENTARE';
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'community-widget__close';
    closeButton.setAttribute('aria-label', english ? 'Close comments' : 'Kommentare schließen');
    closeButton.textContent = '×';
    dialogHeader.append(dialogTitle, closeButton);
    const thread = document.createElement('div');
    thread.className = 'community-widget__thread';
    dialog.append(dialogHeader, thread);
    document.body.append(dialog);
    if (node.matches('a, button')) node.after(widget);
    else node.append(widget);

    let state = { like_count: 0, comment_count: 0, viewer_liked: false, comments: [], authenticated: false };
    let busy = false;
    let localError = '';
    const summaryUrl = () => `${api}?page_key=${encodeURIComponent(pageKey)}&item_id=${encodeURIComponent(itemId)}`;
    const login = () => {
      const next = `${location.origin}${location.pathname}${location.search}${location.hash}`;
      location.assign(`https://d4sn3st.dev/auth/google?next=${encodeURIComponent(next)}`);
    };
    const render = () => {
      likeButton.disabled = busy;
      likeButton.setAttribute('aria-pressed', String(state.viewer_liked));
      likeButton.classList.toggle('is-active', state.viewer_liked);
      likeButton.querySelector('.community-widget__count').textContent = String(state.like_count ?? 0);
      toggle.querySelector('.community-widget__count').textContent = String(state.comment_count ?? 0);
      thread.replaceChildren();
      const list = document.createElement('div');
      list.className = 'community-widget__list';
      if (!state.comments?.length) {
        const empty = document.createElement('p'); empty.className = 'community-widget__empty'; empty.textContent = t.empty; list.append(empty);
      } else {
        state.comments.forEach((comment) => {
          const entry = document.createElement('article'); entry.className = 'community-widget__comment';
          const author = document.createElement('strong'); author.textContent = comment.author;
          const date = document.createElement('time'); date.dateTime = comment.created_at;
          date.textContent = new Intl.DateTimeFormat(english ? 'en-GB' : 'de-DE', { dateStyle: 'medium' }).format(new Date(comment.created_at));
          const content = document.createElement('p'); content.textContent = comment.body;
          entry.append(author, date, content); list.append(entry);
        });
      }
      thread.append(list);
      if (state.authenticated) {
        const form = document.createElement('form'); form.className = 'community-widget__form';
        const input = document.createElement('textarea'); input.name = 'comment'; input.maxLength = 1200; input.required = true; input.minLength = 2; input.placeholder = t.write; input.setAttribute('aria-label', t.write);
        const send = document.createElement('button'); send.type = 'submit'; send.textContent = busy ? '…' : t.send; send.disabled = busy;
        form.append(input, send);
        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          const comment = input.value.trim();
          if (comment.length < 2 || busy) return;
          await update('comment', comment);
        });
        thread.append(form);
      } else {
        const signIn = document.createElement('a'); signIn.className = 'community-widget__login'; signIn.href = '#google-login'; signIn.textContent = t.login;
        signIn.addEventListener('click', (event) => { event.preventDefault(); login(); });
        thread.append(signIn);
      }
      if (localError) {
        const note = document.createElement('p'); note.className = 'community-widget__error'; note.textContent = localError; thread.append(note);
      }
    };
    async function load() {
      try {
        const response = await fetch(summaryUrl(), { credentials: 'include', cache: 'no-store' });
        if (!response.ok) throw new Error('LOAD_FAILED');
        state = { ...state, ...await response.json() };
        widget.hidden = false;
        render();
      } catch {
        widget.hidden = true;
      }
    }
    async function update(action, comment) {
      if (!state.authenticated) { login(); return; }
      busy = true; localError = ''; render();
      try {
        const response = await fetch(api, {
          method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page_key: pageKey, item_id: itemId, action, comment }),
        });
        if (response.status === 401) { login(); return; }
        if (!response.ok) throw new Error('UPDATE_FAILED');
        state = { ...state, ...await response.json() };
        render();
      } catch {
        localError = t.error;
      } finally { busy = false; render(); }
    }
    toggle.addEventListener('click', () => {
      if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
      toggle.setAttribute('aria-expanded', 'true');
    });
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => toggle.setAttribute('aria-expanded', 'false'));
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    likeButton.addEventListener('click', () => void update(state.viewer_liked ? 'unlike' : 'like'));
    widget.hidden = true;
    void load();
  }

  const root = document.querySelector('main:not(#menu)') || document.querySelector('#main') || document.querySelector('main') || document.body;
  const targets = [];
  const add = (node, kind) => { if (node instanceof HTMLElement && !targets.includes(node)) targets.push(node); };
  root.querySelectorAll('[data-community-scope]').forEach((node) => add(node, node.dataset.communityScope || 'all'));
  root.querySelectorAll('[data-community-item], figure').forEach((node) => {
    if (node.matches('figure') && !node.querySelector('figcaption') && (node.querySelector('img')?.alt || '').trim().length < 12) return;
    add(node, 'all');
  });
  root.querySelectorAll('img').forEach((image) => {
    if (!visible(image)) return;
    let candidate = image.closest('figure, article');
    if (!candidate) {
      let parent = image.parentElement;
      for (let depth = 0; parent && depth < 5 && parent !== root; depth += 1, parent = parent.parentElement) {
        if (parent.matches('section, main, #main')) break;
        const text = cleanText(parent);
        if (text.length >= 80 && parent.querySelector('h2,h3,h4') && !parent.closest(excluded)) { candidate = parent; break; }
      }
    }
    if (candidate && candidate.querySelector('img') && (cleanText(candidate).length >= 40 || image.alt.trim().length >= 12)) add(candidate, 'all');
  });
  root.querySelectorAll('article, section').forEach((node) => {
    if (!visible(node) || node.matches('main, #main, .community-feedback')) return;
    if (node.querySelector('.community-widget, figure, article, [data-community-item]')) return;
    const text = cleanText(node);
    if (text.length >= 180 && node.querySelector('h1,h2,h3,h4')) add(node, 'all');
  });

  // The canvas game has one stable title menu instead of normal article sections.
  const gameMenu = document.querySelector('#menu .menu-inner');
  const menuList = gameMenu?.querySelector('.menu-list');
  if (gameMenu && menuList) {
    const gameWidget = document.createElement('div');
    gameWidget.dataset.communityId = 'violet-talon-game';
    gameWidget.dataset.communityLabel = 'Violet Talon';
    gameWidget.setAttribute('data-community-item', '');
    menuList.after(gameWidget);
    add(gameWidget, 'all');
  }

  targets.forEach((node, index) => addTarget(node, index, node.dataset.communityScope === 'comments' ? 'comments' : 'all'));

  const observeRoot = document.querySelector('main:not(#menu)') || document.querySelector('#main');
  if (observeRoot) {
    const observer = new MutationObserver(() => {
      const fresh = [...observeRoot.querySelectorAll('[data-community-item], figure, article, section')]
        .filter((node) => visible(node) && !node.dataset.communityBound && !node.closest('.community-widget'));
      fresh.forEach((node, index) => {
        if (node.matches('figure') || node.hasAttribute('data-community-item') || cleanText(node).length >= 180) addTarget(node, index, node.dataset.communityScope === 'comments' ? 'comments' : 'all');
      });
    });
    observer.observe(observeRoot, { childList: true, subtree: true });
  }
})();
