import { state } from "./state.js";
import { displayCategories } from "./categories.js";

//Charger les json
export async function loadDatas() {
    try {
        const categoriesResponse = await fetch("./data/categories.json");

        if (!categoriesResponse.ok) {
            throw new Error("Erreur lors du chargement des catégories");
        }

        state.categories = await categoriesResponse.json();

        const productsResponse = await fetch("./data/produits.json");

        if (!productsResponse.ok) {
            throw new Error("Erreur lors du chargement des produits");
        }

        state.products = await productsResponse.json();

        displayCategories();

    } catch (error) {
        console.error("Erreur :", error);
    }
}