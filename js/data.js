import { state } from "./menu.js";
import { displayCategories } from "./categories.js";
 
export async function loadDatas() {
    const categoriesResponse = await fetch("./data/categories.json");
    state.categories = await categoriesResponse.json();
 
    const productsResponse = await fetch("./data/produits.json");
    state.products = await productsResponse.json();
 
    displayCategories();
}
 