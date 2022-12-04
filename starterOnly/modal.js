function editNav() {
    let x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

// types of errors and associated messages for each form control
const FORM_ERRORS = {
    first: {
        empty: "Votre prénom est requis.",
        too_short: "Veuillez entrer 2 caractères ou plus pour le prénom.",
        invalid: "Veuillez entrer un prénom valide."
    },
    last: {
        empty: "Votre nom est requis.",
        too_short: "Veuillez entrer 2 caractères ou plus pour le nom.",
        invalid: "Veuillez entrer un nom valide."
    },
    email: {
        empty: "Une adresse mail est requise.",
        invalid: "Veuillez entrer une adresse email valide.",
    },
    birthdate: {
        empty: "Votre date de naissance est requise.",
        invalid: "Veuillez entrer une date de naissance valide.",
    },
    quantity: {
        empty: "Le nombre de tournois est requis.",
        invalid: "Veuillez entrer un nombre de tournois valide.",
    },
    location: {
        empty: "Veuillez sélectionner une ville.",
    },
    terms: {
        empty: "Veuillez accepter les conditions d'utilisation.",
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

function resetFormControlError(formControl) {
    if (formControl.validity.customError) {
        // needed for validity.valid to be true
        formControl.setCustomValidity("");
        // hide previously displayed error message without removing it
        formControl.parentElement.removeAttribute("data-error-visible");
    }
}

function isValideName(name) {
    const nameRegex = /^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
    console.log(name);
    console.log(nameRegex.test(name));
    return nameRegex.test(name);
}

function isValideMail(mail) {
    const mailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    return mailRegex.test(mail);
}

function isFormControlNotANumber(formControl) {
    return formControl.validity.badInput;
}

function isFormControlOutOfRange(formControl) {
    return formControl.validity.rangeUnderflow || formControl.validity.rangeOverflow;
}

// errorName is the name of the error in the FORM_ERRORS object. It can be "empty", "too_short" or "invalid".
function setFormControlErrorMessage(formControl, errorName) {
    formControl.setCustomValidity(FORM_ERRORS[formControl.name][errorName]);
}

function setElementFormDataErrorMessage(formControl) {
    formControl.parentElement.setAttribute("data-error", formControl.validationMessage);
    formControl.parentElement.setAttribute("data-error-visible", "false");
}

// display previously set and hidden errors messages in the form
function displayFormErrorsMessages(form) {
    form.querySelectorAll(":scope > .formData[data-error-visible=false]").forEach((formDataError) => {
        formDataError.setAttribute("data-error-visible", "true");
    });
}

// check if required form controls are not empty
function validateRequiredFormControl(formControl) {
    // check if the element has a required attribute and is empty
    if (formControl.validity.valueMissing) {
        setFormControlErrorMessage(formControl, "empty")
        return false;
    }
    return true;
}

function validateName(formControl) {
    let isEmpty = !validateRequiredFormControl(formControl);
    if (isEmpty) {
        return false;
    } else if (formControl.validity.tooShort) {
        setFormControlErrorMessage(formControl, "too_short")
        return false;
    } else if (formControl.validity.patternMismatch) {
        setFormControlErrorMessage(formControl, "invalid")
        return false;
    }
    return true;
}

function validateMail(formControl) {
    let isEmpty = !validateRequiredFormControl(formControl);
    if (isEmpty) {
        return false;
    } else if (formControl.validity.typeMismatch || formControl.validity.patternMismatch) {
        formControl.setCustomValidity(`${FORM_ERRORS[formControl.name].invalid}`);
        return false;
    }
    return true;
}

function validateBirthdate(formControl) {
    let isEmpty = !validateRequiredFormControl(formControl);
    if (isEmpty) {
        return false;
    } else if (isFormControlOutOfRange(formControl)) {
        formControl.setCustomValidity(`${FORM_ERRORS[formControl.name].invalid}`);
        return false;
    }
    return true;
}

function validateQuantity(formControl) {
    let isEmpty = !validateRequiredFormControl(formControl);
    if (isEmpty) {
        return false;
    } else if (isFormControlNotANumber(formControl) || isFormControlOutOfRange(formControl)) {
        formControl.setCustomValidity(`${FORM_ERRORS[formControl.name].invalid}`);
        return false;
    }
    return true;
}

function validateLocation(locationRadioNodeList) {
    // if no location radio is selected
    if (locationRadioNodeList.value === "") {
        // we use the first radio button to store the error message
        setFormControlErrorMessage(locationRadioNodeList[0], "empty");
        setElementFormDataErrorMessage(locationRadioNodeList[0])
        return false;
    }
    return true
}

function validateForm(event) {
    event.preventDefault();

    let isFormValid = true;
    const form = event.target;
    const formControlsCollection = form.elements;

    // validate form controls implementing Constraint Validation API (all but radio buttons)
    for (const formControl of formControlsCollection) {
        // reset previous error message if any
        resetFormControlError(formControl);

        if (!formControl.validity.valid) {
            isFormValid = false;

            switch (formControl.name) {
                case "first":
                case "last":
                    validateName(formControl);
                    break;
                case "email":
                    validateMail(formControl);
                    break;
                case "birthdate":
                    validateBirthdate(formControl);
                    break;
                case "quantity":
                    validateQuantity(formControl);
                    break;
                case "location":
                    // validation is done after, radio buttons don't implement Constraint Validation API
                    break;
                case "terms":
                    validateRequiredFormControl(formControl);
                    break;
                case "newsletter":
                    break;
            }
            setElementFormDataErrorMessage(formControl);
        }
    }
    // validate form controls not implementing Constraint Validation API (radio buttons)
    if (!validateLocation(formControlsCollection.namedItem("location"))) {
        isFormValid = false;
    }

    if (!isFormValid) {
        // display error messages. Separate loop for animation
        displayFormErrorsMessages(form);
        return false;
    }
    return true;
}
