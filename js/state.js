
export const state = {
    categories: [],
    products: [],
    cart: [],
};


export function addToCart(order){
    const copy = {
        product:{ ...order.product},
        choices: { ...order.choices}
    };

    //Nouveau panier  
    state.cart = [...state.cart, copy];
}
