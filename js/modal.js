// modal.js
import { state } from "./menu.js";

const modal = document.querySelector("#modal");
const closeModal = document.querySelector(".close-modal");
const backModal = document.querySelector("#modal-back");
const nextModal = document.querySelector("#modal-next");
const modalTitle = document.querySelector("#modal-title");
const modalText = document.querySelector("#modal-text");
const modalChoices = document.querySelectorAll(".modal-choices .choice");
const stepSize = document.querySelector("#step-size");
const stepDrink = document.querySelector("#step-drink");
const stepFries = document.querySelector("#step-fries");
const drinksContainer = document.querySelector("#drinks-container");
const friesChoices = document.querySelectorAll("#fries-container .choice");

export function openModal(product) {
    state.newOrder = {
        product: product,
        size: null,
        drink: null,
        fries: null
    };

    modalText.textContent =
        `Le menu ${product.nom} comprend un sandwich, une grande frite et une boisson`;

    showSteps("size");

    // Maxi sélectionné par défaut
    modalChoices.forEach((choice) => {
        choice.classList.toggle("selected", choice.dataset.type === "maxi");
    });
    state.newOrder.size = "maxi";
    modal.showModal();
}

// Choix taille
modalChoices.forEach((choice) => {
    choice.addEventListener("click", () => {
        modalChoices.forEach((item) => item.classList.remove("selected"));
        choice.classList.add("selected");
        state.newOrder.size = choice.dataset.type;
    });
});

// Affiche les boissons
function displayDrinks() {
    drinksContainer.innerHTML = "";

    const drinks = state.products.boissons;

    drinks.forEach((drink) => {
        const element = document.createElement("button");
        element.classList.add("choice");

        element.innerHTML = `
        <img src="img/products${drink.image}" alt="${drink.nom}"/>
        <p>${drink.nom}</p>
        `;

        element.addEventListener("click", () => {
            drinksContainer.querySelectorAll(".choice").forEach((item) => {
                item.classList.remove("selected");
            });
            element.classList.add("selected");

            state.newOrder.drink = drink;
        });

        drinksContainer.appendChild(element);
    });
}

// Choix des frites
friesChoices.forEach((choice) => {
    choice.addEventListener("click", () => {
        friesChoices.forEach((item) => item.classList.remove("selected"));
        choice.classList.add("selected");
        state.newOrder.fries = choice.dataset.type;
    });
});

// Étapes
function showSteps(step) {
    stepSize.hidden = true;
    stepDrink.hidden = true;
    stepFries.hidden = true;

    if (step === "size") {
        stepSize.hidden = false;
        modalTitle.textContent = `Une grosse faim?`;
        modalText.textContent = `Le menu ${state.newOrder.product.nom} comprend un sandwich, une grande frite et une boisson`;
        backModal.hidden = true;
    }

    if (step === "fries") {
        stepFries.hidden = false;
        modalTitle.textContent = `Choisissez votre accompagnement`;
        modalText.textContent = `Frites, potatoes, la pomme de terre dans tous ses états`;
        backModal.hidden = false;
    }

    if (step === "drink") {
        stepDrink.hidden = false;
        modalTitle.textContent = `Choisissez votre boisson`;
        modalText.textContent = `un soda, un jus de fruit ou un verre d'eau pour accompagner votre repas`;
        backModal.hidden = false;

        displayDrinks();
    }
}

// Suivant
nextModal.addEventListener("click", () => {
    if (!state.newOrder.fries) {
        showSteps("fries");
        return;
    }

    if (!state.newOrder.drink) {
        showSteps("drink");
        return;
    }

    addToCart();
});

// Retour
backModal.addEventListener("click", () => {
    if (!stepFries.hidden) {
        showSteps("size");
        return;
    }

    if (!stepDrink.hidden) {
        showSteps("fries");
        return;
    }
});

// Ajouter au panier
function addToCart() {
    state.cart.push(state.newOrder);
    console.log("Commande terminée :", state.newOrder);

    modal.close();
}

// Fermeture
closeModal.addEventListener("click", () => {
    modal.close();
});