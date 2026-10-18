/* Brand Cargo — main.js (kutubxonasiz, oddiy JS) */
document.documentElement.classList.add("js");

/* ---------- Menyu (OPEN / CLOSE) ---------- */
(() => {
  const btn = document.querySelector(".menu-toggle");
  const menu = document.getElementById("site-menu");
  if (!btn || !menu) return;
  const set = (open) => {
    document.body.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    if (open) menu.querySelector("a")?.focus();
  };
  btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => set(false)));
})();

/* ---------- Header soyasi ---------- */
(() => {
  const h = document.querySelector(".site-header");
  if (!h) return;
  const on = () => h.classList.toggle("is-scrolled", window.scrollY > 8);
  on();
  window.addEventListener("scroll", on, { passive: true });
})();

/* =========================================================
   ANIMATSIYALAR (v3)
   Hammasi "prefers-reduced-motion" da o'chadi.
   ========================================================= */
const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Sarlavhalarni so'zlarga bo'lish: har bir so'z pastdan "chiqadi" */
const splitWords = (el) => {
  if (el.dataset.split) return;
  el.dataset.split = "1";
  el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          const w = document.createElement("span");
          w.className = "w"; w.setAttribute("aria-hidden", "true");
          const inner = document.createElement("span");
          inner.textContent = part;
          inner.style.transitionDelay = `${i++ * 45}ms`;
          w.appendChild(inner); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
    });
  };
  walk(el);
  el.classList.add("words");
};

if (!REDUCE) {
  /* 1) Sarlavhalar */
  document.querySelectorAll(".hero .h1, .page-hero .h1, .article-hero__box .h1").forEach((h) => { splitWords(h); h.classList.add("split--load"); });
  document.querySelectorAll("main .h2").forEach((h) => { splitWords(h); h.classList.add("reveal-self"); });

  /* 2) Guruhlar: kartalar birin-ketin chiqadi */
  document.querySelectorAll(".cards, .news-grid, .trucks, .stats, .proof, .faq__list, .contact__info, .site-footer .container").forEach((group) => {
    group.classList.remove("reveal");
    [...group.children].forEach((child, n) => {
      child.classList.add("reveal");
      child.style.transitionDelay = `${Math.min(n, 8) * 80}ms`;
    });
  });

  /* 3) Sahifa yuklanganda hero ketma-ketligi */
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("is-loaded")));
} else {
  document.documentElement.classList.add("is-loaded");
}

/* Scroll'da paydo bo'luvchi sarlavhalar */
(() => {
  const els = document.querySelectorAll(".reveal-self");
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -10% 0px" });
  els.forEach((el) => io.observe(el));
})();

/* Yuqorida yo'l + yuk mashinasi: sahifa qancha o'qilganini ko'rsatadi */
(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const road = document.createElement("div");
  road.className = "road";
  road.setAttribute("aria-hidden", "true");
  road.innerHTML = '<div class="road__fill"></div><img class="road__truck" src="' +
    (document.querySelector('link[rel="stylesheet"]').getAttribute("href").replace("css/style.css", "icons/svc-truck.webp")) +
    '" alt="" width="34" height="34">';
  header.appendChild(road);
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(scrollY / max, 1) : 0;
    road.style.setProperty("--p", p.toFixed(4));
    road.classList.toggle("is-moving", scrollY > 4);
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update);
  update();
})();

/* Parallaks: rasmlar scroll bilan sekin siljiydi */
(() => {
  if (REDUCE) return;
  const items = [...document.querySelectorAll(".hero__media img, .hero__video, .cta__bg, .article-hero > img, .drive img, .quote__img")];
  if (!items.length) return;
  items.forEach((img) => img.classList.add("parallax"));
  let ticking = false;
  const update = () => {
    const vh = innerHeight;
    items.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const center = (r.top + r.height / 2 - vh / 2) / vh; // -1..1
      img.style.setProperty("--py", `${(center * -6).toFixed(2)}%`);
    });
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update);
  update();
})();

/* "How it works": marshrut chizig'i scroll bilan to'ladi, bekatlar yonadi */
(() => {
  document.querySelectorAll(".steps").forEach((list) => {
    list.classList.add("steps--route");
    const steps = [...list.children];
    let ticking = false;
    const update = () => {
      const r = list.getBoundingClientRect();
      const mark = innerHeight * 0.65;
      const p = Math.min(Math.max((mark - r.top) / r.height, 0), 1);
      list.style.setProperty("--route", p.toFixed(4));
      steps.forEach((s) => s.classList.toggle("is-passed", s.getBoundingClientRect().top + 30 < mark));
      ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  });
})();

/* Kursorga ergashuvchi yorug'lik (kartalar ustida) — faqat sichqoncha bo'lsa */
(() => {
  if (REDUCE || !matchMedia("(hover: hover)").matches) return;
  document.querySelectorAll(".card, .truck, .news-card__img").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
})();

/* ---------- Scroll'da paydo bo'lish ---------- */
(() => {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-visible")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("is-visible"); io.unobserve(el);
      // kechikish faqat paydo bo'lishda kerak — keyin hover darhol ishlasin
      setTimeout(() => { el.style.transitionDelay = ""; }, 1500);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => io.observe(el));
})();

