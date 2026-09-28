// =====================================================
// BACKEND API
// =====================================================

const API_URL = "http://localhost:8081";


// =====================================================
// EDITING IDs
// =====================================================

let editingProductId = null;

let editingMovementId = null;

let editingAlertId = null;


// =====================================================
// NAVIGATION
// =====================================================

function showSection(sectionId, clickedButton = null) {

    const sections =
        document.querySelectorAll(".section");

    sections.forEach(section => {

        section.classList.add("hidden");

    });


    const selectedSection =
        document.getElementById(sectionId);

    if (selectedSection) {

        selectedSection.classList.remove("hidden");

    }


    const menuItems =
        document.querySelectorAll(".menu-item");

    menuItems.forEach(item => {

        item.classList.remove("active");

    });


    if (clickedButton) {

        clickedButton.classList.add("active");

    }


    const pageTitle =
        document.getElementById("pageTitle");


    const pageSubtitle =
        document.getElementById("pageSubtitle");


    if (sectionId === "dashboard") {

        pageTitle.textContent = "Dashboard";

        pageSubtitle.textContent =
            "Monitor your store inventory";

    }

    else if (sectionId === "products") {

        pageTitle.textContent = "Products";

        pageSubtitle.textContent =
            "Manage your store products";

        loadProducts();

    }

    else if (sectionId === "movements") {

        pageTitle.textContent = "Stock Movements";

        pageSubtitle.textContent =
            "Track incoming and outgoing stock";

        loadMovements();

    }

    else if (sectionId === "alerts") {

        pageTitle.textContent = "Reorder Alerts";

        pageSubtitle.textContent =
            "Manage products that need restocking";

        loadAlerts();

    }

}


// =====================================================
// QUICK ACCESS
// =====================================================

function goToSection(sectionId) {

    const buttons =
        document.querySelectorAll(".menu-item");

    buttons.forEach(button => {

        button.classList.remove("active");

    });


    if (sectionId === "products") {

        buttons[1].classList.add("active");

    }

    else if (sectionId === "movements") {

        buttons[2].classList.add("active");

    }

    else if (sectionId === "alerts") {

        buttons[3].classList.add("active");

    }


    showSection(sectionId);

}


// =====================================================
// ================= PRODUCTS CRUD =====================
// =====================================================

function showProductForm() {

    document
        .getElementById("productForm")
        .classList.remove("hidden");


    document
        .getElementById("productFormTitle")
        .textContent = "Add Product";


    document
        .getElementById("productSaveButton")
        .textContent = "Add Product";


    editingProductId = null;

    clearProductForm();

}


function hideProductForm() {

    document
        .getElementById("productForm")
        .classList.add("hidden");


    editingProductId = null;

    clearProductForm();

}


function clearProductForm() {

    document.getElementById("productName").value = "";

    document.getElementById("productSKU").value = "";

    document.getElementById("productDescription").value = "";

    document.getElementById("productPrice").value = "";

    document.getElementById("productThreshold").value = "";

}


async function saveProduct() {

    const data = {

        Name:
        document.getElementById("productName").value,

        SKU:
        document.getElementById("productSKU").value,

        Description:
        document.getElementById("productDescription").value,

        Price:
            Number(
                document.getElementById("productPrice").value
            ),

        ReorderThreshold:
            Number(
                document.getElementById("productThreshold").value
            )

    };


    if (
        !data.Name ||
        !data.SKU ||
        !data.Description ||
        isNaN(data.Price) ||
        isNaN(data.ReorderThreshold)
    ) {

        alert("Please fill all product fields.");

        return;

    }


    try {

        let response;


        if (editingProductId !== null) {

            data.Id = editingProductId;


            response = await fetch(
                `${API_URL}/api/product`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(data)

                }
            );

        }

        else {

            response = await fetch(
                `${API_URL}/api/product`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(data)

                }
            );

        }


        if (!response.ok) {

            throw new Error(
                "Unable to save product"
            );

        }


        alert(
            editingProductId !== null
                ? "Product updated successfully!"
                : "Product added successfully!"
        );


        hideProductForm();

        loadProducts();

        loadDashboardData();

    }

    catch (error) {

        console.error(error);

        alert("Failed to save product.");

    }

}


