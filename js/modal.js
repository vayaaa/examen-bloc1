import { state, addToCart, removeFromCart } from "./state.js";
import { components } from "./modalComponents.js";

const modal = document.querySelector("#modal");

const closeModal = document.querySelector(".close-modal");
const backModal = document.querySelector("#modal-back");
const nextModal = document.querySelector("#modal-next");
const cancelModal = document.querySelector("#cancel-modal");

const modalTitle = document.querySelector("#modal-title");
const modalText = document.querySelector("#modal-text");
const modalChoices = document.querySelector(".modal-choices");

const counterContainer = document.querySelector(".counter-container");
const lessButton = document.querySelector("#btn-less");
const moreButton = document.querySelector("#btn-more");
const counter = document.querySelector("#counter");

const cartContainer = document.querySelector("#order-container");
const totalElement = document.querySelector("#total");
const payButton = document.querySelector("#modal-pay");
const cancelButton = document.querySelector("#cancel-button");


let currentOrder = null;

//Maj sans muter de la commande en cours
function setCurrent(changes) {
    currentOrder = { ...currentOrder, ...changes };
}

//Enregistre les choix à chaque étapes
function selectChoice(stepId, option) {
    setCurrent({
        choices: { ...currentOrder.choices, [stepId]: option }
    })
}

//Vérifie si l'étape actuelle est la dernière
function isLastStep() {
    return currentOrder.index === currentOrder.steps.length - 1;
}



//ouverture de la modale_________________________________________________
export function openModal(product, categorie) {
    let steps = components[categorie];

    //Si pas de modale pour la catégorie
    if (!steps) {
        steps = [];
    }

    steps = steps.filter((step) => {
        if (!step.condition) {
            return true;
        }
        return step.condition(product);
    })

    if (steps.length === 0) {
        addToCart({
            product: product,
            choices: {}
        });

        displayCart();
        return;
    }


    const defaults = {};

    steps.forEach((step) => {
        if (step.default) {
            const options = step.option();
            let option;

            for (let i = 0; i < options.length; i++) {
                if (options[i].id === step.default) {
                    option = options[i];
                    break;
                }
            }
            defaults[step.id] = option;
        }
    });

    currentOrder = {
        product: product,
        categorie: categorie,
        steps: steps,
        index: 0,
        choices: defaults,
        quantity: 1,
    };

    cancelModal.hidden = categorie === "menus";

    showSteps();
    modal.showModal();
}


// Afficher les étapes et options_________________________________________________
function showSteps() {

    const step = currentOrder.steps[currentOrder.index];

    modalTitle.textContent = step.title;

    if (typeof step.text === "function") {
        modalText.textContent = step.text(currentOrder.product);
    } else {
        modalText.textContent = step.text;
    }

    backModal.hidden = currentOrder.index === 0; //masqué à la 1ere étape
    nextModal.textContent = isLastStep() ? "Ajouter à ma commande" : "Etape suivante";
    nextModal.disabled = !currentOrder.choices[step.id];

    modalChoices.innerHTML = "";

    if (step.scroll) {
        modalChoices.classList.add("list-container");
    } else {
        modalChoices.classList.remove("list-container")
    }

    //Si l'étape est facultative 
    if (step.skip) {
        nextModal.disabled = false;
    } else {
        nextModal.disabled = !currentOrder.choices[step.id];
    }

    //compteur pour les boissons
    counterContainer.hidden = true; //masqué par défaut 

    if (step.number) {
        counterContainer.hidden = false;
        counter.textContent = currentOrder.quantity;
    }


    //Parcours les options pour chaque étape
    step.option().forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("choice");

        // Vérifie si l'option est déjà sélectionnée
        const chosen = currentOrder.choices[step.id];
        button.setAttribute("aria-pressed", "false");
        if (chosen && chosen.id === option.id) {
            button.classList.add("selected");
            button.setAttribute("aria-pressed", "true");
        }

        let imageOption = "";
        if (option.image) {
            imageOption = `<img src="${option.image}" alt="${option.nom}">`
        }

        button.innerHTML = `
        ${imageOption} 
        <p>${option.nom} </p>
        `;

        //Quand je clique sur une option
        button.addEventListener("click", () => {

            //select/deselect
            if (currentOrder.choices[step.id]?.id === option.id) {

                const newChoices = { ...currentOrder.choices };
                delete newChoices[step.id];

                setCurrent(({
                    choices: newChoices
                }))

                button.classList.remove("selected");
                button.setAttribute("aria-pressed", "false");
                nextModal.disabled = !step.skip; //ne passe pas si pas de select
                return;
            }

            modalChoices.querySelectorAll(".choice").forEach((item) => {
                item.classList.remove("selected");
                item.setAttribute("aria-pressed", "false");
            })

            button.classList.add("selected");
            button.setAttribute("aria-pressed", "true");

            selectChoice(step.id, option); //Enregistre le choix dans la commande

            nextModal.disabled = false;
        })

        modalChoices.appendChild(button);
    })

}