/* ---------- Raqamlar (count-up) ----------
   HTML ichida yakuniy raqam yozilgan (SEO va JS'siz holat uchun).
   data-count="30" data-suffix="+" — animatsiya 0 dan shu songacha. */
(() => {
  const els = document.querySelectorAll("[data-count]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!els.length || reduce || !("IntersectionObserver" in window)) return;
  const run = (el) => {
    const end = parseFloat(el.dataset.count);
    const pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    const dur = 1600, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(end * eased).toLocaleString("en-US") + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.6 });
  els.forEach((el) => io.observe(el));
})();

/* ---------- Slider ---------- */
document.querySelectorAll("[data-slider]").forEach((root) => {
  const track = root.querySelector(".slider__track");
  const slides = [...track.children];
  const dotsWrap = root.querySelector(".slider__dots");
  let i = 0, timer;
  const dots = slides.map((_, n) => {
    const b = document.createElement("button");
    b.className = "slider__dot";
    b.type = "button";
    b.setAttribute("aria-label", `Slide ${n + 1}`);
    b.addEventListener("click", () => { go(n); restart(); });
    dotsWrap.appendChild(b);
    return b;
  });
  const go = (n) => {
    i = (n + slides.length) % slides.length;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.style.transform = `translateX(${-i * (slides[0].offsetWidth + gap)}px)`;
    dots.forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
    slides.forEach((s, k) => s.setAttribute("aria-hidden", String(k !== i)));
  };
  const restart = () => { clearInterval(timer); timer = setInterval(() => go(i + 1), 5000); };
  root.querySelector(".slider__arrow--prev")?.addEventListener("click", () => { go(i - 1); restart(); });
  root.querySelector(".slider__arrow--next")?.addEventListener("click", () => { go(i + 1); restart(); });
  // Telefonda barmoq bilan surish
  let x0 = null;
  track.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); restart(); }
    x0 = null;
  });
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", restart);
  window.addEventListener("resize", () => go(i));
  go(0); restart();
});

/* ---------- Formalar (quote, haydovchi arizasi, mashina so'rovi) ----------
   Formalar Web3Forms orqali emailga yuboradi (bepul).
   1) https://web3forms.com dan brandcargous@gmail.com uchun access key oling
   2) Barcha sahifalardagi  YOUR_WEB3FORMS_ACCESS_KEY  ni shu kalitga almashtiring (VS Code: Cmd+Shift+H). */
document.querySelectorAll("[data-contact-form]").forEach((form) => {
  const status = form.querySelector(".form__status");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const key = form.querySelector('[name="access_key"]').value;
    const data = new FormData(form);
    if (!key || key.startsWith("YOUR_")) {
      // Kalit qo'yilmagan bo'lsa — email ilovasini ochadi
      const skip = ["access_key", "subject", "botcheck"];
      const body = [...data.entries()].filter(([k]) => !skip.includes(k)).map(([k, v]) => `${k}: ${v}`).join("\n");
      location.href = `mailto:${form.dataset.fallbackEmail}?subject=${encodeURIComponent(data.get("subject") || "Website inquiry")}&body=${encodeURIComponent(body)}`;
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; status.className = "form__status"; status.textContent = "Sending…";
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      form.reset();
      status.classList.add("is-ok");
      status.textContent = "Thank you! We'll get back to you shortly.";
    } catch (err) {
      status.classList.add("is-err");
      status.textContent = "Something went wrong. Please call us at (513) 653-4448.";
    } finally { btn.disabled = false; }
  });
});

/* ---------- Hero video ----------
   Harakatni kamaytirish yoqilgan bo'lsa video to'xtab turadi (poster ko'rinadi).
   Pauza tugmasi: 5 soniyadan uzun avtomatik video uchun (WCAG 2.2.2). */
document.querySelectorAll(".hero__media--video").forEach((wrap) => {
  const v = wrap.querySelector("video");
  const btn = wrap.querySelector(".video-toggle");
  const sync = () => {
    btn.classList.toggle("is-paused", v.paused);
    btn.setAttribute("aria-label", v.paused ? "Play video" : "Pause video");
  };
  if (REDUCE) { v.removeAttribute("autoplay"); v.pause(); }
  v.addEventListener("play", sync); v.addEventListener("pause", sync);
  btn.addEventListener("click", () => (v.paused ? v.play() : v.pause()));
  // Ekrandan chiqqanda to'xtatib, batareya/trafikni tejaydi
  if ("IntersectionObserver" in window && !REDUCE) {
    new IntersectionObserver(([e]) => {
      if (btn.dataset.user === "paused") return;
      e.isIntersecting ? v.play().catch(() => {}) : v.pause();
    }, { threshold: 0.1 }).observe(v);
    btn.addEventListener("click", () => { btn.dataset.user = v.paused ? "paused" : ""; });
  }
  sync();
});

/* ---------- Yil ---------- */
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
