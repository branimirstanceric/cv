// Shared helpers for index.html and case.html
(function(){
  // Theme toggle (initial theme is set inline in <head> to avoid a flash)
  const themeBtn = document.getElementById('theme-btn');
  if(themeBtn){
    themeBtn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch(e) {}
    });
  }

  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  // Small DOM helper: el('div', {class:'x'}, 'text', childNode, ...)
  function el(tag, attrs, ...children){
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if(v !== undefined && v !== null && v !== '') node.setAttribute(k, v);
    });
    children.flat().forEach(c => {
      if(c === undefined || c === null || c === '') return;
      node.append(c instanceof Node ? c : String(c));
    });
    return node;
  }

  // Line icons by default; filled=true for solid brand logos
  function icon(path, filled){
    const span = document.createElement('span');
    const paint = filled
      ? 'fill="currentColor"'
      : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    span.innerHTML = '<svg viewBox="0 0 24 24" ' + paint + ' aria-hidden="true">' + path + '</svg>';
    return span.firstChild;
  }
  const ICONS = {
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    linkedin: '<path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>',
    github: '<path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.82-.26.82-.57v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3"/>'
  };

  // Pages CMS may store media paths with a leading slash; the site lives under /cv/, so keep them relative.
  function asset(path){
    return (path || '').replace(/^\/+/, '');
  }

  function list(value){
    return Array.isArray(value) ? value.filter(Boolean) : [];
  }

  // Pulls the headline number out of a key result, e.g. "Reduced ... by over 70%." -> "70%"
  function statOf(text){
    const m = (text || '').match(/\d+(?:[.,]\d+)?\s?(?:%|x\b)|\d+\+/i);
    return m ? m[0].replace(/\s/g, '') : '';
  }

  function slugify(text){
    return (text || '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // The id used in case.html?id=... ; falls back to the title when "Page link" is empty
  function caseId(c){
    return slugify(c.id) || slugify(c.title);
  }

  function caseUrl(c){
    return 'case.html?id=' + encodeURIComponent(caseId(c));
  }

  function isOngoing(c){
    return /ongoing|present|now/i.test(c.period || '');
  }

  function caseMeta(c){
    return el('div', { class: 'case-meta' },
      c.company ? el('span', { class: 'company' }, c.company) : null,
      c.period ? el('span', {}, c.period) : null,
      isOngoing(c) ? el('span', { class: 'ongoing' }, 'Ongoing') : null
    );
  }

  async function load(path){
    const res = await fetch(path, { cache: 'no-cache' });
    if(!res.ok) throw new Error(path + ': ' + res.status);
    return res.json();
  }

  // Fills every [data-field] element with the matching profile value
  function fillFields(p){
    document.querySelectorAll('[data-field]').forEach(node => {
      const value = p[node.getAttribute('data-field')];
      if(typeof value === 'string') node.textContent = value;
    });
  }

  function contactButtons(p){
    const out = [];
    if(p.email) out.push(el('a', { class: 'btn primary', href: 'mailto:' + p.email }, icon(ICONS.mail), 'Email me'));
    if(p.linkedin) out.push(el('a', { class: 'btn', href: p.linkedin, target: '_blank', rel: 'noreferrer' }, icon(ICONS.linkedin, true), 'LinkedIn'));
    if(p.github) out.push(el('a', { class: 'btn', href: p.github, target: '_blank', rel: 'noreferrer' }, icon(ICONS.github, true), 'GitHub'));
    if(p.cv_file) out.push(el('a', { class: 'btn', href: asset(p.cv_file), target: '_blank', rel: 'noreferrer' }, icon(ICONS.download), 'CV (PDF)'));
    return out;
  }

  function showError(target, err){
    console.error(err);
    const node = document.getElementById(target);
    if(node) node.append(el('div', { class: 'load-error' }, 'This section could not be loaded. Please refresh the page.'));
  }

  window.Site = {
    el, icon, ICONS, asset, list, statOf, caseId, caseUrl, isOngoing, caseMeta,
    load, fillFields, contactButtons, showError
  };
})();
