<<<<<<< HEAD
// Sidebar
function toggleMenu() {
  document.getElementById("sideNav").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
}

function showSection(sectionId) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("show"));
  document.getElementById(sectionId).classList.add("show");
  window.scrollTo(0, 0);
}

// Checkout
function toggleCardFields() {
  const payment = document.getElementById("payment").value;
  const cardFields = document.getElementById("cardFields");
  cardFields.classList.toggle("hidden", payment !== "card");
}

function validateForm() {
  const form = document.getElementById("checkoutForm");
  const terms = document.getElementById("termsCheck").checked;
  const btn = document.getElementById("placeOrderBtn");
  btn.disabled = !form.checkValidity() || !terms;
}

document.getElementById("checkoutForm").addEventListener("input", validateForm);
document.getElementById("checkoutForm").addEventListener("submit", e => {
  e.preventDefault();
  if (e.target.checkValidity() && document.getElementById("termsCheck").checked) {
    alert("Order placed successfully!");
  }
});

// CRUD
const employees = [
  { id: 1, name: "Ali Khan", role: "Guard", salary: 25000 },
  { id: 2, name: "Sara Malik", role: "Analyst", salary: 40000 },
  { id: 3, name: "Ahmed Raza", role: "Technician", salary: 35000 }
];

function renderTable() {
  const tbody = document.getElementById("employeeTable");
  const search = document.getElementById("searchInput").value.toLowerCase();
  tbody.innerHTML = "";
  employees.filter(e => e.name.toLowerCase().includes(search))
    .forEach(e => {
      tbody.innerHTML += `
        <tr>
          <td>${e.id}</td>
          <td>${e.name}</td>
          <td>${e.role}</td>
          <td>${e.salary}</td>
          <td>
            <button class='btn btn-sm btn-gold' onclick='editEmployee(${e.id})'>Edit</button>
            <button class='btn btn-sm btn-danger' onclick='deleteEmployee(${e.id})'>Delete</button>
          </td>
        </tr>`;
    });
}

function addEmployee() {
  const name = prompt("Enter employee name:");
  const role = prompt("Enter role:");
  const salary = prompt("Enter salary:");
  if (name && role && salary) {
    employees.push({ id: employees.length + 1, name, role, salary });
    renderTable();
  }
}

function editEmployee(id) {
  const emp = employees.find(e => e.id === id);
  const name = prompt("Edit name:", emp.name);
  const role = prompt("Edit role:", emp.role);
  const salary = prompt("Edit salary:", emp.salary);
  if (name && role && salary) {
    emp.name = name;
    emp.role = role;
    emp.salary = salary;
    renderTable();
  }
}

function deleteEmployee(id) {
  const index = employees.findIndex(e => e.id === id);
  if (confirm("Delete this record?")) {
    employees.splice(index, 1);
    renderTable();
  }
}

document.getElementById("searchInput").addEventListener("input", renderTable);
renderTable();
=======
// Sidebar
function toggleMenu() {
  document.getElementById("sideNav").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
}

function showSection(sectionId) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("show"));
  document.getElementById(sectionId).classList.add("show");
  window.scrollTo(0, 0);
}

// Checkout
function toggleCardFields() {
  const payment = document.getElementById("payment").value;
  const cardFields = document.getElementById("cardFields");
  cardFields.classList.toggle("hidden", payment !== "card");
}

function validateForm() {
  const form = document.getElementById("checkoutForm");
  const terms = document.getElementById("termsCheck").checked;
  const btn = document.getElementById("placeOrderBtn");
  btn.disabled = !form.checkValidity() || !terms;
}

document.getElementById("checkoutForm").addEventListener("input", validateForm);
document.getElementById("checkoutForm").addEventListener("submit", e => {
  e.preventDefault();
  if (e.target.checkValidity() && document.getElementById("termsCheck").checked) {
    alert("Order placed successfully!");
  }
});

