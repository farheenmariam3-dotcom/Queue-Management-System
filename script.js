let queue = [];
let completed = [];
let tokenCounter = 1;

document.addEventListener('DOMContentLoaded', function () {

  // Hamburger
  document.getElementById('navToggle').addEventListener('click', function () {
    document.getElementById('navLinks').classList.toggle('open');
  });

  // Smooth scroll for all internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = document.querySelector('.site-header').offsetHeight +
                     document.querySelector('.site-nav').offsetHeight +
                     document.querySelector('.announce-bar').offsetHeight;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
      document.getElementById('navLinks').classList.remove('open');
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('#home, #admin, #user');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-148px 0px -55% 0px', threshold: 0 });

  sections.forEach(function (s) { observer.observe(s); });
});

function toggleSearch() {
  document.getElementById('searchOverlay').classList.toggle('open');
  if (document.getElementById('searchOverlay').classList.contains('open')) {
    document.getElementById('topSearch').focus();
  }
}

function scrollTo(hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  const offset = document.querySelector('.site-header').offsetHeight +
                 document.querySelector('.site-nav').offsetHeight +
                 document.querySelector('.announce-bar').offsetHeight;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
}

function generateToken() {
  const token = "A" + String(tokenCounter).padStart(3, '0');
  queue.push(token);
  tokenCounter++;
  document.getElementById("totalTokens").innerText = tokenCounter - 1;
  document.getElementById("waitingCount").innerText = queue.length;
  updateQueue();
  showNotification("Your token is <strong>" + token + "</strong> — please wait.");
}

function callNext() {
  if (queue.length === 0) {
    showNotification("No tokens are currently waiting.", true);
    return;
  }
  const current = queue.shift();
  document.getElementById("nowServing").innerText = current;
  document.getElementById("heroNowServing").innerText = current;
  completed.push(current);
  document.getElementById("completedCount").innerText = completed.length;
  document.getElementById("waitingCount").innerText = queue.length;
  updateQueue();
  showNotification("<strong>" + current + "</strong> — please proceed to Counter 1.");
}

function updateQueue() {
  const el = document.getElementById("queueList");
  if (queue.length === 0) {
    el.innerHTML = '<p class="q-empty">No tokens in queue</p>';
    return;
  }
  el.innerHTML = queue.map(function (t, i) {
    return '<div class="q-item"><span>' + t + '</span><span class="q-pos">Position ' + (i + 1) + '</span></div>';
  }).join('');
}

function searchToken() {
  const val = document.getElementById("searchToken").value.toUpperCase().trim();
  const res = document.getElementById("searchResult");
  if (!val) { res.textContent = "Please enter a token number."; return; }
  const pos = queue.indexOf(val);
  if (pos !== -1) {
    res.textContent = val + " is at position " + (pos + 1) + " in the queue.";
  } else if (completed.includes(val)) {
    res.textContent = val + " has already been served. ✓";
  } else {
    res.textContent = "Token " + val + " was not found.";
  }
}

function handleTopSearch() {
  const val = document.getElementById("topSearch").value.toUpperCase().trim();
  if (!val) return;
  document.getElementById("searchToken").value = val;
  scrollTo('#user');
  setTimeout(searchToken, 700);
  toggleSearch();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function showNotification(message, warn) {
  const div = document.createElement("div");
  div.innerHTML = message;
  Object.assign(div.style, {
    position: "fixed",
    bottom: "28px",
    right: "28px",
    background: warn ? "#8a7060" : "#5c7d60",
    color: "white",
    padding: "14px 22px",
    borderRadius: "4px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    zIndex: "9999",
    fontSize: "13px",
    fontFamily: "'Lato', sans-serif",
    fontWeight: "400",
    letterSpacing: "0.3px",
    maxWidth: "300px",
    lineHeight: "1.6",
    opacity: "1",
    transition: "opacity 0.4s",
  });
  document.body.appendChild(div);
  setTimeout(() => { div.style.opacity = "0"; }, 2800);
  setTimeout(() => { div.remove(); }, 3200);
}
