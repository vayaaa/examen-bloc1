import { sendOrder } from "./sendOrder.js";
import { state } from "./state.js";

const saveButton = document.querySelector("#save-button");
const input1 = document.querySelector("#input1");
const input2 = document.querySelector("#input2");
const input3 = document.querySelector("#input3");

const orderType = sessionStorage.getItem("orderType");

saveButton.disabled = true;


// Si on arrive sur cette page sans panier on redirige
if (!state.cart || state.cart.length === 0) {
    window.location.href = "index.html"; 
}

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


saveButton.addEventListener("click", async () => {
    
    const tableNumber = input1.value + input2.value + input3.value;

    saveButton.disabled = true;

    try {
        await sendOrder(orderType, state.cart, tableNumber);

        sessionStorage.setItem("lastOrder", JSON.stringify(state.cart));
        sessionStorage.setItem("tableNumber", tableNumber);

        window.location.href = "thanks.html";
    }
    catch {
        alert("Une erreur est surveue lors de l'envoi de la commande. Veuillez réessayer.");
        saveButton.disabled = false;
    }
})