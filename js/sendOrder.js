const API_URL = "https://jsonplaceholder.typicode.com/posts";


//Envoyer la commande
export async function sendOrder(orderType, cart, tableNumber) {
    const order = buildOrder(orderType, cart, tableNumber);

    try {
        const reponse = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
        });

        if (!reponse.ok) {
            throw new Error(`Statut de réponse : ${reponse.status}`);
        }

        const resultat = await reponse.json();
        console.log(resultat);

    } catch (error) {
        console.error("Une erreur est survenue lors de l'envoi de la commande. Veuillez réessayer", error);
        throw error; // pour que l'appelant sache que ça a échoué

    }
}


// Construction de la commande
function buildOrder(orderType, cart, tableNumber) {
    return {
        type: orderType,
        numeroTable: tableNumber,
        produits: cart.map((order) => ({
            nom: order.product.nom,
            quantite: order.quantity,
            prixUnitaire: order.product.prix,
            options: Object.values(order.choices).map((choice) => ({
                nom: choice.nom,
                prix: choice.prix
            }))
        })),
        date: new Date().toISOString()
    }
}