// CRUD
const employees = [
  { id: 1, name: "Ali Khan", role: "Guard", salary: 25000 },
  { id: 2, name: "Sara Malik", role: "Analyst", salary: 40000 },
  { id: 3, name: "Ahmed Raza", role: "Technician", salary: 35000 }
];

function renderTable() {
  const tbody = document.getElementById("employeeTable");
  const search = document.getElementById("searchInput").value.toLowerCase();
  tbody.innerHTML = "";
  employees.filter(e => e.name.toLowerCase().includes(search))
    .forEach(e => {
      tbody.innerHTML += `
        <tr>
          <td>${e.id}</td>
          <td>${e.name}</td>
          <td>${e.role}</td>
          <td>${e.salary}</td>
          <td>
            <button class='btn btn-sm btn-gold' onclick='editEmployee(${e.id})'>Edit</button>
            <button class='btn btn-sm btn-danger' onclick='deleteEmployee(${e.id})'>Delete</button>
          </td>
        </tr>`;
    });
}

function addEmployee() {
  const name = prompt("Enter employee name:");
  const role = prompt("Enter role:");
  const salary = prompt("Enter salary:");
  if (name && role && salary) {
    employees.push({ id: employees.length + 1, name, role, salary });
    renderTable();
  }
}

function editEmployee(id) {
  const emp = employees.find(e => e.id === id);
  const name = prompt("Edit name:", emp.name);
  const role = prompt("Edit role:", emp.role);
  const salary = prompt("Edit salary:", emp.salary);
  if (name && role && salary) {
    emp.name = name;
    emp.role = role;
    emp.salary = salary;
    renderTable();
  }
}

function deleteEmployee(id) {
  const index = employees.findIndex(e => e.id === id);
  if (confirm("Delete this record?")) {
    employees.splice(index, 1);
    renderTable();
  }
}

document.getElementById("searchInput").addEventListener("input", renderTable);
renderTable();

// Testimonials
const testimonialsData = [
  { name: "Hamza Farooq", image: "https://randomuser.me/api/portraits/men/45.jpg", stars: 5, text: "Exceptional service, highly professional team." },
  { name: "Ayesha Khan", image: "https://randomuser.me/api/portraits/women/65.jpg", stars: 4, text: "Reliable and courteous staff. Very satisfied." },
  { name: "Bilal Ahmed", image: "https://randomuser.me/api/portraits/men/52.jpg", stars: 5, text: "Quick response and thorough protection. Recommended." },
  { name: "Sana Tariq", image: "https://randomuser.me/api/portraits/women/30.jpg", stars: 5, text: "Top-notch security solutions, very impressed." }
];

const testimonialWrapper = document.getElementById("testimonialWrapper");
const viewMoreBtn = document.getElementById("viewMoreBtn");
let testimonialsShown = 2;

// Render initial testimonials
function renderTestimonials(count) {
  testimonialWrapper.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const t = testimonialsData[i];
    const stars = "★".repeat(t.stars) + "☆".repeat(5 - t.stars);
    const div = document.createElement("div");
    div.classList.add("testimonial");
    if (i < 2) div.classList.add("active");
    div.innerHTML = `
      <img src="${t.image}" alt="${t.name}">
      <h4>${t.name}</h4>
      <div class="stars">${stars}</div>
      <p>${t.text}</p>
    `;
    testimonialWrapper.appendChild(div);
  }
}

renderTestimonials(testimonialsShown);

// View more
viewMoreBtn.addEventListener("click", () => {
  testimonialsShown = testimonialsData.length;
  renderTestimonials(testimonialsShown);
  viewMoreBtn.style.display = "none";
});

// Auto rotate first 2 testimonials
let current = 0;
setInterval(() => {
  const tEls = document.querySelectorAll(".testimonial.active");
  tEls.forEach(el => el.classList.remove("active"));
  current = (current + 1) % Math.min(2, testimonialsData.length);
  tEls[current].classList.add("active");
}, 4000);
>>>>>>> 640996c (Web-Project)
