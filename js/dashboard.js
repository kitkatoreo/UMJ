/* dashboard.js - summary cards, 3 charts, announcements */
initPage("dashboard"); setupCharts();
const S = UMJ.student, all = Object.values(UMJ.results).flat();
const credits = UMJ.courses.reduce((a,c)=>a+c.credits,0);
const attCourses = UMJ.courses.filter(c=>c.attendance!==null);   // new courses have no attendance yet
const attAvg = Math.round(attCourses.reduce((a,c)=>a+c.attendance,0)/attCourses.length);
const user = currentUser();

document.getElementById("welcome").textContent = "Welcome back, " + user.name.split(" ")[0];
document.getElementById("heroSub").textContent = `${S.programme} | ${S.faculty} | Semester ${S.semester}`;

const stats = [
  {i:"bi-mortarboard", v:cgpa().toFixed(2), l:"Cumulative GPA"},
  {i:"bi-journal-check", v:credits, l:"Credit hours this semester"},
  {i:"bi-calendar-check", v:attAvg+"%", l:"Average attendance"},
  {i:"bi-wallet2", v:"RM "+totalDue().toFixed(2), l:"Outstanding fees (see Finance)"}
];
document.getElementById("stats").innerHTML = stats.map(s=>`
  <div class="col-6 col-lg-3"><div class="panel stat"><span class="ico"><i class="bi ${s.i}"></i></span>
  <div><div class="val">${s.v}</div><div class="lbl">${s.l}</div></div></div></div>`).join("");

/* Chart 1: GPA trend (line) */
const sems = Object.keys(UMJ.results), gpas = sems.map(k=>+gpaOf(UMJ.results[k]).toFixed(2));
new Chart(gpaChart,{type:"line",data:{labels:sems,datasets:[
  {label:"Semester GPA",data:gpas,borderColor:"#142f87",backgroundColor:"rgba(47,95,208,.12)",fill:true,tension:.35,pointRadius:5,pointBackgroundColor:"#142f87"},
  {label:"CGPA",data:sems.map((_,i)=>+gpaOf(sems.slice(0,i+1).flatMap(k=>UMJ.results[k])).toFixed(2)),borderColor:"#e0223a",borderDash:[6,6],pointRadius:3,tension:.35}]},
  options:{responsive:true,maintainAspectRatio:false,scales:{y:{min:2.5,max:4,title:{display:true,text:"GPA"}}},plugins:{legend:{position:"bottom"}}}});

/* Chart 2: Grade distribution (doughnut) */
const gc={}; all.forEach(c=>{const g=gradeOf(c.marks).grade; gc[g]=(gc[g]||0)+1;});
new Chart(gradeChart,{type:"doughnut",data:{labels:Object.keys(gc),datasets:[{data:Object.values(gc),backgroundColor:["#0b1f5c","#142f87","#2f5fd0","#e0223a","#f4a3ad","#dce5fb"],borderWidth:2}]},
  options:{responsive:true,maintainAspectRatio:false,cutout:"62%",plugins:{legend:{position:"bottom"},tooltip:{callbacks:{label:t=>` ${t.label}: ${t.raw} courses`}}}}});

/* Chart 3: Attendance (bar, red-ish when < 80%) */
new Chart(attChart,{type:"bar",data:{labels:attCourses.map(c=>c.code),datasets:[{label:"Attendance %",data:attCourses.map(c=>c.attendance),
  backgroundColor:attCourses.map(c=>c.attendance<80?"#e07b7b":"#2f5fd0"),borderRadius:8}]},
  options:{responsive:true,maintainAspectRatio:false,scales:{y:{min:0,max:100}},plugins:{legend:{display:false},
  tooltip:{callbacks:{title:t=>attCourses[t[0].dataIndex].name}}}}});

/* Announcements */
document.getElementById("notices").innerHTML = UMJ.announcements.map(n=>`
  <div class="notice"><span class="badge-soft b-blue">${n.tag}</span>
  <div class="fw-semibold mt-1">${n.title}</div><time>${n.date}</time></div>`).join("");

/* Current courses table + weekly timetable (auto-updates after registration) */
const stBadge = st => st==="Ongoing"?"b-ok":(st==="Completed"||st==="Registered")?"b-blue":"b-bad";
document.getElementById("curSub").textContent = `${UMJ.courses.length} courses | ${credits} credit hours`;
document.getElementById("curRows").innerHTML = UMJ.courses.map(c=>`<tr>
  <td data-label="Code"><strong>${c.code}</strong></td>
  <td data-label="Course">${c.name}<div class="small text-muted">${c.lecturer} &middot; ${c.venue}</div></td>
  <td data-label="Credit hours">${c.credits}</td><td data-label="Timetable">${c.slot}</td>
  <td data-label="Status"><span class="badge-soft ${stBadge(c.status)}">${c.status}</span></td></tr>`).join("");
document.getElementById("ttGrid").innerHTML = timetableHTML();
