console.log("start");
let classmates = [];

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
const vcardButtonElement = document.getElementById("create_button");

// Clear the class list table
function clearList() {
    console.log(classListElement ? "Class list found" : "No class list found");
    while (classListElement.firstChild) {
        classListElement.removeChild(classListElement.firstChild);
    }
    console.log("List cleared");
    classmates = [];
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
function updateButtonState(save = true) {
    const isInvalid = isContactInvalid();
    addButtonElement.disabled = isInvalid;
    addButtonElement.setAttribute('aria-disabled', isInvalid);
    if(save) saveToStorage();
}

// Handle add button click
function setupButtonListeners() {
    addButtonElement.addEventListener("click", handleAddButtonClick);
    vcardButtonElement.addEventListener("click", handleVcardButtonClick);
}


function handleVcardButtonClick() {
    let vcards = createClassVcards();
    download("class_contact.vcf", vcards);
}

function createClassmate(){
    return classmate = new Classmate(
        firstnameElement.value.trim(),
        lastnameElement.value.trim(),
        pronounsElement.value.trim(),
        phoneElement.value.trim(),
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
    saveClassmates();
    resetContactInfo();

    addToList(classmate);
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
function addToList(classmate, save = true) {
    console.log(save);
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${classListElement.children.length + 1}</td>
        <td>${classmate.firstname}</td>
        <td>${classmate.lastname}</td>
        <td><button>❌</button></td>
    `;

    classListElement.appendChild(row);

    if(save) {
        console.log("saving classmates");
        classmates.push(classmate);
        saveClassmates();
        updateButtonState();
    }
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
        try { loadFromStorage(); } catch { }
        setupCheckboxListeners();
        setupInputListeners();
        setupButtonListeners();
    } catch (error) {
        console.error("An error occurred:", error);
    }
    window.addEventListener("mousemove", _ => {
        let isDisabled = classmates.length < 1;
        vcardButtonElement.disabled = isDisabled;
        vcardButtonElement.setAttribute('aria-disabled', isDisabled);
    })
    console.log("Initialization complete");
}


//Repopulate the filds using information from a previous session.
function loadFromStorage() {
    const savedContact = JSON.parse(localStorage.getItem("saved_contact"));

    if(typeof savedContact == "object") {
        firstnameElement.value = savedContact.firstname;
        lastnameElement.value = savedContact.lastname;
        pronounsElement.value = savedContact.pronouns;
        phoneElement.value = savedContact.phone;
        emailElement.value = savedContact.email;
        noteElement.value = savedContact.note;
    
        updateButtonState(false);
    }
    
    let classmates_ = JSON.parse(localStorage.getItem("classmates"));
    console.log("after pasrse", classmates_);
    console.log("before update list", classmates)
    updateList(classmates_ || []);
    console.log("After update list", classmates);
}

function updateList(classmatesList) {
    console.log("classmates list", classmatesList)
    classmates = classmatesList.map(classmateData => new Classmate(
        classmateData.firstname,
        classmateData.lastname,
        classmateData.pronouns,
        classmateData.phone,
        classmateData.email,
        classmateData.note
    ));
    console.log("before adding to list", classmates);
    classmates.forEach(classmate => addToList(classmate, false));
    console.log("aftering adding to list", classmates);

}

function createVCard(classmate) {
return `BEGIN:VCARD
VERSION:3.0
TITLE:AEMT Classmate
FN:${classmate.firstname} ${classmate.lastname}
N:${classmate.lastname};${classmate.firstname};;;
TEL;TYPE=cell:${classmate.phone}
NOTE: Their pronouns are ${classmate.pronouns}. ${classmate.note ? `\n${classmate.note}` : ""}${classmate.email? `\nEMAIL:${classmate.email}` : ""}${classmate.birthday ? `\nBDAY:${classmate.birthday}` : ""}
END:VCARD`
}

function createClassVcards() {
    let vcards = "";

    classmates.forEach(classmate =>{
        vcards += (createVCard(classmate) + '\n')
    });

    return vcards;
}

//Save field information to local storage
function saveToStorage() {
    localStorage.setItem("saved_contact", JSON.stringify(createClassmate()));
}

function saveClassmates(){
    localStorage.removeItem("classmates"); 
    localStorage.setItem("classmates", JSON.stringify(classmates));
}

// Run initialization
initialize();


console.log("done");

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}