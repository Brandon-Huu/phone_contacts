console.log("start");

class Classmate {
    constructor(_firstname, _lastname) {
        
    }
}
const class_list = document.getElementById("class_list");

//<start> User interface controls 
const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const gender = document.getElementById("gender");
const note = document.getElementById("note")
const include_note = document.getElementById("note_checkbox");
const add_button = document.getElementById("add_button");
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
    include_note
    .addEventListener('change', 
        event => {
            note.disabled = !event.currentTarget.checked;
            note.ariaDisabled = !event.currentTarget.checked;
        });
    console.log("setup checkbox");
}

function setup_add_button(){
    add_button.onclick(event => {
        
    })
}

try{clear_list()}catch{}
try{setup_checkbox()}catch{}
try{setup_add_button()}catch{}

console.log("done");
