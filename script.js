document.addEventListener("DOMContentLoaded", () => {
    let panel = document.getElementById("contentPanel");
    const layout = document.querySelector("main.layout");
    let sidebar = document.querySelector(".sidebar");
    const managerAccessCode = "1234";
    const header = document.querySelector(".topbar");
    const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbylHZEGwG3E0wg0ejejN5ktHX2gRkIuJ6HCscTjge7A1WyGu1GGGN59JDqlrKp1Hyz9Wg/exec";
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

                    <button type="submit" class="btn-submeter" disabled>Submeter Tema</button>
                </form>
            </div>
            `;

        const studentInput = document.getElementById("numeroEstudante");
        const phoneInput = document.getElementById("contactoTelefonico");
        const form = panel.querySelector("form");
        const existingSuccessOverlay = document.getElementById("submissionSuccessOverlay");

        if (existingSuccessOverlay) {
            existingSuccessOverlay.remove();
        }

        const successOverlay = document.createElement("div");

        successOverlay.className = "modal-overlay";
        successOverlay.id = "submissionSuccessOverlay";
        successOverlay.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true" aria-labelledby="submissionSuccessTitle">
                <div class="modal-header">
                    <h3 id="submissionSuccessTitle">Submissão efectuada</h3>
                </div>
                <div class="modal-body">
                    <p>Os seus dados foram submetidos com sucesso.</p>
                    <p>Acompanhe o estado do processo na aba “Estado do tema” usando o seu número de estudante.</p>
                    <div class="modal-actions">
                        <button type="button" class="modal-submit" id="closeSubmissionSuccess">OK</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(successOverlay);

        const closeSuccessButton = document.getElementById("closeSubmissionSuccess");

        const closeSuccessModal = () => {
            if (successOverlay) {
                successOverlay.style.display = "none";
            }
        };

        closeSuccessButton?.addEventListener("click", closeSuccessModal);
        successOverlay.addEventListener("click", (event) => {
            if (event.target === successOverlay) {
                closeSuccessModal();
            }
        });

        if (studentInput) {
            applyStudentMask(studentInput);
        }

        if (phoneInput) {
            applyPhoneMask(phoneInput);
        }

        const submitButton = panel.querySelector(".btn-submeter");
        const formFields = [
            document.getElementById("nomeCompleto"),
            document.getElementById("numeroEstudante"),
            document.getElementById("contactoTelefonico"),
            document.getElementById("curso"),
            document.getElementById("tituloTema"),
            document.getElementById("descricaoTema"),
        ];

        if (submitButton) {
            const updateSubmitState = () => {
                const hasValue = formFields.some((field) => field && field.value.trim() !== "");
                submitButton.disabled = !hasValue;
            };

            formFields.forEach((field) => {
                field?.addEventListener("input", updateSubmitState);
            });

            submitButton.addEventListener("click", async (event) => {
                event.preventDefault();
                submitButton.disabled = true;

                const nome = document.getElementById("nomeCompleto")?.value.trim() || "";
                const numeroEstudante = document.getElementById("numeroEstudante")?.value.trim() || "";
                const contacto = document.getElementById("contactoTelefonico")?.value.trim() || "";
                const curso = document.getElementById("curso")?.value || "";
                const tituloTema = document.getElementById("tituloTema")?.value.trim() || "";
                const descricaoTema = document.getElementById("descricaoTema")?.value.trim() || "";

                const payload = new FormData();

                payload.append("nome", nome);
                payload.append("numeroEstudante", numeroEstudante);
                payload.append("contacto", contacto);
                payload.append("curso", curso);
                payload.append("tituloTema", tituloTema);
                payload.append("descricaoTema", descricaoTema);

                try {
                    const response = await fetch(WEBAPP_URL, {
                        method: "POST",
                        body: payload,
                    });

                    const data = await response.json();

                    if (data?.sucesso === true) {
                        form?.reset();
                        updateSubmitState();
                        successOverlay.style.display = "flex";
                    } else {
                        const mensagem = data?.mensagem || data?.erro || "Falha ao submeter tema";
                        alert(`Erro: ${mensagem}`);
                        updateSubmitState();
                    }
                } catch (error) {
                    const message = error instanceof Error ? error.message : "Erro desconhecido";
                    alert(`Erro: ${message}`);
                    updateSubmitState();
                }
            });

            updateSubmitState();
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

                if (feature === "Submissões de tema de monografia") {
                    renderGestorSubmissoes(gestorPainel);
                    return;
                }

                if (gestorPainel) {
                    gestorPainel.innerHTML = `
                        <h2>${feature}</h2>
                        <p>Conteúdo de gestão será adicionado.</p>
                    `;
                }
            });
        });
    }

    function renderGestorSubmissoes(gestorPainel) {
        if (!gestorPainel) return;

        gestorPainel.innerHTML = `
            <h2>Submissões de tema de monografia</h2>
            <p>As submissões realizadas pelos estudantes aparecem abaixo.</p>
        `;

        const container = document.createElement("div");
        gestorPainel.appendChild(container);

        const statusMessage = document.createElement("p");
        statusMessage.textContent = "A carregar submissões...";
        container.appendChild(statusMessage);

        const rowsPerPage = 10;
        let currentPage = 1;
        let submissions = [];

        function renderTablePage() {
            container.innerHTML = "";

            const table = document.createElement("table");
            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
            const headers = [
                "Número do estudante",
                "Nome",
                "Curso",
                "Título do Tema",
                "Supervisor",
                "Parecer",
                "Ações"
            ];

            headers.forEach(text => {
                const th = document.createElement("th");
                th.textContent = text;
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement("tbody");
            const start = (currentPage - 1) * rowsPerPage;
            const pageItems = submissions.slice(start, start + rowsPerPage);

            pageItems.forEach(submission => {
                const row = document.createElement("tr");

                const numberCell = document.createElement("td");
                numberCell.textContent = submission.numeroEstudante || "";
                row.appendChild(numberCell);

                const nameCell = document.createElement("td");
                nameCell.textContent = submission.nome || "";
                row.appendChild(nameCell);

                const courseCell = document.createElement("td");
                courseCell.textContent = submission.curso || "";
                row.appendChild(courseCell);

                const titleCell = document.createElement("td");
                titleCell.textContent = submission.tituloTema || "";
                row.appendChild(titleCell);

                const supervisorCell = document.createElement("td");
                const supervisorInput = document.createElement("input");
                supervisorInput.type = "text";
                supervisorInput.value = submission.supervisor || "";
                supervisorCell.appendChild(supervisorInput);
                row.appendChild(supervisorCell);

                const parecerCell = document.createElement("td");
                const parecerInput = document.createElement("input");
                parecerInput.type = "text";
                parecerInput.value = submission.parecer || "";
                parecerCell.appendChild(parecerInput);
                row.appendChild(parecerCell);

                const actionsCell = document.createElement("td");
                const saveButton = document.createElement("button");
                saveButton.textContent = "Guardar";
                saveButton.addEventListener("click", async () => {
                    saveButton.disabled = true;
                    saveButton.textContent = "A guardar...";

                    try {
                        const response = await fetch(WEBAPP_URL, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                action: "atualizarParecerSupervisor",
                                linha: submission.linha,
                                supervisor: supervisorInput.value.trim(),
                                parecer: parecerInput.value.trim()
                            })
                        });

                        const result = await response.json();

                        if (result?.sucesso) {
                            submission.supervisor = supervisorInput.value.trim();
                            submission.parecer = parecerInput.value.trim();
                            saveButton.textContent = "Guardado";
                        } else {
                            const mensagem = result?.mensagem || result?.erro || "Não foi possível actualizar.";
                            alert(mensagem);
                            saveButton.textContent = "Guardar";
                        }
                    } catch (error) {
                        const message = error instanceof Error ? error.message : "Erro desconhecido";
                        alert(message);
                        saveButton.textContent = "Guardar";
                    } finally {
                        saveButton.disabled = false;
                    }
                });

                actionsCell.appendChild(saveButton);
                row.appendChild(actionsCell);

                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            container.appendChild(table);

            const pagination = document.createElement("div");
            const prevButton = document.createElement("button");
            prevButton.textContent = "Página anterior";
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener("click", () => {
                if (currentPage > 1) {
                    currentPage -= 1;
                    renderTablePage();
                }
            });

            const nextButton = document.createElement("button");
            nextButton.textContent = "Página seguinte";
            const totalPages = Math.max(1, Math.ceil(submissions.length / rowsPerPage));
            nextButton.disabled = currentPage >= totalPages;
            nextButton.addEventListener("click", () => {
                if (currentPage < totalPages) {
                    currentPage += 1;
                    renderTablePage();
                }
            });

            pagination.appendChild(prevButton);
            pagination.appendChild(nextButton);
            container.appendChild(pagination);
        }

        fetch(`${WEBAPP_URL}?action=listarSubmissoes`)
            .then(response => response.json())
            .then(data => {
                submissions = Array.isArray(data) ? data : [];

                if (submissions.length === 0) {
                    container.innerHTML = "";
                    const emptyMessage = document.createElement("p");
                    emptyMessage.textContent = "Não existem submissões para apresentar.";
                    container.appendChild(emptyMessage);
                    return;
                }

                renderTablePage();
            })
            .catch(() => {
                statusMessage.textContent = "Não foi possível carregar as submissões.";
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
