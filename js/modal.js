import { state, addToCart, removeFromCart } from "./state.js";
import { components } from "./modalComponents.js";

const modal = document.querySelector("#modal");

const closeModal = document.querySelector(".close-modal");
const backModal = document.querySelector("#modal-back");
const nextModal = document.querySelector("#modal-next");
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
const cancelModal = document.querySelector("#cancel-modal");
const cancelButton = document.querySelector("#cancel-button");
const orderType = sessionStorage.getItem("orderType");

let currentOrder = null;

//Maj sans muter de la commande en cours
function setCurrent(changes) {
    currentOrder = { ...currentOrder, ...changes };
}

function selectChoice(stepId, option) {
    setCurrent({
        choices: { ...currentOrder.choices, [stepId]: option }
    })
}

function isLastStep() {
    return currentOrder.index === currentOrder.steps.length - 1;
}



//ouverture de la modale
export function openModal(product, categorie) {
    let steps = components[categorie];

    //Si pas de modale pour la catégorie
    if (!steps) {
        addToCart({ product, choices: {} });
        displayCart();
        return;
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
            const option = step.option().find((o) => o.id === step.default);
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


// Afficher les components
function showSteps() {
    const step = currentOrder.steps[currentOrder.index];

    modalTitle.textContent = step.title;

    if (typeof step.text === "function") {
        modalText.textContent = step.text(currentOrder.product);
    } else {
        modalText.textContent = step.text;
    }

    backModal.hidden = currentOrder.index === 0;
    nextModal.textContent = isLastStep() ? "Ajouter à ma commande" : "Etape suivante";
    nextModal.disabled = !currentOrder.choices[step.id];


    modalChoices.innerHTML = "";

    if (step.scroll) {
        modalChoices.classList.add("list-container");
    } else {
        modalChoices.classList.remove("list-container")
    }

    if (step.skip) {
        nextModal.disabled = false;
    } else {
        nextModal.disabled = !currentOrder.choices[step.id];
    }

    //compteur pour les boissons
    counterContainer.hidden = true;

    if (step.number) {
        counterContainer.hidden = false;
        counter.textContent = currentOrder.quantity;
    }

    step.option().forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("choice");

        const chosen = currentOrder.choices[step.id];
        if (chosen && chosen.id === option.id) {
            button.classList.add("selected");
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
                nextModal.disabled = false;
                return;
            }

            modalChoices.querySelectorAll(".choice").forEach((item) => {
                item.classList.remove("selected");
            })
            button.classList.add("selected");

            selectChoice(step.id, option);

            nextModal.disabled = false;
        })

        modalChoices.appendChild(button);
    })

}


moreButton.addEventListener("click", () => {
    currentOrder.quantity++;
    counter.textContent = currentOrder.quantity;

})

lessButton.addEventListener("click", () => {
    if (!currentOrder) return;

    if (currentOrder.quantity > 1) {
        currentOrder.quantity--;
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

modal.addEventListener("close", () => {
    currentOrder = null;
})



//Valider la commande
function confirmOrder() {
    addToCart({
        product: currentOrder.product,
        choices: currentOrder.choices,
        quantity: currentOrder.quantity
    });

    displayCart();
    modal.close();
}


//Afficher le panier 
function displayCart() {
    cartContainer.innerHTML = "";
    let totalCart = 0;

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

        element.innerHTML = `
      <div class="cart-item">
            <h4> ${order.quantity} ${order.product.nom} <button class="trash" type="button" aria-label="Supprimer cet article"><img src="img/icons/trash.png" alt="" ></button> </h4>
            <ul>${list} </ul>
        </div>
    `

        const trash = element.querySelector(".trash");
        trash.addEventListener("click", () => {
            removeFromCart(index);
            displayCart();
        })
        cartContainer.appendChild(element);


    })
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
