
const panel = document.getElementById("contentPanel");

document.querySelectorAll(".group-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.dataset.group;
        const body = document.getElementById(id);
        body.style.display = body.style.display === "block" ? "none" : "block";
    });
});

document.querySelectorAll(".menu-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        panel.innerHTML = `
            <h2>${btn.dataset.feature}</h2>
            <p>Conteúdo desta funcionalidade será adicionado aqui.</p>
        `;
    });
});
