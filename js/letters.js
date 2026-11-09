/* letters.js - ready-made letter templates. Student details are pre-filled;
   the student only types their name or draws a signature. */
initPage("letters"); setupCharts();
const LOGO = new URL("../images/logo.png", location.href).href;
const KEY = "umj_requests", S = UMJ.student, $ = id => document.getElementById(id);
const fmtDate = d => new Date(d).toLocaleDateString("en-MY",{day:"numeric",month:"short",year:"numeric"});
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const loadReq = () => { try{ return JSON.parse(localStorage.getItem(KEY)) || []; }catch(e){ return []; } };
let stored = loadReq(), chart, current, padDrawn = false;

/* ---------- Letter templates ---------- */
const TYPES = [
 {id:"leave", short:"Leave of absence", title:"Apply for leave of absence", icon:"bi-calendar-x", time:"5-7 working days", fee:"Free",
  desc:"Pause your studies for one semester.", subject:"APPLICATION FOR LEAVE OF ABSENCE", noteLabel:"Reason for leave",
  line:"would like to apply for a leave of absence for one (1) semester, starting from the next semester.",
  extra:"<p>I understand that I must settle any outstanding fees and inform my academic advisor before the leave begins.</p>"},
 {id:"resume", short:"Continue studies", title:"Continue studies", icon:"bi-arrow-repeat", time:"3-5 working days", fee:"Free",
  desc:"Resume your programme after an approved leave.", subject:"REQUEST TO CONTINUE STUDIES", noteLabel:"Leave approval reference",
  line:"would like to resume my studies in the next semester following my approved leave of absence.",
  extra:"<p>I understand that all outstanding fees must be settled before I can register for courses.</p>"},
 {id:"transcript", short:"Official transcript", title:"Request a transcript", icon:"bi-file-earmark-text", time:"3 working days", fee:"RM 10 per official copy",
  desc:"Get an official copy of your academic results.", subject:"REQUEST FOR OFFICIAL ACADEMIC TRANSCRIPT", noteLabel:"Purpose / delivery details",
  line:"would like to request <b>one (1) official copy</b> of my academic transcript.",
  extra:"<p>I understand that the fee is RM 10 per official copy and that the transcript will be ready in 3 working days.</p>"},
 {id:"confirm", short:"Confirmation of student status", title:"Confirmation of student status", icon:"bi-patch-check", time:"Instant", fee:"Free", instant:true,
  desc:"Proof that you are a registered student.", subject:"REQUEST FOR CONFIRMATION OF STUDENT STATUS", noteLabel:"Purpose of the letter",
  line:"would like to request an official letter confirming that I am currently a registered student of the university.", extra:""},
 {id:"internship", short:"Internship introduction letter", title:"Internship introduction letter", icon:"bi-briefcase", time:"3 working days", fee:"Free",
  desc:"Introduce yourself to a host company.", subject:"REQUEST FOR INTERNSHIP INTRODUCTION LETTER", noteLabel:"Company name and address",
  line:"would like to request an introduction letter to apply for an internship placement.",
  extra:"<p>Please address the letter to the host company named below.</p>"},
 {id:"clearance", short:"Fee clearance letter", title:"Fee clearance letter", icon:"bi-cash-coin", time:"2 working days", fee:"Free", needsClear:true,
  desc:"Confirms you have no unpaid fees or summons.", subject:"REQUEST FOR FEE CLEARANCE LETTER", noteLabel:"Purpose (e.g. graduation)",
  line:"would like to request a fee clearance letter confirming that I have no unpaid fees or summons.",
  extra:"<p>I understand that the letter can only be issued when my account balance is zero.</p>"}
];

/* The letter text (same for preview and print) */
function letterInner(t, note, ref){
  return `<p>Ref: ${ref}<br>Date: ${fmtDate(new Date())}</p>
  <p>The Registrar<br>Registry Office<br>${UMJ.uni}<br>Jalan Universiti, 81310 Skudai, Johor</p>
  <p>Dear Sir/Madam,</p><p><b>${t.subject}</b></p>
  <p>I, <b>${esc(S.name)}</b> (Student ID: ${S.id}), a student of <b>${esc(S.programme)}</b>, ${S.faculty}, currently in Semester ${S.semester}, ${t.line}</p>
  ${t.extra}${note ? `<p><b>${t.noteLabel}:</b> ${esc(note)}</p>` : ""}
  <p>Thank you for your kind consideration.</p><p>Yours faithfully,</p>`;
}

