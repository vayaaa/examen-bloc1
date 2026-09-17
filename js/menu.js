let categories = [];
let products = [];

const sliderLeft = document.querySelector("#slider-left");
const sliderRight = document.querySelector("#slider-right");

const categoriesContainer = document.querySelector("#categories-container");
const productsContainer = document.querySelector("#products-container");

const modal = document.querySelector("#modal");
const closeModal = document.querySelector(".close-modal");
const modalText = document.querySelector("#modal-text");
const modalChoices = document.querySelectorAll(".modal-choices .choice");


// Récupérations des données
async function Datas() {
    const categoriesResponse = await fetch("./data/categories.json")
    categories = await categoriesResponse.json();

    const productsResponse = await fetch("./data/produits.json")
    products = await productsResponse.json();

    displayCategories();
}

//Affichage des catégories  ______________________________________________________
function displayCategories() {

    categoriesContainer.innerHTML = "";

    categories.forEach((category) => {
        const element = document.createElement("li");
        element.classList.add("item");
        element.dataset.categoryId = category.id;


        element.innerHTML = `<img src="img${category.image}" alt="${category.title}"/>
        <p>${category.title}</p>`;


        element.addEventListener("click", () => {
            const items = categoriesContainer.querySelector(".selected");
            if (items) {
                items.classList.remove("selected");
            }
            element.classList.add("selected");



            displayProducts(category.id)
        })

        categoriesContainer.appendChild(element);
    })

}

// Slider
sliderLeft.addEventListener("click", () => {

    categoriesContainer.scrollBy({
        left: -400,
        behavior: "smooth"
    });
});

sliderRight.addEventListener("click", () => {

    categoriesContainer.scrollBy({
        left: 400,
        behavior: "smooth"
    });
});


const productsTitle = document.querySelector("#categorie-title");
const text = document.querySelector("#description")

function correctionImage(image) {
    image = image.replace(".png.png", ".png");
    image = image.replace(".jpg.png", ".png");

    return image;
}



// Affichage des produits  ______________________________________________________
const descriptions = {
    menus: "Un sandwich, une friture ou une salade et une boisson",
    burgers: "Savourez un bon burger à la viande au végétal",
    wraps: "Garnd ou petit, le wrap se mange à tout moment",
    frites: "Petites, moyennes ou grandes ",
    boissons: "Une petite soif, sucrée, légère, rafraîchissante",
    encas: "Une petite faim?",
    desserts: "Une dose de sucre pour bien finir le repas",
    salades: "Découvrez nos salades fraîches",
    sauces: "Personnalisez votre repas avec nos sauces"
};


function displayProducts(categoryId) {
    productsContainer.innerHTML = "";


    const category = categories.find(
        (category) => category.id === categoryId
    );

    if (!category) {
        return;
    }

    productsTitle.textContent = `Nos ${category.title}`;
    text.textContent = descriptions[category.title];

    // Récupérations des données
    const filteredProducts = products[category.title];

    if (!filteredProducts) {
        return;
    }


    filteredProducts.forEach((product) => {
        const element = document.createElement("article");
        element.classList.add("item");

        const image = correctionImage(product.image);

        element.innerHTML =
            ` <img src="img/products${image}" alt="${product.nom}"/>
        <h3>${product.nom}</h3>
        <p>${product.prix} € </p>
        `
        //ouverture de la modale
        element.addEventListener("click", () => {
            if (category.title === "menus") {
                openModal(product);
            }

        })


        productsContainer.appendChild(element);
    })

}

//Modale______________________________________________________
function openModal(product) {

    modalText.textContent =
        `Le menu ${product.nom} comprend un sandwich, une grande frite et une boisson`;

    // Maxi sélectionné par défaut
    modalChoices.forEach(choice => {
        choice.classList.toggle(
            "selected",
            choice.dataset.type === "maxi"
        );
    });

    modal.showModal();
}


// Choix Maxi / Best Of
modalChoices.forEach(choice => {

    choice.addEventListener("click", () => {

        modalChoices.forEach(item => {
            item.classList.remove("selected");
        });

        choice.classList.add("selected");

        const taille = choice.dataset.type;

        console.log("Taille choisie :", taille);
    });

});


// Fermeture
closeModal.addEventListener("click", () => {
    modal.close();
});
//Affichage du panier ______________________________________________________
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






Datas(); 