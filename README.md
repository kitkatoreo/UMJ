# UMJ Student Portal

A responsive student-portal prototype for **University Malaysia Johorean (UMJ)**, built for the **IMS566 Advanced Web Design Development and Content Management** individual project.

## Features
- **Login / Register** with hardcoded demo credentials plus simulated registration (localStorage), inline error feedback, show/hide password.
- **Consistent responsive navbar and footer** on every page (collapses to a menu on mobile).
- **Dashboard**: key figures (CGPA, credits, attendance, fees), GPA trend line chart, grade distribution doughnut, attendance bar chart, announcements.
- **My Courses** (data view 1): searchable, filterable table with attendance bars and a credit-hours doughnut chart.
- **Results** (data view 2): semester selector, results table with grades, and an interactive "You vs class average" chart.
- **Finance** (data view 3): study fees, college (residential) fees, campus summons and other charges, with a payment-history chart, category chart, financial aid list and simulated "Pay" buttons.
- **Course Registration**: every open course shows its code, name and credit hours. One click on Register adds it (with automatic checks for timetable clash, 24-credit limit, prerequisites, full classes). The course then appears on the Dashboard, My Courses and the weekly timetable automatically.
- **Letters & Requests**: ready-made letter templates (leave of absence, continue studies, transcript, confirmation of student status, internship, fee clearance). Details are pre-filled; the student only types their name or draws a signature. Signed letters can be viewed and printed.
- Content management: page titles, meta description/keywords, semantic sections, ARIA labels, skip links.
- Tables turn into stacked cards on phones. Red + blue theme using the UMJ crest as the logo.

## How to test login
| Field | Value |
|---|---|
| Student ID | `2024123456` |
| Password | `Johor@2026` |

Try a wrong password to see the error message, or use **Register** to create your own account (10-digit ID, password with 8+ characters and a number).

## Frameworks / libraries
Bootstrap 5.3, Bootstrap Icons, Chart.js 4, Google Fonts (Plus Jakarta Sans). All loaded from CDN.

## Folder structure
```
index.html          Login / Register
pages/              dashboard.html, courses.html, results.html, finance.html, registration.html, letters.html
images/campus.jpg   Login page background photo (slow-drift animation)
css/style.css       Global styles (tokens, navbar, cards, tables, footer, responsive)
js/data.js          Sample datasets + grade/GPA helpers
js/app.js           Shared navbar/footer, auth guard, chart defaults
js/auth.js          Login & register logic
js/dashboard.js | courses.js | results.js | finance.js | registration.js | letters.js   Page-specific scripts
```

## Deploy on GitHub Pages
1. Create a repository and upload all files (keep `index.html` at the root).
2. Go to **Settings > Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
3. Your live link will be `https://<username>.github.io/<repository>/`.

*Prototype only: authentication is simulated and not secure.*
