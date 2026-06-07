let dados =
JSON.parse(localStorage.getItem("dados")) || [];

function login(){

const usuario =
document.getElementById("user").value;

const senha =
document.getElementById("pass").value;

if(usuario === "admin" && senha === "1234"){

document.getElementById("painel")
.style.display = "block";

}else{

alert("Usuário: admin | Senha: 1234");

}

}

function salvar(){

localStorage.setItem(
"dados",
JSON.stringify(dados)
);

}

function atualizarDashboard(){

let producao = 0;
let receita = 0;

dados.forEach(item => {

producao += item.qtd;

receita += item.qtd * item.preco;

});

document.getElementById("prod")
.innerText = producao + " kg";

document.getElementById("rec")
.innerText = "R$ " + receita.toFixed(2);

}

function renderizar(){

const lista =
document.getElementById("lista");

lista.innerHTML = "";

dados.forEach((item,index)=>{

const li =
document.createElement("li");

li.innerHTML = `
<div>
<strong>${item.cultura}</strong><br>
Quantidade: ${item.qtd} kg<br>
Preço: R$ ${item.preco}
</div>

<button
class="excluir"
onclick="remover(${index})">
Excluir
</button>
`;

lista.appendChild(li);

});

atualizarDashboard();

}

function add(){

const cultura =
document.getElementById("cultura").value;

const qtd =
Number(document.getElementById("qtd").value);

const preco =
Number(document.getElementById("preco").value);

if(!cultura || !qtd || !preco){

alert("Preencha todos os campos");

return;

}

dados.push({
cultura,
qtd,
preco
});

salvar();

renderizar();

document.getElementById("cultura").value="";
document.getElementById("qtd").value="";
document.getElementById("preco").value="";

}

function remover(index){

dados.splice(index,1);

salvar();

renderizar();

}

renderizar();
