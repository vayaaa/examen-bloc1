const saveButton = document.querySelector("#save-button");
const input1 = document.querySelector("#input1");
const input2 = document.querySelector("#input2");
const input3 = document.querySelector("#input3");

saveButton.disabled = true;

//Bouton enregistrer
function checkInputs() {
    if (input1.value !== "" && input2.value !== "" && input3.value !== "") {
        saveButton.disabled = false;
    } else {
        saveButton.disabled = true;
    }
}

//check si on a écrit dans l'input
input1.addEventListener("input", checkInputs);
input2.addEventListener("input", checkInputs);
input3.addEventListener("input", checkInputs);


saveButton.addEventListener("click", () => {
    window.location.href = "thanks.html";
})