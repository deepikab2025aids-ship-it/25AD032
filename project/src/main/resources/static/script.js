// ===============================
// BACKEND API URL
// ===============================

const API_URL = "http://localhost:8081";


// ===============================
// SECTION NAVIGATION
// ===============================

function showSection(sectionId, clickedButton = null) {

    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.add("hidden");
    });

    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.remove("hidden");
    }


    // Update sidebar active button

    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach(item => {
        item.classList.remove("active");
    });

    if (clickedButton) {
        clickedButton.classList.add("active");
    }


    // Update page title

    const pageTitle = document.getElementById("pageTitle");

    if (sectionId === "dashboard") {
        pageTitle.textContent = "Dashboard";
    }

    else if (sectionId === "products") {
        pageTitle.textContent = "Products";
    }

    else if (sectionId === "movements") {
        pageTitle.textContent = "Stock Movements";
    }

    else if (sectionId === "alerts") {
        pageTitle.textContent = "Reorder Alerts";
    }
}


// ===============================
// LOAD PRODUCTS
// ===============================

async function loadProducts() {

    const productList = document.getElementById("productList");

    productList.innerHTML = `
        <div class="empty">
            Loading products...
        </div>
    `;

    try {

        const response = await fetch(
            `${API_URL}/api/product`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch products");
        }

        const products = await response.json();

        document.getElementById("productCount").textContent =
            products.length;


        if (products.length === 0) {

            productList.innerHTML = `
                <div class="empty">
                    No products found.
                </div>
            `;

            return;
        }


        let html = `
            <table class="data-table">

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Reorder Threshold</th>
                    </tr>

                </thead>

                <tbody>
        `;


        products.forEach(product => {

            html += `
                <tr>

                    <td>${product.id}</td>

                    <td>${product.name}</td>

                    <td>${product.sku}</td>

                    <td>₹ ${product.price}</td>

                    <td>${product.reorderThreshold}</td>

                </tr>
            `;

        });


        html += `
                </tbody>
            </table>
        `;

        productList.innerHTML = html;

    }

    catch (error) {

        console.error(error);

        productList.innerHTML = `
            <div class="empty">
                Unable to load products.
                Please check whether the Spring Boot server is running.
            </div>
        `;
    }
}


// ===============================
// LOAD STOCK MOVEMENTS
// ===============================

async function loadStockMovements() {

    const movementList =
        document.getElementById("movementList");

    movementList.innerHTML = `
        <div class="empty">
            Loading stock movements...
        </div>
    `;

    try {

        const response = await fetch(
            `${API_URL}/api/stockmovement`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch stock movements");
        }

        const movements = await response.json();

        document.getElementById("movementCount").textContent =
            movements.length;


        if (movements.length === 0) {

            movementList.innerHTML = `
                <div class="empty">
                    No stock movements found.
                </div>
            `;

            return;
        }


        let html = `
            <table class="data-table">

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Quantity</th>
                        <th>Reason</th>
                        <th>Movement Date</th>
                        <th>Product ID</th>
                    </tr>

                </thead>

                <tbody>
        `;


        movements.forEach(movement => {

            html += `
                <tr>

                    <td>${movement.id}</td>

                    <td>${movement.quantity}</td>

                    <td>${movement.reason}</td>

                    <td>${movement.movementDate}</td>

                    <td>${movement.product?.id ?? "-"}</td>

                </tr>
            `;

        });


        html += `
                </tbody>
            </table>
        `;

        movementList.innerHTML = html;

    }

    catch (error) {

        console.error(error);

        movementList.innerHTML = `
            <div class="empty">
                Unable to load stock movements.
            </div>
        `;
    }
}


// ===============================
// LOAD REORDER ALERTS
// ===============================

async function loadReorderAlerts() {

    const alertList =
        document.getElementById("alertList");

    alertList.innerHTML = `
        <div class="empty">
            Loading reorder alerts...
        </div>
    `;

    try {

        const response = await fetch(
            `${API_URL}/api/reorderalert`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch reorder alerts");
        }

        const alerts = await response.json();

        document.getElementById("alertCount").textContent =
            alerts.length;


        if (alerts.length === 0) {

            alertList.innerHTML = `
                <div class="empty">
                    No reorder alerts found.
                </div>
            `;

            return;
        }


        let html = `
            <table class="data-table">

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Current Stock</th>
                        <th>Threshold</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Alert Date</th>
                    </tr>

                </thead>

                <tbody>
        `;


        alerts.forEach(alert => {

            html += `
                <tr>

                    <td>${alert.id}</td>

                    <td>${alert.currentStock}</td>

                    <td>${alert.reorderThreshold}</td>

                    <td>${alert.message}</td>

                    <td>
                        <span class="status-badge">
                            ${alert.status}
                        </span>
                    </td>

                    <td>${alert.alertDate}</td>

                </tr>
            `;

        });


        html += `
                </tbody>
            </table>
        `;

        alertList.innerHTML = html;

    }

    catch (error) {

        console.error(error);

        alertList.innerHTML = `
            <div class="empty">
                Unable to load reorder alerts.
            </div>
        `;
    }
}


// ===============================
// LOAD DASHBOARD DATA
// ===============================

async function loadDashboardData() {

    try {

        const productResponse =
            await fetch(`${API_URL}/api/product`);

        const movementResponse =
            await fetch(`${API_URL}/api/stockmovement`);

        const alertResponse =
            await fetch(`${API_URL}/api/reorderalert`);


        if (productResponse.ok) {

            const products =
                await productResponse.json();

            document.getElementById("productCount")
                .textContent = products.length;
        }


        if (movementResponse.ok) {

            const movements =
                await movementResponse.json();

            document.getElementById("movementCount")
                .textContent = movements.length;
        }


        if (alertResponse.ok) {

            const alerts =
                await alertResponse.json();

            document.getElementById("alertCount")
                .textContent = alerts.length;
        }

    }

    catch (error) {

        console.error(
            "Dashboard data error:",
            error
        );
    }
}


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboardData();

    }
);