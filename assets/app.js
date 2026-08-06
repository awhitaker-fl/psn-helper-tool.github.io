/* ============================================================
   PSN Helper Tool — App logic
   Vanilla JS. No build step. Loaded via <script defer>.
   ============================================================ */
(function () {
  'use strict';

  // ------------------------------------------------------------
  // Data: partners → territories → licenses
  // ------------------------------------------------------------
  const TERRITORY_LABELS = {
    BE: 'Belgium',
    BG: 'Bulgaria',
    COM: '.com',
    DE: 'Germany',
    DK: 'Denmark',
    EE: 'Estonia',
    GR: 'Greece',
    NZ: 'New Zealand',
    RO: 'Romania',
    SE: 'Sweden',
    ES: 'Spain',
    FR: 'France',
    PT: 'Portugal',
    IT: 'Italy (PokerStars)',
    SNAI: 'SNAI',
    SISAL: 'SISAL',
    UK: 'United Kingdom',
  };

  const TERRITORY_FLAG = {
    BE: '🇧🇪', BG: '🇧🇬', COM: '🌐', DE: '🇩🇪', DK: '🇩🇰', EE: '🇪🇪',
    GR: '🇬🇷', NZ: '🇳🇿', RO: '🇷🇴', SE: '🇸🇪', ES: '🇪🇸', FR: '🇫🇷',
    PT: '🇵🇹', IT: '🇮🇹', SNAI: '🎲', SISAL: '🎰', UK: '🇬🇧',
  };

  const BRAND_LABELS = {
    BF: 'Betfair',
    PP: 'Paddy Power',
    SBG: 'SkyBet',
    PS: 'PokerStars',
    IT: 'PokerStars',
  };

  const PARTNERS = {
    pragmatic: {
      key: 'pragmatic',
      name: 'Pragmatic',
      tagline: 'Pragmatic partner brands (PS)',
      icon: '♠',
      licenses: ['BE-PS', 'BG-PS', 'COM-PS', 'DE-PS', 'DK-PS', 'EE-PS', 'GR-PS', 'NZ-PS', 'RO-PS', 'SE-PS'],
    },
    seu: {
      key: 'seu',
      name: 'SEU',
      tagline: 'South-EU: Spain · France · Portugal',
      icon: '♦',
      licenses: ['ES-PS', 'FR-PS', 'PT-PS'],
    },
    italy: {
      key: 'italy',
      name: 'Italy',
      tagline: 'Italian market: PokerStars · SNAI · SISAL',
      icon: '♥',
      licenses: ['SNAI-IT', 'SISAL-IT', 'IT-PS'],
    },
    huki: {
      key: 'huki',
      name: 'hUKI',
      tagline: 'UK & .com: Betfair · Paddy Power · SkyBet',
      icon: '♣',
      licenses: ['COM-BF', 'COM-PP', 'COM-SBG', 'UK-BF', 'UK-PP', 'UK-SBG'],
    },
  };

  // Environment display metadata (order matters for cards)
  const ENV_ORDER = ['PR', 'QC', 'SPADEQA02', 'SPADEQA03', 'SPADEQA04', 'SPADEQA05', 'SPADEQA06'];
  const ENV_META = {
    PR:        { label: 'Production',   sub: 'Live production traffic',    tone: 'red' },
    QC:        { label: 'QC',           sub: 'QA core environment',        tone: 'gold' },
    SPADEQA02: { label: 'SpadeQA 02',   sub: 'Certification environment',  tone: 'gold' },
    SPADEQA03: { label: 'SpadeQA 03',   sub: 'Preprod / staging',          tone: 'gold' },
    SPADEQA04: { label: 'SpadeQA 04',   sub: 'Preprod / staging',          tone: 'gold' },
    SPADEQA05: { label: 'SpadeQA 05',   sub: 'Preprod / staging',          tone: 'gold' },
    SPADEQA06: { label: 'SpadeQA 06',   sub: 'Preprod / staging',          tone: 'gold' },
  };

  // ------------------------------------------------------------
  // Data: environment URLs
  // ------------------------------------------------------------
  const PARTNER_BASE_URLS = {
    'BE-PS':    { QC: 'https://www-pokerstars-be-qa.pragmatic.starsweb.io', SPADEQA02: 'https://www-pokerstars-de-cert.pragmatic.starsweb.io' },
    'BG-PS':    { QC: 'https://www-pokerstars-bg-qa.pragmatic.starsweb.io' },
    'COM-BF':   { QC: 'https://poker.betfair.com.nxt.ppbdev.com' },
    'COM-PP':   { QC: 'https://www.paddypower.com.nxt.ppbdev.com' },
    'COM-PS':   { QC: 'https://www-pokerstars-com-qa.pragmatic.starsweb.io', SPADEQA02: 'https://www-pokerstars-com-cert.pragmatic.starsweb.io' },
    'COM-SBG':  { QC: 'https://skybet.com.nxt.ppbdev.com' },
    'DE-PS':    { QC: 'https://www-pokerstars-de-qa.pragmatic.starsweb.io', SPADEQA02: 'https://www-pokerstars-de-cert.pragmatic.starsweb.io' },
    'DK-PS':    { QC: 'https://www-pokerstars-dk-qa.pragmatic.starsweb.io', SPADEQA02: 'https://www-pokerstars-dk-cert.pragmatic.starsweb.io' },
    'EE-PS':    { QC: 'https://www-pokerstars-ee-qa.pragmatic.starsweb.io', SPADEQA02: 'https://www-pokerstars-ee-cert.pragmatic.starsweb.io' },
    'ES-PS':    { QC: 'https://test-es-www-ps.sisal.it', SPADEQA04: 'https://preprod-es-www-ps.flutterseatech.com', PR: 'https://www.pokerstars.es' },
    'FR-PS':    { QC: 'https://test-fr-www-ps.sisal.it', SPADEQA05: 'https://preprod-fr-www-ps.flutterseatech.com', PR: 'https://www.pokerstars.fr' },
    'GR-PS':    { QC: 'https://www-pokerstars-gr-qa.pragmatic.starsweb.io', SPADEQA02: 'https://www-pokerstars-gr-cert.pragmatic.starsweb.io' },
    'IT-PS':    { QC: 'https://test-www-pokerstars.sisal.it', SPADEQA06: 'https://preprod-www.pokerstars.it', PR: 'https://www.pokerstars.it' },
    'NZ-PS':    { QC: 'https://www-pokerstars-nz-qa.pragmatic.starsweb.io', SPADEQA02: 'https://www-pokerstars-nz-cert.pragmatic.starsweb.io' },
    'PT-PS':    { QC: 'https://test-pt-www-ps.sisal.it', SPADEQA03: 'https://preprod-pt-www-ps.flutterseatech.com', PR: 'https://www.pokerstars.pt' },
    'RO-PS':    { QC: 'https://www-pokerstars-ro-qa.pragmatic.starsweb.io', SPADEQA02: 'https://www-pokerstars-ro-cert.pragmatic.starsweb.io' },
    'SE-PS':    { QC: 'https://www-pokerstars-se-qa.pragmatic.starsweb.io', SPADEQA02: 'https://www-pokerstars-se-cert.pragmatic.starsweb.io' },
    'SISAL-IT': { QC: 'https://test-www.sisal.it', SPADEQA06: 'https://preprod-www.sisal.it', PR: 'https://www.sisal.it' },
    'SNAI-IT':  { QC: 'https://test-www-snai.flutterseatech.it', SPADEQA06: 'https://preprod-www-snai.flutterseatech.it', PR: 'https://www.snai.it' },
    'UK-BF':    { QC: 'https://poker.betfair.com.nxt.ppbdev.com' },
    'UK-PP':    { QC: 'https://www.paddypower.com.nxt.ppbdev.com' },
    'UK-SBG':   { QC: 'https://skybet.com.nxt.ppbdev.com' },
  };

  const POKER_BASE_URLS = {
    'BE-PS':    { QC: 'https://psn.pokerstars.be.qc-dev.starsweb.io', SPADEQA02: 'https://psn.pokerstars.be.spadeqa02.starsweb.io' },
    'BG-PS':    { QC: 'https://psn.pokerstars.bg.qc-dev.starsweb.io' },
    'COM-BF':   { QC: 'https://www.betfair.pokerstars.com.qc-dev.starsweb.io' },
    'COM-PP':   { QC: 'https://www.paddypower.pokerstars.com.qc-dev.starsweb.io' },
    'COM-PS':   { QC: 'https://psn.pokerstars.com.qc-dev.starsweb.io', SPADEQA02: 'https://psn.pokerstars.com.spadeqa02.starsweb.io' },
    'COM-SBG':  { QC: 'https://www.skypoker.pokerstars.com.qc-dev.starsweb.io' },
    'DE-PS':    { QC: 'https://psn.pokerstars.de.qc-dev.starsweb.io', SPADEQA02: 'https://psn.pokerstars.de.spadeqa02.starsweb.io' },
    'DK-PS':    { QC: 'https://psn.pokerstars.dk.qc-dev.starsweb.io', SPADEQA02: 'https://psn.pokerstars.dk.spadeqa02.starsweb.io' },
    'EE-PS':    { QC: 'https://psn.pokerstars.ee.qc-dev.starsweb.io', SPADEQA02: 'https://psn.pokerstars.ee.spadeqa02.starsweb.io' },
    'ES-PS':    { QC: 'https://psn.pokerstars.es.qc-sisal1.starsweb.io', SPADEQA04: 'https://psn.pokerstars.es.spadeqa04.starsweb.io' },
    'FR-PS':    { QC: 'https://psn.pokerstars.fr.qc-sisal1.starsweb.io', SPADEQA05: 'https://psn.pokerstars.fr.spadeqa05.starsweb.io' },
    'GR-PS':    { QC: 'https://psn.pokerstars.gr.qc-dev.starsweb.io', SPADEQA02: 'https://psn.pokerstars.gr.spadeqa02.starsweb.io' },
    'IT-PS':    { QC: 'https://psn.pokerstars.it.qc-sisal1.starsweb.io', SPADEQA06: 'https://psn.pokerstars.it.spadeqa06.starsweb.io', PR: 'https://psn.pokerstars.it' },
    'NZ-PS':    { QC: 'https://psn.pokerstars.nz.qc-dev.starsweb.io', SPADEQA02: 'https://psn.pokerstars.nz.spadeqa02.starsweb.io' },
    'PT-PS':    { QC: 'https://psn.pokerstars.pt.qc-sisal1.starsweb.io', SPADEQA03: 'https://psn.pokerstars.pt.spadeqa03.starsweb.io' },
    'RO-PS':    { QC: 'https://psn.pokerstars.ro.qc-dev.starsweb.io', SPADEQA02: 'https://psn.pokerstars.ro.spadeqa02.starsweb.io' },
    'SE-PS':    { QC: 'https://psn.pokerstars.se.qc-dev.starsweb.io', SPADEQA02: 'https://psn.pokerstars.se.spadeqa02.starsweb.io' },
    'SISAL-IT': { QC: 'https://www.sisal.pokerstars.it.qc-sisal1.starsweb.io', SPADEQA06: 'https://www.sisal.pokerstars.it.spadeqa06.starsweb.io', PR: 'https://www.sisal.pokerstars.it' },
    'SNAI-IT':  { QC: 'https://www.snai.pokerstars.it.qc-poker1.starsweb.io', SPADEQA06: 'https://www.snai.pokerstars.it.spadeqa06.starsweb.io', PR: 'https://www.snai.pokerstars.it' },
    'UK-BF':    { QC: 'https://www.betfair.pokerstars.uk.qc-dev.starsweb.io' },
    'UK-PP':    { QC: 'https://www.paddypower.pokerstars.uk.qc-dev.starsweb.io' },
    'UK-SBG':   { QC: 'https://www.skypoker.pokerstars.uk.qc-dev.starsweb.io' },
  };

  // ------------------------------------------------------------
  // Data: native builds / users / systems
  // ------------------------------------------------------------
  const ARTIFACTORY_TARGETS = [
    { key: 'PR',        label: 'PR',          sub: 'Pull request builds' },
    { key: 'QA_CORE',   label: 'QA_CORE',     sub: 'QA core packages' },
    { key: 'SPADEQA02', label: 'SPADEQA02',   sub: 'Spade QA 02' },
    { key: 'SPADEQA03', label: 'SPADEQA03',   sub: 'Spade QA 03' },
    { key: 'SPADEQA04', label: 'SPADEQA04',   sub: 'Spade QA 04' },
    { key: 'SPADEQA05', label: 'SPADEQA05',   sub: 'Spade QA 05' },
    { key: 'SPADEQA06', label: 'SPADEQA06',   sub: 'Spade QA 06' },
  ];

  const NATIVE_ROOT = [
    {
      key: 'artifactory',
      title: 'Artifactory',
      desc: 'QA packages and PR builds',
      icon: iconArchive(),
      badges: ['Native · QA'],
    },
    {
      key: 'applive',
      title: 'App Live · BrowserStack',
      desc: 'Live testing on real devices in the browser',
      icon: iconDevice(),
      href: 'https://app-live.browserstack.com/',
      external: true,
      badges: ['Live Test'],
    },
    {
      key: 'slack',
      title: 'Slack · #builds',
      desc: 'For all the latest builds. If you can’t find it in Artifactory, check here.',
      icon: iconSlack(),
      href: 'https://flutter.enterprise.slack.com/archives/C08PA9GAZ2L',
      external: true,
      badges: ['Team Channel'],
    },
  ];

  const USER_TARGETS = [
    {
      title: 'Jenkins · User Creation Tool',
      desc: 'Create a user and set table name via the standard Jenkins job.',
      href: 'https://build.pyrsoftware.ca/job/PSN/job/E2E/job/User%20Creation%20Tool/build',
      icon: iconWrench(),
      badges: ['Jenkins · E2E'],
    },
    {
      title: 'hUKI UCT · Backend',
      desc: 'hUKI partner-specific User Creation Tool (backend only).',
      href: 'https://uct.nxt.ppbdev.com/',
      icon: iconServer(),
      badges: ['hUKI', 'Backend'],
    },
  ];

  const SYSTEM_TARGETS = [
    { title: 'QA',      sub: 'tools1-qa',     href: 'https://tools1-qa.pyrsoftware.ca:5556/admin/index.shtml',     badges: ['Main · QA'] },
    { title: 'QA2',     sub: 'tools1-qa2',    href: 'https://tools1-qa2.pyrsoftware.ca:5556/admin/index.shtml',    badges: ['Main · QA2'] },
    { title: 'QA_CORE', sub: 'tools1-qacore', href: 'https://tools1-qacore.pyrsoftware.ca:5556/admin/index.shtml', badges: ['Main · Core'] },
  ];

  // ------------------------------------------------------------
  // Inline SVG icons
  // ------------------------------------------------------------
  function svg(pathD, opts) {
    opts = opts || {};
    return (
      '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
      '<path fill="' + (opts.fill || 'currentColor') + '" d="' + pathD + '"/>' +
      '</svg>'
    );
  }
  function iconArchive() { return svg('M3 4h18v4H3zm1 6h16v10a1 1 0 01-1 1H5a1 1 0 01-1-1zm5 2v2h6v-2z'); }
  function iconDevice()  { return svg('M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zm-5 19a1 1 0 110-2 1 1 0 010 2zm5-4H7V4h10z'); }
  function iconSlack()   { return svg('M6 15a2 2 0 110-4h2v4zm1 0a2 2 0 114 0v5a2 2 0 11-4 0zm2-9a2 2 0 110-4 2 2 0 012 2v2zm0 1a2 2 0 010 4H4a2 2 0 110-4zm9 2a2 2 0 110 4h-2V9zm-1 0a2 2 0 11-4 0V4a2 2 0 114 0zm-2 9a2 2 0 110-4 2 2 0 012 2v2zm0-1a2 2 0 010-4h5a2 2 0 110 4z'); }
  function iconWrench()  { return svg('M22 6.7l-3.2 3.2-3.7-3.7L18.3 3a5.5 5.5 0 00-6.8 6.8l-9 9L4.7 20.7l9-9A5.5 5.5 0 0022 6.7z'); }
  function iconServer()  { return svg('M4 3h16a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm2 3v2h2V6zm-2 7h16a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6a1 1 0 011-1zm2 3v2h2v-2z'); }
  function iconGlobe()   { return svg('M12 2a10 10 0 100 20 10 10 0 000-20zm7.94 9H16.8a17 17 0 00-1.4-5.5A8 8 0 0119.94 11zM12 4c1.5 0 2.94 2.06 3.7 6.5H8.3C9.06 6.06 10.5 4 12 4zM4.06 11a8 8 0 015.54-5.5A17 17 0 007.2 11H4.06zM4.06 13H7.2a17 17 0 001.4 5.5A8 8 0 014.06 13zM12 20c-1.5 0-2.94-2.06-3.7-6.5h7.4C14.94 17.94 13.5 20 12 20zm3.4-1.5a17 17 0 001.4-5.5h3.14a8 8 0 01-4.54 5.5z'); }
  function iconChip()    { return svg('M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 017 7 7 7 0 01-7 7 7 7 0 01-7-7 7 7 0 017-7zm-1 3v2h2V8zm-3 3v2h2v-2zm6 0v2h2v-2zm-3 3v2h2v-2z'); }

  // ------------------------------------------------------------
  // Small helpers
  // ------------------------------------------------------------
  function el(html) {
    const wrap = document.createElement('div');
    wrap.innerHTML = html.trim();
    return wrap.firstElementChild;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function extractTerritoryFromLicense(license) {
    // Everything before the last hyphen (e.g. "SNAI-IT" → "SNAI", "COM-BF" → "COM")
    const idx = license.lastIndexOf('-');
    return idx === -1 ? license : license.slice(0, idx);
  }
  function extractBrandFromLicense(license) {
    const idx = license.lastIndexOf('-');
    return idx === -1 ? '' : license.slice(idx + 1);
  }

  function groupLicensesByTerritory(licenses) {
    const map = new Map();
    licenses.forEach(function (lic) {
      const terr = extractTerritoryFromLicense(lic);
      if (!map.has(terr)) map.set(terr, []);
      map.get(terr).push(lic);
    });
    return map;
  }

  // ------------------------------------------------------------
  // State + hash-based routing
  // ------------------------------------------------------------
  const state = {
    tab: 'environments',
    // environments path: [partner, territory, license]
    envPath: [],
    // native path: [section]  e.g. ['artifactory']
    nativePath: [],
  };

  function safeDecode(seg) {
    try { return decodeURIComponent(seg); } catch (e) { return seg; }
  }

  function readHash() {
    const raw = (location.hash || '').replace(/^#\/?/, '');
    if (!raw) return { tab: 'environments' };
    const parts = raw.split('/').filter(Boolean).map(safeDecode);
    const tab = parts.shift() || 'environments';
    return { tab: tab, rest: parts };
  }

  function writeHash() {
    let h = '#/' + state.tab;
    if (state.tab === 'environments' && state.envPath.length) {
      h += '/' + state.envPath.map(encodeURIComponent).join('/');
    } else if (state.tab === 'native' && state.nativePath.length) {
      h += '/' + state.nativePath.map(encodeURIComponent).join('/');
    }
    if (location.hash !== h) {
      // pushState creates a real history entry so Back/Forward restores prior state.
      // Back/Forward across pushState entries still fires the existing hashchange listener.
      history.pushState(null, '', h);
    }
  }

  function applyHash() {
    const parsed = readHash();
    const validTabs = ['environments', 'native', 'users', 'systems'];
    state.tab = validTabs.indexOf(parsed.tab) !== -1 ? parsed.tab : 'environments';
    state.envPath = state.tab === 'environments' ? (parsed.rest || []) : [];
    state.nativePath = state.tab === 'native' ? (parsed.rest || []) : [];
  }

  // ------------------------------------------------------------
  // Tabs
  // ------------------------------------------------------------
  function setActiveTab(name) {
    state.tab = name;
    state.envPath = [];
    state.nativePath = [];
    writeHash();
    render();
  }

  document.addEventListener('click', function (e) {
    const tab = e.target.closest('[data-tab]');
    if (tab) {
      setActiveTab(tab.dataset.tab);
    }
  });

  window.addEventListener('hashchange', function () {
    applyHash();
    render();
  });

  // ------------------------------------------------------------
  // Render: environment tab
  // ------------------------------------------------------------
  function renderEnvironments() {
    const body = document.getElementById('env-body');
    const crumbs = document.getElementById('env-crumbs');
    clear(body);
    clear(crumbs);

    const [partnerKey, territoryKey, licenseKey] = state.envPath;
    const partner = partnerKey ? PARTNERS[partnerKey] : null;

    // Breadcrumbs
    crumbs.appendChild(makeCrumb('Partner', partner ? 'link' : 'current', function () {
      state.envPath = [];
      writeHash(); render();
    }));

    if (partner) {
      crumbs.appendChild(sep());
      const isCurrent = !territoryKey;
      crumbs.appendChild(makeCrumb(partner.name, isCurrent ? 'current' : 'link', function () {
        state.envPath = [partnerKey];
        writeHash(); render();
      }));
    }
    if (territoryKey) {
      crumbs.appendChild(sep());
      const label = TERRITORY_LABELS[territoryKey] || territoryKey;
      const isCurrent = !licenseKey;
      crumbs.appendChild(makeCrumb(label, isCurrent ? 'current' : 'link', function () {
        state.envPath = [partnerKey, territoryKey];
        writeHash(); render();
      }));
    }
    if (licenseKey) {
      crumbs.appendChild(sep());
      crumbs.appendChild(makeCrumb(licenseKey, 'current'));
    }

    // Step 1: Partners
    if (!partner) {
      body.appendChild(renderPartnerGrid());
      return;
    }

    // Step 2: Territories for partner
    if (!territoryKey) {
      body.appendChild(renderTerritoryGrid(partner));
      return;
    }

    // If territory has multiple licenses (hUKI) and no license selected → brand pick
    const licensesInTerritory = partner.licenses.filter(function (l) {
      return extractTerritoryFromLicense(l) === territoryKey;
    });

    if (!licenseKey && licensesInTerritory.length > 1) {
      body.appendChild(renderBrandGrid(partner, territoryKey, licensesInTerritory));
      return;
    }

    // Only accept licenseKey when it belongs to the selected partner + territory.
    // Fall back to sole-license auto-selection, else show the empty state.
    let resolvedLicense = null;
    if (licenseKey) {
      if (licensesInTerritory.indexOf(licenseKey) !== -1) {
        resolvedLicense = licenseKey;
      }
    } else if (licensesInTerritory.length === 1) {
      resolvedLicense = licensesInTerritory[0];
    }

    if (!resolvedLicense) {
      body.appendChild(el('<div class="empty">No licenses configured for this territory.</div>'));
      return;
    }

    body.appendChild(renderLicenseEnvironments(resolvedLicense));
  }

  function renderPartnerGrid() {
    const grid = el('<div class="grid grid-lg"></div>');
    Object.keys(PARTNERS).forEach(function (key) {
      const p = PARTNERS[key];
      const card = el(
        '<button class="card" type="button">' +
          '<div class="card-head">' +
            '<span class="card-icon" aria-hidden="true">' + escapeHtml(p.icon) + '</span>' +
            '<span class="card-title">' + escapeHtml(p.name) + '</span>' +
          '</div>' +
          '<p class="card-desc">' + escapeHtml(p.tagline) + '</p>' +
          '<div class="badge-row"><span class="badge">' + p.licenses.length + ' licenses</span></div>' +
        '</button>'
      );
      card.addEventListener('click', function () {
        state.envPath = [key];
        writeHash(); render();
      });
      grid.appendChild(card);
    });
    return grid;
  }

  function renderTerritoryGrid(partner) {
    const groups = groupLicensesByTerritory(partner.licenses);
    const grid = el('<div class="grid"></div>');
    Array.from(groups.keys()).sort().forEach(function (terr) {
      const licensesHere = groups.get(terr);
      const label = TERRITORY_LABELS[terr] || terr;
      const flag = TERRITORY_FLAG[terr] || '♠';
      const licSummary = licensesHere.length > 1
        ? licensesHere.length + ' brands · ' + licensesHere.join(', ')
        : licensesHere[0];
      const card = el(
        '<button class="card" type="button">' +
          '<div class="card-head">' +
            '<span class="card-icon" aria-hidden="true">' + escapeHtml(flag) + '</span>' +
            '<span class="card-title">' + escapeHtml(label) + '</span>' +
          '</div>' +
          '<p class="card-sub"><code>' + escapeHtml(terr) + '</code></p>' +
          '<p class="card-desc">' + escapeHtml(licSummary) + '</p>' +
        '</button>'
      );
      card.addEventListener('click', function () {
        state.envPath = [partner.key, terr];
        writeHash(); render();
      });
      grid.appendChild(card);
    });
    return grid;
  }

  function renderBrandGrid(partner, territory, licenses) {
    const grid = el('<div class="grid"></div>');
    licenses.forEach(function (lic) {
      const brand = extractBrandFromLicense(lic);
      const brandLabel = BRAND_LABELS[brand] || brand;
      const card = el(
        '<button class="card" type="button">' +
          '<div class="card-head">' +
            '<span class="card-icon" aria-hidden="true">♣</span>' +
            '<span class="card-title">' + escapeHtml(brandLabel) + '</span>' +
          '</div>' +
          '<p class="card-sub"><code>' + escapeHtml(lic) + '</code></p>' +
          '<p class="card-desc">' + escapeHtml((TERRITORY_LABELS[territory] || territory) + ' · ' + brandLabel) + '</p>' +
        '</button>'
      );
      card.addEventListener('click', function () {
        state.envPath = [partner.key, territory, lic];
        writeHash(); render();
      });
      grid.appendChild(card);
    });
    return grid;
  }

  function renderLicenseEnvironments(license) {
    const wrap = document.createDocumentFragment();
    const territory = extractTerritoryFromLicense(license);
    const brand = extractBrandFromLicense(license);
    const brandLabel = BRAND_LABELS[brand] || brand;
    const territoryLabel = TERRITORY_LABELS[territory] || territory;

    const header = el(
      '<div class="license-header">' +
        '<span class="lh-code">' + escapeHtml(license) + '</span>' +
        '<span class="lh-title">' + escapeHtml(territoryLabel + ' · ' + brandLabel) + '</span>' +
        '<span class="lh-meta">Pick an environment, then choose Base or Poker URL.</span>' +
      '</div>'
    );
    wrap.appendChild(header);

    const base = PARTNER_BASE_URLS[license] || {};
    const poker = POKER_BASE_URLS[license] || {};
    const envKeys = ENV_ORDER.filter(function (k) { return base[k] || poker[k]; });

    if (!envKeys.length) {
      wrap.appendChild(el('<div class="empty">No environments configured for ' + escapeHtml(license) + '.</div>'));
      return wrap;
    }

    const grid = el('<div class="env-grid"></div>');
    envKeys.forEach(function (envKey) {
      const meta = ENV_META[envKey] || { label: envKey, sub: '', tone: 'gold' };
      const card = document.createElement('div');
      card.className = 'env-card';
      card.innerHTML =
        '<h3>' + escapeHtml(meta.label) +
          ' <span class="badge ' + (meta.tone === 'red' ? 'badge-red' : '') + '">' + escapeHtml(envKey) + '</span>' +
        '</h3>' +
        '<div class="env-sub">' + escapeHtml(meta.sub) + '</div>' +
        '<div class="link-row">' +
          (base[envKey] ? makeLinkButton(base[envKey], 'Base URL', 'base') : '') +
          (poker[envKey] ? makeLinkButton(poker[envKey], 'Poker URL', 'poker') : '') +
        '</div>';
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function makeLinkButton(href, label, kind) {
    // Show host portion as monospace subtitle
    let host = href;
    try { host = new URL(href).host; } catch (e) { /* keep raw */ }
    const tagClass = kind === 'poker' ? 'link-tag tag-poker' : 'link-tag';
    return (
      '<a class="link-btn" href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer">' +
        '<span>' + escapeHtml(label) + '</span>' +
        '<span class="link-sub">' + escapeHtml(host) + '</span>' +
        '<span class="' + tagClass + '">' + (kind === 'poker' ? 'Poker' : 'Base') + '</span>' +
      '</a>'
    );
  }

  function makeCrumb(label, kind, onClick) {
    const cls = 'crumb' + (kind === 'link' ? ' is-link' : '') + (kind === 'current' ? ' is-current' : '');
    const node = document.createElement(onClick ? 'button' : 'span');
    node.className = cls;
    if (onClick) {
      node.type = 'button';
      node.addEventListener('click', onClick);
    }
    node.textContent = label;
    return node;
  }
  function sep() {
    const s = document.createElement('span');
    s.className = 'sep';
    s.textContent = '›';
    return s;
  }

  // ------------------------------------------------------------
  // Render: native builds tab
  // ------------------------------------------------------------
  function renderNative() {
    const body = document.getElementById('native-body');
    const crumbs = document.getElementById('native-crumbs');
    clear(body);
    clear(crumbs);

    const [section] = state.nativePath;
    crumbs.appendChild(makeCrumb('Native Builds', section ? 'link' : 'current', function () {
      state.nativePath = [];
      writeHash(); render();
    }));
    if (section === 'artifactory') {
      crumbs.appendChild(sep());
      crumbs.appendChild(makeCrumb('Artifactory', 'current'));
    }

    if (section === 'artifactory') {
      body.appendChild(renderArtifactoryGrid());
      return;
    }

    const grid = el('<div class="grid grid-lg"></div>');
    NATIVE_ROOT.forEach(function (item) {
      const card = document.createElement(item.href ? 'a' : 'button');
      card.className = 'card';
      if (item.href) {
        card.href = item.href;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
      } else {
        card.type = 'button';
        card.addEventListener('click', function () {
          state.nativePath = [item.key];
          writeHash(); render();
        });
      }
      card.innerHTML =
        '<div class="card-head">' +
          '<span class="card-icon">' + item.icon + '</span>' +
          '<span class="card-title">' + escapeHtml(item.title) + '</span>' +
        '</div>' +
        '<p class="card-desc">' + escapeHtml(item.desc) + '</p>' +
        '<div class="badge-row">' + (item.badges || []).map(function (b) {
          return '<span class="badge">' + escapeHtml(b) + '</span>';
        }).join('') + '</div>';
      grid.appendChild(card);
    });
    body.appendChild(grid);
  }

  function renderArtifactoryGrid() {
    const grid = el('<div class="grid"></div>');
    ARTIFACTORY_TARGETS.forEach(function (t) {
      const url = 'https://artifactory.pyrsoftware.ca/ui/repos/tree/General/MobileNG-QA-Packages/' + t.key;
      const card = el(
        '<a class="card" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' +
          '<div class="card-head">' +
            '<span class="card-icon">' + iconArchive() + '</span>' +
            '<span class="card-title">' + escapeHtml(t.label) + '</span>' +
          '</div>' +
          '<p class="card-desc">' + escapeHtml(t.sub) + '</p>' +
          '<div class="badge-row"><span class="badge">Artifactory</span></div>' +
        '</a>'
      );
      grid.appendChild(card);
    });
    return grid;
  }

  // ------------------------------------------------------------
  // Render: users / systems
  // ------------------------------------------------------------
  function renderUsers() {
    const body = document.getElementById('users-body');
    clear(body);
    const grid = el('<div class="grid grid-lg"></div>');
    USER_TARGETS.forEach(function (u) {
      const card = el(
        '<a class="card" href="' + escapeHtml(u.href) + '" target="_blank" rel="noopener noreferrer">' +
          '<div class="card-head">' +
            '<span class="card-icon">' + u.icon + '</span>' +
            '<span class="card-title">' + escapeHtml(u.title) + '</span>' +
          '</div>' +
          '<p class="card-desc">' + escapeHtml(u.desc) + '</p>' +
          '<div class="badge-row">' + (u.badges || []).map(function (b) {
            return '<span class="badge">' + escapeHtml(b) + '</span>';
          }).join('') + '</div>' +
        '</a>'
      );
      grid.appendChild(card);
    });
    body.appendChild(grid);
  }

  function renderSystems() {
    const body = document.getElementById('systems-body');
    clear(body);
    const grid = el('<div class="grid"></div>');
    SYSTEM_TARGETS.forEach(function (s) {
      const card = el(
        '<a class="card" href="' + escapeHtml(s.href) + '" target="_blank" rel="noopener noreferrer">' +
          '<div class="card-head">' +
            '<span class="card-icon">' + iconChip() + '</span>' +
            '<span class="card-title">' + escapeHtml(s.title) + '</span>' +
          '</div>' +
          '<p class="card-sub"><code>' + escapeHtml(s.sub) + '</code></p>' +
          '<div class="badge-row">' + (s.badges || []).map(function (b) {
            return '<span class="badge">' + escapeHtml(b) + '</span>';
          }).join('') + '</div>' +
        '</a>'
      );
      grid.appendChild(card);
    });
    body.appendChild(grid);
  }

  // ------------------------------------------------------------
  // Top-level render
  // ------------------------------------------------------------
  function render() {
    // Tabs
    document.querySelectorAll('.tab').forEach(function (btn) {
      const active = btn.dataset.tab === state.tab;
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    // Panels
    document.querySelectorAll('.panel').forEach(function (p) {
      p.setAttribute('aria-hidden', p.dataset.panel === state.tab ? 'false' : 'true');
    });

    // Route the active tab's content
    switch (state.tab) {
      case 'environments': renderEnvironments(); break;
      case 'native':       renderNative();       break;
      case 'users':        renderUsers();        break;
      case 'systems':      renderSystems();      break;
    }
  }

  // Boot
  applyHash();
  render();
})();
