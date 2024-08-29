console.log("start");

class Classmate {
    constructor(
        firstname,
        lastname,
        pronouns,
        phone,
        email = null,
        note = null
    ) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.pronouns = pronouns;
        this.phone = phone;
        this.email = email;
        this.note = note;
    }
}
const class_list = document.getElementById("class_list");

//<start> User interface controls 
const firstname_element = document.getElementById("firstname");
const lastname_element = document.getElementById("lastname");
const pronouns_element = document.getElementById("pronouns");
const phone_element = document.getElementById("phone_number");
const include_email_element = document.getElementById("email_checkbox");
const email_element = document.getElementById("email");
const note_element = document.getElementById("note")
const include_note_element = document.getElementById("note_checkbox");
const add_button_element = document.getElementById("add_button");
//<end>

//If the list is empty on page load then javascript is working
function clear_list() {
    console.log(class_list ? "Class list found" : "No class list found");
    for (var index in class_list?.children){
        let row = class_list.children[0];
        if(row.tagName != "TR") continue;

        class_list.removeChild(row);
    }
    console.log("cleared list")
}

function setup_checkbox(){
    include_note_element
    .addEventListener('change', 
        event => {
            note_element.disabled = !event.currentTarget.checked;
            note_element.ariaDisabled = !event.currentTarget.checked;
            disable_button(invalid_contact());
    });

    include_email_element
    .addEventListener('change', 
    event => {
        email_element.disabled = !event.currentTarget.checked;
        email_element.ariaDisabled = !event.currentTarget.checked;
        disable_button(invalid_contact());

    });

    console.log("setup checkbox");
}
function setup_valid_check(){
    firstname_element.addEventListener("input", _ => disable_button(invalid_contact()));
    lastname_element.addEventListener("input", _ => disable_button(invalid_contact()));
    pronouns_element.addEventListener("input", _ => disable_button(invalid_contact()));
    phone_element.addEventListener("input", _ => disable_button(invalid_contact()));
    email_element.addEventListener("input", _ => disable_button(invalid_contact()));
}

function disable_button(disable){
    add_button_element.disabled = disable;
    add_button_element.ariaDisabled = disable;
}
function setup_add_button(){
    add_button_element.addEventListener("click", event => {
        if(invalid_contact()) return;
        console.log('clicked');
        
        let classmate = new Classmate(
            firstname_element.value,
            lastname_element.value,
            pronouns_element.value,
            phone_element.value,
            email_element.value.trim() != "" ? email_element.value : null,
            note_element.value.trim() != "" ? note_element.value : null,
        );

        console.log("adding classmate");
        add_to_list(classmate);
        reset_contact_info();
    })
}
function invalid_contact() {
    return !firstname_element.validity.valid
        || !lastname_element.validity.valid 
        || !pronouns_element.validity.valid
        || !phone_element.validity.valid
        || include_email_element.checked && !email_element.validity.valid
        || include_note_element.checked && !note_element.validity.valid;
}


function add_to_list(classmate){
    let row = document.createElement("tr");

    let index = document.createElement("td");
    let firstname = document.createElement("td");
    let lastname = document.createElement("td");
    let delete_column = document.createElement("td");
    let delete_button = document.createElement("button");
    

    index.innerHTML = class_list.children.length + 1;
    firstname.innerHTML = classmate.firstname;
    lastname.innerHTML = classmate.lastname;
    delete_button.innerText = "❌";
    delete_column.appendChild(delete_button);

    row.appendChild(index);
    row.appendChild(firstname);
    row.appendChild(lastname);
    row.appendChild(delete_column);

    class_list.appendChild(row);
    disable_button(true);
}

function reset_contact_info(){
    firstname_element.value = "";
    lastname_element.value = "";
    pronouns_element.value = "";
    phone_element.value = "";
    email_element.value = "";
    note_element.value = "";
}

try{clear_list()}catch{}
try{setup_checkbox()}catch{}
try{setup_valid_check()}catch{}
try{setup_add_button()}catch{}

console.log("done");
