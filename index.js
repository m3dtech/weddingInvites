// ========================
// ELEMENTS
// ========================
const envelope = document.getElementById("envelopeWrapper");
const dashboard = document.getElementById("dashboard");
const mainPage = document.getElementById("All");

// ========================
// URL PARAMS
// ========================
const params = new URLSearchParams(window.location.search);

const id = params.get("id");
const guest = params.get("guest");
const adminKey = params.get("adminKey");

// ========================
// CONFIG
// ========================
const CONFIG = {
  enableCountDown: true,
  enableGuests: true,
  enableDashboard: true,
  adminKey: "admin"
};

// ========================
// DEFAULT DATA
// ========================
const Data = {
  private: false,
  NameMale: "Ahmed",
  NameFamale: "Salma",
  eventShow: "2026-12-1",
  eventDate: new Date("2026-12-01T20:00:00"),
  locationName: "القاهرة",
  locationLink: "https://google.com",
};

// ========================
// STATE
// ========================
let isOpen = false;
let isAnimating = false;
let countdownInterval = null;

// ========================
// ENVELOPE CONTROL
// ========================
if (envelope) {
  envelope.addEventListener("click", () => {
    if (isAnimating) return;

    isAnimating = true;

    if (!isOpen) openEnvelope();
    else closeEnvelope();
  });
}

function openEnvelope() {
  envelope.classList.add("open");
  isOpen = true;

  setTimeout(() => (isAnimating = false), 1000);
}

function closeEnvelope() {
  envelope.classList.remove("open");
  isOpen = false;

  setTimeout(() => (isAnimating = false), 700);
}

// ========================
// DASHBOARD CONTROL
// ========================
function handleDashboard() {
  if (CONFIG.enableDashboard && id && adminKey === CONFIG.adminKey) {
    dashboard.style.display = "flex";
    mainPage.style.display = "none";
  } else {
    dashboard.style.display = "none";
    mainPage.style.display = "flex";
  }
}

// ========================
// COUNTDOWN
// ========================
function updateCountdown() {
  const now = new Date();
  const diff = Data.eventDate - now;

  const el = document.getElementById("countdown");
  if (!el) return;

  if (diff <= 0) {
    el.innerText = "بدأ الحدث 🎉";
    clearInterval(countdownInterval);
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  el.innerText = `⏳عد تنازلي: يوم ${d} - ${h}:${m}:${s}`;
}

// ========================
// SHARE
// ========================
function shareLink() {
  const link = window.location.href;

  if (navigator.share) {
    navigator.share({ text: link });
  } else {
    prompt("انسخ الرابط:", link);
  }
}

// ========================
// EVENTS
// ========================
const watermark = document.getElementById("watermark");
if (watermark) {
  watermark.addEventListener("click", () => {
    window.open("https://your-site.com", "_blank");
  });
}

const locationBtn = document.getElementById("location");
if (locationBtn) {
  locationBtn.addEventListener("click", () => {
    window.open(Data.locationLink, "_blank");
  });
}

// ========================
// SHOW DATA
// ========================
function showData() {
  // Guest Name
  const guestEl = document.getElementById("guestName");

if (guestEl) {
  if (guest) {
    guestEl.innerText = `إلى ${guest}`;
  } else {
    guestEl.innerText = "";
  }
}
  // Countdown
  if (CONFIG.enableCountDown) {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }
  else{
    document.getElementById("countdown").style.display = "none";
  }

  // Names
  setText("nameBoy", Data.NameMale);
  setText("nameGirl", Data.NameFamale);

  // Date
  setText("dateTime", Data.eventShow);

  // Location
  setText("locationName", Data.locationName);

  const linkEl = document.getElementById("locationLink");
  if (linkEl) linkEl.href = Data.locationLink;
}

// ========================
// HELPERS
// ========================
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

// ========================
// INIT
// ========================
handleDashboard();
showData();

// ========================
// 🔐 ENCRYPTION
// ========================
function encodeData(data) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

function decodeData(encoded) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded))));
  } catch {
    return null;
  }
}

// ========================
// 📥 READ ENCRYPTED LINK
// ========================
const encoded = params.get("data");

if (encoded) {
  const decoded = decodeData(encoded);

  if (decoded) {
    if (decoded.guest) {
      document.getElementById("guestName").innerText = `إلى ${decoded.guest}`;
    }
  }
}

// ========================
// 💾 STORAGE
// ========================
function getGuests() {
  return JSON.parse(localStorage.getItem("guests") || "[]");
}

function saveGuests(data) {
  localStorage.setItem("guests", JSON.stringify(data));
}

// ========================
// 🔗 CREATE LINK
// ========================
function createLink() {
  const input = document.getElementById("guestInput");
  const result = document.getElementById("result");

  if (!input.value) {
    alert("اكتب اسم المدعو");
    return;
  }

  const inviteId = Date.now();

  const link = `${location.origin}?id=${inviteId}&guest=${encodeURIComponent(input.value)}`;

  let guests = getGuests();
  guests.push({
    id: inviteId,
    name: input.value,
    link: link
  });

  saveGuests(guests);
  renderGuests();

  result.innerText = link;
  input.value = "";
}

// ========================
// 🗑️ DELETE
// ========================
function deleteGuest(id) {
  let guests = getGuests();
  guests = guests.filter(g => g.id !== id);
  saveGuests(guests);
  renderGuests();
}

// ========================
// 📋 COPY
// ========================
function copyLink(link) {
  navigator.clipboard.writeText(link);
  alert("تم النسخ ✅");
}

// ========================
// 📃 RENDER LIST
// ========================
function renderGuests() {
  const list = document.getElementById("guestList");
  if (!list) return;

  list.innerHTML = "";

  const guests = getGuests();

  guests.forEach(g => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>${g.name}</span>
      <div>
        <button onclick="copyLink('${g.link}')">📋</button>
        <button onclick="deleteGuest(${g.id})">❌</button>
      </div>
    `;

    list.appendChild(li);
  });
}

// ========================
// 🚀 INIT LIST
// ========================
renderGuests();

/// LINKS

/*

?id=123&guest=Ahmed&adminKey=admin

*/

