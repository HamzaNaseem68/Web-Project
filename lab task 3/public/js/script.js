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

// CRUD with Fetch API
const API_URL = '/api/employees';

async function fetchEmployees() {
    try {
        const response = await fetch(API_URL);
        return await response.json();
    } catch (error) {
        console.error("Error fetching employees:", error);
        return [];
    }
}

async function renderTable() {
    const employees = await fetchEmployees();
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

async function addEmployee() {
    const name = prompt("Enter name");
    const role = prompt("Enter role");
    const salary = prompt("Enter salary");

    if (name && role && salary) {
        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, role, salary })
            });
            renderTable();
        } catch (error) {
            console.error("Error adding employee:", error);
        }
    }
}

async function editEmployee(id) {
    // First fetch current details to assume current values if prompt cancelled (or just to show them, but prompt doesn't support that easily without pre-filling).
    // Simpler approach: Ask for new values.
    const name = prompt("Enter new name");
    const role = prompt("Enter new role");
    const salary = prompt("Enter new salary");

    if (name && role && salary) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, role, salary })
            });
            renderTable();
        } catch (error) {
            console.error("Error updating employee:", error);
        }
    }
}

async function deleteEmployee(id) {
    if (confirm("Are you sure you want to delete this employee?")) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            renderTable();
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    }
}
