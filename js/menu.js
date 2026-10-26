import { loadDatas } from "./data.js";

const orderNumberElement = document.querySelector("#orderNumber");
const orderTypeElement = document.querySelector("#orderType");

const orderNumber = sessionStorage.getItem("orderNumber");
const orderType = sessionStorage.getItem("orderType");



//Protection d'accès aux pages
if (!orderType) {
    window.location.href = "index.html";
} else {
    //récupération du choix de l'utilisateur
    if (orderType === "sur-place") {
        orderTypeElement.textContent = "Sur Place :";
    } else if (orderType === "a-emporter") {
        orderTypeElement.textContent = "A Emporter :";
    }

    //Affichage du numéro et type de commande 
    orderNumberElement.textContent = orderNumber;
    orderNumberElement.classList.add("ordernumber");

    loadDatas();
}



