/* Produsele magazinului. Aici se schimbă tot: un produs nou = încă un bloc { ... } în listă, cu poza lui pusă în
   img/produse/. Câmpuri: id (fără spații, apare în adresa paginii), nume, categorie (una din MAGAZIN.categorii),
   pret (lei), pretVechi (doar la reduceri), nou (true = apare la Noutăți), colectie, culoare, marimi (stoc 0 = epuizat),
   poza, detalii (ce părți din poză se văd mărit, în procente), pe_scurt, descriere, material, ingrijire, croiala.
   Deocamdată produsele, prețurile și mărimile sunt EXEMPLE pentru modelul de site. */
window.MAGAZIN = {
  nume: 'e. ni. wear',
  whatsapp: '40722516773',
  demo: true,
  categorii: {
    rochii: 'Rochii și fuste',
    tricouri: 'Tricouri și bluze',
    pantaloni: 'Pantaloni',
    hanorace: 'Hanorace și pulovere',
    geci: 'Geci',
    accesorii: 'Accesorii'
  }
};

window.PRODUSE = [
  {
    id: 'rochie-midi-imprimeu', nume: 'Rochie midi „Ines” cu imprimeu', categorie: 'rochii', pret: 249, nou: true, colectie: 'Toamnă 2026',
    culoare: { nume: 'Albastru pe alb', cod: '#4f86c6' },
    marimi: [{ m: 'XS', stoc: 3 }, { m: 'S', stoc: 5 }, { m: 'M', stoc: 2 }, { m: 'L', stoc: 0 }],
    poza: 'img/produse/rochie-midi-imprimeu.jpg', detalii: ['46% 34%', '40% 58%'],
    pe_scurt: 'Rochie vaporoasă, cu imprimeu pictat și croială lejeră.',
    descriere: 'O rochie care se mișcă odată cu tine: croială lejeră, mânecă scurtă căzută și lungime midi. Imprimeul în tonuri de albastru o face ușor de purtat și ziua, și seara.',
    material: '100% viscoză, țesătură subțire și fluidă.', ingrijire: 'Spălare la 30°C, program delicat. Se calcă la temperatură mică.',
    croiala: 'Croială lejeră. Dacă ești între două mărimi, alege-o pe cea mai mică.'
  },
  {
    id: 'tricou-basic-alb', nume: 'Tricou basic alb din bumbac', categorie: 'tricouri', pret: 79, nou: true, colectie: 'Toamnă 2026',
    culoare: { nume: 'Alb', cod: '#f7f5f0' },
    marimi: [{ m: 'XS', stoc: 4 }, { m: 'S', stoc: 8 }, { m: 'M', stoc: 9 }, { m: 'L', stoc: 6 }, { m: 'XL', stoc: 2 }],
    poza: 'img/produse/tricou-basic-alb.jpg', detalii: ['50% 46%', '50% 78%'],
    pe_scurt: 'Tricoul de care ai nevoie în fiecare zi: bumbac gros, croială dreaptă.',
    descriere: 'Tricou alb cu guler rotund, din bumbac gros care nu se vede prin el. Croială dreaptă, ușor lejeră, bună și băgată în blugi, și lăsată liberă.',
    material: '100% bumbac, 180 g/m².', ingrijire: 'Spălare la 40°C, pe dos. Nu se usucă la uscător.',
    croiala: 'Croială dreaptă, pe mărime.'
  },
  {
    id: 'pantaloni-roz', nume: 'Pantaloni „Rosa” cu talie înaltă', categorie: 'pantaloni', pret: 199, nou: true, colectie: 'Toamnă 2026',
    culoare: { nume: 'Roz fucsia', cod: '#e0457b' },
    marimi: [{ m: '34', stoc: 2 }, { m: '36', stoc: 4 }, { m: '38', stoc: 5 }, { m: '40', stoc: 1 }, { m: '42', stoc: 0 }],
    poza: 'img/produse/pantaloni-roz.jpg', detalii: ['50% 62%', '50% 88%'],
    pe_scurt: 'Pantaloni cu talie înaltă și pense, într-o culoare care se vede.',
    descriere: 'Pantaloni cu talie înaltă, pense în față și crac drept. Se poartă cu cămașa asortată pentru o ținută întreagă sau cu un tricou alb, pentru zi.',
    material: '68% poliester, 28% viscoză, 4% elastan.', ingrijire: 'Spălare la 30°C. Se calcă pe dos.',
    croiala: 'Talie înaltă, crac drept. Pe mărime.'
  },
  {
    id: 'hanorac-bej', nume: 'Hanorac oversize bej', categorie: 'hanorace', pret: 219, nou: true, colectie: 'Toamnă 2026',
    culoare: { nume: 'Bej nisip', cod: '#cdbfae' },
    marimi: [{ m: 'S/M', stoc: 6 }, { m: 'L/XL', stoc: 3 }],
    poza: 'img/produse/hanorac-bej.jpg', detalii: ['50% 52%', '50% 82%'],
    pe_scurt: 'Hanorac gros, cu glugă și buzunar mare în față.',
    descriere: 'Hanorac oversize din bumbac gros, pufos pe interior. Glugă cu șnur, buzunar cangur și manșete elastice. Cald, moale și ușor de asortat.',
    material: '80% bumbac, 20% poliester, interior pufos.', ingrijire: 'Spălare la 30°C, pe dos. Nu se usucă la uscător.',
    croiala: 'Oversize. Pentru o croială mai apropiată de corp, alege mărimea mai mică.'
  },
  {
    id: 'pulover-verde', nume: 'Pulover tricotat verde salvie', categorie: 'hanorace', pret: 229, nou: true, colectie: 'Toamnă 2026',
    culoare: { nume: 'Verde salvie', cod: '#8f9f8c' },
    marimi: [{ m: 'S', stoc: 3 }, { m: 'M', stoc: 4 }, { m: 'L', stoc: 1 }],
    poza: 'img/produse/pulover-verde.jpg', detalii: ['52% 52%', '36% 66%'],
    pe_scurt: 'Pulover gros, cu guler înalt și model împletit.',
    descriere: 'Pulover tricotat cu ochiuri mari, guler înalt și mâneci largi. O piesă caldă pentru zilele reci, într-un verde liniștit care merge cu aproape orice.',
    material: '50% lână, 50% acril.', ingrijire: 'Spălare de mână sau program de lână. Se usucă întins.',
    croiala: 'Croială lejeră, pe mărime.'
  },
  {
    id: 'bluza-crem', nume: 'Cămașă crem „Sofia”', categorie: 'tricouri', pret: 169, nou: true, colectie: 'Toamnă 2026',
    culoare: { nume: 'Crem', cod: '#efe6d3' },
    marimi: [{ m: 'S', stoc: 2 }, { m: 'M', stoc: 3 }, { m: 'L', stoc: 2 }],
    poza: 'img/produse/bluza-crem.jpg', detalii: ['50% 44%', '30% 62%'],
    pe_scurt: 'Cămașă fluidă, cu guler clasic și mâneci lungi.',
    descriere: 'Cămașă din material fluid, cu guler clasic, nasturi ascunși și un detaliu brodat la umăr. Arată bine și la birou, și la o ieșire în oraș.',
    material: '100% poliester satinat.', ingrijire: 'Spălare la 30°C, program delicat.',
    croiala: 'Croială dreaptă, pe mărime.'
  },
  {
    id: 'geanta-umar', nume: 'Geantă de umăr „Luna”', categorie: 'accesorii', pret: 149, nou: true, colectie: 'Toamnă 2026',
    culoare: { nume: 'Gri-lila', cod: '#8f8089' },
    marimi: [{ m: 'Mărime unică', stoc: 4 }],
    poza: 'img/produse/geanta-umar.jpg', detalii: ['62% 60%', '50% 40%'],
    pe_scurt: 'Geantă moale, în formă de semilună, cu fermoar.',
    descriere: 'Geantă de umăr în formă de semilună, din piele ecologică moale. Încăpătoare cât pentru telefon, portofel și chei, cu fermoar și buzunar interior.',
    material: 'Piele ecologică, căptușeală textilă.', ingrijire: 'Se șterge cu o cârpă umedă.',
    croiala: 'Dimensiuni: aproximativ 32 × 18 × 8 cm.'
  },
  {
    id: 'jeans-skinny', nume: 'Jeans skinny albastru deschis', categorie: 'pantaloni', pret: 179, colectie: 'Vară 2026',
    culoare: { nume: 'Albastru deschis', cod: '#8fb0d0' },
    marimi: [{ m: '34', stoc: 1 }, { m: '36', stoc: 3 }, { m: '38', stoc: 4 }, { m: '40', stoc: 2 }, { m: '42', stoc: 2 }],
    poza: 'img/produse/jeans-skinny.jpg', detalii: ['56% 16%', '56% 60%'],
    pe_scurt: 'Jeans elastici, cu talie medie și spălătură deschisă.',
    descriere: 'Jeans skinny cu talie medie, din denim elastic. Spălătura deschisă îi face ușor de purtat cu tricouri, cămăși sau pulovere groase.',
    material: '92% bumbac, 6% poliester, 2% elastan.', ingrijire: 'Spălare la 30°C, pe dos, cu culori asemănătoare.',
    croiala: 'Croială strâmtă. Pe mărime.'
  },
  {
    id: 'rochie-florala', nume: 'Rochie florală „Mara”', categorie: 'rochii', pret: 149, pretVechi: 189, colectie: 'Vară 2026',
    culoare: { nume: 'Flori pe crem', cod: '#e3c9b4' },
    marimi: [{ m: 'XS', stoc: 0 }, { m: 'S', stoc: 2 }, { m: 'M', stoc: 3 }, { m: 'L', stoc: 1 }],
    poza: 'img/produse/rochie-florala.jpg', detalii: ['50% 46%', '50% 60%'],
    pe_scurt: 'Rochie ușoară, cu flori mici și umeri căzuți.',
    descriere: 'Rochie de vară cu imprimeu floral mărunt, umeri căzuți și talie marcată. Ușoară și aerisită, potrivită pentru zilele calde.',
    material: '100% bumbac subțire.', ingrijire: 'Spălare la 30°C. Se calcă la temperatură medie.',
    croiala: 'Talie marcată, fustă largă. Pe mărime.'
  },
  {
    id: 'fusta-mini-kaki', nume: 'Fustă mini „Olive” cu nasturi', categorie: 'rochii', pret: 139, colectie: 'Vară 2026',
    culoare: { nume: 'Verde kaki', cod: '#a9b57a' },
    marimi: [{ m: 'XS', stoc: 2 }, { m: 'S', stoc: 3 }, { m: 'M', stoc: 2 }, { m: 'L', stoc: 0 }],
    poza: 'img/produse/fusta-mini-kaki.jpg', detalii: ['52% 68%', '50% 30%'],
    pe_scurt: 'Fustă mini petrecută, cu nasturi și buzunar aplicat.',
    descriere: 'Fustă mini cu talie înaltă, croială petrecută și doi nasturi mari. Buzunarul aplicat îi dă un aer relaxat; se poartă cu un tricou alb simplu.',
    material: '65% poliester, 35% bumbac.', ingrijire: 'Spălare la 30°C.',
    croiala: 'Talie înaltă. Pe mărime.'
  },
  {
    id: 'tricou-negru', nume: 'Tricou negru „Everyday” pentru bărbați', categorie: 'tricouri', pret: 89, colectie: 'Vară 2026',
    culoare: { nume: 'Negru', cod: '#1c1b1d' },
    marimi: [{ m: 'S', stoc: 3 }, { m: 'M', stoc: 6 }, { m: 'L', stoc: 5 }, { m: 'XL', stoc: 2 }, { m: 'XXL', stoc: 0 }],
    poza: 'img/produse/tricou-negru.jpg', detalii: ['50% 56%', '50% 82%'],
    pe_scurt: 'Tricou negru simplu, cu guler rotund.',
    descriere: 'Tricou negru din bumbac moale, cu guler rotund și croială clasică. Nu se deformează la spălat și își păstrează culoarea.',
    material: '95% bumbac, 5% elastan.', ingrijire: 'Spălare la 30°C, pe dos.',
    croiala: 'Croială clasică, pe mărime.'
  },
  {
    id: 'bluza-neagra', nume: 'Bluză neagră unisex „Core”', categorie: 'hanorace', pret: 169, colectie: 'Vară 2026',
    culoare: { nume: 'Negru', cod: '#1c1b1d' },
    marimi: [{ m: 'S', stoc: 2 }, { m: 'M', stoc: 4 }, { m: 'L', stoc: 4 }, { m: 'XL', stoc: 1 }],
    poza: 'img/produse/bluza-neagra.jpg', detalii: ['50% 50%', '50% 82%'],
    pe_scurt: 'Bluză groasă, fără glugă, cu mânecă raglan.',
    descriere: 'Bluză unisex din bumbac gros, cu guler rotund, mânecă raglan și manșete elastice. O piesă simplă, care merge peste orice.',
    material: '85% bumbac, 15% poliester.', ingrijire: 'Spălare la 30°C, pe dos.',
    croiala: 'Croială lejeră, unisex. Pentru femei, alege o mărime mai mică.'
  },
  {
    id: 'geaca-blugi', nume: 'Geacă de blugi indigo', categorie: 'geci', pret: 259, colectie: 'Vară 2026',
    culoare: { nume: 'Indigo închis', cod: '#1f2a44' },
    marimi: [{ m: 'S', stoc: 2 }, { m: 'M', stoc: 2 }, { m: 'L', stoc: 1 }, { m: 'XL', stoc: 0 }],
    poza: 'img/produse/geaca-blugi.jpg', detalii: ['50% 34%', '30% 62%'],
    pe_scurt: 'Geacă de blugi cambrată, cu fermoar și cusături arămii.',
    descriere: 'Geacă din denim închis la culoare, cambrată, cu fermoar metalic și cusături arămii la vedere. Două buzunare la piept și guler clasic.',
    material: '98% bumbac, 2% elastan.', ingrijire: 'Spălare la 30°C, pe dos, separat la prima spălare.',
    croiala: 'Croială pe corp. Dacă o porți peste pulovere, alege o mărime mai mare.'
  },
  {
    id: 'esarfa-dungi', nume: 'Eșarfă cu dungi alb-negru', categorie: 'accesorii', pret: 69, colectie: 'Vară 2026',
    culoare: { nume: 'Alb și negru', cod: '#2a2a2a' },
    marimi: [{ m: 'Mărime unică', stoc: 5 }],
    poza: 'img/produse/esarfa-dungi.jpg', detalii: ['50% 30%', '62% 78%'],
    pe_scurt: 'Eșarfă lungă, moale, cu dungi late.',
    descriere: 'Eșarfă lungă din tricot subțire, cu dungi late alb-negru. Se poartă la gât, pe umeri sau pe cap; schimbă pe loc o ținută simplă.',
    material: '100% viscoză.', ingrijire: 'Spălare de mână, cu apă rece.',
    croiala: 'Dimensiuni: aproximativ 180 × 60 cm.'
  }
];
