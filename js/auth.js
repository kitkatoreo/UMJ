/* ==========================================================
   auth.js - Simulated authentication (hardcoded + localStorage)
   Demo account: 2024123456 / Johor@2026
   ========================================================== */
const DEMO = {id:"2024123456", password:"Johor@2026", name:UMJ.student.name};
const $ = id => document.getElementById(id);

if(sessionStorage.getItem("umj_user")) location.replace("pages/dashboard.html");

function registeredUsers(){ try{ return JSON.parse(localStorage.getItem("umj_users"))||[]; }catch(e){ return []; } }

function showError(box, msg){
  box.textContent = msg; box.classList.remove("d-none");
  const form = box.closest("form"); form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake");
}

/* Show / hide password */
document.querySelectorAll("[data-toggle-pass]").forEach(btn=>btn.addEventListener("click",()=>{
  const inp = $(btn.dataset.togglePass); const show = inp.type==="password";
  inp.type = show?"text":"password"; btn.innerHTML = `<i class="bi ${show?"bi-eye-slash":"bi-eye"}"></i>`;
}));

/* Login */
$("loginForm").addEventListener("submit", e=>{
  e.preventDefault();
  const id=$("loginId").value.trim(), pw=$("loginPass").value, err=$("loginError");
  err.classList.add("d-none"); $("loginOk").classList.add("d-none");
  if(!id || !pw) return showError(err,"Enter both your student ID and password.");
  const match = (id===DEMO.id && pw===DEMO.password) ? DEMO
              : registeredUsers().find(u=>u.id===id && u.password===pw);
  if(!match) return showError(err,"Invalid student ID or password. Check your details and try again.");
  sessionStorage.setItem("umj_user", JSON.stringify({id:match.id,name:match.name}));
  location.href="pages/dashboard.html";
});

/* Register */
$("regForm").addEventListener("submit", e=>{
  e.preventDefault();
  const name=$("regName").value.trim(), id=$("regId").value.trim(), pw=$("regPass").value, err=$("regError");
  err.classList.add("d-none");
  if(name.length<3) return showError(err,"Enter your full name (at least 3 characters).");
  if(!/^\d{10}$/.test(id)) return showError(err,"Student ID must be exactly 10 digits.");
  if(pw.length<8 || !/\d/.test(pw)) return showError(err,"Password needs at least 8 characters and one number.");
  if(id===DEMO.id || registeredUsers().some(u=>u.id===id)) return showError(err,"This student ID is already registered. Log in instead.");
  const users=registeredUsers(); users.push({name,id,password:pw});
  localStorage.setItem("umj_users", JSON.stringify(users));
  $("loginId").value=id; $("loginPass").value="";
  bootstrap.Tab.getOrCreateInstance($("tab-login")).show();
  $("loginOk").classList.remove("d-none");
});
