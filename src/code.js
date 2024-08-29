console.log("start");

// Class to represent a classmate
class Classmate {
    constructor(firstname, lastname, pronouns, phone, email = null, note = null) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.pronouns = pronouns;
        this.phone = phone;
        this.email = email;
        this.note = note;
    }
}

// DOM Elements
const classListElement = document.getElementById("class_list");
const firstnameElement = document.getElementById("firstname");
const lastnameElement = document.getElementById("lastname");
const pronounsElement = document.getElementById("pronouns");
const phoneElement = document.getElementById("phone_number");
const includeEmailElement = document.getElementById("email_checkbox");
const emailElement = document.getElementById("email");
const noteElement = document.getElementById("note");
const includeNoteElement = document.getElementById("note_checkbox");
const addButtonElement = document.getElementById("add_button");

// Clear the class list table
function clearList() {
    console.log(classListElement ? "Class list found" : "No class list found");
    while (classListElement.firstChild) {
        classListElement.removeChild(classListElement.firstChild);
    }
    console.log("List cleared");
}

// Setup event listeners for checkboxes
function setupCheckboxListeners() {
    includeNoteElement.addEventListener('change', handleNoteCheckboxChange);
    includeEmailElement.addEventListener('change', handleEmailCheckboxChange);
    console.log("Checkbox listeners set up");
}

// Handle changes to the note checkbox
function handleNoteCheckboxChange(event) {
    noteElement.disabled = !event.currentTarget.checked;
    noteElement.setAttribute('aria-disabled', !event.currentTarget.checked);
    updateButtonState();
}

// Handle changes to the email checkbox
function handleEmailCheckboxChange(event) {
    emailElement.disabled = !event.currentTarget.checked;
    emailElement.setAttribute('aria-disabled', !event.currentTarget.checked);
    updateButtonState();
}

// Setup event listeners for input fields
function setupInputListeners() {
    const inputs = [firstnameElement, lastnameElement, pronounsElement, phoneElement, emailElement];
    inputs.forEach(input => input.addEventListener("input", updateButtonState));
}

// Update the state of the add button based on input validity
function updateButtonState() {
    const isInvalid = isContactInvalid();
    addButtonElement.disabled = isInvalid;
    addButtonElement.setAttribute('aria-disabled', isInvalid);
    saveToStorage();
}

// Handle add button click
function setupAddButtonListener() {
    addButtonElement.addEventListener("click", handleAddButtonClick);
}

function createClassmate(){
    return classmate = new Classmate(
        firstnameElement.value,
        lastnameElement.value,
        pronounsElement.value,
        phoneElement.value,
        emailElement.value.trim() || null,
        noteElement.value.trim() || null
    );
}

// Handle adding a classmate to the list
function handleAddButtonClick() {
    if (isContactInvalid()) return updateButtonState();
    
    console.log('Add button clicked');
    
    const classmate = createClassmate();

    console.log("Adding classmate:", classmate);
    addToList(classmate);
    resetContactInfo();
}

// Check if the contact information is valid
function isContactInvalid() {
    return !firstnameElement.validity.valid
        || !lastnameElement.validity.valid
        || !pronounsElement.validity.valid
        || !phoneElement.validity.valid
        || (includeEmailElement.checked && !emailElement.validity.valid)
        || (includeNoteElement.checked && !noteElement.validity.valid);
}

// Add a classmate to the list in the table
function addToList(classmate) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${classListElement.children.length + 1}</td>
        <td>${classmate.firstname}</td>
        <td>${classmate.lastname}</td>
        <td><button>❌</button></td>
    `;
    
    classListElement.appendChild(row);
    updateButtonState();
}

// Reset the contact information form fields
function resetContactInfo() {
    firstnameElement.value = "";
    lastnameElement.value = "";
    pronounsElement.value = "";
    phoneElement.value = "";
    emailElement.value = "";
    noteElement.value = "";
}

// Initialize the application
function initialize() {
    try {
        clearList();
        setupCheckboxListeners();
        setupInputListeners();
        setupAddButtonListener();
    } catch (error) {
        console.error("An error occurred:", error);
    }
    console.log("Initialization complete");
}


//Repopulate the filds using information from a previous session.
function loadFromStorage() {
    const savedContact = JSON.parse(localStorage.getItem("saved_contact"));
    if(typeof savedContact != "object") return;

    firstnameElement.value = savedContact.firstname;
    lastnameElement.value = savedContact.lastname;
    pronounsElement.value = savedContact.pronouns;
    phoneElement.value = savedContact.phone;
    emailElement.value = savedContact.email;
    noteElement.value = savedContact.note;

    updateButtonState();
}

//Save field information to local storage
function saveToStorage() {
    localStorage.setItem("saved_contact", JSON.stringify(createClassmate()))
}

// Run initialization
initialize();
loadFromStorage();


console.log("done");
