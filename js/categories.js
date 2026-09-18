import { state } from "./menu.js";
import { displayProducts } from "./products.js";
 
const sliderLeft = document.querySelector("#slider-left");
const sliderRight = document.querySelector("#slider-right");
const categoriesContainer = document.querySelector("#categories-container");
 
export function displayCategories() {
    categoriesContainer.innerHTML = "";
 
    state.categories.forEach((category) => {
        const element = document.createElement("li");
        element.classList.add("item");
        element.dataset.categoryId = category.id;
 
        element.innerHTML = `<img src="img${category.image}" alt="${category.title}"/>
        <p>${category.title}</p>`;
 
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
 
sliderLeft.addEventListener("click", () => {
    categoriesContainer.scrollBy({ left: -400, behavior: "smooth" });
});
 
sliderRight.addEventListener("click", () => {
    categoriesContainer.scrollBy({ left: 400, behavior: "smooth" });
});