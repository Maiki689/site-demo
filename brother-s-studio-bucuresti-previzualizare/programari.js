/* Programări online MK Studio: pune pe site fereastra «Programează-te online» (serviciul, ziua, ora liberă, numele,
   telefonul) și anunțul de concediu. Pe pagină:
   <script src="programari.js" data-salon="brothers" data-api="https://mk-programari.eni-wear.workers.dev"></script>
   Orice element cu data-programare (sau un link spre #programare) deschide fereastra; în [data-programari-info] apare
   programul și concediul. Culorile se iau din data-accent / data-fundal (implicit negru pe alb). */
(function () {
  'use strict';
  const eu = document.currentScript;
  const SALON = eu.dataset.salon, API = (eu.dataset.api || '').replace(/\/$/, '') + '/api/' + SALON + '/';
  const ACCENT = eu.dataset.accent || '#111111', FUNDAL = eu.dataset.fundal || '#ffffff';
  const LUNI = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
  const ZILE_SC = ['Du', 'Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ'];
  const ZILE = ['duminica', 'luni', 'marti', 'miercuri', 'joi', 'vineri', 'sambata'];
  const NUME_ZI = { luni: 'Luni', marti: 'Marți', miercuri: 'Miercuri', joi: 'Joi', vineri: 'Vineri', sambata: 'Sâmbătă', duminica: 'Duminică' };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const d = zi => new Date(zi + 'T12:00:00');
  const frumos = zi => `${d(zi).getDate()} ${LUNI[d(zi).getMonth()]}`;
  let info = null, ales = { serviciu: null, zi: null, ora: null };

  const css = `
  .mkp-fundal{position:fixed;inset:0;z-index:2147483000;background:rgba(10,10,10,.55);display:flex;align-items:flex-end;justify-content:center;opacity:0;transition:opacity .2s}
  .mkp-fundal.mkp-deschis{opacity:1}
  .mkp{font:16px/1.45 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#111;background:${FUNDAL};width:100%;max-width:520px;max-height:92vh;overflow:auto;
    border-radius:18px 18px 0 0;padding:20px 18px calc(20px + env(safe-area-inset-bottom));transform:translateY(24px);transition:transform .25s cubic-bezier(.2,.8,.2,1);box-shadow:0 -10px 40px rgba(0,0,0,.25)}
  @media(min-width:600px){.mkp-fundal{align-items:center}.mkp{border-radius:18px}}
  .mkp-deschis .mkp{transform:none}
  .mkp *{box-sizing:border-box}
  .mkp-sus{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:6px}
  .mkp h2{font-size:1.25rem;margin:0;letter-spacing:-.01em}
  .mkp-x{width:40px;height:40px;border-radius:50%;border:1px solid #ddd;background:#fff;font-size:20px;cursor:pointer;color:#111}
  .mkp h3{font-size:.95rem;margin:18px 0 8px}
  .mkp-servicii{display:grid;gap:8px}
  .mkp-servicii button,.mkp-ore button{border:1.5px solid #d7d7d7;background:#fff;color:#111;border-radius:12px;cursor:pointer;font:inherit}
  .mkp-servicii button{display:flex;justify-content:space-between;gap:10px;text-align:left;padding:12px 14px;min-height:52px;align-items:center}
  .mkp-servicii small{color:#666;white-space:nowrap}
  .mkp [aria-pressed=true]{border-color:${ACCENT};background:${ACCENT};color:#fff}
  .mkp [aria-pressed=true] small{color:rgba(255,255,255,.8)}
  .mkp-zile{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;scroll-snap-type:x mandatory}
  .mkp-zile button{flex:0 0 62px;scroll-snap-align:start;border:1.5px solid #d7d7d7;background:#fff;color:#111;border-radius:12px;padding:8px 4px;cursor:pointer;font:inherit;text-align:center}
  .mkp-zile b{display:block;font-size:1.2rem}
  .mkp-zile span{font-size:.75rem;color:#666}
  .mkp-zile button:disabled{opacity:.4;cursor:default;text-decoration:line-through}
  .mkp-zile [aria-pressed=true] span{color:rgba(255,255,255,.8)}
  .mkp-ore{display:grid;grid-template-columns:repeat(auto-fill,minmax(76px,1fr));gap:8px}
  .mkp-ore button{min-height:46px}
  .mkp-gol{color:#666;font-size:.95rem;margin:4px 0}
  .mkp label{display:block;font-size:.85rem;color:#555;margin:10px 0 4px}
  .mkp input{width:100%;min-height:50px;padding:12px 14px;border:1.5px solid #d7d7d7;border-radius:12px;font:inherit;font-size:16px;color:#111;background:#fff}
  .mkp input:focus,.mkp button:focus-visible{outline:3px solid ${ACCENT};outline-offset:2px}
  .mkp-ok{width:100%;min-height:54px;margin-top:16px;border:0;border-radius:12px;background:${ACCENT};color:#fff;font:600 1rem/1 inherit;cursor:pointer}
  .mkp-ok:disabled{opacity:.5;cursor:default}
  .mkp-eroare{color:#b00020;font-size:.95rem;margin:10px 0 0}
  .mkp-concediu{background:#fff4e5;border:1px solid #f5c98b;color:#7a4b00;border-radius:12px;padding:10px 12px;font-size:.92rem;margin:10px 0 0}
  .mkp-gata{text-align:center;padding:10px 0}
  .mkp-gata .mkp-bifa{width:64px;height:64px;border-radius:50%;background:${ACCENT};color:#fff;display:grid;place-items:center;font-size:32px;margin:6px auto 12px}
  .mkp-gata p{margin:6px 0;color:#444}
  .mkp-link{background:none;border:0;color:#111;text-decoration:underline;cursor:pointer;font:inherit;padding:8px}
  @media(prefers-reduced-motion:reduce){.mkp,.mkp-fundal{transition:none}}
  [data-programari-info] .mkp-program{display:grid;grid-template-columns:auto 1fr;gap:4px 16px;margin:8px 0 0}
  `;
  const stil = document.createElement('style');
  stil.textContent = css;
  document.head.appendChild(stil);

  async function cere(cale, optiuni) {
    const r = await fetch(API + cale, optiuni);
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.eroare || 'Nu am putut face programarea acum. Sună-ne.');
    return j;
  }

  /* ---------- programul și concediul, pe pagină ---------- */
  function arataInfo() {
    const locuri = document.querySelectorAll('[data-programari-info]');
    if (!locuri.length || !info) return;
    const zile = ['luni', 'marti', 'miercuri', 'joi', 'vineri', 'sambata', 'duminica'];
    const html = `<div class="mkp-program">${zile.map(z => { const p = info.program[z] || {}; return `<span>${NUME_ZI[z]}</span><span>${p.deschis ? p.de_la + ' – ' + p.pana_la : 'Închis'}</span>`; }).join('')}</div>`
      + info.libere.map(l => `<p class="mkp-concediu">Închis ${l.de_la === l.pana_la ? 'pe ' + frumos(l.de_la) : 'între ' + frumos(l.de_la) + ' și ' + frumos(l.pana_la)}${l.motiv ? ' (' + esc(l.motiv) + ')' : ''}.</p>`).join('');
    locuri.forEach(x => { x.innerHTML = html; });
  }

  /* ---------- fereastra ---------- */
  let fundal = null, ultimulFocus = null;
  function deschide() {
    ultimulFocus = document.activeElement;
    ales = { serviciu: null, zi: null, ora: null };
    fundal = document.createElement('div');
    fundal.className = 'mkp-fundal';
    fundal.innerHTML = `<div class="mkp" role="dialog" aria-modal="true" aria-labelledby="mkp-titlu"><div class="mkp-sus"><h2 id="mkp-titlu">Programează-te online</h2>
      <button class="mkp-x" type="button" aria-label="Închide">×</button></div><div class="mkp-corp"><p class="mkp-gol">Se încarcă…</p></div></div>`;
    document.body.appendChild(fundal);
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => fundal.classList.add('mkp-deschis'));
    fundal.addEventListener('click', e => { if (e.target === fundal || e.target.closest('.mkp-x')) inchide(); });
    fundal.querySelector('.mkp-x').focus();
    (info ? Promise.resolve() : incarca()).then(pasi).catch(err => { corp().innerHTML = `<p class="mkp-eroare">${esc(err.message)}</p>`; });
  }
  function inchide() {
    if (!fundal) return;
    fundal.remove();
    fundal = null;
    document.documentElement.style.overflow = '';
    if (ultimulFocus) ultimulFocus.focus();
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') inchide(); });
  const corp = () => fundal.querySelector('.mkp-corp');

  function pasi() {
    const azi = info.libere.find(l => l.de_la <= info.zile[0].zi);
    corp().innerHTML = (azi ? `<p class="mkp-concediu">Salonul e închis până pe ${frumos(azi.pana_la)}${azi.motiv ? ' (' + esc(azi.motiv) + ')' : ''}. Te poți programa pentru după.</p>` : '')
      + `<h3>1. Ce vrei să-ți facem?</h3><div class="mkp-servicii">${info.servicii.map((s, i) =>
        `<button type="button" data-s="${i}" aria-pressed="false"><span>${esc(s.nume)}</span><small>${s.durata} min${s.pret ? ' · ' + esc(s.pret) : ''}</small></button>`).join('')}</div>
      <div class="mkp-pas-zi" hidden><h3>2. În ce zi?</h3><div class="mkp-zile">${info.zile.map(z => {
        const dt = d(z.zi);
        return `<button type="button" data-z="${z.zi}" aria-pressed="false" ${z.deschis ? '' : 'disabled'} title="${z.liber ? esc(z.liber) : z.deschis ? '' : 'Închis'}">
          <span>${ZILE_SC[dt.getDay()]}</span><b>${dt.getDate()}</b><span>${z.liber ? 'liber' : LUNI[dt.getMonth()].slice(0, 3)}</span></button>`; }).join('')}</div></div>
      <div class="mkp-pas-ora" hidden><h3>3. La ce oră?</h3><div class="mkp-ore"></div></div>
      <form class="mkp-pas-date" hidden novalidate><h3>4. Cine vine?</h3>
        <label for="mkp-nume">Numele tău</label><input id="mkp-nume" autocomplete="name" maxlength="60" required>
        <label for="mkp-tel">Telefonul (mobil)</label><input id="mkp-tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="07xx xxx xxx" required>
        <p class="mkp-eroare" hidden></p>
        <button class="mkp-ok" type="submit">Confirmă programarea</button></form>`;
    corp().addEventListener('click', alege);
    corp().querySelector('form').addEventListener('submit', trimite);
  }
  async function alege(e) {
    const s = e.target.closest('[data-s]'), z = e.target.closest('[data-z]'), o = e.target.closest('[data-o]');
    if (s) {
      ales.serviciu = Number(s.dataset.s); ales.ora = null;
      apasat('[data-s]', s);
      corp().querySelector('.mkp-pas-zi').hidden = false;
      if (ales.zi) await ore(); else corp().querySelector('.mkp-pas-zi').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (z) { ales.zi = z.dataset.z; ales.ora = null; apasat('[data-z]', z); await ore(); }
    if (o) {
      ales.ora = o.dataset.o; apasat('[data-o]', o);
      const f = corp().querySelector('form');
      f.hidden = false;
      f.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
  function apasat(sel, b) { corp().querySelectorAll(sel).forEach(x => x.setAttribute('aria-pressed', x === b)); }
  async function ore() {
    const loc = corp().querySelector('.mkp-ore');
    corp().querySelector('.mkp-pas-ora').hidden = false;
    corp().querySelector('form').hidden = true;
    loc.innerHTML = '<p class="mkp-gol">Caut orele libere…</p>';
    try {
      const { ore } = await cere(`ore?zi=${ales.zi}&serviciu=${ales.serviciu}`);
      loc.innerHTML = ore.length ? ore.map(o => `<button type="button" data-o="${o}" aria-pressed="false">${o}</button>`).join('')
        : '<p class="mkp-gol">Nu mai sunt ore libere în ziua asta. Alege altă zi.</p>';
      loc.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) { loc.innerHTML = `<p class="mkp-eroare">${esc(err.message)}</p>`; }
  }
  async function trimite(e) {
    e.preventDefault();
    const f = e.target, er = f.querySelector('.mkp-eroare'), b = f.querySelector('.mkp-ok');
    er.hidden = true;
    b.disabled = true;
    b.textContent = 'Se trimite…';
    try {
      const r = await cere('programeaza', { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ serviciu: ales.serviciu, zi: ales.zi, ora: ales.ora, nume: f.querySelector('#mkp-nume').value, telefon: f.querySelector('#mkp-tel').value }) });
      gata(r);
    } catch (err) {
      er.textContent = err.message;
      er.hidden = false;
      b.disabled = false;
      b.textContent = 'Confirmă programarea';
      if (/ocupat/.test(err.message)) ore();
    }
  }
  function gata(r) {
    const [h, m] = r.ora.split(':').map(Number), sv = info.servicii[ales.serviciu];
    const start = r.zi.replace(/-/g, '') + 'T' + String(h).padStart(2, '0') + String(m).padStart(2, '0') + '00';
    const sfarsitMin = h * 60 + m + sv.durata, sf = r.zi.replace(/-/g, '') + 'T' + String(Math.floor(sfarsitMin / 60)).padStart(2, '0') + String(sfarsitMin % 60).padStart(2, '0') + '00';
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MK Studio//Programari//RO', 'BEGIN:VEVENT', 'UID:' + r.id, 'DTSTART;TZID=Europe/Bucharest:' + start,
      'DTEND;TZID=Europe/Bucharest:' + sf, 'SUMMARY:' + r.serviciu + ' la ' + info.nume, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    corp().innerHTML = `<div class="mkp-gata"><div class="mkp-bifa" aria-hidden="true">✓</div><h3 style="font-size:1.15rem">Te-am programat!</h3>
      <p><b>${esc(r.serviciu)}</b>, ${NUME_ZI[ZILE[d(r.zi).getDay()]].toLowerCase()} ${frumos(r.zi)}, la ${r.ora}.</p>
      <p>Dacă nu mai poți ajunge, anunță-ne din timp, te rugăm.</p>
      <a class="mkp-link" href="${url}" download="programare.ics">Pune-o în calendarul telefonului</a><br>
      <button class="mkp-ok" type="button" data-inchide>Gata</button></div>`;
    corp().querySelector('[data-inchide]').addEventListener('click', inchide);
  }

  async function incarca() {
    info = await cere('public');
    arataInfo();
  }
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-programare], a[href="#programare"]');
    if (!t) return;
    e.preventDefault();
    deschide();
  });
  incarca().catch(() => {});
})();
