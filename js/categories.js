import { state } from "./state.js";
import { displayProducts } from "./products.js";

const sliderLeft = document.querySelector("#slider-left");
const sliderRight = document.querySelector("#slider-right");
const categoriesContainer = document.querySelector("#categories-container");


//Afficher les catégories_________________________________________________
export function displayCategories() {
    categoriesContainer.innerHTML = "";

    state.categories.forEach((category, index) => {
        const element = document.createElement("li");
        element.classList.add("item");
        element.dataset.categoryId = category.id;

        element.innerHTML = `<img src="img${category.image}" alt="${category.title}"/>
        <p>${category.title}</p>`;


        // Sélectionner la première catégorie par défaut
        if (index === 0) {
            element.classList.add("selected");
            displayProducts(category.id);
        }

        element.addEventListener("click", () => {
            const selected = categoriesContainer.querySelector(".selected");
            
            if (selected) {
                selected.classList.remove("selected");
            }

            element.classList.add("selected");

            displayProducts(category.id);
        });

        categoriesContainer.appendChild(element);
    });
}


//Sliders_________________________________________________
sliderLeft.addEventListener("click", () => {
    categoriesContainer.scrollBy({ left: -400, behavior: "smooth" });
});

sliderRight.addEventListener("click", () => {
    categoriesContainer.scrollBy({ left: 400, behavior: "smooth" });
});