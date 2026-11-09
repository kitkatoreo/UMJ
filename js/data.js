/* ==========================================================
   data.js - Sample datasets (no database needed)
   ========================================================== */
const UMJ = {
  uni: "University Malaysia Johorean",
  student: { name:"Aisyah Rahman", id:"2024123456", programme:"B.Sc. (Hons.) Information Technology",
             faculty:"Faculty of Computing", semester:4, advisor:"Dr. Faizal Hamdan", feesDue:850 },

  /* Dataset 1 - courses registered this semester */
  courses: [
    {code:"IMS566", name:"Advanced Web Design & Content Management", credits:3, category:"Core", lecturer:"Dr. Nurul Huda", slot:"Mon 10:00-13:00", venue:"CL 2.04", attendance:96, status:"Ongoing"},
    {code:"CSC584", name:"Enterprise Programming", credits:4, category:"Core", lecturer:"Dr. Faizal Hamdan", slot:"Tue 08:00-11:00", venue:"CL 1.12", attendance:88, status:"Ongoing"},
    {code:"ISP573", name:"Database Administration", credits:3, category:"Core", lecturer:"Pn. Salmah Yusof", slot:"Wed 14:00-17:00", venue:"CL 3.01", attendance:74, status:"At risk"},
    {code:"CSC662", name:"Mobile Application Development", credits:3, category:"Elective", lecturer:"En. Hafiz Lim", slot:"Thu 09:00-12:00", venue:"CL 2.10", attendance:92, status:"Ongoing"},
    {code:"MGT530", name:"Entrepreneurship Fundamentals", credits:2, category:"University", lecturer:"Dr. Tan Mei Ling", slot:"Fri 08:30-10:30", venue:"LT B", attendance:81, status:"Ongoing"},
    {code:"LAN550", name:"Academic Communication Skills", credits:2, category:"University", lecturer:"Pn. Aina Zulkifli", slot:"Fri 14:30-16:30", venue:"LT C", attendance:100, status:"Completed"}
  ],

  /* Dataset 2 - past results (marks out of 100; avg = class average) */
  results: {
    "Semester 1": [
      {code:"CSC408", name:"Programming Fundamentals", credits:4, marks:84, avg:68},
      {code:"MAT435", name:"Discrete Mathematics", credits:3, marks:71, avg:62},
      {code:"ITS420", name:"Computer Systems", credits:3, marks:78, avg:65},
      {code:"ENG401", name:"English for Academic Purposes", credits:2, marks:80, avg:70},
      {code:"BMI400", name:"Bahasa Melayu Komunikasi", credits:2, marks:88, avg:74}],
    "Semester 2": [
      {code:"CSC508", name:"Data Structures", credits:4, marks:79, avg:63},
      {code:"CSC510", name:"Web Programming", credits:3, marks:91, avg:72},
      {code:"STA416", name:"Statistics for Computing", credits:3, marks:66, avg:60},
      {code:"ITS500", name:"Networking Essentials", credits:3, marks:82, avg:67},
      {code:"CTU551", name:"Ethics & Civilisation", credits:2, marks:85, avg:76}],
    "Semester 3": [
      {code:"CSC576", name:"Object-Oriented Programming", credits:4, marks:87, avg:66},
      {code:"CSC583", name:"Systems Analysis & Design", credits:3, marks:76, avg:64},
      {code:"ISP530", name:"Database Systems", credits:3, marks:83, avg:65},
      {code:"CSC590", name:"Human-Computer Interaction", credits:3, marks:90, avg:71},
      {code:"MGT420", name:"Principles of Management", credits:2, marks:69, avg:63}]
  },

  announcements: [
    {title:"Mid-semester break begins 23 November", date:"2 Nov 2026", tag:"Academic"},
    {title:"IMS566 individual project due in Week 8", date:"1 Nov 2026", tag:"Assignment"},
    {title:"Fee payment deadline: 15 November", date:"28 Oct 2026", tag:"Finance"},
    {title:"Career fair at Dewan Seri Johor, 12 November", date:"25 Oct 2026", tag:"Event"}
  ]
};

