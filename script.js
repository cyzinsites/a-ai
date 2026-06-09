let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

function salvar() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

function formatarMoeda(valor) {
  const n = Number(valor) || 0;
  return n.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
}

function escapar(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function mostrarToast(mensagem) {
  const toast = document.getElementById("toast");
  toast.textContent = mensagem;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 2600);
}

function atualizarResumo() {
  const total = clientes.reduce((s, c) => s + (Number(c.valor) || 0), 0);
  const qtd = clientes.length;
  document.getElementById("totalClientes").textContent = qtd;
  document.getElementById("totalValor").textContent = formatarMoeda(total);
}

function adicionar() {
  const nome = document.getElementById("nome").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const companhia = document.getElementById("companhia").value.trim();
  const cargo = document.getElementById("cargo").value.trim();
  const valor = document.getElementById("valor").value;

  if (!nome || !valor) {
    mostrarToast("Preencha pelo menos nome e valor");
    return;
  }

  clientes.push({
    nome, numero, companhia, cargo, valor,
    data: new Date().toLocaleDateString("pt-br")
  });

  salvar();
  renderizar();
  atualizarResumo();
  document.querySelectorAll(".formulario input").forEach((i) => (i.value = ""));
  document.getElementById("nome").focus();
  mostrarToast("Cliente salvo com sucesso");
}

function renderizar(lista = clientes) {
  const tabela = document.getElementById("tabela");
  const mobile = document.getElementById("listaMobile");
  const vazio = document.getElementById("vazio");

  tabela.innerHTML = "";
  mobile.innerHTML = "";

  if (!lista.length) {
    vazio.hidden = false;
  } else {
    vazio.hidden = true;
  }

  lista.forEach((cliente) => {
    const index = clientes.indexOf(cliente);
    const nome = escapar(cliente.nome) || "—";
    const numero = escapar(cliente.numero) || "—";
    const companhia = escapar(cliente.companhia) || "—";
    const cargo = escapar(cliente.cargo) || "—";
    const valor = formatarMoeda(cliente.valor);
    const data = escapar(cliente.data);

    tabela.innerHTML += `
      <tr>
        <td>${nome}</td>
        <td>${numero}</td>
        <td>${companhia}</td>
        <td>${cargo}</td>
        <td><span class="valor-badge">${valor}</span></td>
        <td>${data}</td>
        <td>
          <button class="excluir" onclick="excluir(${index})">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2m-9 0v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6"/></svg>
            Excluir
          </button>
        </td>
      </tr>`;

    mobile.innerHTML += `
      <article class="cliente-card">
        <div class="cc-topo">
          <div>
            <div class="cc-nome">${nome}</div>
            <div class="cc-data">${data}</div>
          </div>
          <span class="valor-badge">${valor}</span>
        </div>
        <div class="cc-grid">
          <div class="cc-item"><span>Número</span><strong>${numero}</strong></div>
          <div class="cc-item"><span>Companhia</span><strong>${companhia}</strong></div>
          <div class="cc-item"><span>Cargo</span><strong>${cargo}</strong></div>
        </div>
        <div class="cc-rodape">
          <button class="cc-excluir" onclick="excluir(${index})">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2m-9 0v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6"/></svg>
            Excluir
          </button>
        </div>
      </article>`;
  });
}

function excluir(index) {
  if (confirm("Excluir este registro?")) {
    clientes.splice(index, 1);
    salvar();
    renderizar();
    atualizarResumo();
    mostrarToast("Registro excluído");
  }
}

function filtrar() {
  const termo = document.getElementById("pesquisa").value.toLowerCase();
  const filtrados = clientes.filter((c) =>
    [c.nome, c.numero, c.companhia, c.cargo]
      .some((campo) => String(campo ?? "").toLowerCase().includes(termo))
  );
  renderizar(filtrados);
}

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  adicionar();
});

renderizar();
atualizarResumo();