async function loadProducts() {

    const productList =
        document.getElementById("productList");


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

            throw new Error(
                "Unable to fetch products"
            );

        }


        const products =
            await response.json();


        document.getElementById("productCount")
            .textContent = products.length;


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

                        <th>Description</th>

                        <th>Price</th>

                        <th>Threshold</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

        `;


        products.forEach(product => {

            html += `

                <tr>

                    <td>${product.Id}</td>

                    <td>${product.Name}</td>

                    <td>${product.SKU}</td>

                    <td>${product.Description}</td>

                    <td>₹ ${product.Price}</td>

                    <td>${product.ReorderThreshold}</td>

                    <td>

                        <div class="action-buttons">

                            <button
                                class="edit-btn"
                                onclick="editProduct(${product.Id})">

                                Edit

                            </button>

                            <button
                                class="delete-btn"
                                onclick="deleteProduct(${product.Id})">

                                Delete

                            </button>

                        </div>

                    </td>

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

            </div>

        `;

    }

}


async function editProduct(id) {

    try {

        const response = await fetch(
            `${API_URL}/api/product/${id}`
        );


        if (!response.ok) {

            throw new Error(
                "Unable to get product"
            );

        }


        const product =
            await response.json();


        editingProductId = product.Id;


        document.getElementById("productName").value =
            product.Name;

        document.getElementById("productSKU").value =
            product.SKU;

        document.getElementById("productDescription").value =
            product.Description;

        document.getElementById("productPrice").value =
            product.Price;

        document.getElementById("productThreshold").value =
            product.ReorderThreshold;


        document
            .getElementById("productFormTitle")
            .textContent = "Edit Product";


        document
            .getElementById("productSaveButton")
            .textContent = "Update Product";


        document
            .getElementById("productForm")
            .classList.remove("hidden");

    }

    catch (error) {

        console.error(error);

        alert("Unable to load product.");

    }

}


async function deleteProduct(id) {

    if (
        !confirm(
            "Are you sure you want to delete this product?"
        )
    ) {

        return;

    }


    try {

        const response = await fetch(
            `${API_URL}/api/product/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Unable to delete product"
            );

        }


        alert(
            "Product deleted successfully!"
        );


        loadProducts();

        loadDashboardData();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to delete product. It may have related stock movements or alerts."
        );

    }

}


// =====================================================
// ============== STOCK MOVEMENT CRUD ==================
// =====================================================

function showMovementForm() {

    document
        .getElementById("movementForm")
        .classList.remove("hidden");


    document
        .getElementById("movementFormTitle")
        .textContent = "Add Stock Movement";


    document
        .getElementById("movementSaveButton")
        .textContent = "Add Movement";


    editingMovementId = null;

    clearMovementForm();

}


function hideMovementForm() {

    document
        .getElementById("movementForm")
        .classList.add("hidden");


    editingMovementId = null;

    clearMovementForm();

}


function clearMovementForm() {

    document.getElementById("movementQuantity").value = "";

    document.getElementById("movementReason").value = "";

    document.getElementById("movementDate").value = "";

    document.getElementById("movementProductId").value = "";

}


async function saveMovement() {

    const productId =
        Number(
            document.getElementById(
                "movementProductId"
            ).value
        );


    const data = {

        Quantity:
            Number(
                document.getElementById(
                    "movementQuantity"
                ).value
            ),

        Reason:
        document.getElementById(
            "movementReason"
        ).value,

        MovementDate:
        document.getElementById(
            "movementDate"
        ).value,

        ProductId:
        productId

    };


    if (
        isNaN(data.Quantity) ||
        !data.Reason ||
        !data.MovementDate ||
        isNaN(data.ProductId)
    ) {

        alert(
            "Please fill all stock movement fields."
        );

        return;

    }


    try {

        let response;


        if (editingMovementId !== null) {

            const updateData = {

                Id: editingMovementId,

                Quantity: data.Quantity,

                Reason: data.Reason,

                MovementDate: data.MovementDate,

                Product: {
                    Id: data.ProductId
                }

            };


            response = await fetch(
                `${API_URL}/api/stockmovement`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(updateData)

                }
            );

        }

        else {

            response = await fetch(
                `${API_URL}/api/stockmovement`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(data)

                }
            );

        }


        if (!response.ok) {

            throw new Error(
                "Unable to save movement"
            );

        }


        alert(
            editingMovementId !== null
                ? "Stock movement updated successfully!"
                : "Stock movement added successfully!"
        );


        hideMovementForm();

        loadMovements();

        loadDashboardData();

    }

    catch (error) {

        console.error(error);

        alert(
            "Failed to save stock movement."
        );

    }

}