//Bouton + et - 
moreButton.addEventListener("click", () => {
    if (!currentOrder) return;
    setCurrent({ quantity: currentOrder.quantity + 1 })
    counter.textContent = currentOrder.quantity;
})

lessButton.addEventListener("click", () => {
    if (!currentOrder) return;

    if (currentOrder.quantity > 1) {
        setCurrent({ quantity: currentOrder.quantity - 1 })
        counter.textContent = currentOrder.quantity;
    }
})


// Suivant
nextModal.addEventListener("click", () => {
    if (isLastStep()) {
        confirmOrder();
        return;
    }

    setCurrent({ index: currentOrder.index + 1 });
    showSteps();
});

// Retour
backModal.addEventListener("click", () => {
    if (currentOrder.index > 0) {
        setCurrent({ index: currentOrder.index - 1 });
        showSteps();
    }
});

// Fermeture de la modale
closeModal.addEventListener("click", () => {
    modal.close();
});

//Annuler la commande
cancelModal.addEventListener("click", () => {
    modal.close();
});


//Une fois fermée, on reinitialise
modal.addEventListener("close", () => {
    currentOrder = null;
})


//Valider la commande_________________________________________________
function confirmOrder() {
    addToCart({
        product: currentOrder.product,
        choices: currentOrder.choices,
        quantity: currentOrder.quantity
    });

    displayCart();
    modal.close();
}



//Afficher le panier_________________________________________________
function displayCart() {
    cartContainer.innerHTML = "";

    let totalCart = 0;

    //Toutes les commandes dans le panier
    state.cart.forEach((order, index) => {
        const element = document.createElement("article");
        element.classList.add("cart-item");

        let list = "";
        let totalOrder = order.product.prix; // prix du produit

        Object.values(order.choices).forEach((choice) => {
            list += `<li>${choice.nom}</li>`;

            totalOrder += choice.prix ?? 0;
        });

        totalOrder = totalOrder * order.quantity;
        totalCart += totalOrder;


        //Affiche le produit, la quantité, les options et l'icon de supp
        element.innerHTML =
            `
      <div class="cart-item">
            <h4> ${order.quantity} ${order.product.nom} <button class="trash" type="button" aria-label="Supprimer cet article"><img src="img/icons/trash.png" alt="" ></button> </h4>
            <ul>${list} </ul>
        </div>
            `

        //Supprimer la commande du panier au clic sur l'icon
        const trash = element.querySelector(".trash");
        trash.addEventListener("click", () => {
            removeFromCart(index);
            displayCart();
        })

        cartContainer.appendChild(element);
    })

    //Affich le prix total
    totalElement.textContent = `${totalCart.toFixed(2)}€`;

    payButton.disabled = true;

    if (!isEmpty(cartContainer)) {
        payButton.disabled = false;
    }
}

function isEmpty(cartContainer) {
    return cartContainer.children.length === 0;
}

displayCart();



//Bouton payer
payButton.addEventListener("click", () => {
    window.location.href = "tableNumber.html";
})

//Bouton abandon
cancelButton.addEventListener("click", () => {
    window.location.href = "index.html";
})
