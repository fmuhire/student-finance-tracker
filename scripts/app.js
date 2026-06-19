const records = JSON.parse(localStorage.getItem("records")) || [];

const form = document.getElementById("record-form");
const message = document.getElementById("form-message");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");

// =========================
// Display RECORDS
// =========================
function renderRecords() {

    const recordsBody =
        document.getElementById("records-body");

    recordsBody.innerHTML = "";

    const searchTerm =
    searchInput.value.toLowerCase();

records.forEach(record => {

    const matchesSearch =
        record.description.toLowerCase().includes(searchTerm) ||
        record.category.toLowerCase().includes(searchTerm);

    if (!matchesSearch) {
        return;
    }

        const newRow =
            document.createElement("tr");

        newRow.innerHTML = `
            <td>${record.description}</td>
            <td>${record.amount}</td>
            <td>${record.category}</td>
            <td>${record.date}</td>
        `;

        recordsBody.appendChild(newRow);
    });
}

// =========================
// DASHBOARD
// =========================
function updateDashboard() {

    const totalTransactions = records.length;

    let totalSpending = 0;

    records.forEach(record => {
        totalSpending += record.amount;
    });

    document.getElementById("total-transactions").textContent =
        totalTransactions;

    document.getElementById("total-spending").textContent =
        "$" + totalSpending.toFixed(2);
}

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const description =
        document.getElementById("description").value;

    const amount =
        document.getElementById("amount").value;

    const category =
        document.getElementById("category").value;

    const date =
        document.getElementById("date").value;

    // VALIDATION
    const descriptionRegex = /^\S(?:.*\S)?$/;
    const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    if (!descriptionRegex.test(description)) {
        message.textContent = "Invalid description.";
        return;
    }

    if (/\b(\w+)\s+\1\b/i.test(description)) {
        message.textContent = "Duplicate word detected.";
        return;
    }

    if (!amountRegex.test(amount)) {
        message.textContent = "Invalid amount.";
        return;
    }

    if (!categoryRegex.test(category)) {
        message.textContent = "Invalid category.";
        return;
    }

    if (!dateRegex.test(date)) {
        message.textContent = "Invalid date.";
        return;
    }

    // CREATE RECORD
    const record = {
        id: Date.now(),
        description,
        amount: Number(amount),
        category,
        date,
        createdAt: new Date().toISOString()
    };

    // SAVE DATA
    records.push(record);
    localStorage.setItem("records", JSON.stringify(records));

    // UPDATE UI
    renderRecords();
    updateDashboard();

    message.textContent = "Record added successfully.";
    form.reset();
});

renderRecords();
updateDashboard();

searchInput.addEventListener("input", function () {

    renderRecords();

});