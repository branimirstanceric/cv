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

  function icon(path){
    const span = document.createElement('span');
    span.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
    return span.firstChild;
  }
  const ICONS = {
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    left: '<path d="M19 12H5M11 6l-6 6 6 6"/>'
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
    if(p.email) out.push(el('a', { class: 'btn primary', href: 'mailto:' + p.email }, 'Email me'));
    if(p.linkedin) out.push(el('a', { class: 'btn', href: p.linkedin, target: '_blank', rel: 'noreferrer' }, 'LinkedIn'));
    if(p.github) out.push(el('a', { class: 'btn', href: p.github, target: '_blank', rel: 'noreferrer' }, 'GitHub'));
    if(p.cv_file) out.push(el('a', { class: 'btn', href: asset(p.cv_file), target: '_blank', rel: 'noreferrer' }, 'CV (PDF)'));
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