/* Grade scale helper (marks -> grade & grade point) */
function gradeOf(m){
  const s=[[80,"A",4.0],[75,"A-",3.67],[70,"B+",3.33],[65,"B",3.0],[60,"B-",2.67],[55,"C+",2.33],[50,"C",2.0]];
  for(const [min,g,p] of s) if(m>=min) return {grade:g,points:p};
  return {grade:"F",points:0};
}
/* GPA for a list of course results */
function gpaOf(list){
  const cr=list.reduce((a,c)=>a+c.credits,0);
  return list.reduce((a,c)=>a+gradeOf(c.marks).points*c.credits,0)/cr;
}
/* Cumulative GPA across all semesters */
function cgpa(){ return gpaOf(Object.values(UMJ.results).flat()); }

/* ==========================================================
   Finance dataset (study fees, college, summons, others, aid)
   m = month the payment was made (used for the history chart)
   ========================================================== */
UMJ.finance = {
  invoices: [
    {id:"INV-2611-101", item:"Tuition fee - Semester 4", cat:"Study fees", amount:2450, paid:2450, due:"31 Oct 2026", m:"Oct"},
    {id:"INV-2611-102", item:"Laboratory & ICT facilities fee", cat:"Study fees", amount:300, paid:300, due:"31 Oct 2026", m:"Oct"},
    {id:"INV-2611-103", item:"Examination & assessment fee", cat:"Study fees", amount:180, paid:100, due:"15 Nov 2026", m:"Nov"},
    {id:"INV-2611-201", item:"Kolej Tun Aminah - room rental (Sem 4)", cat:"College", amount:650, paid:0, due:"15 Nov 2026"},
    {id:"INV-2611-202", item:"College deposit (refundable)", cat:"College", amount:100, paid:100, due:"1 Aug 2026", m:"Aug"},
    {id:"INV-2611-301", item:"Student activity & society fee", cat:"Others", amount:50, paid:50, due:"30 Sep 2026", m:"Sep"},
    {id:"INV-2611-302", item:"Student health insurance", cat:"Others", amount:20, paid:20, due:"30 Sep 2026", m:"Sep"},
    {id:"INV-2611-303", item:"Library overdue fine", cat:"Others", amount:12, paid:0, due:"15 Nov 2026"}
  ],
  summons: [
    {id:"SMN-26-0377", item:"Motorcycle without campus sticker", date:"3 Oct 2026", place:"Main gate", amount:20, paid:20, m:"Oct"},
    {id:"SMN-26-0412", item:"Parking in a restricted zone", date:"21 Oct 2026", place:"Block C car park", amount:30, paid:0},
    {id:"SMN-26-0450", item:"Exceeding campus speed limit (30 km/h)", date:"30 Oct 2026", place:"Jalan Pelajar", amount:50, paid:0}
  ],
  aid: [
    {name:"UMJ Excellence Scholarship", amount:1000, status:"Awarded"},
    {name:"PTPTN study loan", amount:4000, status:"Disbursed"},
    {name:"Bursary hardship fund", amount:500, status:"Pending"}
  ]
};

/* Balance + status helpers */
const balanceOf = x => x.amount - x.paid;
function statusOf(x){ return balanceOf(x)===0 ? "Paid" : x.paid>0 ? "Partial" : "Unpaid"; }
/* Total outstanding across invoices and summons (used on dashboard + finance) */
function totalDue(){
  const f = UMJ.finance;
  return [...f.invoices, ...f.summons].reduce((a,x)=>a+balanceOf(x),0);
}

/* ==========================================================
   Course registration + letter requests data
   ========================================================== */
UMJ.rules = { maxCredits: 24, addDropCloses: "20 Nov 2026" };

