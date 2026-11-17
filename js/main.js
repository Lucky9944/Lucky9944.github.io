(() => {
  const root = document.documentElement;

  // Theme toggle (initial theme set inline in <head>)
  document.getElementById("themeToggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // Active nav item
  const links = [...document.querySelectorAll("#nav a")];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  links.forEach(a => {
    const s = document.querySelector(a.getAttribute("href"));
    if (s) spy.observe(s);
  });

  // Reveal on scroll
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      reveal.unobserve(e.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(el => reveal.observe(el));

  // Stat counters (final values are in the HTML as fallback)
  const counter = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      let n = 0;
      const step = () => {
        el.textContent = ++n;
        if (n < target) setTimeout(step, 900 / target);
      };
      step();
      counter.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach(el => {
    el.textContent = "0";
    counter.observe(el);
  });

  // Tenure, e.g. "7 yrs 8 mos", counted inclusively like LinkedIn
  document.querySelectorAll(".tenure").forEach(el => {
    const [y, m] = el.dataset.from.split("-").map(Number);
    const now = new Date();
    const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m) + 1;
    const yrs = Math.floor(months / 12), mos = months % 12;
    el.textContent = [yrs && `${yrs} yr${yrs > 1 ? "s" : ""}`, mos && `${mos} mo${mos > 1 ? "s" : ""}`].filter(Boolean).join(" ");
  });

  // Skill filter
  const tabs = document.querySelectorAll(".tab");
  const groups = document.querySelectorAll(".sg");
  tabs.forEach(tab => tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.toggle("active", t === tab));
    const f = tab.dataset.filter;
    groups.forEach(g => g.classList.toggle("hidden", f !== "all" && g.dataset.cat !== f));
  }));

  // Certificate lightbox
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCap");
  const closeLb = () => lb.classList.remove("open");
  document.querySelectorAll(".cert").forEach(c => c.addEventListener("click", () => {
    lbImg.src = c.dataset.src;
    lbImg.alt = c.dataset.title;
    lbCap.textContent = c.dataset.title;
    lb.classList.add("open");
  }));
  document.getElementById("lbClose").addEventListener("click", closeLb);
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLb(); });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
