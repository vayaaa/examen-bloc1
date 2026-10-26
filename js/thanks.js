import { clearCart } from "./state.js";

const newButton = document.querySelector("#new-button");

const lastOrder = JSON.parse(sessionStorage.getItem("lastOrder"));
const tableNumber = sessionStorage.getItem("tableNumber");

console.log("Numéro de table :", tableNumber);
console.log("Commande passée :", lastOrder);


//Bouton enregistrer
newButton.addEventListener("click", () => {
    clearCart();
    sessionStorage.removeItem("orderType");
    sessionStorage.removeItem("tableNumber");
    sessionStorage.removeItem("lastOrder");

    window.location.href = "index.html";
})

