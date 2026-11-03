(function () {
  var root = document.documentElement;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { /* storage may be unavailable */ }
    return null;
  }

  // theme
  var saved = store('theme');
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  document.getElementById('theme').addEventListener('click', function () {
    var current = root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    var next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    store('theme', next);
  });

  // project filters
  var chips = document.querySelectorAll('.chip');
  var cards = document.querySelectorAll('.card');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.getAttribute('data-filter');
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('active', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      cards.forEach(function (card) {
        var show = filter === 'all' || card.getAttribute('data-cat') === filter;
        card.hidden = !show;
        if (show) card.classList.add('in');
      });
    });
  });

  // scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // highlight the current section in the nav
  var links = {};
  document.querySelectorAll('[data-spy]').forEach(function (a) { links[a.getAttribute('data-spy')] = a; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          Object.keys(links).forEach(function (id) { links[id].classList.toggle('active', id === e.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  // replay the Connect Four animation
  var replay = document.getElementById('replay');
  if (replay) {
    replay.addEventListener('click', function () {
      var board = document.querySelector('.board');
      board.querySelectorAll('.disc').forEach(function (d) {
        d.style.animation = 'none';
        void d.getBoundingClientRect();
        d.style.animation = '';
      });
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