/* Open courses for Semester 4 (slot format: "Day HH:MM-HH:MM") */
UMJ.catalogue = [
  {code:"CSC650", name:"Cloud Computing Fundamentals", credits:3, category:"Elective", lecturer:"Dr. Rizal Ahmad", slot:"Mon 14:00-17:00", venue:"CL 2.06", seats:12, prereq:["CSC576"]},
  {code:"MGT540", name:"Project Management", credits:2, category:"Elective", lecturer:"En. Daniel Teo", slot:"Mon 08:00-10:00", venue:"LT A", seats:18},
  {code:"ISP610", name:"Data Analytics & Visualisation", credits:3, category:"Elective", lecturer:"Pn. Farah Nabila", slot:"Tue 14:00-17:00", venue:"CL 3.03", seats:5, prereq:["ISP530"]},
  {code:"CSC660", name:"Cybersecurity Essentials", credits:3, category:"Elective", lecturer:"En. Azman Idris", slot:"Tue 11:30-14:30", venue:"CL 2.11", seats:8, prereq:["ITS500"]},
  {code:"CSC640", name:"UI/UX Design Studio", credits:3, category:"Elective", lecturer:"Pn. Aliya Hassan", slot:"Wed 09:00-12:00", venue:"Studio 1", seats:14, prereq:["CSC590"]},
  {code:"LAN560", name:"Business Communication", credits:2, category:"University", lecturer:"Pn. Sarah Wong", slot:"Wed 09:00-11:00", venue:"LT C", seats:20},
  {code:"CSC670", name:"Internet of Things", credits:3, category:"Elective", lecturer:"Dr. Hanif Zain", slot:"Thu 12:30-15:30", venue:"CL 1.05", seats:9, prereq:["ITS420"]},
  {code:"CSC630", name:"Artificial Intelligence Basics", credits:3, category:"Elective", lecturer:"Dr. Lim Wei Jie", slot:"Thu 16:00-19:00", venue:"CL 1.08", seats:0, prereq:["CSC508"]},
  {code:"CTU570", name:"Community Service Project", credits:2, category:"University", lecturer:"Dr. Kamal Hashim", slot:"Fri 11:00-13:00", venue:"LT B", seats:15},
  {code:"CSC700", name:"Final Year Project I", credits:4, category:"Core", lecturer:"Dr. Nurul Huda", slot:"Wed 14:00-16:00", venue:"CL 2.04", seats:10, minSem:6}
];

/* Sample letter requests already in the system */
UMJ.requestSeeds = [
  {ref:"LTR-261014", type:"confirm", short:"Confirmation of student status", date:"12 Oct 2026", status:"Ready", details:{purpose:"Bank loan / PTPTN", lang:"English"}},
  {ref:"LTR-260908", type:"transcript", short:"Official transcript", date:"25 Sep 2026", status:"Ready", details:{copies:"1", kind:"Official (sealed)"}},
  {ref:"LTR-261102", type:"internship", short:"Internship introduction letter", date:"2 Nov 2026", status:"In review", details:{company:"Johor Digital Sdn Bhd"}}
];

/* Helpers: timetable parsing, clash check, passed course codes */
function parseSlot(s){
  const m=/^(\w{3}) (\d\d):(\d\d)-(\d\d):(\d\d)$/.exec(s);
  return {day:m[1], s:+m[2]*60+ +m[3], e:+m[4]*60+ +m[5]};
}
function clash(a,b){ const x=parseSlot(a), y=parseSlot(b); return x.day===y.day && x.s<y.e && y.s<x.e; }
function passedCodes(){
  return Object.values(UMJ.results).flat().filter(c=>gradeOf(c.marks).grade!=="F").map(c=>c.code);
}

/* ==========================================================
   Courses registered through the portal are kept in localStorage
   and merged into UMJ.courses, so EVERY page updates automatically
   ========================================================== */
const REG_KEY = "umj_registered";
function regCodes(){ try{ return JSON.parse(localStorage.getItem(REG_KEY)) || []; }catch(e){ return []; } }
function saveRegCodes(list){ localStorage.setItem(REG_KEY, JSON.stringify(list)); }
function toCourse(c){
  return {code:c.code, name:c.name, credits:c.credits, category:c.category, lecturer:c.lecturer, slot:c.slot,
          venue:c.venue || "TBA", attendance:null, status:"Registered", added:true};
}
regCodes().forEach(code => {
  const c = UMJ.catalogue.find(x => x.code === code);
  if(c && !UMJ.courses.some(x => x.code === code)) UMJ.courses.push(toCourse(c));
});
