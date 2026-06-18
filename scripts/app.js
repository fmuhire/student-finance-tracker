const form = document.getElementById("record-form");
const message = document.getElementById("form-message");

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

    const descriptionRegex =
        /^\S(?:.*\S)?$/;

    const amountRegex =
        /^(0|[1-9]\d*)(\.\d{1,2})?$/;

    const categoryRegex =
        /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

    const dateRegex =
        /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    if (!descriptionRegex.test(description)) {

        message.textContent =
            "Invalid description.";

        return;
    }
    const duplicateWordRegex =
    /\b(\w+)\s+\1\b/i;

if (duplicateWordRegex.test(description)) {

    message.textContent =
        "Duplicate word detected.";

    return;
}

    if (!amountRegex.test(amount)) {

        message.textContent =
            "Invalid amount.";

        return;
    }

    if (!categoryRegex.test(category)) {

        message.textContent =
            "Invalid category.";

        return;
    }

    if (!dateRegex.test(date)) {

        message.textContent =
            "Invalid date.";

        return;
    }

    const recordsBody =
    document.getElementById("records-body");

const newRow =
    document.createElement("tr");

newRow.innerHTML = `
    <td>${description}</td>
    <td>${amount}</td>
    <td>${category}</td>
    <td>${date}</td>
`;

recordsBody.appendChild(newRow);

message.textContent =
    "Record added successfully.";

form.reset();

});