const choices = document.querySelectorAll(".choice");

choices.forEach(choice => {
    choice.addEventListener("click", () => {
        const type = choice.dataset.type;

        let numeroCommande = Number(sessionStorage.getItem("orderNumber")) || 0;

        numeroCommande++;

        sessionStorage.setItem("orderType", type);
        sessionStorage.setItem("orderNumber", numeroCommande);


        window.location.href = "menu.html";
    })
})