/* ---------- Type cards ---------- */
$("typeGrid").innerHTML = TYPES.map(t => `<div class="col-sm-6 col-lg-4"><button class="type-card" data-type="${t.id}">
  <span class="ico"><i class="bi ${t.icon}"></i></span><h3>${t.title}</h3><p>${t.desc}</p>
  <span class="type-meta"><span><i class="bi bi-clock me-1"></i>${t.time}</span><span><i class="bi bi-tag me-1"></i>${t.fee}</span></span></button></div>`).join("");

/* ---------- Open template (preview + sign) ---------- */
const modal = new bootstrap.Modal($("reqModal"));
function openForm(id){
  current = TYPES.find(t => t.id === id); padDrawn = false;
  $("reqTitle").textContent = current.title;
  const blocked = current.needsClear && totalDue() > 0;
  $("reqBody").innerHTML = `
    ${blocked ? `<div class="alert alert-warning">You still owe <strong>RM ${totalDue().toFixed(2)}</strong>. This letter can only be issued after you pay. <a href="finance.html">Go to Finance</a></div>` : ""}
    <p class="small text-muted">Your details are already filled in. Check the letter, then sign it at the bottom.</p>
    <div class="letter-paper"><div class="lh d-flex align-items-center gap-3"><img src="../images/logo.png" alt="" height="56"><div><strong>${UMJ.uni}</strong><small>Registry Office &middot; Jalan Universiti, 81310 Skudai, Johor</small></div></div>
      ${letterInner(current, "", "(assigned when you submit)")}</div>
    <div class="mt-3"><label class="form-label fw-semibold" for="f_note">${current.noteLabel} <span class="text-muted fw-normal">(optional)</span></label>
      <textarea id="f_note" class="form-control" rows="2" maxlength="300"></textarea></div>
    <div class="row g-3 mt-1">
      <div class="col-md-6"><label class="form-label fw-semibold" for="sigName">Type your full name</label>
        <input id="sigName" class="form-control" autocomplete="name" placeholder="Your full name"></div>
      <div class="col-md-6"><div class="d-flex justify-content-between"><span class="form-label fw-semibold mb-1">Or draw your signature</span>
        <button type="button" class="btn btn-link btn-sm p-0" id="sigClear">Clear</button></div><canvas id="sigPad" class="sig-canvas" aria-label="Signature pad"></canvas></div></div>
    <div id="sigErr" class="text-danger small mt-2 d-none" role="alert">Please type your name or draw your signature to sign this letter.</div>`;
  $("reqSubmit").disabled = blocked;
  modal.show();
}

/* Signature pad (starts after the modal is visible so the canvas has a size) */
$("reqModal").addEventListener("shown.bs.modal", () => {
  const cv = $("sigPad"); if(!cv) return;
  cv.width = cv.clientWidth; cv.height = cv.clientHeight;
  const ctx = cv.getContext("2d"); ctx.lineWidth = 2.2; ctx.lineCap = "round"; ctx.strokeStyle = "#0b1f5c";
  let down = false; const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.onpointerdown = e => { down = true; padDrawn = true; ctx.beginPath(); ctx.moveTo(...pos(e)); cv.setPointerCapture(e.pointerId); };
  cv.onpointermove = e => { if(down){ ctx.lineTo(...pos(e)); ctx.stroke(); } };
  cv.onpointerup = cv.onpointerleave = () => { down = false; };
  $("sigClear").onclick = () => { ctx.clearRect(0, 0, cv.width, cv.height); padDrawn = false; };
});

/* ---------- Sign & submit ---------- */
$("reqForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("sigName").value.trim();
  if(name.length < 3 && !padDrawn){ $("sigErr").classList.remove("d-none"); return; }
  $("sigErr").classList.add("d-none");
  const req = {ref:"LTR-" + Date.now().toString().slice(-6), type:current.id, short:current.short, date:fmtDate(new Date()),
    status:current.instant ? "Ready" : "Submitted", note:$("f_note").value.trim(), signedName:name, signature:padDrawn ? $("sigPad").toDataURL("image/png") : ""};
  stored.push(req);
  try{ localStorage.setItem(KEY, JSON.stringify(stored)); }catch(err){ /* storage full: request stays for this visit only */ }
  modal.hide(); renderAll();
  const m = $("reqMsg");
  m.textContent = current.instant ? `Signed and ready (ref ${req.ref}). Press "View / print" in the table below.`
                                  : `Signed and submitted (ref ${req.ref}). We will update the status within ${current.time}.`;
  m.classList.remove("d-none"); window.scrollTo({top:0, behavior:"smooth"});
});

