function editNav() {
    let x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const modalCloseBtn = document.querySelector(".close");
const formData = document.querySelectorAll(".formData");
const reserveForm = document.forms.namedItem("reserve");

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// close modal event
modalCloseBtn.addEventListener("click", closeModal);

// form submit event
reserveForm.addEventListener("submit", validateForm);

// launch modal form
function launchModal() {
    modalbg.style.display = "block";
}

// close modal form
function closeModal() {
    modalbg.style.display = "none";
}

function validateForm(event) {
    let formNotValid = false;

    const form = event.target;
    const formControlsCollection = form.elements;

    for (const formControl of formControlsCollection) {
        console.log(formControl.name);

        switch (formControl.name) {
            case "first":
                if (formControl.validity.valueMissing) {
                    formNotValid = true;
                    console.error("first name is required");
                    // formControl.nextElementSibling.innerHTML =
                    //     "Veuillez entrer 2 caractères ou plus pour le champ du prénom.";
                    // formNotValid = true;
                } else if (formControl.value.length < 2) {
                    formNotValid = true;
                    console.error("first name is too short");
                }
                break;
            case "last":
                break;
            case "email":
                break;
            case "birthdate":
                break;
            case "quantity":
                break;
            case "location":
                break;
            case "terms-and-conditions":
                break;
            case "newsletter":
                break;

        }
    }

    // console.log(event);
    // console.log(form);
    // console.log(event.target.elements);
    // console.log(event.target.elements.location);

    console.log("validation");


    if (formNotValid) {
        event.preventDefault();
        return false;
    }

    return true;
}
