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
let allProducts = []; // Global state for products

async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        allProducts = await response.json(); // Update global state
        return allProducts;
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
          <td>
            <div class="d-flex align-items-center">
                <div class="avatar rounded-circle bg-light d-flex justify-content-center align-items-center text-primary fw-bold me-3" style="width: 40px; height: 40px; font-size: 1.2rem;">
                    ${prod.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h6 class="mb-0 fw-bold" style="color: #151d42;">${prod.name}</h6>
                </div>
            </div>
          </td>
          <td class="text-muted" style="max-width: 300px;">${prod.description}</td>
          <td><span class="badge bg-light text-dark border">${cats}</span></td>
          <td class="text-end">
            <button class='btn-icon btn-icon-edit' onclick='editProduct("${prod._id}")' title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class='btn-icon btn-icon-delete' onclick='deleteProduct("${prod._id}")' title="Delete">
                <i class="fas fa-trash-alt"></i>
            </button>
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

// Form Submit Handler
document.addEventListener("DOMContentLoaded", () => {
    // ... existing listeners ...

    // Product Form Listener
    const productForm = document.getElementById("productForm");
    if (productForm) {
        productForm.addEventListener("submit", handleProductFormSubmit);
    }
});

function prepareAddProduct() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('modalTitle').textContent = 'Add New Product';
}

function editProduct(id) {
    const product = allProducts.find(p => p._id === id);
    if (!product) return;

    document.getElementById('productId').value = product._id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDesc').value = product.description;

    const cats = Array.isArray(product.categories) ? product.categories.join(", ") : product.categories;
    document.getElementById('productCats').value = cats;

    document.getElementById('modalTitle').textContent = 'Edit Product';

    // Show Modal
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

async function handleProductFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDesc').value;
    const categories = document.getElementById('productCats').value; // Backend should split this string if needed

    const data = { name, description, categories };

    try {
        let response;
        if (id) {
            // Edit
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            // Add
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        if (response.ok) {
            // Hide Modal
            const modalEl = document.getElementById('productModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();

            // Clean up backdrop if stuck (Bootstrap bug workaround)
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();

            renderTable();
        } else {
            alert('Failed to save product');
        }
    } catch (error) {
        console.error("Error saving product:", error);
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