/* ---------- Tracker + chart ---------- */
const statusCls = s => ({"Submitted":"b-blue","In review":"b-warn","Approved":"b-ok","Ready":"b-ok"}[s] || "b-blue");
const allReqs = () => [...stored.slice().reverse(), ...UMJ.requestSeeds];

function renderAll(){
  const list = allReqs();
  $("reqRows").innerHTML = list.map(r => `<tr><td data-label="Reference"><strong>${r.ref}</strong></td><td data-label="Request">${r.short}</td>
    <td data-label="Submitted">${r.date}</td><td data-label="Status"><span class="badge-soft ${statusCls(r.status)}">${r.status}</span></td>
    <td data-label=""><button class="btn btn-outline-primary btn-sm" data-view="${r.ref}"><i class="bi bi-printer me-1"></i>View / print</button></td></tr>`).join("");
  const counts = {}; list.forEach(r => counts[r.status] = (counts[r.status]||0) + 1);
  const data = {labels:Object.keys(counts), datasets:[{data:Object.values(counts), backgroundColor:["#142f87","#e0223a","#2f5fd0","#f4a3ad"], borderWidth:2}]};
  if(chart){ chart.data = data; chart.update(); return; }
  chart = new Chart($("statusChart"), {type:"doughnut", data, options:{responsive:true, maintainAspectRatio:false, cutout:"60%",
    plugins:{legend:{position:"bottom"}, tooltip:{callbacks:{label:t => ` ${t.label}: ${t.raw} request(s)`}}}}});
}

/* ---------- Signed letter in a new window (print / save as PDF) ---------- */
function transcriptTable(){
  return Object.entries(UMJ.results).map(([sem, list]) => `<h4>${sem} (GPA ${gpaOf(list).toFixed(2)})</h4>
    <table><tr><th>Code</th><th>Course</th><th>Credits</th><th>Grade</th><th>Points</th></tr>${list.map(c => { const g = gradeOf(c.marks);
    return `<tr><td>${c.code}</td><td>${esc(c.name)}</td><td>${c.credits}</td><td>${g.grade}</td><td>${g.points.toFixed(2)}</td></tr>`; }).join("")}</table>`).join("")
    + `<p><strong>Cumulative GPA: ${cgpa().toFixed(2)}</strong></p>`;
}
function openLetter(r){
  const t = TYPES.find(x => x.id === r.type), note = r.note || (r.details && r.details.company) || "";
  const img = r.signature ? `<img class="sigimg" src="${esc(r.signature)}" alt="Signature"><br>` : "";
  const typed = r.signedName || (!r.signature ? S.name : "");
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${esc(r.short)} - ${r.ref}</title><style>
    body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:0 24px;color:#14213d;line-height:1.6}
    .head{display:flex;align-items:center;gap:14px;border-bottom:3px solid #d8142a;padding-bottom:10px;margin-bottom:24px}.head h1{margin:0;color:#0b1f5c;font-size:22px}.head small{color:#5b6b88}
    .sigimg{height:70px}.typed{font-family:'Brush Script MT','Segoe Script',cursive;font-size:26px;color:#0b1f5c}
    table{border-collapse:collapse;width:100%;font-size:13px;margin-bottom:10px}th,td{border:1px solid #c9d3ee;padding:4px 8px;text-align:left}th{background:#f3f6fd}
    h4{margin:14px 0 4px;color:#142f87}.foot{margin-top:40px;font-size:11px;color:#5b6b88;border-top:1px solid #c9d3ee;padding-top:8px}
    </style></head><body><div class="head"><img src="${LOGO}" height="64" alt=""><div><h1>${UMJ.uni}</h1><small>Registry Office &middot; Jalan Universiti, 81310 Skudai, Johor</small></div></div>
    ${letterInner(t, note, r.ref)}${img}<div class="typed">${esc(typed)}</div>
    <div>${esc(S.name)}<br>Student ID: ${S.id}<br>${esc(S.programme)}</div>
    ${r.type === "transcript" ? `<h3>Attachment: academic record</h3>${transcriptTable()}` : ""}
    <div class="foot">Prototype letter for the IMS566 project. Status: ${esc(r.status)}.</div>
    <script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script></body></html>`;
  const w = window.open("", "_blank");
  if(!w) return alert("Please allow pop-ups to view the letter.");
  w.document.write(html); w.document.close();
}

document.addEventListener("click", e => {
  const t = e.target.closest("[data-type]"), v = e.target.closest("[data-view]");
  if(t) openForm(t.dataset.type);
  if(v) openLetter(allReqs().find(r => r.ref === v.dataset.view));
});
renderAll();
