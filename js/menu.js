import { loadDatas } from "./data.js";

//Affichage du numéro et type de commande 
const orderNumberElement = document.querySelector("#orderNumber");
const orderTypeElement = document.querySelector("#orderType");

const orderNumber = sessionStorage.getItem("orderNumber");
const orderType = sessionStorage.getItem("orderType");


orderNumberElement.textContent = orderNumber;
orderNumberElement.classList.add("ordernumber");

//récupération du choix de l'utilisateur
if (orderType === "sur-place") {
    orderTypeElement.textContent = "Sur Place :";
} else if (orderType === "a-emporter") {
    orderTypeElement.textContent = "A Emporter :";
}


loadDatas(); 