const carts = document.querySelectorAll('.add-cart');

var products = [
    {
        name: 'Conjunto Paddle Board',
        tag: 'standup',
        price: 300.00,
        inCart: 0
    },
    {
        name: 'Conjunto Surf',
        tag: 'surf',
        price: 249.99,
        inCart: 0
    },
    {
        name: 'Conjunto Windsurf',
        tag: 'windsurf',
        price: 1480.99,
        inCart: 0
    },
    {
        name: 'Wakeboard',
        tag: 'wakeboard',
        price: 310.47,
        inCart: 0
    },
    {
        name: 'Barco Insuflavel',
        tag: 'barco',
        price: 70.78,
        inCart: 0
    },
    {
        name: 'Kayak',
        tag: 'kayak',
        price: 404.99,
        inCart: 0
    },
    {
        name: 'Kayak Espelhado',
        tag: 'kayakglass',
        price: 539.18,
        inCart: 0
    },
    {
        name: 'Speed Boat',
        tag: 'speedboat',
        price: 15824.99,
        inCart: 0
    },
    {
        name: 'Conjunto de Parasailing',
        tag: 'parasailing',
        price: 1000.00,
        inCart: 0
    },
    {
        name: 'JetSki Subaquatico',
        tag: 'underjet',
        price: 799.29,
        inCart: 0
    },
    {
        name: 'Conjunto Snorkeling',
        tag: 'snorkel',
        price: 35.00,
        inCart: 0
    },
    {
        name: 'Conjunto Mergulho',
        tag: 'scuba',
        price: 1049.23,
        inCart: 0
    }
]

// Toda a vez que se clica no adicionar carrinho
for(let i=0; i<carts.length; i++) {
    carts[i].addEventListener('click', () => {
        if(LoadUser()) {
            cartNumbers(products[i], 0);
            totalCost();
        } else {
            window.alert("Por favor faca o login antes de adicionar ao carrinho");
        }
    });
}

// Mostrar o numero no carrinho do cabecalho ao carregar a pagina principal
function onLoadCartNumbers() {
    var productNumbers = localStorage.getItem('cartNumbers');

    if(productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}

// Actualizar o numero no carrinho do cabecalho
function cartNumbers(product, update) {
    var productNumbers = localStorage.getItem('cartNumbers');

    //Caso a quantidade de produtos seja alterada, update != 0
    if(update == 0) {
        productNumbers = parseInt(productNumbers);

        //atribuir limite nas quantidades
        if(productNumbers >= 999){
            window.alert("So pode selecionar um maximo de 999 produtos!");
            return;
        }
        if(productNumbers) {
            localStorage.setItem('cartNumbers', productNumbers + 1);
            document.querySelector('.cart span').textContent = productNumbers + 1;
        } else {
            localStorage.setItem('cartNumbers', 1);
            document.querySelector('.cart span').textContent = 1;
        }
    } else {
        productNumbers = parseInt(productNumbers);
        localStorage.setItem('cartNumbers', productNumbers + update);
        document.querySelector('.cart span').textContent = productNumbers + update;
    }

    setItems(product);
}

//colocar lista de produtos no local storage
function setItems(product) {
    var cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if(cartItems != null) {
        if(cartItems[product.tag] == undefined) {
            cartItems = {
                ...cartItems,
                [product.tag]: product
            }
        }
        cartItems[product.tag].inCart += 1;
    } else {
        product.inCart = 1;
        cartItems = {
            [product.tag]: product
        }
    }
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

// Calcular o custo total do carrinho
function totalCost() {
    var cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    var cartCost = 0.00;

    for (var key in cartItems) {
        var obj = cartItems[key];
        cartCost += obj.inCart * obj.price;
    }

    localStorage.setItem("totalCost", cartCost.toFixed(2));
    localStorage.setItem("productsInCart", JSON.stringify(cartItems)); 
}

// Alterar a lista do carrinho no local storage
function UpdateCart(nome, numero){
    var cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    // Caso o utilizador nao mude a opcao
    var diff = parseInt(numero) - cartItems[nome].inCart
    if(diff == 0) {
        localStorage.setItem("productsInCart", JSON.stringify(cartItems));     
        return;
    }

    // Remover produto
    if(numero == 0) {
        localStorage.setItem("productsInCart", JSON.stringify(cartItems));     
        RemoveItem(nome);
        return;
    }
    
    // Verificar se ultrapassa a quantidade maxima de 999 produtos
    var productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);
    console.log(productNumbers);
    if(productNumbers + diff >= 999) {
        window.alert("Quantidade maxima de 999 items atingida!");
    }
    // Caso contrartio, actualiza
    else if(numero > 0) {
        if(cartItems[nome] != undefined) {
            //Alterar o numero na estrutura
            cartItems[nome].inCart = numero;

            //Update numero de produtos no carrinho
            cartNumbers(cartItems[nome], diff);
            cartItems[nome].inCart = parseInt(cartItems[nome].inCart);
        }
    }
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));  
    
    //Update valor Total e recarregar pagina
    totalCost();   
    location.reload();
}

// Remover produto da lista
function RemoveItem(name) {
    var cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    var numero = cartItems[name].inCart;
     
    //remover artigo do carrinho
    delete cartItems[name];
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));

    //update numero carrinho
    var productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);
    localStorage.setItem('cartNumbers', productNumbers - numero);
    document.querySelector('.cart span').textContent = productNumbers -numero;

    //update totalCost
    totalCost();
    location.reload(); 
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }

    return true;
}

//mostrar listagem do carrinho
function displayCart() {
    var cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    var productContainer = document.querySelector(".products");
    var cartCost = localStorage.getItem('totalCost');
    
    //se o carrinho estiver vazio ou nao foi carregado, mostra uma div oculta senao, mostra os produtos
    if(cartItems == null || Object.entries(cartItems).length === 0 ) {
        document.getElementById('emptyCart').style.display = 'block';
    } else{
        document.getElementById('emptyCart').style.display = 'none';
        if(cartItems && productContainer) {
            productContainer.innerHTML = '';
            Object.values(cartItems).map(item => {            
                productContainer.innerHTML += `
                <div class="product">
                    <img src="./img/icons/closeicon.png" title="Remover" onclick="RemoveItem('${item.tag}')" style="height:15px;width:15px; padding-left:30px; padding-right:30px; cursor: pointer;">
                    <img src="./img/${item.tag}.jpg" style="height:70px;width:80px;">
                    &nbsp;&nbsp;
                    <span>${item.name}</span>
                </div>
                <div class="price-cart">€${item.price}</div>
                <div class="quantity">
                    <input id="txtQt${item.tag}" type=\"text\" onkeypress=\"return isNumber(event)\" value="${item.inCart}" style="width:30px;display: inline-block;">
                    &nbsp;&nbsp;
                    <img src="./img/icons/reloadicon.png" title="Atualizar" onclick="UpdateCart('${item.tag}', txtQt${item.tag}.value)" style="height: 15px; width: 15px; cursor: pointer;">
                </div>
                <div class="total">
                    €${(item.inCart * item.price).toFixed(2)}
                </div>
                `;
            });
            productContainer.innerHTML += `
                <div class="basketTotalContainer">
                    <h4 class="basketTotalTitle">Total&nbsp;</h4>
                    <h4 class="basketTotal">€${cartCost}</h4>
                </div>
                <div class="basketTotalContainer">
                    <a href="checkout.html"><button>Checkout</button></a>
                </div>
            `;
        } 
    }
}