# Brand Cargo — statik sayt

Oddiy HTML + CSS + JS. Hech qanday build yoki kutubxona kerak emas.

## Ishga tushirish (VS Code)

1. Papkani VS Code'da oching.
2. **Live Server** kengaytmasi bilan `index.html` ni oching (yo'llar `/assets/...` ko'rinishida, shuning uchun faylni ikki marta bosib ochish emas, server orqali ochish kerak).

## Tuzilma

```
index.html                 Bosh sahifa
about/index.html           /about
contact/index.html         /contact
news/index.html            /news
news/<slug>/index.html     4 ta maqola (URL'lar Framer'dagi bilan bir xil)
sell-truck/index.html      /sell-truck (ro'yxat)
sell-truck/<slug>/         Har bir mashinaning alohida sahifasi
careers/index.html         /careers — haydovchi yollash
404.html
assets/css/style.css       Barcha dizayn. Ranglar :root ichida
assets/js/main.js          Menyu, slider, animatsiyalar (sarlavhalar, parallaks, yo'l-progress, marshrut), forma
assets/img/                Rasmlar (WebP ga o'tkazilgan)
assets/icons/              Ikonkalar
assets/fonts/              Big Shoulders + Almarai (o'zimizda, Google'ga bog'liq emas)
sitemap.xml, robots.txt
```

## Ishga tushirishdan oldin qilinadigan ishlar

- [ ] **Domen**: barcha sahifalardagi `https://brandcargo.com` ni haqiqiy domenga almashtiring (VS Code: Cmd+Shift+H, ya'ni hamma fayllarda qidirib almashtirish). `sitemap.xml` va `robots.txt` ham shunga kiradi.
- [ ] **Formalar** (Quote, haydovchi arizasi, mashina so'rovi): https://web3forms.com dan `brandcargous@gmail.com` uchun bepul access key oling. So'ng hamma fayllardagi `YOUR_WEB3FORMS_ACCESS_KEY` ni shu kalitga almashtiring (Cmd+Shift+H). Kalit qo'yilmaguncha formalar foydalanuvchining email ilovasini ochadi.
- [ ] **MC / USDOT**: footer'dagi `footer__legal` qatoriga raqamlarni yozing va `hidden` ni o'chiring (hamma sahifalarda).
- [ ] **Ijtimoiy tarmoqlar**: footer'dagi `href="#"` larga Brand Cargo'ning haqiqiy sahifalarini qo'ying (barcha sahifalarda).
- [ ] **Mijozlar fikri**: bo'lim yashirilgan (`hidden`). Haqiqiy fikrlar bilan to'ldirgach yoqing.
- [ ] **Sotuvdagi mashinalar**: hozir 6 ta namunaviy mashina bor. Yangi mashina qo'shish uchun: `sell-truck/index.html` da bitta `<article class="truck">` kartani nusxalang, `sell-truck/` ichidagi bitta papkani ham nusxalab nomini o'zgartiring, keyin ikkalasidagi ma'lumotni almashtiring.

## Hosting

Har qanday statik hostingda ishlaydi: Netlify, Vercel, Cloudflare Pages, GitHub Pages. Papkani o'zini yuklang, sozlash shart emas.
