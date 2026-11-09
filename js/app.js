/* ==========================================================
   app.js - Shared layout (navbar/footer), auth guard, helpers
   Every protected page calls initPage('<active-page>')
   ========================================================== */
const NAV = [
  {id:"dashboard",    group:"Main",     label:"Home",         href:"dashboard.html",    icon:"bi-house-door"},
  {id:"courses",      group:"Academic", label:"My Courses",   href:"courses.html",      icon:"bi-journal-bookmark"},
  {id:"registration", group:"Academic", label:"Registration", href:"registration.html", icon:"bi-plus-circle"},
  {id:"results",      group:"Academic", label:"Results",      href:"results.html",      icon:"bi-award"},
  {id:"finance",      group:"Services", label:"Finance",      href:"finance.html",      icon:"bi-wallet2"},
  {id:"letters",      group:"Services", label:"Letters",      href:"letters.html",      icon:"bi-envelope-paper"}
];

function currentUser(){ try{ return JSON.parse(sessionStorage.getItem("umj_user")); }catch(e){ return null; } }
function logout(){ sessionStorage.removeItem("umj_user"); location.href="../index.html"; }

function initPage(active){
  const user = currentUser();
  if(!user){ location.replace("../index.html"); return; }          // auth guard
  const initials = user.name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();

  document.getElementById("app-navbar").innerHTML = `
  <nav class="umj-nav sticky-top" aria-label="Top bar">
    <div class="container-fluid px-3 py-2 d-flex align-items-center gap-3">
      <button class="menu-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#sideMenu" aria-controls="sideMenu" aria-label="Open menu"><i class="bi bi-list"></i></button>
      <a class="umj-brand" href="dashboard.html"><img class="umj-crest" src="../images/logo.png" alt="UMJ crest">
        <span class="d-none d-sm-block">${UMJ.uni}<small>Student Portal</small></span></a>
      <div class="ms-auto d-flex align-items-center gap-2">
        <span class="avatar" aria-hidden="true">${initials}</span>
        <span class="small fw-semibold d-none d-md-inline">${user.name}</span>
        <button class="btn btn-outline-primary btn-sm ms-1" onclick="logout()"><i class="bi bi-box-arrow-right"></i><span class="d-none d-sm-inline"> Log out</span></button>
      </div>
    </div>
  </nav>
  <div class="offcanvas offcanvas-start umj-side" tabindex="-1" id="sideMenu" aria-labelledby="sideLabel">
    <div class="offcanvas-header">
      <div class="side-title" id="sideLabel">MENU</div>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close menu"></button>
    </div>
    <div class="offcanvas-body p-0">
      <div class="side-user"><span class="avatar" aria-hidden="true">${initials}</span>
        <div><div class="fw-semibold lh-sm">${user.name}</div><small class="text-muted">${user.id}</small></div></div>
      <nav aria-label="Main navigation">
        ${["Main","Academic","Services"].map(g => `
          <div class="side-group">${g}</div>
          <ul class="side-list">${NAV.filter(n => n.group === g).map(n => `<li><a href="${n.href}" class="${n.id===active?"active":""}" ${n.id===active?'aria-current="page"':""}><i class="bi ${n.icon}"></i>${n.label}</a></li>`).join("")}</ul>`).join("")}
      </nav>
      <div class="side-foot"><button class="btn btn-outline-primary w-100" onclick="logout()"><i class="bi bi-box-arrow-right me-1"></i>Log out</button></div>
    </div>
  </div>`;

  document.getElementById("app-footer").innerHTML = `
  <footer class="umj-footer" role="contentinfo">
    <div class="container">
      <div class="row g-4">
        <div class="col-md-5"><img src="../images/logo.png" alt="UMJ crest" height="64" class="mb-2"><h6>${UMJ.uni}</h6>
          <p class="small mb-0">Jalan Universiti, 81310 Skudai, Johor, Malaysia.<br>Student portal for course, result and campus information.</p></div>
        <div class="col-6 col-md-3"><h6>Portal</h6>
          <ul>${NAV.map(n=>`<li><a href="${n.href}">${n.label}</a></li>`).join("")}</ul></div>
        <div class="col-6 col-md-4"><h6>Support</h6>
          <ul><li><i class="bi bi-envelope me-1"></i>helpdesk@umj.edu.my</li>
          <li><i class="bi bi-telephone me-1"></i>+60 7-555 0123</li>
          <li><i class="bi bi-clock me-1"></i>Mon-Fri, 8:30am-5:00pm</li></ul></div>
      </div>
      <div class="copy d-flex flex-wrap justify-content-between gap-2">
        <span>&copy; ${new Date().getFullYear()} ${UMJ.uni}. IMS566 individual project (prototype).</span>
        <span>Built with Bootstrap 5 &amp; Chart.js</span>
      </div>
    </div>
  </footer>`;
}

/* Shared chart defaults */
function setupCharts(){
  Chart.defaults.font.family = "'Plus Jakarta Sans',sans-serif";
  Chart.defaults.color = "#5b6b88";
}
const BLUES = ["#142f87","#2f5fd0","#e0223a","#f4a3ad","#0b1f5c"];

/* Weekly timetable built from UMJ.courses (used on Dashboard + Registration) */
function timetableHTML(){
  return ["Mon","Tue","Wed","Thu","Fri"].map(d => {
    const items = UMJ.courses.filter(c => parseSlot(c.slot).day === d).sort((a,b) => parseSlot(a.slot).s - parseSlot(b.slot).s);
    return `<div class="tt-row"><span class="tt-day">${d}</span><div class="tt-items">${items.length
      ? items.map(c => `<span class="tt-chip" title="${c.name}"><strong>${c.code}</strong> ${c.slot.split(" ")[1]}</span>`).join("")
      : '<span class="text-muted small">No class</span>'}</div></div>`;
  }).join("");
}
