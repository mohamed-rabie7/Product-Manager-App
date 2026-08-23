const toggle = document.getElementById("toggle");
const skipLink = document.getElementById("skipLink");
const shortcuts = document.getElementById("shortcuts");
const app = document.getElementById("app");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productQuantity = document.getElementById("productQuantity");
const saveBtn = document.getElementById("saveBtn");
const validation = document.getElementById("validation");
const message = document.getElementById("message");
const productList = document.getElementById("productList");
const shortcutsModal = document.getElementById("shortcutsModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

let products = [];
let editIndex = null;

//Save Products
const savedProducts = localStorage.getItem("products");

if (savedProducts !== null) {
    products = JSON.parse(savedProducts);
}

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

//Save the input fields
const savedInputs = localStorage.getItem("inputs");

if (savedInputs !== null) {
    const preservedInputs = JSON.parse(savedInputs);

    productName.value = preservedInputs.name;
    productPrice.value = preservedInputs.price;
    productQuantity.value = preservedInputs.quantity;
}

function saveInputs() {
    const inputs = {
        name: productName.value,
        price: productPrice.value,
        quantity: productQuantity.value
    };
    localStorage.setItem("inputs", JSON.stringify(inputs));
}

productName.addEventListener("input", saveInputs);
productPrice.addEventListener("input", saveInputs);
productQuantity.addEventListener("input", saveInputs);
window.addEventListener("beforeunload", saveInputs);

//Display Products
function displayProducts() {
    if (products.length === 0) {
        productList.innerHTML = `
        <p style="text-align:center; color:#777; font-size: 22px;">
            No products yet. Add your first product above!
        </p>
        `
        return;
    }

    let html = "";
    products.forEach((product, index) => {
        const isLong = product.name.replaceAll(" ", "").length >= 40;
        const isUpperCase = product.name === product.name.toUpperCase();
        let h3Class = "";

        if (isLong && isUpperCase) h3Class = "huge";
        else if (isLong) h3Class = "long";
        else if (isUpperCase) h3Class = "upperCase";

        html += `
        <div class="product">
            <h3 class="${h3Class}">${product.name}</h3>
            <h4>Price: $${Number(product.price).toFixed(2)}</h4>
            <h4>Quantity: ${product.quantity}</h4>
            <button type="button" class="edit" data-index="${index}" aria-label="Edit ${product.name}">Edit</button>
            <button type="button" class="del" data-index="${index}" aria-label="Delete ${product.name}">Delete</button>
        </div>
        `;
    });

    productList.innerHTML = html;
}

//target the edit or the delete button
productList.addEventListener("click", function (e) {
    const target = e.target;

    if (target.classList.contains("edit")) {
        const index = target.dataset.index;
        if (index !== undefined) edit(parseInt(index));
    } 
    else if (target.classList.contains("del")) {
        const index = target.dataset.index;
        if (index !== undefined) del(parseInt(index));
    }
});

//Save product button
saveBtn.addEventListener("click", function () {
    const product = {
        name: productName.value.trim(),
        price: productPrice.value.trim(),
        quantity: productQuantity.value.trim()
    };

    if (product.name == "" && product.price == "" && product.quantity == "") {
        validation.textContent = "Please Enter The Product Details";
        message.textContent = "";
        return;
    }

    if (product.name == "") {
        validation.textContent = "Please Enter The Product Name";
        message.textContent = "";
        return;
    } else if (product.price == "") {
        validation.textContent = "Please Enter The Product Price";
        message.textContent = "";
        return;
    } else if (product.quantity == "") {
        validation.textContent = "Please Enter The Product Quantity";
        message.textContent = "";
        return;
    }

    if (editIndex === null) {
        products.push(product);
        message.textContent = "Product Added Successfully";
    } else {
        products[editIndex] = product;
        editIndex = null;
        saveBtn.textContent = "Save Product";
        message.textContent = "Product Updated Successfully";
        validation.textContent = "";
    }

    saveProducts();
    saveEditIndex(null);
    displayProducts();

    productName.value = "";
    productPrice.value = "";
    productQuantity.value = "";

    validation.textContent = "";

    document.querySelectorAll(".edit, .del").forEach(btn => btn.disabled = false);
});

//Edit Button
function edit(index) {
    document.querySelectorAll(".edit, .del").forEach(btn => btn.disabled = true);
    productName.focus();

    editIndex = index;
    saveEditIndex(index);

    productName.value = products[index].name;
    productPrice.value = products[index].price;
    productQuantity.value = products[index].quantity;

    saveBtn.textContent = "Update Product";

    document.querySelectorAll(".product").forEach(el => el.classList.remove("editing"));

    const highlighted = document.querySelectorAll(".product");

    if (highlighted[index]) {
        highlighted[index].classList.add("editing");
    }
}

//Save the editIndex
const getEditIndex = localStorage.getItem("editIndex");

if (getEditIndex !== null) {
    editIndex = JSON.parse(getEditIndex);

    if (editIndex !== null) {
        setTimeout(() => edit(editIndex), 0);
    }
}

function saveEditIndex(index) {
    localStorage.setItem("editIndex", JSON.stringify(index));
}

//Delete Button
function del(index) {
    products.splice(index, 1);

    saveProducts();
    displayProducts();

    message.textContent = "Product Deleted Successfully";
    validation.textContent = "";
}

//Keyboard navigation
productName.addEventListener("keydown", function (event) {
    if (event.code === "Enter") {
        productPrice.focus();
    }

    if (event.code === "ArrowUp") event.preventDefault();
});

productPrice.addEventListener("keydown", function (event) {
    if (event.code === "Enter") {
        productQuantity.focus();
    }
});

productQuantity.addEventListener("keydown", function (event) {
    if (event.code === "Enter") {
        saveBtn.click();
        productName.focus();
    }
});

//Keyboard Shortcuts
document.addEventListener("keydown", function (event) {
    if (event.repeat) return;

    const isTyping = ["INPUT", "TEXTAREA"].includes(event.target.tagName) || event.target.isContentEditable;

    if (event.code === "NumpadDivide" && !event.ctrlKey && !event.altKey && !event.metaKey && !isTyping) {
        event.preventDefault();
        skipLink.click();
    }

    if (event.code === "KeyR" && event.altKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        skipLink.click();
    }

    if (event.code === "Slash" && event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey && !isTyping) {
        event.preventDefault();
        shortcuts.click();
    }

    if (event.code === "KeyD" && event.altKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        toggle.click();
    }

    if (event.code === "Escape" && !event.altKey && !event.ctrlKey && !event.metaKey && editIndex !== null) {
        editIndex = null;
        saveEditIndex(null);

        productName.value = "";
        productPrice.value = "";
        productQuantity.value = "";

        saveBtn.textContent = "Save Product";
        validation.textContent = "";
        message.textContent = "Editing cancelled";

        document.querySelectorAll(".product").forEach(el => el.classList.remove("editing"));
        document.querySelectorAll(".del, .edit").forEach(btn => btn.disabled = false);
        
        productName.blur();
    }

    if (event.code === "Escape" && shortcutsModal.style.display === "flex") {
        closeModalWithAnimation();
    }
});

//Prevented chars and max lengths
productName.addEventListener("keydown", function (event) {
    if (event.key === "<" || event.key === ">") {
        event.preventDefault();
    }
});

productPrice.addEventListener("keydown", function (event) {
    if (event.key === "+" || event.key === "-") {
        event.preventDefault();
    }
});

productQuantity.addEventListener("keydown", function (event) {
    if (event.key === "+" || event.key === "-" || event.key === ".") {
        event.preventDefault();
    }
});

productName.addEventListener("input", function () {
    this.value = this.value.replace(/[<>]/g, "");
});

productPrice.addEventListener("input", function () {
    this.value = this.value.replace(/[-+e]/g, "");

    if (this.value.length > 20) {
        this.value = this.value.slice(0, 20);
    }
});

productQuantity.addEventListener("input", function () {
    this.value = this.value.replace(/[-+.e]/g, "");

    if (this.value.length > 20) {
        this.value = this.value.slice(0, 20);
    }
});

//Dark Mode
let dark = false;
const savedMode = localStorage.getItem("dark");

if (savedMode !== null) {
    dark = JSON.parse(savedMode);
}

if (dark) {
    document.body.classList.add("darkMode");
    toggle.textContent = "Light Mode";
}

function saveMode() {
    localStorage.setItem("dark", JSON.stringify(dark));
}

toggle.addEventListener("click", function () {
    dark = !dark;
    document.body.classList.toggle("darkMode", dark);
    toggle.textContent = dark ? "Light Mode" : "Dark Mode";
    saveMode();
});

toggle.addEventListener("keydown", function (event) {
    if (event.repeat && (event.code === "Enter" || event.code === "Space")) {
        event.preventDefault();
        return;
    }
});

//Skip to form
skipLink.addEventListener("click", function () {
    shortcuts.scrollIntoView({ behavior: "smooth" });

    document.addEventListener("scrollend", function onScrollEnd() {
        productName.focus();
        document.removeEventListener("scrollend", onScrollEnd);
    });
});

//shortcuts Modal
function trapFocus(event) {}

function closeModalWithAnimation() {
    shortcutsModal.classList.add("closing");

    shortcutsModal.addEventListener("animationend", function onEnd() {
        shortcutsModal.style.display = "none";
        shortcutsModal.setAttribute("aria-hidden", "true");
        shortcutsModal.classList.remove("closing");
        shortcuts.focus();
        shortcutsModal.removeEventListener("animationend", onEnd);
    });
}

shortcuts.addEventListener("click", function () {
    shortcutsModal.classList.remove("closing");
    shortcutsModal.style.display = "flex";
    shortcutsModal.setAttribute("aria-hidden", "false");
    closeModal.focus();
});

closeModal.addEventListener("click", closeModalWithAnimation);

shortcutsModal.addEventListener("click", function (event) {
    if (event.target === shortcutsModal) {
        closeModalWithAnimation();
    }
});

displayProducts();