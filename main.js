let listaDeItens = []
let itemAEditar

const form = document.getElementById("form-itens")
const itensInput = document.getElementById("receber-item")
const ulItens = document.getElementById("lista-de-itens")
const ulItensComprados = document.getElementById("itens-comprados")
const listaRecuperada = localStorage.getItem('listaDeItens')

function atualizaLocalStorage(){
    localStorage.setItem('listaDeItens', JSON.stringify(listaDeItens))
}

if(listaRecuperada){
    listaDeItens = JSON.parse(listaRecuperada)
    mostrarItem()
} else{
    listaDeItens = []
}

//addEventListener serve para escutar, no caso escutar quando der o submit, chamando a function
form.addEventListener("submit", function (evento) {
    // impedir que algo aconteça 
    // quando clicar no botão de Salvar Item, não faça nada, para que a informação no campo não desapareça
    evento.preventDefault()
    salvarItem()
    mostrarItem()
    // mantendo o foco no input, mesmo após clicar em 'Salva Item' ou no 'ok' do alert
    itensInput.focus()
})

function salvarItem() {
    const comprasItem = itensInput.value
    // some é usado para percorrer a lista
    // estamos fazendo um arrow function para ver se o elemento já existe na lista
    const checarDuplicado = listaDeItens.some((elemento) => elemento.valor.toUpperCase() === comprasItem.toUpperCase())

    if (checarDuplicado) {
        alert("Item já existe")
    } else {
        // push(), serve para adicionar coisas a lista
        listaDeItens.push({
            valor: comprasItem,
            checar: false
        })
    }

    // deixando o campo vazio
    itensInput.value = ''
}


function mostrarItem() {
    ulItens.innerHTML = ''
    ulItensComprados.innerHTML = ''
    listaDeItens.forEach((elemento, index) => {
        // verifica se o atributo checar está como 'true'
        if (elemento.checar) {
            ulItensComprados.innerHTML += `
             <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
        <div>
            <input type="checkbox" checked class="is-clickable" />  
            <span class="itens-comprados is-size-5">${elemento.valor}</span>
        </div>
        <div>
            <i class="fa-solid fa-trash is-clickable deletar"></i>
        </div>
    </li>`
        }
        else {
            ulItens.innerHTML += `
        <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
        <div>
            <input type="checkbox" class="is-clickable" />
            <input type="text" class="is-size-5" value="${elemento.valor}" ${index !== Number(itemAEditar) ? 'disabled' : ''}></input>
        </div>

        <div>
            ${ index === Number(itemAEditar) ? '<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button> ' : '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'}
            <i class="fa-solid fa-trash is-clickable deletar"></i>
        </div>
        </li>`
        }
    })

    const inputsCheck = document.querySelectorAll('input[type="checkbox"]')

    inputsCheck.forEach(i => {

        i.addEventListener('click', (evento) => {
            // target me retorna um alvo
            // parenteElemente me retorna o pai do elemento que está sendo clicado, no caso me retorn a div, que é pai do input do checkbox
            // usando o getAttribute, consigo pegar o índice do elemento no qual estou clicando
            const valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value')
            // usando o checked, que é um método dos inputs checkbox, ele muda o valor para checked quando for marcado
            listaDeItens[valorDoElemento].checar = evento.target.checked
            mostrarItem()
        })
    })

    const deletarObjetos = document.querySelectorAll(".deletar")

    deletarObjetos.forEach(i => {

        i.addEventListener('click', (evento) => {
            // target me retorna um alvo
            // parenteElemente me retorna o pai do elemento que está sendo clicado, no caso me retorn a div, que é pai do input do checkbox
            // usando o getAttribute, consigo pegar o índice do elemento no qual estou clicando
            const valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value')
            // splice(), serve para deletar objetos, adicionar, substituir
            // o 1 significa que quero deletar apenas ele
            listaDeItens.splice(valorDoElemento, 1)
            mostrarItem()
        })
    })


    const editarItens = document.querySelectorAll(".editar")

    editarItens.forEach(i => {

        i.addEventListener('click', (evento) => {
            itemAEditar = evento.target.parentElement.parentElement.getAttribute('data-value')
            mostrarItem()
        })
    })

    atualizaLocalStorage()

}

function salvarEdicao() {
    const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`)
    listaDeItens[itemAEditar].valor = itemEditado.value
    itemAEditar = -1
    mostrarItem()
}