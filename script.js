
const panel = document.getElementById("contentPanel");

document.querySelectorAll(".menu-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        panel.innerHTML = `
            <h2>${btn.dataset.feature}</h2>
            <p>Conteúdo desta funcionalidade será adicionado aqui.</p>
        `;
    });
});
