// Sidebar Functions
function toggleMenu() {
  document.getElementById("sideNav").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
}

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("show"));
  // Show the requested section
  document.getElementById(sectionId).classList.add("show");
  window.scrollTo(0, 0);
  // Close sidebar if open
  if (document.getElementById("sideNav").classList.contains("open")) {
    toggleMenu();
  }
}


// Checkout Functions
function toggleCardFields() {
  const payment = document.getElementById("payment").value;
  const cardFields = document.getElementById("cardFields");
  // Check if the payment value is 'card'
  const isCardSelected = payment === "card";

  // Set 'required' attribute for card fields
  document.getElementById("cardName").required = isCardSelected;
  document.getElementById("cardNumber").required = isCardSelected;
  document.getElementById("expiry").required = isCardSelected;
  document.getElementById("cvv").required = isCardSelected;

  cardFields.classList.toggle("hidden", !isCardSelected);
  validateForm(); // Re-validate the form state
}

function validateForm() {
  const form = document.getElementById("checkoutForm");
  const terms = document.getElementById("termsCheck").checked;
  const btn = document.getElementById("placeOrderBtn");
  
  // Check form validity and terms
  btn.disabled = !form.checkValidity() || !terms;
}

// Order Summary Logic
const servicePrices = {
    "Personal Protection": 12,
    "Private Detective": 15, 
    "Security Equipment": 8,
    "Analysis & Investigations": 10 
};

function updateTotal() {
    const servicesDiv = document.getElementById('services');
    const serviceItems = servicesDiv.querySelectorAll('.service');
    let total = 0;
    const summaryList = document.getElementById('orderSummaryList');
    
    // Clear previous items but keep the total line placeholder
    summaryList.innerHTML = '';

    serviceItems.forEach(item => {
        const title = item.querySelector('h3').innerText;
        // Find input and quantity. Added check for 'null' as a safeguard.
        const input = item.querySelector('input[type="number"]');
        if (!input) return; // Skip if no number input found

        const quantity = parseInt(input.value) || 0;
        const price = servicePrices[title] || 0;
        const subtotal = quantity * price;

        if (quantity > 0) {
            total += subtotal;
            // Add item to summary list at the top
            summaryList.insertAdjacentHTML('afterbegin', `
                <li class="list-group-item d-flex justify-content-between">
                    <span>${title} (x${quantity})</span>
                    <span>$${subtotal}</span>
                </li>
            `);
        }
    });

    // Add total line at the bottom
    summaryList.innerHTML += `<li class="list-group-item d-flex justify-content-between"><strong>Total</strong><strong id="totalPrice">$${total}</strong></li>`;
}

// Event Listeners for Checkout Form
document.addEventListener("DOMContentLoaded", () => {
    updateTotal(); // Initial calculation
    // Attaching form input validation listener
    document.getElementById("checkoutForm").addEventListener("input", validateForm);
    
    // Attaching form submit listener
    document.getElementById("checkoutForm").addEventListener("submit", e => {
        e.preventDefault();
        if (e.target.checkValidity() && document.getElementById("termsCheck").checked) {
            alert("Order placed successfully! Total: " + document.getElementById("totalPrice").innerText);
        }
    });
    // Attaching terms checkbox listener
    document.getElementById("termsCheck").addEventListener("change", validateForm);
});


// CRUD Functions
const employees = [
  { id: 1, name: "Ali Khan", role: "Guard", salary: 25000 },
  { id: 2, name: "Sara Malik", role: "Analyst", salary: 40000 },
  { id: 3, name: "Ahmed Raza", role: "Technician", salary: 35000 }
];

let nextId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;

function renderTable() {
  const tbody = document.getElementById("employeeTable");
  const search = document.getElementById("searchInput").value.toLowerCase();
  tbody.innerHTML = "";
  
  employees.filter(e => 
    e.name.toLowerCase().includes(search) || 
    e.role.toLowerCase().includes(search) ||
    String(e.id).includes(search)
  )
  .forEach(e => {
    tbody.innerHTML += `
      <tr>
        <td>${e.id}</td>
        <td>${e.name}</td>
        <td>${e.role}</td>
        <td>${e.salary.toLocaleString()} PKR</td>
        <td>
          <button class='btn btn-sm btn-gold me-2' onclick='editEmployee(${e.id})'>Edit</button>
          <button class='btn btn-sm btn-danger' onclick='deleteEmployee(${e.id})'>Delete</button>
        </td>
        </tr>`;
  });
}

function addEmployee() {
  const name = prompt("Enter employee name:");
  const role = prompt("Enter role:");
  const salary = prompt("Enter salary:");
  
  if (name && role && salary && !isNaN(salary) && parseInt(salary) > 0) {
    employees.push({ id: nextId++, name, role, salary: parseInt(salary) });
    renderTable();
  } else if (name || role || salary) {
        alert("Invalid input. Please enter valid details for all fields, and salary must be a number greater than 0.");
    }
}

function editEmployee(id) {
  const emp = employees.find(e => e.id === id);
  if (!emp) return;

  const newName = prompt("Edit name:", emp.name);
  const newRole = prompt("Edit role:", emp.role);
  const newSalary = prompt("Edit salary:", emp.salary);

  if (newName && newRole && newSalary && !isNaN(newSalary) && parseInt(newSalary) > 0) {
    emp.name = newName;
    emp.role = newRole;
    emp.salary = parseInt(newSalary);
    renderTable();
  } else if (newName || newRole || newSalary) {
        alert("Invalid input. All fields are required and salary must be a number greater than 0.");
    }
}

function deleteEmployee(id) {
  const index = employees.findIndex(e => e.id === id);
  if (index > -1 && confirm("Are you sure you want to delete this record?")) {
    employees.splice(index, 1);
    renderTable();
  }
}

// Initial render and search event listener
document.getElementById("searchInput").addEventListener("input", renderTable);
document.addEventListener("DOMContentLoaded", renderTable);