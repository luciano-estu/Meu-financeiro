// ==========================
// SENHA PADRÃO
// ==========================

if (!localStorage.getItem("senha")) {
    localStorage.setItem("senha", "1234");
}

// ==========================
// LOGIN
// ==========================

function fazerLogin() {

    const senhaDigitada =
        document.getElementById("senha").value;

    const senhaSalva =
        localStorage.getItem("senha");

    if (senhaDigitada === senhaSalva) {

        document.getElementById("login-container")
            .style.display = "none";

        document.getElementById("app")
            .style.display = "block";

        carregarTema();
        atualizarTabela();

    } else {

        alert("Senha incorreta!");

    }
}

// ==========================
// BANCO LOCAL
// ==========================

let lancamentos =
    JSON.parse(localStorage.getItem("lancamentos")) || [];

// ==========================
// ADICIONAR LANÇAMENTO
// ==========================

function adicionarLancamento() {

    const tipo =
        document.getElementById("tipo").value;

    const descricao =
        document.getElementById("descricao").value;

    const valor =
        parseFloat(document.getElementById("valor").value);

    const categoria =
        document.getElementById("categoria").value;

    if (!descricao || !valor) {

        alert("Preencha todos os campos.");
        return;
    }

    const novo = {

        id: Date.now(),

        data:
            new Date().toLocaleDateString("pt-BR"),

        tipo,
        descricao,
        valor,
        categoria
    };

    lancamentos.push(novo);

    salvarDados();

    document.getElementById("descricao").value = "";
    document.getElementById("valor").value = "";
}

// ==========================
// SALVAR
// ==========================

function salvarDados() {

    localStorage.setItem(
        "lancamentos",
        JSON.stringify(lancamentos)
    );

    atualizarTabela();
}

// ==========================
// EXCLUIR
// ==========================

function excluirLancamento(id) {

    if (!confirm("Deseja excluir?"))
        return;

    lancamentos =
        lancamentos.filter(
            item => item.id !== id
        );

    salvarDados();
}

// ==========================
// TABELA
// ==========================

function atualizarTabela() {

    const tabela =
        document.getElementById(
            "listaLancamentos"
        );

    const pesquisa =
        document.getElementById(
            "pesquisa"
        ).value.toLowerCase();

    tabela.innerHTML = "";

    let receitas = 0;
    let despesas = 0;

    lancamentos.forEach(item => {

        if (
            !JSON.stringify(item)
                .toLowerCase()
                .includes(pesquisa)
        ) return;

        const linha = `
        <tr>
            <td>${item.data}</td>
            <td>${item.tipo}</td>
            <td>${item.descricao}</td>
            <td>${item.categoria}</td>
            <td>R$ ${item.valor.toFixed(2)}</td>

            <td>
                <button
                class="excluir"
                onclick="excluirLancamento(${item.id})">
                X
                </button>
            </td>
        </tr>
        `;

        tabela.innerHTML += linha;

        if (item.tipo === "Receita") {
            receitas += item.valor;
        } else {
            despesas += item.valor;
        }

    });

    document.getElementById(
        "totalReceitas"
    ).innerText =
        receitas.toFixed(2);

    document.getElementById(
        "totalDespesas"
    ).innerText =
        despesas.toFixed(2);

    document.getElementById(
        "saldoTotal"
    ).innerText =
        (receitas - despesas).toFixed(2);

    atualizarGraficoPizza();
    atualizarGraficoMensal();
}

// ==========================
// TEMA ESCURO
// ==========================

function alternarTema() {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "tema",
        document.body.classList.contains("dark")
    );
}

function carregarTema() {

    const tema =
        localStorage.getItem("tema");

    if (tema === "true") {

        document.body.classList.add("dark");

    }
}

// ==========================
// GRÁFICO PIZZA
// ==========================

let pizzaChart;

function atualizarGraficoPizza() {

    const categorias = {};

    lancamentos.forEach(item => {

        if (item.tipo === "Despesa") {

            categorias[item.categoria] =
                (categorias[item.categoria] || 0)
                + item.valor;
        }
    });

    const labels =
        Object.keys(categorias);

    const valores =
        Object.values(categorias);

    const ctx =
        document.getElementById(
            "graficoPizza"
        );

    if (pizzaChart)
        pizzaChart.destroy();

    pizzaChart = new Chart(ctx, {

        type: "pie",

        data: {

            labels,

            datasets: [{
                data: valores
            }]
        }
    });
}

// ==========================
// GRÁFICO MENSAL
// ==========================

let mensalChart;

function atualizarGraficoMensal() {

    const meses = {};

    lancamentos.forEach(item => {

        const partes =
            item.data.split("/");

        const chave =
            partes[1] + "/" + partes[2];

        meses[chave] =
            (meses[chave] || 0)
            + item.valor;
    });

    const labels =
        Object.keys(meses);

    const valores =
        Object.values(meses);

    const ctx =
        document.getElementById(
            "graficoMensal"
        );

    if (mensalChart)
        mensalChart.destroy();

    mensalChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels,

            datasets: [{
                label: "Movimentação",
                data: valores
            }]
        }
    });
}

// ==========================
// EXPORTAR EXCEL
// ==========================

function exportarExcel() {

    const planilha =
        XLSX.utils.json_to_sheet(
            lancamentos
        );

    const livro =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        livro,
        planilha,
        "Financeiro"
    );

    XLSX.writeFile(
        livro,
        "RelatorioFinanceiro.xlsx"
    );
}

// ==========================
// LIMPAR TUDO
// ==========================

function limparTudo() {

    if (
        confirm(
            "Deseja apagar todos os lançamentos?"
        )
    ) {

        lancamentos = [];

        salvarDados();
    }
}

// ==========================
// AUTO LOGIN
// ==========================

window.onload = () => {

    if (
        sessionStorage.getItem("logado")
        === "true"
    ) {

        document.getElementById(
            "login-container"
        ).style.display = "none";

        document.getElementById(
            "app"
        ).style.display = "block";

        carregarTema();
        atualizarTabela();
    }
};
