// Accordion logic
const btn = document.getElementById("areaEstudanteBtn");
const body = document.getElementById("areaEstudanteBody");
const selected = document.getElementById("selectedFeature");

btn.addEventListener("click", () => {
    body.classList.toggle("open");
});

document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", () => {
        selected.textContent = "Funcionalidade seleccionada: " + item.dataset.feature;
    });
});
