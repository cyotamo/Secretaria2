
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
        if (btn.dataset.feature === "Submissão de tema") {
            panel.innerHTML = `
                <div class="formulario">
                    <h2>Submissão de Tema de Monografia</h2>
                    <form>
                        <label for="nomeCompleto">Nome completo</label>
                        <input id="nomeCompleto" type="text" name="nomeCompleto" placeholder="Insira o seu nome completo" required>

                        <label for="numeroEstudante">Número de estudante</label>
                        <input id="numeroEstudante" type="text" name="numeroEstudante" placeholder="Insira o número de estudante" required>

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
            return;
        }

        panel.innerHTML = `
            <h2>${btn.dataset.feature}</h2>
            <p>Conteúdo desta funcionalidade será adicionado aqui.</p>
        `;
    });
});
