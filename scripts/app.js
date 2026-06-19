const records = JSON.parse(localStorage.getItem("records")) || [];
document.getElementById("budget-cap").value =
    localStorage.getItem("budgetCap") || "";

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

const sortedRecords = [...records];

if (sortSelect.value === "newest") {

    sortedRecords.sort((a, b) =>
        b.id - a.id);

}
if (sortSelect.value === "oldest") {

    sortedRecords.sort((a, b) =>
        a.id - b.id);

}
if (sortSelect.value === "highest") {

    sortedRecords.sort((a, b) =>
        b.amount - a.amount);

}
if (sortSelect.value === "lowest") {

    sortedRecords.sort((a, b) =>
        a.amount - b.amount);

}
sortedRecords.forEach(record => {

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

    const categoryTotals = {};

    records.forEach(record => {

        const amount = Number(record.amount);

        totalSpending += amount;

        if (!categoryTotals[record.category]) {
            categoryTotals[record.category] = 0;
        }

        categoryTotals[record.category] += amount;
    });

    // Find top category
    let topCategory = "None";
    let maxAmount = 0;

    for (let category in categoryTotals) {

        if (categoryTotals[category] > maxAmount) {
            maxAmount = categoryTotals[category];
            topCategory = category;
        }
    }

    document.getElementById("total-transactions").textContent =
        totalTransactions;

    document.getElementById("total-spending").textContent =
        "$" + totalSpending.toFixed(2);

    document.getElementById("top-category").textContent =
        topCategory;
        const budgetInput =
    document.getElementById("budget-cap").value;

const budgetStatus =
    document.getElementById("budget-status");

if (!budgetInput) {

    budgetStatus.textContent = "No Budget Set";

} else {

    const budget = Number(budgetInput);

    if (totalSpending > budget) {

        budgetStatus.textContent = "Over Budget ⚠️";

    } else {

        budgetStatus.textContent = "Within Budget ✅";

    }
}

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

// SEARCH
searchInput.addEventListener("input", function () {

    renderRecords();

});

// SORT
sortSelect.addEventListener("change", function () {

    renderRecords();

});

// BUDGET (SAFE)
const budgetInputField =
    document.getElementById("budget-cap");

if (budgetInputField) {

    budgetInputField.addEventListener("input", function () {

        localStorage.setItem("budgetCap", budgetInputField.value);

        updateDashboard();

    });
}
const exportBtn = document.getElementById("export-data");

if (exportBtn) {

    exportBtn.addEventListener("click", function () {

        const dataStr = JSON.stringify(records, null, 2);

        const blob = new Blob([dataStr], { type: "application/json" });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "student-finance-data.json";

        a.click();

        URL.revokeObjectURL(url);

    });

}
const importBtn = document.getElementById("import-data");

if (importBtn) {

    importBtn.addEventListener("click", function () {

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";

        input.addEventListener("change", function (event) {

            const file = event.target.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = function (e) {

                try {

                    const importedData = JSON.parse(e.target.result);

                    if (!Array.isArray(importedData)) {
                        alert("Invalid file format");
                        return;
                    }

                    records.length = 0; // clear current records

                    importedData.forEach(item => {
                        records.push(item);
                    });

                    localStorage.setItem("records", JSON.stringify(records));

                    renderRecords();
                    updateDashboard();

                    alert("Data imported successfully!");

                } catch (error) {
                    alert("Error reading file");
                }

            };

            reader.readAsText(file);

        });

        input.click();

    });

}