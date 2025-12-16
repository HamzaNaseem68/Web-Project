// Sidebar
function toggleMenu() {
    document.getElementById("sideNav").classList.toggle("open");
    document.getElementById("overlay").classList.toggle("show");
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

// CRUD with Fetch API (Products)
const API_URL = '/api/products';

async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        return await response.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

async function renderTable() {
    const products = await fetchProducts();

    // Render Table (CRUD)
    const tbody = document.getElementById("productTable");
    if (tbody) {
        tbody.innerHTML = "";
        products.forEach(prod => {
            const cats = Array.isArray(prod.categories) ? prod.categories.join(", ") : prod.categories;
            const row = `<tr>
          <td>${prod.name}</td><td>${prod.description}</td><td>${cats}</td>
          <td>
            <button class='btn btn-sm btn-gold' onclick='editProduct("${prod._id}")'>Edit</button>
            <button class='btn btn-sm btn-danger' onclick='deleteProduct("${prod._id}")'>Delete</button>
          </td>
        </tr>`;
            tbody.insertAdjacentHTML("beforeend", row);
        });
    }

    // Render Grid (Homepage)
    const grid = document.getElementById("productGrid");
    if (grid) {
        grid.innerHTML = "";
        products.forEach(prod => {
            const cats = Array.isArray(prod.categories) ? prod.categories.join(", ") : prod.categories;
            const card = `
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${prod.name}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${cats}</h6>
                            <p class="card-text">${prod.description}</p>
                        </div>
                    </div>
                </div>
             `;
            grid.insertAdjacentHTML("beforeend", card);
        });
    }
}

async function addProduct() {
    const name = prompt("Enter product name");
    const description = prompt("Enter description");
    const categories = prompt("Enter categories (comma separated)");

    if (name && description && categories) {
        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, description, categories })
            });
            renderTable();
        } catch (error) {
            console.error("Error adding product:", error);
        }
    }
}

async function editProduct(id) {
    const name = prompt("Enter new product name");
    const description = prompt("Enter new description");
    const categories = prompt("Enter new categories (comma separated)");

    if (name && description && categories) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, description, categories })
            });
            renderTable();
        } catch (error) {
            console.error("Error updating product:", error);
        }
    }
}

async function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            renderTable();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }
}
