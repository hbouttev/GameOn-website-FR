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
const reserveForm = document.forms.namedItem("reserve");

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// close modal event
modalCloseBtn.addEventListener("click", closeModal);

// form submit event
reserveForm.addEventListener("submit", validateForm);

// validate form controls when input is changed
["first", "last"].forEach(formControlName => {
    reserveForm.elements.namedItem(formControlName).addEventListener("change", (event) => {
        event.preventDefault();
        resetFormControlError(event.target);
        if (!validateName(event.target)) {
            setElementFormDataErrorMessage(event.target);
            displayFormControlErrorMessage(event.target);
        }
    });
});

reserveForm.elements.namedItem("email").addEventListener("change", (event) => {
    event.preventDefault();
    resetFormControlError(event.target);
    if (!validateMail(event.target)) {
        setElementFormDataErrorMessage(event.target);
        displayFormControlErrorMessage(event.target);
    }
});

reserveForm.elements.namedItem("birthdate").addEventListener("change", (event) => {
    event.preventDefault();
    resetFormControlError(event.target);
    if (!validateBirthdate(event.target)) {
        setElementFormDataErrorMessage(event.target);
        displayFormControlErrorMessage(event.target);
    }
});

// Input of type number in Firefox accepts letters and special characters and doesn't trigger change event on first
// wrong input. We use input event instead to fix this.
reserveForm.elements.namedItem("quantity").addEventListener("input", (event) => {
    event.preventDefault();
    resetFormControlError(event.target);
    if (!validateQuantity(event.target)) {
        setElementFormDataErrorMessage(event.target);
        displayFormControlErrorMessage(event.target);
    }
});

// Dynamically remove error message for location radio button when it was set by previous submit validation and is then
// selected.
// The error message is set in the first radio button of the group.
reserveForm.elements.namedItem("location").forEach((locationRadio) => {
    locationRadio.addEventListener("change", (event) => {
        event.preventDefault();
        resetFormControlError(reserveForm.elements.namedItem("location")[0]);
    })
});

reserveForm.elements.namedItem("terms").addEventListener("change", (event) => {
    event.preventDefault();
    resetFormControlError(event.target);
    if (!validateRequiredFormControl(event.target)) {
        setElementFormDataErrorMessage(event.target);
        displayFormControlErrorMessage(event.target);
    }
});

// launch modal form
function launchModal() {
    modalbg.style.display = "block";
}

// close modal form
function closeModal() {
    modalbg.style.display = "none";
    // if the form was previously successfully submitted we display it again and hide the confirmation message
    const confirmationElement = document.querySelector(".confirmation-display");
    if (confirmationElement) {
        reserveForm.classList.remove("select-hide");
        confirmationElement.style.display = "none";
    }
}

/**
 * Reset a form control error if previously set, and hide the error element. This is mandatory to be able to validate
 * the form control again with the Constraint Validation API.
 */
function resetFormControlError(formControl) {
    if (formControl.validity.customError) {
        // needed for validity.valid to be true
        formControl.setCustomValidity("");
        // hide previously displayed error message without removing it
        formControl.parentElement.removeAttribute("data-error-visible");
    }
}

/**
 * Check if a form control input is not a number using the Constraint Validation API.
 */
function isFormControlNotANumber(formControl) {
    // validity.badInput is true if the input is not a number. Doesn't work on first wrong input with change event in Firefox.
    return formControl.validity.badInput;
}

/**
 * Check if a form control input is out of range using the Constraint Validation API.
 */
function isFormControlOutOfRange(formControl) {
    return formControl.validity.rangeUnderflow || formControl.validity.rangeOverflow;
}

/**
 * Set a form control error message depending on its name and the error type.
 * errorName is the name of the error in the FORM_ERRORS object. It can be "empty", "too_short" or "invalid".
 */
function setFormControlErrorMessage(formControl, errorName) {
    formControl.setCustomValidity(FORM_ERRORS[formControl.name][errorName]);
}

/**
 * Copy a form control error message to its form data error element for displaying.
 */
function setElementFormDataErrorMessage(formControl) {
    formControl.parentElement.setAttribute("data-error", formControl.validationMessage);
    formControl.parentElement.setAttribute("data-error-visible", "false");
}

/**
 * Display previously set and hidden errors messages in the form.
 */
function displayFormErrorsMessages(form) {
    form.querySelectorAll(":scope > .formData[data-error-visible=false]").forEach((formDataError) => {
        formDataError.setAttribute("data-error-visible", "true");
    });
}

/**
 * Display previously set and hidden error message for a form control.
 */
function displayFormControlErrorMessage(formControl) {
    formControl.parentElement.setAttribute("data-error-visible", "true");
}

/**
 * Check if required form controls are not empty.
 */
function validateRequiredFormControl(formControl) {
    // check if the element has a required attribute and is empty
    if (formControl.validity.valueMissing) {
        setFormControlErrorMessage(formControl, "empty")
        return false;
    }
    return true;
}

/**
 * Validate name form control, being first or last.
 */
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

/**
 * Validate email form control.
 */
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

/**
 * Validate birthdate form control.
 */
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

/**
 * Validate quantity form control.
 */
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

/**
 * Validate location checkboxes from a RadioNodeList.
 */
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

/**
 * Display confirmation in the modal after form validation and submission.
 */
function displayConfirmationMessage() {
    const confirmationElement = document.querySelector(".confirmation-display");
    if (confirmationElement) {
        reserveForm.classList.add("select-hide");
        confirmationElement.style.display = "flex";
    } else {

        const modalBody = modalbg.querySelector(".modal-body");
        let modalContentHeight = reserveForm.offsetHeight;
        const confirmationDisplay = document.createElement("div");
        const confirmationMessage = document.createElement("span");
        const confirmationCloseButton = document.createElement("button");
        confirmationDisplay.classList.add("confirmation-display");
        confirmationCloseButton.classList.add("button", "btn-submit");
        confirmationCloseButton.textContent = "Fermer";

        confirmationDisplay.append(confirmationMessage, confirmationCloseButton);
        confirmationDisplay.style.height = (modalContentHeight) + "px";
        confirmationDisplay.style.display = "flex";
        confirmationDisplay.style.flexDirection = "column";

        confirmationMessage.textContent = "Merci pour votre inscription !";
        confirmationMessage.style.display = "flex";
        confirmationMessage.style.alignItems = "center";
        confirmationMessage.style.justifyContent = "center";
        confirmationMessage.style.height = "100%";
        confirmationMessage.style.width = "80%";
        confirmationMessage.style.margin = "auto";
        confirmationMessage.style.textAlign = "center";
        confirmationMessage.style.fontSize = "36px";

        reserveForm.classList.add("select-hide");
        modalBody.append(confirmationDisplay);

        confirmationCloseButton.addEventListener("click", closeModal);
    }
}

/**
 * Validate the form and display the confirmation message if the form is valid.
 */
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
    displayConfirmationMessage();
    form.reset();
    return true;
}
