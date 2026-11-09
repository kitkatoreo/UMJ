/* courses.js - searchable/filterable course table + credit chart */
initPage("courses"); setupCharts();
const rows = document.getElementById("courseRows"), q = document.getElementById("q"), cat = document.getElementById("cat");
const statusBadge = s => s==="Ongoing"?"b-ok":(s==="Completed"||s==="Registered")?"b-blue":"b-bad";

function render(){
  const term = q.value.toLowerCase(), c = cat.value;
  const list = UMJ.courses.filter(x=>(!c||x.category===c) && (x.code+x.name+x.lecturer).toLowerCase().includes(term));
  rows.innerHTML = list.map(x=>`<tr>
    <td data-label="Code"><strong>${x.code}</strong></td>
    <td data-label="Course">${x.name}<div class="small text-muted">${x.lecturer} &middot; ${x.venue}</div></td>
    <td data-label="Credit hours">${x.credits}</td>
    <td data-label="Timetable">${x.slot}</td>
    <td data-label="Attendance" style="min-width:110px">${x.attendance===null
      ? `<span class="small text-muted">Classes not started</span>`
      : `<div class="small">${x.attendance}%</div><div class="progress" role="progressbar" aria-valuenow="${x.attendance}" aria-valuemin="0" aria-valuemax="100" aria-label="Attendance ${x.attendance}%"><div class="progress-bar" style="width:${x.attendance}%"></div></div>`}</td>
    <td data-label="Status"><span class="badge-soft ${statusBadge(x.status)}">${x.status}</span></td></tr>`).join("");
  document.getElementById("empty").classList.toggle("d-none", list.length>0);
}
q.addEventListener("input",render); cat.addEventListener("change",render); render();

/* Credit hours by category (doughnut) */
const byCat={}; UMJ.courses.forEach(c=>byCat[c.category]=(byCat[c.category]||0)+c.credits);
const total=Object.values(byCat).reduce((a,b)=>a+b,0);
document.getElementById("creditSub").textContent = total+" credit hours registered";
new Chart(creditChart,{type:"doughnut",data:{labels:Object.keys(byCat),datasets:[{data:Object.values(byCat),backgroundColor:["#142f87","#2f5fd0","#f4a3ad"],borderWidth:2}]},
  options:{responsive:true,maintainAspectRatio:false,cutout:"60%",plugins:{legend:{position:"bottom"},tooltip:{callbacks:{label:t=>` ${t.label}: ${t.raw} credit hours (${Math.round(t.raw/total*100)}%)`}}}}});
