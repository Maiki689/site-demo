/* Magazinul e. ni. wear: lista de produse cu căutare și filtre, pagina de produs, coșul și comanda pe WhatsApp.
   Produsele vin din produse.js. Coșul și favoritele se țin minte în browserul vizitatorului (localStorage). */
(function () {
  'use strict';
  const P = window.PRODUSE || [], CFG = window.MAGAZIN || {}, CAT = CFG.categorii || {};
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lei = n => n.toLocaleString('ro-RO') + ' lei';
  const fara = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');     // fără diacritice, pentru căutare
  const dupaId = id => P.find(p => p.id === id);
  const link = p => 'produs.html?p=' + encodeURIComponent(p.id);
  const reducere = p => Math.round((1 - p.pret / p.pretVechi) * 100);
  const stoc = (p, marime) => (p.marimi.find(m => m.m === marime) || { stoc: 0 }).stoc;
  const unica = p => p.marimi.length === 1;

  const ICON = {
    inima: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.7a4.2 4.2 0 0 1 7.5 2.5c0 5.7-7.5 10.3-7.5 10.3Z"/></svg>',
    cos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.6-1.2A9 9 0 1 0 12 3Zm0 1.8a7.2 7.2 0 1 1-3.7 13.4l-.4-.2-2.3.6.6-2.2-.3-.4A7.2 7.2 0 0 1 12 4.8Z"/><path d="M9.3 8.3h1.2l.7 1.9-.9.9a6 6 0 0 0 2.6 2.6l.9-.9 1.9.7v1.2a.7.7 0 0 1-.7.7 6.4 6.4 0 0 1-6.4-6.4.7.7 0 0 1 .7-.7Z"/></svg>',
    camion: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    retur: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h11a5 5 0 0 1 0 10H8"/><path d="m8 5-4 4 4 4"/></svg>'
  };

  /* ---------- ce ține minte browserul ---------- */
  const tine = {
    ia(cheie, altfel) { try { return JSON.parse(localStorage.getItem(cheie)) || altfel; } catch (e) { return altfel; } },
    pune(cheie, valoare) { try { localStorage.setItem(cheie, JSON.stringify(valoare)); } catch (e) { /* mod privat: merge și fără */ } }
  };
  let cos = tine.ia('eni-cos', []).filter(r => r && dupaId(r.id) && stoc(dupaId(r.id), r.marime) > 0 && r.buc > 0);
  let favorite = tine.ia('eni-favorite', []).filter(dupaId);

  /* ---------- bucăți de pagină folosite peste tot ---------- */
  function pret(p, clasa) {
    return `<p class="${clasa || 'price'}"><span class="now${p.pretVechi ? ' red' : ''}">${lei(p.pret)}</span>`
      + (p.pretVechi ? `<span class="old">${lei(p.pretVechi)}</span>` : '')
      + (p.pretVechi && clasa ? `<span class="off">−${reducere(p)}%</span>` : '') + '</p>';
  }
  function butonFav(p) {
    const pus = favorite.includes(p.id);
    return `<button class="fav" type="button" data-fav="${p.id}" aria-pressed="${pus}" aria-label="${pus ? 'Scoate de la favorite' : 'Adaugă la favorite'}: ${esc(p.nume)}">${ICON.inima}</button>`;
  }
  function eticheta(p) {
    if (!p.marimi.some(m => m.stoc > 0)) return '<span class="badge out">Stoc epuizat</span>';
    if (p.pretVechi) return `<span class="badge sale">−${reducere(p)}%</span>`;
    return p.nou ? '<span class="badge">Nou</span>' : '';
  }
  function card(p) {
    const libere = p.marimi.filter(m => m.stoc > 0);
    return `<article class="card">
      <div class="card-top">
        <a class="card-media" href="${link(p)}" tabindex="-1" aria-hidden="true"><img src="${p.poza}" alt="" loading="lazy" width="1000" height="1250">${eticheta(p)}</a>
        ${butonFav(p)}
        ${libere.length ? `<button class="quick" type="button" data-rapid="${p.id}" aria-label="Adaugă rapid în coș: ${esc(p.nume)}"><span class="plus-sign" aria-hidden="true">+</span>Adaugă rapid</button>` : ''}
      </div>
      <a class="card-info" href="${link(p)}"><h3>${esc(p.nume)}</h3>${pret(p)}
        <p class="card-meta">${unica(p) ? 'Mărime unică' : libere.map(m => esc(m.m)).join(' · ')}</p></a>
    </article>`;
  }
  function butoaneMarimi(p, aleasa) {
    return p.marimi.map(m => `<button class="size" type="button" role="radio" data-marime="${esc(m.m)}" aria-checked="${m.m === aleasa}"`
      + `${m.stoc ? '' : ' disabled aria-label="' + esc(m.m) + ', stoc epuizat"'}>${esc(m.m)}</button>`).join('');
  }

  /* ---------- coșul, fereastra de mărimi și ghidul: se pun o singură dată în pagină ---------- */
  document.body.insertAdjacentHTML('beforeend', `
    <div class="overlay" data-inchide></div>
    <aside class="drawer" id="cos" role="dialog" aria-modal="true" aria-labelledby="cos-titlu" inert>
      <div class="drawer-head"><h2 class="box-title" id="cos-titlu">Coșul tău <small></small></h2><button class="x" type="button" data-inchide aria-label="Închide coșul">×</button></div>
      <div class="drawer-body"></div>
      <div class="drawer-foot">
        <div class="sum"><span>Total</span><strong></strong></div>
        <p class="sum-note">Trimiți comanda pe WhatsApp, iar magazinul îți confirmă stocul, livrarea și plata.</p>
        <a class="btn-main" data-comanda target="_blank" rel="noopener noreferrer">${ICON.whatsapp} Trimite comanda pe WhatsApp</a>
        <button class="btn-ghost" type="button" data-inchide>Continuă cumpărăturile</button>
      </div>
    </aside>
    <div class="sheet" id="alege" role="dialog" aria-modal="true" aria-label="Alege mărimea" inert></div>
    <div class="sheet wide" id="ghid" role="dialog" aria-modal="true" aria-labelledby="ghid-titlu" inert>
      <div class="sheet-head"><h2 class="box-title" id="ghid-titlu">Ghid de mărimi</h2><button class="x" type="button" data-inchide aria-label="Închide ghidul">×</button></div>
      <table class="size-table">
        <thead><tr><th>Mărime</th><th>EU</th><th>Bust</th><th>Talie</th><th>Șold</th></tr></thead>
        <tbody>
          <tr><td>XS</td><td>34</td><td>80–84</td><td>60–64</td><td>86–90</td></tr>
          <tr><td>S</td><td>36</td><td>84–88</td><td>64–68</td><td>90–94</td></tr>
          <tr><td>M</td><td>38</td><td>88–92</td><td>68–72</td><td>94–98</td></tr>
          <tr><td>L</td><td>40</td><td>92–96</td><td>72–76</td><td>98–102</td></tr>
          <tr><td>XL</td><td>42</td><td>96–102</td><td>76–82</td><td>102–108</td></tr>
        </tbody>
      </table>
      <p class="guide-note">Măsurile sunt în centimetri și se iau pe corp. Ești între două mărimi? Scrie-ne pe WhatsApp și te ajutăm să alegi.</p>
    </div>
    <div class="toast" role="status" aria-live="polite"></div>`);
  const fundal = $('.overlay'), sertar = $('#cos'), foaie = $('#alege'), ghid = $('#ghid'), mesaj = $('.toast');

  let deschisa = null, inapoiLa = null, ceasMesaj;
  function deschide(fereastra) {
    if (deschisa && deschisa !== fereastra) { deschisa.classList.remove('open'); deschisa.inert = true; }
    else if (!deschisa) inapoiLa = document.activeElement;
    deschisa = fereastra;
    fereastra.inert = false;
    fereastra.classList.add('open');
    fundal.classList.add('open');
    document.body.classList.add('no-scroll');
    const primul = $('[data-focus]', fereastra) || $('button:not(:disabled), a[href]', fereastra);
    if (primul) primul.focus({ preventScroll: true });
  }
  function inchide() {
    if (!deschisa) return;
    deschisa.classList.remove('open');
    deschisa.inert = true;
    deschisa = null;
    fundal.classList.remove('open');
    document.body.classList.remove('no-scroll');
    if (inapoiLa && document.contains(inapoiLa)) inapoiLa.focus({ preventScroll: true });
    inapoiLa = null;
  }
  function spune(text) {
    mesaj.textContent = text;
    mesaj.classList.add('show');
    clearTimeout(ceasMesaj);
    ceasMesaj = setTimeout(() => mesaj.classList.remove('show'), 2600);
  }

  /* ---------- coșul ---------- */
  function deseneazaCos(cuSalt) {
    const bucati = cos.reduce((s, r) => s + r.buc, 0), total = cos.reduce((s, r) => s + dupaId(r.id).pret * r.buc, 0);
    $$('.cart-count').forEach(n => {
      n.textContent = bucati;
      n.hidden = !bucati;
      if (cuSalt) { n.classList.remove('bump'); void n.offsetWidth; n.classList.add('bump'); }
    });
    $$('[data-cos]').forEach(b => b.setAttribute('aria-label', bucati ? `Deschide coșul (${bucati} ${bucati === 1 ? 'produs' : 'produse'})` : 'Deschide coșul (gol)'));
    $('#cos-titlu small').textContent = bucati ? `· ${bucati} ${bucati === 1 ? 'produs' : 'produse'}` : '';
    $('.drawer-foot', sertar).hidden = !bucati;
    $('.sum strong', sertar).textContent = lei(total);
    $('.drawer-body', sertar).innerHTML = !bucati
      ? `<div class="cart-empty">${ICON.cos}<strong>Coșul tău e gol</strong><span>Alege o piesă care îți place și o găsești aici.</span></div>`
      : cos.map((r, i) => {
        const p = dupaId(r.id);
        return `<div class="line">
          <a class="line-photo" href="${link(p)}" tabindex="-1" aria-hidden="true"><img src="${p.poza}" alt=""></a>
          <div>
            <div class="line-top"><a class="line-name" href="${link(p)}">${esc(p.nume)}</a><span class="line-price">${lei(p.pret * r.buc)}</span></div>
            <p class="line-meta">${esc(p.culoare.nume)} · ${unica(p) ? 'Mărime unică' : 'Mărimea ' + esc(r.marime)}</p>
            <div class="line-bottom">
              <div class="qty"><button type="button" data-minus="${i}" aria-label="O bucată mai puțin">−</button><span>${r.buc}</span><button type="button" data-plus="${i}" aria-label="Încă o bucată"${r.buc >= stoc(p, r.marime) ? ' disabled' : ''}>+</button></div>
              <button class="remove" type="button" data-scoate="${i}">Șterge</button>
            </div>
          </div>
        </div>`;
      }).join('');
    const randuri = cos.map(r => {
      const p = dupaId(r.id);
      return `• ${p.nume}${unica(p) ? '' : ' – mărimea ' + r.marime} – ${r.buc} buc. – ${lei(p.pret * r.buc)}`;
    });
    const text = ['Bună ziua! Aș dori să comand de pe site:', ...randuri, 'Total: ' + lei(total)]
      .concat(CFG.demo ? ['(comandă de probă, din modelul de site)'] : []).join('\n');
    $('[data-comanda]', sertar).href = 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(text);
    tine.pune('eni-cos', cos);
  }
  function adaugaInCos(id, marime) {
    const p = dupaId(id), rand = cos.find(r => r.id === id && r.marime === marime);
    if (!p || stoc(p, marime) < 1) return;
    if (rand && rand.buc >= stoc(p, marime)) spune('Ai deja în coș toate bucățile disponibile la mărimea asta.');
    else if (rand) rand.buc += 1;
    else cos.push({ id, marime, buc: 1 });
    deseneazaCos(true);
    deschide(sertar);
  }

  /* ---------- „Adaugă rapid”: alegi mărimea fără să intri pe produs ---------- */
  function alegeMarime(p) {
    if (unica(p)) return adaugaInCos(p.id, p.marimi[0].m);
    foaie.innerHTML = `
      <div class="sheet-head"><h2 class="box-title">Alege mărimea</h2><button class="x" type="button" data-inchide aria-label="Închide">×</button></div>
      <div class="pick"><div class="pick-photo"><img src="${p.poza}" alt=""></div><div><p class="pick-name">${esc(p.nume)}</p>${pret(p)}</div></div>
      <div class="pdp-row"><span class="label">Mărime</span><button class="link-btn" type="button" data-ghid>Ghid de mărimi</button></div>
      <div class="sizes" role="radiogroup" aria-label="Mărime" data-pentru="${p.id}">${butoaneMarimi(p)}</div>
      <a class="btn-ghost" href="${link(p)}" style="text-align:center">Vezi toate detaliile</a>`;
    deschide(foaie);
  }

  /* ---------- clicuri, oriunde în pagină ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-cos],[data-inchide],[data-fav],[data-rapid],[data-ghid],[data-minus],[data-plus],[data-scoate],#alege [data-marime]');
    if (!t) return;
    if (t.matches('[data-cos]')) deschide(sertar);
    else if (t.matches('[data-inchide]')) inchide();
    else if (t.matches('[data-ghid]')) deschide(ghid);
    else if (t.matches('[data-rapid]')) alegeMarime(dupaId(t.dataset.rapid));
    else if (t.matches('#alege [data-marime]')) adaugaInCos(t.parentNode.dataset.pentru, t.dataset.marime);
    else if (t.matches('[data-fav]')) {
      const id = t.dataset.fav, pus = !favorite.includes(id);
      favorite = pus ? favorite.concat(id) : favorite.filter(f => f !== id);
      tine.pune('eni-favorite', favorite);
      $$(`[data-fav="${id}"]`).forEach(b => {
        b.setAttribute('aria-pressed', pus);
        b.setAttribute('aria-label', (pus ? 'Scoate de la favorite' : 'Adaugă la favorite') + ': ' + dupaId(id).nume);
      });
      spune(pus ? 'Adăugat la favorite.' : 'Scos de la favorite.');
      document.dispatchEvent(new CustomEvent('favorite-schimbate'));
    } else {
      const i = Number(t.dataset.minus || t.dataset.plus || t.dataset.scoate);
      if (t.matches('[data-plus]')) cos[i].buc += 1;
      else if (t.matches('[data-minus]') && cos[i].buc > 1) cos[i].buc -= 1;
      else cos.splice(i, 1);
      deseneazaCos();
      const ramas = $(`[data-${t.matches('[data-plus]') ? 'plus' : 'minus'}="${i}"]:not(:disabled)`, sertar) || $('.x', sertar);
      ramas.focus({ preventScroll: true });
    }
  });
  document.addEventListener('keydown', e => {
    if (!deschisa) return;
    if (e.key === 'Escape') { e.stopPropagation(); return inchide(); }
    if (e.key !== 'Tab') return;      // Tab rămâne în fereastra deschisă
    const lista = $$('button:not(:disabled), a[href], input, select', deschisa).filter(n => n.offsetParent !== null);
    if (!lista.length) return;
    const primul = lista[0], ultimul = lista[lista.length - 1];
    if (e.shiftKey && document.activeElement === primul) { e.preventDefault(); ultimul.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimul) { e.preventDefault(); primul.focus(); }
  }, true);
  deseneazaCos();

  /* ---------- prima pagină: noutățile ---------- */
  const sir = $('#noutati');
  if (sir) {
    sir.innerHTML = P.filter(p => p.nou).map(card).join('');
    const inapoi = $('[data-sir="inapoi"]'), inainte = $('[data-sir="inainte"]');
    const stare = () => {
      inapoi.disabled = sir.scrollLeft < 8;
      inainte.disabled = sir.scrollLeft + sir.clientWidth > sir.scrollWidth - 8;
    };
    inapoi.addEventListener('click', () => sir.scrollBy({ left: -sir.clientWidth * 0.8, behavior: 'smooth' }));
    inainte.addEventListener('click', () => sir.scrollBy({ left: sir.clientWidth * 0.8, behavior: 'smooth' }));
    sir.addEventListener('scroll', stare, { passive: true });
    window.addEventListener('resize', stare);
    stare();
  }

  /* ---------- prima pagină: toată colecția, cu căutare, filtre și sortare ---------- */
  const grila = $('#grila');
  if (grila) {
    const camp = $('#cauta'), sterge = $('.search .clear'), ordine = $('#ordine'), filtre = $('#filtre'), numar = $('#cate');
    const cerut = new URLSearchParams(location.search).get('cat');
    const st = { text: '', filtru: CAT[cerut] ? cerut : 'toate', ordine: 'recomandate' };
    const FILTRE = [['toate', 'Toate', () => true], ['nou', 'Noutăți', p => p.nou]]
      .concat(Object.keys(CAT).map(c => [c, CAT[c], p => p.categorie === c]))
      .concat([['reduceri', 'Reduceri', p => p.pretVechi], ['favorite', '♥ Favorite', p => favorite.includes(p.id)]]);
    const potrivite = () => {
      const cuvinte = fara(st.text).split(/\s+/).filter(Boolean), trece = FILTRE.find(f => f[0] === st.filtru)[2];
      const lista = P.filter(p => trece(p) && cuvinte.every(c => fara([p.nume, CAT[p.categorie], p.culoare.nume, p.colectie, p.pe_scurt].join(' ')).includes(c)));
      if (st.ordine === 'pret-cresc') lista.sort((a, b) => a.pret - b.pret);
      else if (st.ordine === 'pret-desc') lista.sort((a, b) => b.pret - a.pret);
      else if (st.ordine === 'nume') lista.sort((a, b) => a.nume.localeCompare(b.nume, 'ro'));
      return lista;
    };
    const deseneaza = () => {
      filtre.innerHTML = FILTRE.map(f => `<button class="chip" type="button" data-filtru="${f[0]}" aria-pressed="${f[0] === st.filtru}">${f[1]} <small>${P.filter(f[2]).length}</small></button>`).join('');
      const lista = potrivite(), cuFiltre = st.text || st.filtru !== 'toate';
      numar.innerHTML = `<span>${lista.length} ${lista.length === 1 ? 'produs' : 'produse'}${st.text ? ' pentru „' + esc(st.text) + '”' : ''}</span>`
        + (cuFiltre ? '<button class="link-btn" type="button" data-reset>Arată tot</button>' : '');
      sterge.hidden = !st.text;
      grila.innerHTML = lista.length ? lista.map(card).join('')
        : `<div class="empty"><strong>Nu am găsit nimic${st.text ? ' pentru „' + esc(st.text) + '”' : ' aici'}</strong>`
          + `<span>${st.filtru === 'favorite' && !st.text ? 'Apasă pe inimioara unui produs și îl găsești aici.' : 'Încearcă alt cuvânt sau altă categorie.'}</span><br><button type="button" data-reset>Arată toate produsele</button></div>`;
    };
    camp.addEventListener('input', () => { st.text = camp.value.trim(); deseneaza(); });
    sterge.addEventListener('click', () => { camp.value = st.text = ''; deseneaza(); camp.focus(); });
    ordine.addEventListener('change', () => { st.ordine = ordine.value; deseneaza(); });
    $('#colectie').addEventListener('click', e => {
      const filtru = e.target.closest('[data-filtru]');
      if (filtru) {
        st.filtru = filtru.dataset.filtru;
        deseneaza();
        const apasat = $(`[data-filtru="${st.filtru}"]`, filtre);
        apasat.focus({ preventScroll: true });
        apasat.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      } else if (e.target.closest('[data-reset]')) {
        camp.value = st.text = '';
        st.filtru = 'toate';
        deseneaza();
      }
    });
    document.addEventListener('favorite-schimbate', () => { if (st.filtru === 'favorite') deseneaza(); else $(`[data-filtru="favorite"] small`, filtre).textContent = favorite.length; });
    deseneaza();
  }

  /* ---------- pagina de produs ---------- */
  const loc = $('#produs');
  if (loc) {
    const p = dupaId(new URLSearchParams(location.search).get('p'));
    if (!p) {
      loc.innerHTML = '<div class="not-found"><h1>Produsul nu mai e aici</h1><p>Poate a fost scos din colecție. Uită-te la ce avem acum.</p><a class="button" href="./#colectie">Vezi colecția</a></div>';
      return;
    }
    const libere = p.marimi.filter(m => m.stoc > 0);
    let aleasa = unica(p) && libere.length ? p.marimi[0].m : null;
    const intrebare = `Bună ziua! Aș dori detalii despre „${p.nume}” (${location.href.split('#')[0]}).`;
    const asemanatoare = P.filter(x => x.id !== p.id && x.categorie === p.categorie)
      .concat(P.filter(x => x.id !== p.id && x.categorie !== p.categorie && x.nou), P.filter(x => x.id !== p.id && x.categorie !== p.categorie && !x.nou)).slice(0, 4);
    document.title = `${p.nume} — ${CFG.nume}`;
    $('meta[name="description"]').setAttribute('content', `${p.nume}: ${p.pe_scurt} ${lei(p.pret)}.`);
    loc.innerHTML = `
      <nav class="crumbs" aria-label="Ești aici"><a href="./">Acasă</a><span aria-hidden="true">/</span><a href="./?cat=${p.categorie}#colectie">${CAT[p.categorie]}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.nume)}</span></nav>
      <div class="pdp-grid">
        <div>
          <div class="gallery" id="galerie">
            <figure class="main"><img src="${p.poza}" alt="${esc(p.nume)}" width="1000" height="1250" fetchpriority="high">${eticheta(p)}</figure>
            ${(p.detalii || []).map(d => `<figure class="zoomed" style="--focus:${d}"><img src="${p.poza}" alt="${esc(p.nume)}, detaliu" width="1000" height="1250" loading="lazy"><figcaption>Detaliu</figcaption></figure>`).join('')}
          </div>
          <div class="dots" aria-hidden="true"><i class="on"></i>${(p.detalii || []).map(() => '<i></i>').join('')}</div>
        </div>
        <div class="pdp-info">
          <p class="eyebrow">${esc(p.colectie)} · ${CAT[p.categorie]}</p>
          <h1 class="pdp-title">${esc(p.nume)}</h1>
          ${pret(p, 'pdp-price')}
          <p class="pdp-short">${esc(p.pe_scurt)}</p>
          <div class="pdp-block"><span class="label">Culoare</span><div class="color-line"><span class="swatch" style="background:${p.culoare.cod}"></span>${esc(p.culoare.nume)}</div></div>
          <div class="pdp-block">
            <div class="pdp-row"><span class="label" id="eticheta-marime">Mărime</span>${unica(p) ? '' : '<button class="link-btn" type="button" data-ghid>Ghid de mărimi</button>'}</div>
            <div class="sizes" id="marimi" role="radiogroup" aria-labelledby="eticheta-marime">${butoaneMarimi(p, aleasa)}</div>
            <p class="size-msg" id="spune-marime" role="status"></p>
          </div>
          <div class="pdp-actions">
            <button class="btn-main" type="button" id="adauga"${libere.length ? '' : ' disabled'}>${libere.length ? 'Adaugă în coș' : 'Stoc epuizat'}</button>
            ${butonFav(p)}
          </div>
          <a class="ask" href="https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(intrebare)}" target="_blank" rel="noopener noreferrer">${ICON.whatsapp} Întreabă-ne pe WhatsApp despre acest produs</a>
          <ul class="perks">
            <li>${ICON.camion} Livrare prin curier, oriunde în țară</li>
            <li>${ICON.pin} Ridicare din magazin, în București</li>
            <li>${ICON.retur} Retur în 14 zile</li>
          </ul>
          <div class="acc">
            <details open><summary>Descriere</summary><div class="acc-body"><p>${esc(p.descriere)}</p><p>${esc(p.croiala)}</p></div></details>
            <details><summary>Material și îngrijire</summary><div class="acc-body"><p>${esc(p.material)}</p><p>${esc(p.ingrijire)}</p></div></details>
            <details><summary>Livrare și retur</summary><div class="acc-body"><p>Livrăm prin curier în toată țara; costul și termenul se confirmă pe WhatsApp, odată cu comanda. Poți ridica și din magazin.</p><p>Dacă nu ți se potrivește, îl poți returna în 14 zile de la primire.</p></div></details>
          </div>
        </div>
      </div>
      <section class="related" aria-labelledby="asemanatoare-titlu">
        <div class="related-top"><h2 id="asemanatoare-titlu">S-ar putea <span class="serif">să-ți placă</span></h2><a class="text-link" href="./#colectie">Toată colecția</a></div>
        <div class="cards">${asemanatoare.map(card).join('')}</div>
      </section>`;
    document.body.insertAdjacentHTML('beforeend', `<div class="buybar"><div><p class="buybar-name">${esc(p.nume)}</p><p class="buybar-price">${lei(p.pret)}</p></div><button class="btn-main" type="button" id="adauga-jos"${libere.length ? '' : ' disabled'}>${libere.length ? 'Adaugă în coș' : 'Stoc epuizat'}</button></div>`);
    document.body.classList.add('has-buybar');

    const marimi = $('#marimi'), spuneMarime = $('#spune-marime'), buton = $('#adauga'), bara = $('.buybar');
    const arataStoc = () => {
      const n = aleasa ? stoc(p, aleasa) : 0;
      spuneMarime.className = 'size-msg';
      spuneMarime.textContent = !libere.length ? 'Momentan nu mai e pe stoc. Scrie-ne și te anunțăm când revine.'
        : !aleasa ? 'Alege mărimea ca să o pui în coș.'
          : n === 1 ? 'Ultima bucată' + (unica(p) ? '.' : ` la mărimea ${aleasa}.`)
            : n <= 2 ? `Ultimele ${n} bucăți` + (unica(p) ? '.' : ` la mărimea ${aleasa}.`) : 'În stoc.';
    };
    marimi.addEventListener('click', e => {
      const b = e.target.closest('[data-marime]:not(:disabled)');
      if (!b) return;
      aleasa = b.dataset.marime;
      $$('[data-marime]', marimi).forEach(x => x.setAttribute('aria-checked', x === b));
      arataStoc();
    });
    buton.addEventListener('click', () => {
      if (aleasa) return adaugaInCos(p.id, aleasa);
      spuneMarime.className = 'size-msg error';
      spuneMarime.textContent = 'Alege întâi o mărime.';
      marimi.classList.remove('shake'); void marimi.offsetWidth; marimi.classList.add('shake');
      $('[data-marime]:not(:disabled)', marimi).focus();
    });
    // bara de jos (pe telefon): cu mărimea aleasă pune direct în coș, altfel întreabă mărimea
    $('#adauga-jos').addEventListener('click', () => aleasa ? adaugaInCos(p.id, aleasa) : alegeMarime(p));
    if ('IntersectionObserver' in window) new IntersectionObserver(v => bara.classList.toggle('show', !v[0].isIntersecting && v[0].boundingClientRect.top < 0), { threshold: 0 }).observe(buton);
    arataStoc();

    // poza mare: se mărește sub cursor, ca la magazinele mari (doar cu mouse)
    const mare = $('.gallery .main'), galerie = $('#galerie'), puncte = $$('.dots i');
    if (window.matchMedia('(hover:hover) and (min-width:801px)').matches) {
      mare.addEventListener('mousemove', e => {
        const r = mare.getBoundingClientRect();
        $('img', mare).style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`;
        mare.classList.add('zooming');
      });
      mare.addEventListener('mouseleave', () => mare.classList.remove('zooming'));
    }
    // pe telefon pozele se trag cu degetul; punctele arată la a câta ești
    galerie.addEventListener('scroll', () => {
      const pas = galerie.firstElementChild.getBoundingClientRect().width + 6, acum = Math.round(galerie.scrollLeft / pas);
      puncte.forEach((punct, i) => punct.classList.toggle('on', i === acum));
    }, { passive: true });
  }
})();