async function loadMovements() {

    const movementList =
        document.getElementById(
            "movementList"
        );


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

            throw new Error(
                "Unable to fetch movements"
            );

        }


        const movements =
            await response.json();


        document.getElementById(
            "movementCount"
        ).textContent =
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

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

        `;


        movements.forEach(movement => {

            const productId =
                movement.product
                    ? movement.product.Id
                    : "-";


            html += `

                <tr>

                    <td>${movement.Id}</td>

                    <td>${movement.Quantity}</td>

                    <td>${movement.Reason}</td>

                    <td>${movement.MovementDate}</td>

                    <td>${productId}</td>

                    <td>

                        <div class="action-buttons">

                            <button
                                class="edit-btn"
                                onclick="editMovement(${movement.Id})">

                                Edit

                            </button>

                            <button
                                class="delete-btn"
                                onclick="deleteMovement(${movement.Id})">

                                Delete

                            </button>

                        </div>

                    </td>

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


async function editMovement(id) {

    try {

        const response = await fetch(
            `${API_URL}/api/stockmovement/${id}`
        );


        if (!response.ok) {

            throw new Error(
                "Unable to get movement"
            );

        }


        const movement =
            await response.json();


        editingMovementId =
            movement.Id;


        document.getElementById(
            "movementQuantity"
        ).value =
            movement.Quantity;


        document.getElementById(
            "movementReason"
        ).value =
            movement.Reason;


        document.getElementById(
            "movementDate"
        ).value =
            movement.MovementDate;


        if (movement.product) {

            document.getElementById(
                "movementProductId"
            ).value =
                movement.product.Id;

        }


        document
            .getElementById(
                "movementFormTitle"
            )
            .textContent =
            "Edit Stock Movement";


        document
            .getElementById(
                "movementSaveButton"
            )
            .textContent =
            "Update Movement";


        document
            .getElementById(
                "movementForm"
            )
            .classList
            .remove("hidden");

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to load stock movement."
        );

    }

}


