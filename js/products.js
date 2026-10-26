import { state } from "./state.js";
import { openModal } from "./modal.js";



const productsContainer = document.querySelector("#products-container");
const productsTitle = document.querySelector("#categorie-title");
const text = document.querySelector("#description");

const descriptions = {
    menus: "Un sandwich, une friture ou une salade et une boisson",
    burgers: "Savourez un bon burger à la viande au végétal",
    wraps: "Grand ou petit, le wrap se mange à tout moment",
    frites: "Petites, moyennes ou grandes ",
    boissons: "Une petite soif, sucrée, légère, rafraîchissante",
    encas: "Une petite faim?",
    desserts: "Une dose de sucre pour bien finir le repas",
    salades: "Découvrez nos salades fraîches",
    sauces: "Personnalisez votre repas avec nos sauces"
};

export function correctionLienImage(image) {
    image = image.replace(".png.png", ".png");
    image = image.replace(".jpg.png", ".png");
    return image;
}


//Afficher les produits par catégories
export function displayProducts(categoryId) {
    productsContainer.innerHTML = "";

    const category = state.categories.find(
        (category) => category.id === categoryId
    );

    if (!category) {
        return;
    }

    productsTitle.textContent = `Nos ${category.title}`;
    text.textContent = descriptions[category.title];

    const filteredProducts = state.products[category.title];

    if (!filteredProducts) {
        return;
    }

    filteredProducts.forEach((product) => {
        const element = document.createElement("article");
        element.classList.add("item");

        const image = correctionLienImage(product.image);

        element.innerHTML = `
        <img src="img/products${image}" alt="${product.nom}"/>
        <h3>${product.nom}</h3>
        <p>${product.prix} € </p>
        `;

        element.addEventListener("click", () => {
            openModal(product, category.title);
        });

        productsContainer.appendChild(element);
    });
}

// Sélectionner la première catégorie par défaut
displayProducts(1);
