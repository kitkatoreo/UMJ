/* results.js - semester selector, results table, interactive comparison chart */
initPage("results"); setupCharts();
const sel = document.getElementById("sem"), keys = Object.keys(UMJ.results);
sel.innerHTML = keys.map(k=>`<option>${k}</option>`).join(""); sel.value = keys[keys.length-1];
document.getElementById("cgpa").textContent = cgpa().toFixed(2);

let chart;
function render(){
  const k = sel.value, list = UMJ.results[k];
  document.getElementById("sgpa").textContent = gpaOf(list).toFixed(2);
  document.getElementById("sgpaLbl").textContent = k + " GPA";
  document.getElementById("tblTitle").textContent = k + " results";
  document.getElementById("resRows").innerHTML = list.map(c=>{const g=gradeOf(c.marks);
    return `<tr><td data-label="Code"><strong>${c.code}</strong></td><td data-label="Course">${c.name}</td><td data-label="Credits">${c.credits}</td>
    <td data-label="Marks">${c.marks}</td><td data-label="Grade"><span class="badge-soft ${g.points>=3.67?"b-ok":g.points>=2.67?"b-blue":"b-warn"}">${g.grade}</span></td>
    <td data-label="Points">${g.points.toFixed(2)}</td></tr>`;}).join("");

  const data = {labels:list.map(c=>c.code),datasets:[
    {label:"You",data:list.map(c=>c.marks),backgroundColor:"#142f87",borderRadius:6},
    {label:"Class average",data:list.map(c=>c.avg),backgroundColor:"#e0223a",borderRadius:6}]};
  if(chart){ chart.data=data; chart.update(); return; }
  chart = new Chart(cmpChart,{type:"bar",data,options:{responsive:true,maintainAspectRatio:false,indexAxis:"y",
    scales:{x:{min:0,max:100,title:{display:true,text:"Marks"}}},plugins:{legend:{position:"bottom"},
    tooltip:{callbacks:{title:t=>list[t[0].dataIndex].name}}}}});
}
sel.addEventListener("change",render); render();
