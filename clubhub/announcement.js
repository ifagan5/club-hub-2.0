import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, Timestamp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKBBs0TWerQno_u8yjNqV5qmvQImf6xA0",
  authDomain: "club-hub-2.firebaseapp.com",
  projectId: "club-hub-2",
  storageBucket: "club-hub-2.firebasestorage.app",
  messagingSenderId: "339870020143",
  appId: "1:339870020143:web:cc698c287ed642e3798cda",
  measurementId: "G-P97ML6ZP15"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ===== Helpers =====
const COL = "announcements";

function bannerDismissKey(a) {
  return `announcement_dismissed_${a.id}_${a.updatedAt || 0}_${a.endAt || ""}`;
}
function isDismissed(a) {
  return sessionStorage.getItem(bannerDismissKey(a)) === "1";
}
function setDismissed(a) {
  sessionStorage.setItem(bannerDismissKey(a), "1");
}

function insertAfterHeader(node) {
  const header = document.getElementById("header");
  if (header && header.parentNode) {
    header.parentNode.insertBefore(node, header.nextSibling);
  } else {
    document.body.insertBefore(node, document.body.firstChild);
  }
}

function createBanner(a) {
  const wrap = document.createElement("div");
  wrap.className = "site-announcement-banner";
  wrap.innerHTML = `
    <div class="banner-content">
      <div class="banner-text"></div>
      <button class="banner-close" aria-label="Dismiss" title="Dismiss">✕</button>
    </div>
  `;
  wrap.querySelector(".banner-text").textContent = a.message || "";

  wrap.querySelector(".banner-close").onclick = () => {
    setDismissed(a);
    wrap.remove();
  };

  return wrap;
}

// ===== Main Function (call this manually) =====
export async function renderActiveAnnouncements() {
  if (!db) return;

  // Remove any previously inserted banners
  document.querySelectorAll(".site-announcement-banner").forEach(n => n.remove());

  const snaps = await getDocs(collection(db, COL));
  const now = new Date();
  const active = [];

  snaps.forEach(s => {
    const d = s.data();
    if (d?.removed) return;
    if (d?.isActive === false) return;
    if (!d?.startAt || !d?.endAt) return;
    const start = new Date(d.startAt);
    const end = new Date(d.endAt);
    if (start <= now && now <= end) {
      active.push({ id: s.id, ...d });
    }
  });

  // newest first, max 3
  active.sort((a, b) => (b.startAt || "").localeCompare(a.startAt || ""));
  const toShow = active.slice(0, 3);

  // create a fixed container that will hold the banners stacked with spacing
  const container = document.createElement("div");
  container.id = "site-announcement-container";
  container.className = "site-announcement-container";
  document.body.appendChild(container);

  for (const a of toShow) {
    if (isDismissed(a)) continue;
    const banner = createBanner(a);

    // append into the fixed container so CSS gap controls spacing
    container.appendChild(banner);
  }
}