async function deleteMovement(id) {

    if (
        !confirm(
            "Are you sure you want to delete this stock movement?"
        )
    ) {

        return;

    }


    try {

        const response = await fetch(
            `${API_URL}/api/stockmovement/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Unable to delete movement"
            );

        }


        alert(
            "Stock movement deleted successfully!"
        );


        loadMovements();

        loadDashboardData();

    }

    catch (error) {

        console.error(error);

        alert(
            "Failed to delete stock movement."
        );

    }

}


// =====================================================
// ================ REORDER ALERT CRUD =================
// =====================================================

function showAlertForm() {

    document
        .getElementById("alertForm")
        .classList
        .remove("hidden");


    document
        .getElementById("alertFormTitle")
        .textContent =
        "Add Reorder Alert";


    document
        .getElementById("alertSaveButton")
        .textContent =
        "Add Alert";


    editingAlertId = null;

    clearAlertForm();

}


function hideAlertForm() {

    document
        .getElementById("alertForm")
        .classList
        .add("hidden");


    editingAlertId = null;

    clearAlertForm();

}


function clearAlertForm() {

    document.getElementById(
        "currentStock"
    ).value = "";

    document.getElementById(
        "reorderThreshold"
    ).value = "";

    document.getElementById(
        "alertMessage"
    ).value = "";

    document.getElementById(
        "alertStatus"
    ).value = "ACTIVE";

    document.getElementById(
        "alertDate"
    ).value = "";

    document.getElementById(
        "alertProductId"
    ).value = "";

}


async function saveAlert() {

    const productId =
        Number(
            document.getElementById(
                "alertProductId"
            ).value
        );


    const data = {

        CurrentStock:
            Number(
                document.getElementById(
                    "currentStock"
                ).value
            ),

        ReorderThreshold:
            Number(
                document.getElementById(
                    "reorderThreshold"
                ).value
            ),

        Message:
        document.getElementById(
            "alertMessage"
        ).value,

        Status:
        document.getElementById(
            "alertStatus"
        ).value,

        AlertDate:
        document.getElementById(
            "alertDate"
        ).value,

        ProductId:
        productId

    };


    if (
        isNaN(data.CurrentStock) ||
        isNaN(data.ReorderThreshold) ||
        !data.Message ||
        !data.AlertDate ||
        isNaN(data.ProductId)
    ) {

        alert(
            "Please fill all reorder alert fields."
        );

        return;

    }


    try {

        let response;


        if (editingAlertId !== null) {

            const updateData = {

                Id: editingAlertId,

                CurrentStock:
                data.CurrentStock,

                ReorderThreshold:
                data.ReorderThreshold,

                Message:
                data.Message,

                Status:
                data.Status,

                AlertDate:
                data.AlertDate,

                Product: {
                    Id: data.ProductId
                }

            };


            response = await fetch(
                `${API_URL}/api/reorderalert`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            updateData
                        )

                }
            );

        }

        else {

            response = await fetch(
                `${API_URL}/api/reorderalert`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)

                }
            );

        }


        if (!response.ok) {

            throw new Error(
                "Unable to save alert"
            );

        }


        alert(
            editingAlertId !== null
                ? "Reorder alert updated successfully!"
                : "Reorder alert added successfully!"
        );


        hideAlertForm();

        loadAlerts();

        loadDashboardData();

    }

    catch (error) {

        console.error(error);

        alert(
            "Failed to save reorder alert."
        );

    }

}


async function loadAlerts() {

    const alertList =
        document.getElementById(
            "alertList"
        );


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

            throw new Error(
                "Unable to fetch alerts"
            );

        }


        const alerts =
            await response.json();


        document.getElementById(
            "alertCount"
        ).textContent =
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

                        <th>Product ID</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

        `;


        alerts.forEach(alert => {

            const productId =
                alert.product
                    ? alert.product.Id
                    : "-";


            html += `

                <tr>

                    <td>${alert.Id}</td>

                    <td>${alert.CurrentStock}</td>

                    <td>${alert.ReorderThreshold}</td>

                    <td>${alert.Message}</td>

                    <td>

                        <span class="status-badge">

                            ${alert.Status}

                        </span>

                    </td>

                    <td>${alert.AlertDate}</td>

                    <td>${productId}</td>

                    <td>

                        <div class="action-buttons">

                            <button
                                class="edit-btn"
                                onclick="editAlert(${alert.Id})">

                                Edit

                            </button>

                            <button
                                class="delete-btn"
                                onclick="deleteAlert(${alert.Id})">

                                Delete

                            </button>

                        </div>

                    </td>

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


async function editAlert(id) {

    try {

        const response = await fetch(
            `${API_URL}/api/reorderalert/${id}`
        );


        if (!response.ok) {

            throw new Error(
                "Unable to get alert"
            );

        }


        const alertData =
            await response.json();


        editingAlertId =
            alertData.Id;


        document.getElementById(
            "currentStock"
        ).value =
            alertData.CurrentStock;


        document.getElementById(
            "reorderThreshold"
        ).value =
            alertData.ReorderThreshold;


        document.getElementById(
            "alertMessage"
        ).value =
            alertData.Message;


        document.getElementById(
            "alertStatus"
        ).value =
            alertData.Status;


        document.getElementById(
            "alertDate"
        ).value =
            alertData.AlertDate;


        if (alertData.product) {

            document.getElementById(
                "alertProductId"
            ).value =
                alertData.product.Id;

        }


        document
            .getElementById(
                "alertFormTitle"
            )
            .textContent =
            "Edit Reorder Alert";


        document
            .getElementById(
                "alertSaveButton"
            )
            .textContent =
            "Update Alert";


        document
            .getElementById(
                "alertForm"
            )
            .classList
            .remove("hidden");

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to load reorder alert."
        );

    }

}


async function deleteAlert(id) {

    if (
        !confirm(
            "Are you sure you want to delete this reorder alert?"
        )
    ) {

        return;

    }


    try {

        const response = await fetch(
            `${API_URL}/api/reorderalert/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Unable to delete alert"
            );

        }


        alert(
            "Reorder alert deleted successfully!"
        );


        loadAlerts();

        loadDashboardData();

    }

    catch (error) {

        console.error(error);

        alert(
            "Failed to delete reorder alert."
        );

    }

}


// =====================================================
// ================= DASHBOARD =========================
// =====================================================

async function loadDashboardData() {

    try {

        const productResponse =
            await fetch(
                `${API_URL}/api/product`
            );


        const movementResponse =
            await fetch(
                `${API_URL}/api/stockmovement`
            );


        const alertResponse =
            await fetch(
                `${API_URL}/api/reorderalert`
            );


        if (productResponse.ok) {

            const products =
                await productResponse.json();


            document.getElementById(
                "productCount"
            ).textContent =
                products.length;

        }


        if (movementResponse.ok) {

            const movements =
                await movementResponse.json();


            document.getElementById(
                "movementCount"
            ).textContent =
                movements.length;

        }


        if (alertResponse.ok) {

            const alerts =
                await alertResponse.json();


            document.getElementById(
                "alertCount"
            ).textContent =
                alerts.length;

        }

    }

    catch (error) {

        console.error(
            "Dashboard data error:",
            error
        );

    }

}


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Stock Alert Frontend Loaded"
        );

        loadDashboardData();

    }
);