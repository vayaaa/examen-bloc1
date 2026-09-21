import { state } from "./state.js";


//transforme en liste 
function fromProducts(list) {
    return list.map((p) => ({
        id: p.nom,
        nom: p.nom,
        image: `img/products${p.image}`
    }));
}


export const components = {
    menus: [
        {
            id: "size",
            title: "Une grosse faim ?",
            text: (product) =>
                `Le menu ${product.nom} comprend un sandwich, une grande frite et une boisson`,
            default: "maxi",
            option: () => [
                {
                    id: "maxi", nom: "Menu Maxi Best Of", image: "img/products/menu/illustration-maxi-best-of.png"
                },
                {
                    id: "normal", nom: "Menu Best Of", image: "img/products/menu/illustration-best-of.png"
                },
            ],
        },
        {
            id: "fries",
            title: "Choisissez votre accompagnement",
            text: "Frites, potatoes, la pomme de terre dans tous ses états",
            default: "fries",
            option: () => [
                {
                    id: "fries", nom: "Frites", image: "img/products/frites/GRANDE_FRITE.png"
                },
                {
                    id: "potatoes", nom: "Potatoes", image: "img/products/frites/POTATOES.png"

                },
            ]
        },
        {
            id: "sauce",
            title: "Choisissez votre sauce",
            text: "Quel assaisonnement pour votre accompagnement?",
             scroll: true,
            option: () => fromProducts(state.products.sauces),
        },

        {
            id: "drink",
            title: "Choisissez votre boisson",
            text: "Un soda, un jus de fruit ou un verre d'eau pour accompagner votre repas",
            scroll: true,
            option: () => fromProducts(state.products.boissons),
        },
    ],
    boissons: [
        {
            id: "size",
            title: "Une petite soif?",
            text: "Choisissez la taille de votre boisson, +0.50€ pour le format 50 Cl",
            option: () => [
                { id: "30cl", nom: "30Cl" },
                { id: "50cl", nom: "50Cl" },
            ],
        },
    ],
    frites: [
        {
            id: "sauce",
            title: "Choisissez votre sauce",
            text: "Quelle assaisonnement pourrait vous faire plaisir? ",
             scroll: true,
            option: () => fromProducts(state.products.sauces),
        },
    ],

};