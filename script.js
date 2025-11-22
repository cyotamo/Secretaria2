document.addEventListener("DOMContentLoaded", () => {
    let panel = document.getElementById("contentPanel");
    const layout = document.querySelector("main.layout");
    let sidebar = document.querySelector(".sidebar");
    const managerAccessCode = "1234";
    const header = document.querySelector(".topbar");
    const originalLayoutHTML = layout?.innerHTML || "";
    let logoutButton = null;

    function attachGroupListeners(scope) {
        if (!scope) return;

        scope.querySelectorAll(".group-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.group;
                const body = scope.querySelector(`#${id}`);

                if (body) {
                    body.style.display = body.style.display === "block" ? "none" : "block";
                }
            });
        });
    }

    function attachStudentMenuListeners() {
        if (!sidebar) return;

        sidebar.querySelectorAll(".menu-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const feature = btn.dataset.feature;

                if (feature === "Submissão de tema") {
                    renderSubmissionForm();
                    return;
                }

                if (panel) {
                    panel.innerHTML = `
                        <h2>${feature}</h2>
                        <p>Conteúdo desta funcionalidade será adicionado aqui.</p>
                    `;
                }
            });
        });
    }

    function applyStudentMask(input) {
        input.setAttribute("maxlength", "12");
        input.required = true;
        input.addEventListener("input", () => {
            const digits = input.value.replace(/\D/g, "").slice(0, 10);
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

            input.value = formatted;
        });
    }

    function applyPhoneMask(input) {
        input.setAttribute("maxlength", "13");
        input.required = true;
        input.addEventListener("input", () => {
            const digits = input.value.replace(/\D/g, "").slice(0, 9);
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

            input.value = formatted.trim();
        });
    }

    function renderSubmissionForm() {
        if (!panel) return;

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
            applyStudentMask(studentInput);
        }

        if (phoneInput) {
            applyPhoneMask(phoneInput);
        }

        const submitButton = panel.querySelector(".btn-submeter");
        const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxapEKl3M9stXl4jx_bl9Z5m99jqItOSXrvFdAB8TY6sVjnt4SKo8nwB2Cnzfxgbf3NFQ/exec";

        if (submitButton) {
            submitButton.addEventListener("click", async (event) => {
                event.preventDefault();

                const nome = document.getElementById("nomeCompleto")?.value.trim() || "";
                const numeroEstudante = document.getElementById("numeroEstudante")?.value.trim() || "";
                const contacto = document.getElementById("contactoTelefonico")?.value.trim() || "";
                const curso = document.getElementById("curso")?.value || "";
                const tituloTema = document.getElementById("tituloTema")?.value.trim() || "";
                const descricaoTema = document.getElementById("descricaoTema")?.value.trim() || "";

                const payload = {
                    nome,
                    numeroEstudante,
                    contacto,
                    curso,
                    tituloTema,
                    descricaoTema,
                };

                try {
                    const response = await fetch(WEBAPP_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    });

                    const data = await response.json();

                    if (data?.sucesso === true) {
                        const protocolo = data.protocolo ? `\n${data.protocolo}` : "";
                        alert(`Tema submetido com sucesso${protocolo}`);
                    } else {
                        const mensagem = data?.mensagem || data?.erro || "Falha ao submeter tema";
                        alert(`Erro: ${mensagem}`);
                    }
                } catch (error) {
                    const message = error instanceof Error ? error.message : "Erro desconhecido";
                    alert(`Erro: ${message}`);
                }
            });
        }
    }

    attachGroupListeners(sidebar);
    attachStudentMenuListeners();

    const loginOverlay = document.getElementById("loginOverlay");
    const closeLoginModal = document.getElementById("closeLoginModal");
    const cancelLoginModal = document.getElementById("cancelLoginModal");
    const loginButton = document.querySelector(".btn-login");
    const originalLoginText = loginButton?.textContent || "Login Docentes/Gestores";
    const loginForm = document.getElementById("loginForm");
    const codigoAcessoInput = document.getElementById("codigoAcesso");
    const loginError = document.createElement("p");

    loginError.style.color = "#c1121f";
    loginError.style.margin = "6px 0 0";
    loginError.style.fontSize = "13px";
    loginError.textContent = "Código de acesso inválido.";

    function openLoginModal() {
        if (loginOverlay) {
            loginOverlay.style.display = "flex";
            codigoAcessoInput?.focus();
        }
    }

    function closeLogin() {
        if (loginOverlay) {
            loginOverlay.style.display = "none";
        }
    }

    if (loginButton && loginOverlay) {
        loginButton.addEventListener("click", openLoginModal);
    }

    [closeLoginModal, cancelLoginModal].forEach(btn => {
        if (btn) {
            btn.addEventListener("click", closeLogin);
        }
    });

    if (loginOverlay) {
        loginOverlay.addEventListener("click", (event) => {
            if (event.target === loginOverlay) {
                closeLogin();
            }
        });
    }

    if (codigoAcessoInput) {
        codigoAcessoInput.addEventListener("input", () => {
            codigoAcessoInput.value = codigoAcessoInput.value.replace(/\D/g, "").slice(0, 6);
        });
    }

    function renderGestorDashboard() {
        if (!layout) return;

        loginButton?.removeEventListener("click", openLoginModal);
        loginButton.textContent = "Gestor (online)";

        if (!logoutButton) {
            logoutButton = document.createElement("button");
            logoutButton.className = "btn-logout";
            logoutButton.textContent = "Sair";
            logoutButton.addEventListener("click", handleLogout);
        }

        if (header && logoutButton && !header.contains(logoutButton)) {
            header.appendChild(logoutButton);
        }

        layout.innerHTML = `
            <aside class="sidebar gestor-sidebar">
                <div class="group">
                    <button class="group-btn" data-group="gestor-processos">Gerir Processos</button>
                    <div class="group-body" id="gestor-processos">
                        <button class="menu-btn menu-btn-gestor" data-feature="Submissões de tema de monografia">Submissões de tema de monografia</button>
                        <button class="menu-btn menu-btn-gestor" data-feature="Homologação de supervisores">Homologação de supervisores</button>
                        <button class="menu-btn menu-btn-gestor" data-feature="Versão final da monografia">Versão final da monografia</button>
                        <button class="menu-btn menu-btn-gestor" data-feature="Buscar estudante">Buscar estudante</button>
                    </div>
                </div>

                <div class="group">
                    <button class="group-btn" data-group="gestor-relatorios">Relatórios</button>
                    <div class="group-body" id="gestor-relatorios">
                        <button class="menu-btn menu-btn-gestor" data-feature="Supervisores homologados">Supervisores homologados</button>
                        <button class="menu-btn menu-btn-gestor" data-feature="Supervisores por homologar">Supervisores por homologar</button>
                    </div>
                </div>
            </aside>

            <section class="content" id="gestorPainel">
                <h2>Painel do Gestor</h2>
                <p>Selecione uma funcionalidade para ver mais detalhes.</p>
            </section>
        `;

        sidebar = layout.querySelector(".gestor-sidebar");
        panel = null;

        const gestorPainel = layout.querySelector("#gestorPainel");

        attachGroupListeners(sidebar);

        sidebar?.querySelectorAll(".menu-btn-gestor").forEach(btn => {
            btn.addEventListener("click", () => {
                const feature = btn.dataset.feature;

                if (gestorPainel) {
                    gestorPainel.innerHTML = `
                        <h2>${feature}</h2>
                        <p>Conteúdo de gestão será adicionado.</p>
                    `;
                }
            });
        });
    }

    function restoreStudentDashboard() {
        if (!layout) return;

        layout.innerHTML = originalLayoutHTML;
        sidebar = layout.querySelector(".sidebar");
        panel = layout.querySelector("#contentPanel");

        if (sidebar) {
            sidebar.style.display = "block";
        }

        if (panel) {
            panel.innerHTML = "";
        }

        attachGroupListeners(sidebar);
        attachStudentMenuListeners();
    }

    function handleLogout() {
        restoreStudentDashboard();

        if (logoutButton && logoutButton.parentElement) {
            logoutButton.parentElement.removeChild(logoutButton);
        }

        if (loginButton) {
            loginButton.textContent = originalLoginText;
            loginButton.removeEventListener("click", openLoginModal);
            loginButton.addEventListener("click", openLoginModal);
        }

        loginError.remove();

        if (codigoAcessoInput) {
            codigoAcessoInput.value = "";
        }
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const codigo = codigoAcessoInput?.value || "";

            loginError.remove();

            if (codigo === managerAccessCode) {
                closeLogin();
                renderGestorDashboard();
                loginForm.reset();
            } else {
                const parent = codigoAcessoInput?.parentElement;
                if (parent && !parent.contains(loginError)) {
                    parent.appendChild(loginError);
                }
            }
        });
    }
});
