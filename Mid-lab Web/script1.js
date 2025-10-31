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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkoutForm");
  if (form) {
    form.addEventListener("input", validateForm);
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (form.checkValidity() && document.getElementById("termsCheck").checked) {
        alert("Order placed successfully!");
        form.reset();
        validateForm();
      }
    });
  }
  renderTable();
  setupTestimonials();
});

// Testimonials toggle
function setupTestimonials() {
  const btn = document.getElementById("viewMoreBtn");
  const hiddenTestimonials = document.querySelectorAll(".testimonial.hidden");
  let expanded = false;

  btn.addEventListener("click", () => {
    hiddenTestimonials.forEach(t => t.classList.toggle("hidden", expanded));
    btn.textContent = expanded ? "View More" : "View Less";
    expanded = !expanded;
  });
}

// CRUD
let employees = [
  { id: 1, name: "Ali Khan", role: "Guard", salary: 500 },
  { id: 2, name: "Sara Ahmed", role: "Trainer", salary: 700 },
];

function renderTable() {
  const tbody = document.getElementById("employeeTable");
  tbody.innerHTML = "";
  employees.forEach(emp => {
    const row = `<tr>
      <td>${emp.id}</td><td>${emp.name}</td><td>${emp.role}</td><td>${emp.salary}</td>
      <td>
        <button class='btn btn-sm btn-gold' onclick='editEmployee(${emp.id})'>Edit</button>
        <button class='btn btn-sm btn-danger' onclick='deleteEmployee(${emp.id})'>Delete</button>
      </td>
    </tr>`;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

function addEmployee() {
  const name = prompt("Enter name");
  const role = prompt("Enter role");
  const salary = prompt("Enter salary");
  if (name && role && salary) {
    employees.push({ id: employees.length + 1, name, role, salary });
    renderTable();
  }
}

function editEmployee(id) {
  const emp = employees.find(e => e.id === id);
  if (!emp) return;
  emp.name = prompt("Edit name", emp.name) || emp.name;
  emp.role = prompt("Edit role", emp.role) || emp.role;
  emp.salary = prompt("Edit salary", emp.salary) || emp.salary;
  renderTable();
}

function deleteEmployee(id) {
  employees = employees.filter(e => e.id !== id);
  renderTable();
}
