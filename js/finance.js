/* finance.js - summary cards, charts, invoice + summons tables, simulated payment */
initPage("finance"); setupCharts();
const F = UMJ.finance, rm = n => "RM " + n.toLocaleString("en-MY",{minimumFractionDigits:2,maximumFractionDigits:2});
const badge = s => s==="Paid"?"b-ok":s==="Partial"?"b-warn":"b-bad";
let catChart, histChart;

/* Summary cards */
function renderStats(){
  const all = [...F.invoices, ...F.summons];
  const billed = all.reduce((a,x)=>a+x.amount,0), paid = all.reduce((a,x)=>a+x.paid,0);
  const smnDue = F.summons.reduce((a,x)=>a+balanceOf(x),0);
  const cards = [
    {i:"bi-receipt", v:rm(billed), l:"Total billed"},
    {i:"bi-check2-circle", v:rm(paid), l:"Total paid"},
    {i:"bi-exclamation-circle", v:rm(totalDue()), l:"Outstanding balance"},
    {i:"bi-sign-stop", v:rm(smnDue), l:"Unpaid summons"}];
  document.getElementById("finStats").innerHTML = cards.map(c=>`
    <div class="col-6 col-lg-3"><div class="panel stat"><span class="ico"><i class="bi ${c.i}"></i></span>
    <div><div class="val fs-5">${c.v}</div><div class="lbl">${c.l}</div></div></div></div>`).join("");
}

/* Invoices table (with category filter) */
function renderInvoices(){
  const c = document.getElementById("invCat").value;
  document.getElementById("invRows").innerHTML = F.invoices.filter(x=>!c||x.cat===c).map(x=>{
    const st = statusOf(x);
    return `<tr><td data-label="Invoice"><strong>${x.id}</strong></td><td data-label="Description">${x.item}</td>
    <td data-label="Category"><span class="badge-soft b-blue">${x.cat}</span></td>
    <td data-label="Amount">${rm(x.amount)}</td><td data-label="Balance">${rm(balanceOf(x))}</td><td data-label="Due">${x.due}</td>
    <td data-label="Status"><span class="badge-soft ${badge(st)}">${st}</span></td>
    <td data-label="">${st!=="Paid"?`<button class="btn btn-primary btn-sm" data-pay="${x.id}">Pay ${rm(balanceOf(x))}</button>`:`<i class="bi bi-check-lg text-success"></i>`}</td></tr>`;}).join("");
}

/* Summons table */
function renderSummons(){
  document.getElementById("smnRows").innerHTML = F.summons.map(x=>{
    const st = statusOf(x);
    return `<tr><td data-label="Summons no."><strong>${x.id}</strong></td><td data-label="Offence">${x.item}</td>
    <td data-label="Date">${x.date}</td><td data-label="Location">${x.place}</td><td data-label="Amount">${rm(x.amount)}</td>
    <td data-label="Status"><span class="badge-soft ${badge(st)}">${st}</span></td>
    <td data-label="">${st!=="Paid"?`<button class="btn btn-primary btn-sm" data-pay="${x.id}">Pay ${rm(balanceOf(x))}</button>`:`<i class="bi bi-check-lg text-success"></i>`}</td></tr>`;}).join("");
}

/* Charts: paid vs outstanding by category, and monthly payment history */
function renderCharts(){
  const cats = ["Study fees","College","Summons","Others"], sum = (list,f)=>list.reduce((a,x)=>a+f(x),0);
  const grp = c => c==="Summons" ? F.summons : F.invoices.filter(x=>x.cat===c);
  const catData = {labels:cats, datasets:[
    {label:"Paid", data:cats.map(c=>sum(grp(c),x=>x.paid)), backgroundColor:"#142f87", borderRadius:6},
    {label:"Outstanding", data:cats.map(c=>sum(grp(c),balanceOf)), backgroundColor:"#e07b7b", borderRadius:6}]};
  const months = ["Aug","Sep","Oct","Nov"], paidIn = m => sum([...F.invoices,...F.summons].filter(x=>x.m===m),x=>x.paid);
  const histData = {labels:months, datasets:[{label:"Paid (RM)", data:months.map(paidIn), backgroundColor:"#2f5fd0", borderRadius:8}]};
  if(catChart){ catChart.data=catData; histChart.data=histData; catChart.update(); histChart.update(); return; }
  catChart = new Chart(document.getElementById("catChart"),{type:"bar",data:catData,options:{responsive:true,maintainAspectRatio:false,
    scales:{x:{stacked:true},y:{stacked:true,title:{display:true,text:"RM"}}},plugins:{legend:{position:"bottom"},tooltip:{callbacks:{label:t=>` ${t.dataset.label}: ${rm(t.raw)}`}}}}});
  histChart = new Chart(document.getElementById("histChart"),{type:"bar",data:histData,options:{responsive:true,maintainAspectRatio:false,
    scales:{y:{beginAtZero:true,title:{display:true,text:"RM"}}},plugins:{legend:{display:false},tooltip:{callbacks:{label:t=>" "+rm(t.raw)}}}}});
}

/* Financial aid list */
document.getElementById("aidList").innerHTML = F.aid.map(a=>`
  <div class="notice d-flex justify-content-between align-items-center gap-2">
    <div><div class="fw-semibold">${a.name}</div><time>${rm(a.amount)}</time></div>
    <span class="badge-soft ${a.status==="Pending"?"b-warn":"b-ok"}">${a.status}</span></div>`).join("");

/* Simulated payment: click "Pay" -> confirm -> mark as paid (resets on refresh) */
document.addEventListener("click", e=>{
  const btn = e.target.closest("[data-pay]"); if(!btn) return;
  const item = [...F.invoices,...F.summons].find(x=>x.id===btn.dataset.pay), due = balanceOf(item);
  if(!confirm(`Pay ${rm(due)} for ${item.id}? (Demo only - no real payment)`)) return;
  item.paid = item.amount; item.m = "Nov";
  const msg = document.getElementById("payMsg");
  msg.textContent = `Payment of ${rm(due)} for ${item.id} recorded. Receipt no. RC-${Date.now().toString().slice(-6)}.`;
  msg.classList.remove("d-none"); window.scrollTo({top:0,behavior:"smooth"});
  renderAll();
});
document.getElementById("invCat").addEventListener("change", renderInvoices);

function renderAll(){ renderStats(); renderInvoices(); renderSummons(); renderCharts(); }
renderAll();
