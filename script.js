
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
        const feature = btn.dataset.feature;

        if (feature === "Submissão de tema") {
            renderSubmissionForm();
            return;
        }

        panel.innerHTML = `
            <h2>${feature}</h2>
            <p>Conteúdo desta funcionalidade será adicionado aqui.</p>
        `;
    });
});

function renderSubmissionForm() {
    panel.innerHTML = `
        <div class="formulario">
            <h2>Submissão de Tema de Monografia</h2>
            <form>
                <label for="nomeCompleto">Nome completo</label>
                <input id="nomeCompleto" type="text" name="nomeCompleto" placeholder="Insira o seu nome completo" required>

                <label for="numeroEstudante">Número de estudante</label>
                <input id="numeroEstudante" type="text" name="numeroEstudante" placeholder="Insira o número de estudante" required>

                <label for="contactoTelefonico">Contacto Telefónico</label>
                <input id="contactoTelefonico" type="text" name="contactoTelefonico" placeholder="Insira o contacto telefónico" required>

                <label for="curso">Curso</label>
                <select id="curso" name="curso" required>
                    <option value="">Selecione o curso</option>
                    <option value="gestao">Gestão</option>
                    <option value="economia">Economia</option>
                    <option value="informatica">Engenharia Informática</option>
                    <option value="contabilidade">Contabilidade e Auditoria</option>
                </select>

                <label for="tituloTema">Título do tema</label>
                <input id="tituloTema" type="text" name="tituloTema" placeholder="Indique o título do tema" required>

                <label for="descricaoTema">Descrição do tema</label>
                <textarea id="descricaoTema" name="descricaoTema" rows="5" placeholder="Descreva brevemente o tema" required></textarea>

                <button type="submit" class="btn-submeter">Submeter Tema</button>
            </form>
        </div>
        `;

    const studentInput = document.getElementById("numeroEstudante");
    const phoneInput = document.getElementById("contactoTelefonico");

    if (studentInput) {
        studentInput.setAttribute("maxlength", "12");
        studentInput.required = true;
        studentInput.addEventListener("input", () => {
            const digits = studentInput.value.replace(/\D/g, "").slice(0, 10);
            const first = digits.slice(0, 2);
            const second = digits.slice(2, 6);
            const third = digits.slice(6, 10);
            let formatted = first;

            if (digits.length > 2) {
                formatted = `${first}.${second}`;
            }

            if (digits.length > 6) {
                formatted = `${first}.${second}.${third}`;
            }

            studentInput.value = formatted;
        });
    }

    if (phoneInput) {
        phoneInput.setAttribute("maxlength", "13");
        phoneInput.required = true;
        phoneInput.addEventListener("input", () => {
            const digits = phoneInput.value.replace(/\D/g, "").slice(0, 9);
            const ddd = digits.slice(0, 2);
            const firstPart = digits.slice(2, 6);
            const secondPart = digits.slice(6, 9);
            let formatted = "";

            if (digits.length > 0) {
                formatted = `(${ddd}`;

                if (digits.length >= 2) {
                    formatted += ")";
                }
            }

            if (digits.length > 2) {
                formatted += ` ${firstPart}`;
            }

            if (digits.length > 6) {
                formatted += ` ${secondPart}`;
            }

            phoneInput.value = formatted.trim();
        });
    }
}
