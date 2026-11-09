/* registration.js - one-click course registration. Registered courses are saved
   (data.js merges them into UMJ.courses) so Dashboard / My Courses update automatically. */
initPage("registration"); setupCharts();
const R = UMJ.rules, S = UMJ.student, $ = id => document.getElementById(id);
const sum = (list, f) => list.reduce((a,x) => a + f(x), 0), credits = () => sum(UMJ.courses, c => c.credits);
let chart;
$("deadline").textContent = R.addDropCloses;

function notify(type, html){ const m = $("regMsg"); m.className = "alert alert-" + type; m.innerHTML = html; }
const isReg = c => UMJ.courses.some(x => x.code === c.code);

/* Why a course cannot be registered (empty = allowed) */
function reason(c){
  if(isReg(c)) return "Registered";
  if(c.seats === 0) return "Class full";
  if(c.minSem && S.semester < c.minSem) return `Semester ${c.minSem}+ only`;
  const miss = (c.prereq || []).filter(p => !passedCodes().includes(p));
  return miss.length ? "Needs " + miss.join(", ") : "";
}

/* Register: clash + credit-limit checks, then save */
function register(code){
  const c = UMJ.catalogue.find(x => x.code === code);
  const hit = UMJ.courses.find(x => clash(x.slot, c.slot));
  if(hit) return notify("warning", `${c.code} clashes with ${hit.code} (${hit.slot}). Choose another class.`);
  if(credits() + c.credits > R.maxCredits) return notify("warning", `Registering ${c.code} would make ${credits()+c.credits} credit hours. The limit is ${R.maxCredits}.`);
  saveRegCodes([...regCodes(), code]); UMJ.courses.push(toCourse(c)); renderAll();
  notify("success", `<strong>${c.code} - ${c.name}</strong> (${c.credits} credit hours) registered. <a href="dashboard.html" class="alert-link">See it on your Dashboard</a>.`);
}
function drop(code){
  saveRegCodes(regCodes().filter(x => x !== code)); UMJ.courses = UMJ.courses.filter(x => x.code !== code);
  renderAll(); notify("info", `${code} dropped.`);
}

function renderCatalogue(){
  const term = $("q").value.toLowerCase(), cat = $("cat").value;
  const list = UMJ.catalogue.filter(c => (!cat || c.category === cat) && (c.code + c.name + c.lecturer).toLowerCase().includes(term));
  $("catRows").innerHTML = list.map(c => {
    const r = reason(c), seat = c.seats === 0 ? ["Full","b-bad"] : [c.seats + " left", c.seats <= 5 ? "b-warn" : "b-ok"];
    return `<tr><td data-label="Code"><strong>${c.code}</strong></td>
    <td data-label="Course">${c.name}<div class="small text-muted">${c.lecturer} &middot; ${c.venue}${c.prereq ? " &middot; Prerequisite: " + c.prereq.join(", ") : ""}</div></td>
    <td data-label="Credit hours">${c.credits}</td><td data-label="Type"><span class="badge-soft b-blue">${c.category}</span></td>
    <td data-label="Timetable">${c.slot}</td><td data-label="Seats"><span class="badge-soft ${seat[1]}">${seat[0]}</span></td>
    <td data-label="">${r ? `<span class="small ${r==="Registered"?"text-success fw-semibold":"text-muted"}">${r==="Registered"?'<i class="bi bi-check-circle me-1"></i>':""}${r}</span>`
      : `<button class="btn btn-accent btn-sm" data-reg="${c.code}">Register</button>`}</td></tr>`;
  }).join("");
  $("empty").classList.toggle("d-none", list.length > 0);
}

function renderAdded(){
  const added = UMJ.courses.filter(c => c.added);
  $("addedRows").innerHTML = added.map(c => `<tr><td data-label="Code"><strong>${c.code}</strong></td><td data-label="Course">${c.name}</td>
    <td data-label="Credit hours">${c.credits}</td><td data-label="Timetable">${c.slot}</td>
    <td data-label=""><button class="btn btn-outline-danger btn-sm" data-drop="${c.code}">Drop</button></td></tr>`).join("");
  $("addedEmpty").classList.toggle("d-none", added.length > 0);
}

function renderStats(){
  const cards = [
    {i:"bi-journal-check", v:UMJ.courses.length, l:"Courses this semester"},
    {i:"bi-clock-history", v:credits(), l:"Credit hours registered"},
    {i:"bi-speedometer2", v:Math.max(R.maxCredits - credits(), 0), l:`Credit hours left (limit ${R.maxCredits})`},
    {i:"bi-calendar-event", v:R.addDropCloses, l:"Add/drop closes"}];
  $("regStats").innerHTML = cards.map(c => `<div class="col-6 col-lg-3"><div class="panel stat"><span class="ico"><i class="bi ${c.i}"></i></span>
    <div><div class="val fs-5">${c.v}</div><div class="lbl">${c.l}</div></div></div></div>`).join("");
}

function renderChart(){
  const used = credits(), left = Math.max(R.maxCredits - used, 0), newCr = sum(UMJ.courses.filter(c => c.added), c => c.credits);
  $("loadSub").textContent = `${used} of ${R.maxCredits} credit hours used`;
  const data = [used - newCr, newCr, left];
  if(chart){ chart.data.datasets[0].data = data; chart.update(); return; }
  chart = new Chart($("loadChart"), {type:"doughnut", data:{labels:["Existing courses","Registered here","Remaining"],
    datasets:[{data, backgroundColor:["#142f87","#2f5fd0","#dce5fb"], borderWidth:2}]},
    options:{responsive:true, maintainAspectRatio:false, cutout:"62%", plugins:{legend:{position:"bottom"},
    tooltip:{callbacks:{label:t => ` ${t.label}: ${t.raw} credit hours`}}}}});
}

function renderAll(){ renderStats(); renderCatalogue(); renderAdded(); renderChart(); $("tt").innerHTML = timetableHTML(); }

document.addEventListener("click", e => {
  const r = e.target.closest("[data-reg]"), d = e.target.closest("[data-drop]");
  if(r) register(r.dataset.reg);
  if(d && confirm(`Drop ${d.dataset.drop}?`)) drop(d.dataset.drop);
});
$("q").addEventListener("input", renderCatalogue); $("cat").addEventListener("change", renderCatalogue);
renderAll();
