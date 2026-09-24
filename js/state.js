
export const state = {
    categories: [],
    products: [],
    cart: [],
};

function identicalChoices(c1, c2) {
    const keys1 = Object.keys(c1);
    const keys2 = Object.keys(c2);

    //même nombre de choix
    if (keys1.length !== keys2.length) {
        return false;
    }

    for(const key of keys1) {
        const choice1 = c1[key];
        const choice2 = c2[key];

        if (!choice2) {
            return false;
        }

        if (choice1.id !== choice2.id){
            return false;
        }
    }
 return true;
}

//Ajouter au panier
export function addToCart(order) {

    const quantity = order.quantity ?? 1;

    const existOrder = state.cart.find((cartOrder) => {

        if (cartOrder.product.id !== order.product.id) {
            return false;
        }
        return identicalChoices(cartOrder.choices, order.choices)
    })

    if (existOrder) {
        existOrder.quantity += 1;
    } else {
        const copy = {
            product: { ...order.product },
            choices: { ...order.choices },
            quantity: quantity
        };

        //Nouveau panier  
        state.cart = [...state.cart, copy];
    }
}


//Supprimer du panier
export function removeFromCart(index) {
    state.cart = state.cart.filter((order, i) => i !== index);
}