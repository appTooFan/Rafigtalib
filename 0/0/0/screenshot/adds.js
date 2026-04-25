/*****************************************************************************************
 * adds.js (Compatible with new home.js)
 * - No jQuery
 * - Uses softNavigate + Back Manager (setCurrentView/goBackView)
 * - Safe selectors and safe footer binding
 *****************************************************************************************/

/* =========================
   0) Helpers (safe)
========================= */
function _qs(sel) { return document.querySelector(sel); }
function _qsa(sel){ return document.querySelectorAll(sel); }

function _show(sel, display = "block") { const el = _qs(sel); if (el) el.style.display = display; }
function _hide(sel) { const el = _qs(sel); if (el) el.style.display = "none"; }

// استخدم softNavigate لو موجودة في home.js، وإلا fallback
function _soft(fn, delay = 300) {
  if (typeof softNavigate === "function") return softNavigate(fn, delay);
  return setTimeout(fn, delay);
}

// classremove لو موجودة
function _reset() {
  if (typeof classremove === "function") classremove();
}

/* =========================
   1) Data: Adds list
========================= */
let data_List_Adds = [
  { img: "examPdf",           h1: "اخر الاخبار",            p: "اخر الاخبار خلال ٢٤ ساعه الاخيره", new: false },
  { img: "mobileapplication", h1: "المختبر + معمل كامل",    p: "تطبيقات والعاب مفيده تساعدك في الطب", new: "soon" },
  { img: "quiz",              h1: "معلومه على الطاير",      p: "معلومه على الطاير مفيده في الطب تتغير كل اسبوع", new: false },
  { img: "bookstore",         h1: "مستودع الملازم و الكتب", p: "مكتبه شامله تحتوي على كل الملازم المنهج والمراجع وملخصات", new: true },
  { img: "wordenglish",       h1: "طليق المصطلحات",         p: "كل المصطلحات الطبيه الخاصه بالمنهج مع ميزة نطق المصطلح", new: true }
];

/* =========================
   2) Render Adds screen
========================= */
function renderAddsHome() {
  // ✅ اجعل الرجوع يرجع للشاشة السابقة (اللي كانت محفوظة قبل الدخول)
  // لو ما كان محفوظ شيء يرجع للـ goBackView
  if (typeof setCurrentView === "function") {
    // لا نغير currentView هنا، لأننا داخل شاشة جديدة
    // الرجوع من adds يتم عبر goBackView الذي سيستدعي الشاشة السابقة المخزنة
    setCurrentView(renderAddsHome)
  }

  _reset();
  if (!window.change_Page) window.change_Page = _qs("#change_Page");

  change_Page.innerHTML = "";
  _hide(".views");

  change_Page.classList.add("adds");
 const hash = window.location.hash;
      const addsMatch = hash.match(/^#\/adds$/);
      if(!addsMatch)
  {
    history.pushState({page:"adds"},"",`#/adds`)
    
  } 
  // container = change_Page نفسه لأنه يحمل class adds الآن
  const container = change_Page;

  data_List_Adds.forEach((item, i) => {
    const card = document.createElement("div");
    card.classList.add("div_Items");

    const badge =
      item.new === true ? "جديد" :
      item.new === "soon" ? "قريباً" :
      "";

    card.innerHTML = `
      <img src="img/adds/${item.img}.png">
      <h1>${item.h1}</h1>
      <h3>${badge}</h3>
      <p>${item.p}</p>
    `;

    // ✅ ربط الضغط حسب رقم العنصر
    card.addEventListener("click", () => {
      if (i === 0) _soft(openNewsSection, 300);
      if (i === 2) _soft(openInfoFlySection, 300);
      // باقي الأقسام أنت توسعها لاحقاً
    });

    container.appendChild(card);
  });
}

/* =========================
   3) Footer binding (Adds button)
   - footerdiv[1] في كودك القديم
========================= */
(function bindFooterAdds(){
  // حاول نستخدم global footerdiv لو موجود
  let f = window.footerdiv;

  // لو غير موجود، نحاول نلتقطه من DOM
  if (!f || !f.length) {
    f = _qsa(".footer .img");
  }

  // إن لم يوجد Footer اخرج
  if (!f || !f.length) return;

  // زر الإضافات غالباً هو رقم 1 (مثل كودك)
  const addsBtn = f[1];
  if (!addsBtn) return;

  addsBtn.addEventListener("click", function(){
    // ✅ مهم: قبل الدخول لشاشة الإضافات احفظ الصفحة الحالية للرجوع
    setFooterActive(1)
    renderAddsHome()
  });
})();


/* =========================
   4) Section: News
========================= */
function openNewsSection() {
  // ✅ الرجوع من الأخبار يرجع لقائمة الإضافات
  if (typeof setCurrentView === "function") setCurrentView(renderAddsHome);
const hash = window.location.hash;
      const newsMatch = hash.match(/^#\/news$/);
      if(!newsMatch)
  {
    history.pushState({page:"news"},"",`#/news`)
    
  } 
  _reset();
  change_Page.innerHTML = "";
  change_Page.classList.add("section_News");

  change_Page.innerHTML = `
    <img src="img/old-tv.png"/>
    <h1>اخر الاخبار</h1>
    <p class="news_text"></p>
  `;

  const msg = `
🛑 اختبار الاسلاميه 🛑 <br>
قال الدكتور بالحرف : <br>
نفس الاختبار الشامل <br>
غير اني غيرت بعض الاجابات خليتها خطأ <br>
من شأن اختبر المركز من المطنن <br>
الاختبار 60 سؤال
  `;

  const p = _qs(".section_News .news_text");
  if (!p) return;

  // ✅ Typed fallback (إذا مكتبة Typed موجودة اشتغل بها، وإلا اعرض النص مباشرة)
  if (typeof Typed === "function") {
    new Typed(p, {
      strings: [msg],
      loop: false,
      typeSpeed: 35
    });
  } else {
    p.innerHTML = msg;
  }
}

/* =========================
   5) Section: Information Fly
========================= */
function openInfoFlySection() {
  // ✅ الرجوع من المعلومة يرجع لقائمة الإضافات
  if (typeof setCurrentView === "function") setCurrentView(renderAddsHome);

  _reset();
  change_Page.innerHTML = "";
  change_Page.classList.add("section_information_fly");

  change_Page.innerHTML = `
    <img src="img/adds/tools/information_Fly/painting.png"/>
    <h1>القلب</h1>
    <p>
      هو اقوى عضله في جسم الانسان وظيفتها ضخ الدم الى جميع اجزاء الجسم
      <br><br>
      وهي عضله ملساء وذات عمر طويل جدا
    </p>
  `;
}