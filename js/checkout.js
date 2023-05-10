function DisplayCheckout() {
    const user = GetUser();
    const dadosRegisto = GetDadosRegisto(user.name);

    // Adicionar Detalhes Utilizador
    const streetAddress = document.getElementById('streetAddress');
    const postCode = document.getElementById('postCode');
    const localidade = document.getElementById('localidade');
    const pais = document.getElementById('pais');

    streetAddress.innerText = `${dadosRegisto[0].address}`;
    postCode.innerText = `${dadosRegisto[0].postCode}`;
    localidade.innerText = `${dadosRegisto[0].localidade}`;
    pais.innerText = `${dadosRegisto[0].country}`;

    //Mostrar Subtotal e total
    var totalCost = localStorage.getItem("totalCost");
    totalCost = parseFloat(totalCost);

    document.querySelector('.subtotal span').textContent = totalCost.toFixed(2);
    document.querySelector('.valorFinal span').textContent = totalCost.toFixed(2);

    //Verificar morada
    CheckCountry();
    
    // Actualizar Total
    CalculateAllPrices();
}

function CheckCountry() {
    const pais = document.getElementById('pais');
    const envioEstrangeiro = document.getElementById('envioEstrangeiro');
    var valorFinal = parseFloat(document.querySelector('.valorFinal span').textContent);

    //Verificar se a morada Inicial Esta em Portugal
    if(pais.innerText == 'Portugal' && envioEstrangeiro.innerText != '') {
        //Atualizar texto
        envioEstrangeiro.style.display = 'none';
        envioEstrangeiro.innerText = '';
        //Atualizar Preco total
        valorFinal = (parseFloat(valorFinal) - 10).toFixed(2) ;
        document.querySelector('.valorFinal span').textContent = valorFinal;
    } else if(pais.innerText != 'Portugal' && envioEstrangeiro.innerText == '') {
        //Atualizar texto
        envioEstrangeiro.style.display = 'block';
        envioEstrangeiro.innerText = "+ €10 (Envio para o estrangeiro)";
        //Atualizar Preco total
        valorFinal = (parseFloat(valorFinal) + 10).toFixed(2) ;
        document.querySelector('.valorFinal span').textContent = valorFinal;
    }
}

function CalculateAllPrices() {
    var subTotal = localStorage.getItem("totalCost");
    var envioEstrangeiro = 0;
    var envioExpresso = 0;
    var discountCode;

    subTotal = parseFloat(subTotal);

    //Mostrar Subtotal
    document.querySelector('.subtotal span').textContent = subTotal.toFixed(2);

    //Verificar Envio para Estrangeiro
    if(document.getElementById('envioEstrangeiro').innerText != '') {
        envioEstrangeiro = 10.00;
    }
    //Verificar Envio espresso
    if(ExpressDelivery()){
        envioExpresso = 20.00;
    }

    //Verificar Desconto e adicionar o valor que se retirou do subtotal
    discountCode = ((100 - CalculateDiscount()) / 100).toFixed(2);
    document.getElementById('discountedPrice').innerHTML = `${((CalculateDiscount() * subTotal)/100).toFixed(2)}`;

    //Calcular Total  -> Desconto aplicado apenas no valor total do carrinho
    document.querySelector('.valorFinal span').textContent = ( (discountCode * subTotal) + envioEstrangeiro + envioExpresso).toFixed(2);
}

function ExpressDelivery(){
    const entregaExpresso = document.getElementById('entregaExpresso');
    const entregaNormal = document.getElementById('entregaNormal');

    if(entregaNormal.checked) {
        document.getElementById('envioExpressoNota').style.display = 'none';
        return false;
    } else if(entregaExpresso.checked) {
        document.getElementById('envioExpressoNota').style.display = 'block';
        return true;
    }
    return false;
}

function CalculateDiscount() {
    var valueDiscount = document.getElementById('valueDiscount').innerText;

    if(valueDiscount === "10"){
        return 10;
    } else if(valueDiscount === "20") {
        return 20;
    } else if(valueDiscount === "30") {
        return 30;
    }

    return 0;
}

function SubmitPromoCode() {
    var txtCodigoPromocional = document.getElementById('discountCode');    
    const promoCodeNote = document.getElementById('promoCodeNote');
    const descontoCodPromocional = document.getElementById('valueDiscount');
    var valueDiscount;

    var code = txtCodigoPromocional.value;
    
    //Mostra Erro
    if(!ValidateCode(code)) {
        promoCodeNote.innerHTML= `
            <p style="color: red; margin-bottom: 0px; margin-top: 2px;">Codigo Invalido</p>
        `;
    } else {
        //Aplica Codigo
        valueDiscount = code.charAt(2);
        if(valueDiscount === 'A'){
            descontoCodPromocional.innerText = "10";
            promoCodeNote.innerHTML= `
                <p style="color: green; margin-bottom: 0px; margin-top: 2px;">10% Desconto Valido!</p>
            `;
        }else if(valueDiscount === 'B'){
            descontoCodPromocional.innerText = "20";
            promoCodeNote.innerHTML= `
                <p style="color: green; margin-bottom: 0px; margin-top: 2px;">20% Desconto Valido!</p>
            `;
        }else if(valueDiscount === 'C'){
            descontoCodPromocional.innerText = "30";
            promoCodeNote.innerHTML= `
                <p style="color: green; margin-bottom: 0px; margin-top: 2px;">30% Desconto Valido!</p>
            `;
        }

        //tornar visivel o desconto!
        document.getElementById('subtractDiscount').style.display = 'block';
        
        // ReCalcular
        CalculateAllPrices();
    }
}

function ValidateCode(code) {
    //Inicia com VP  -> Seguido de A, B ou C  - > Seguido de 5 digitos
    const regExp = /^VP[ABC]\d{5}$/; 

    if (regExp.test(code)) {
        return true;
    }
    return false;
}

function ChangeAddress() {
    //funcao para aparecer o formulario de troca de morada
    const showAddress = document.getElementById('showAddress');
    const changeAddress = document.getElementById('changeAddress');
    
    showAddress.style.display = `none`;
    changeAddress.style.display = `block`;
}

function SaveAddress() {
    const streetAddress = document.getElementById('streetAddress');
    const postCode = document.getElementById('postCode');
    const localidade = document.getElementById('localidade');
    const pais = document.getElementById('pais');
    const newStreetAddress = document.getElementById('newStreetAddress');
    const newPostCode = document.getElementById('newPostCode');
    const newLocalidade = document.getElementById('newLocalidade');
    const newPais = document.getElementById('newPais');
    const addressSucess = document.getElementById('addressSucess');

    if(ValidateAddress()) {
        const user = GetUser();
        const dadosRegisto = GetDadosRegisto(user.name);

        dadosRegisto[0].address = newStreetAddress.value;
        dadosRegisto[0].postCode = newPostCode.value;
        dadosRegisto[0].localidade = newLocalidade.value;
        dadosRegisto[0].country = newPais.value;

        streetAddress.innerHTML = dadosRegisto[0].address;
        postCode.innerHTML = dadosRegisto[0].postCode;
        localidade.innerHTML = dadosRegisto[0].localidade;
        pais.innerHTML = dadosRegisto[0].country;
        addressSucess.innerText = "Alteracao efectuada com sucesso!";
        showAddress.style.display = `block`;
        changeAddress.style.display = `none`;
        
        //RecalcularTotal -> caso altere o pais
        CheckCountry();
        CalculateAllPrices();
    }
}

function ValidateAddress() {
    const newStreetAddress = document.getElementById('newStreetAddress').value;
    const newPostCode = document.getElementById('newPostCode').value;
    const newLocalidade = document.getElementById('newLocalidade').value;
    const errorStreetAddress = document.getElementById('errorStreetAddress');
    const errorPostCode = document.getElementById('errorPostCode');
    const errorLocalidade = document.getElementById('errorLocalidade');

    var sucess = true;

    errorStreetAddress.innerText = '';
    errorPostCode.innerText = '';
    errorLocalidade.innerText = '';

    // Rua
    if(newStreetAddress.length === 0) {
        errorStreetAddress.innerText = ' * Campo obrigatorio';
        sucess &= false;
    } else if(newStreetAddress.length < 10) {
        errorStreetAddress.innerText = ' * Tem que conter um minimo de 10 caracters';
        sucess &= false;
    }
    // Codigo Postal
    if(newPostCode.length === 0) {
        errorPostCode.innerText = ' * Campo obrigatorio';
        sucess &= false;
    } 
    // Localidade
    if(newLocalidade.length === 0) {
        errorLocalidade.innerText = ' * Campo obrigatorio';
        sucess &= false;
    } 

    return sucess;
}

function GetDadosRegisto(name) {
    //Vamos tentar encontrar a combinação nome/password nos dados de registo
    const registosFromCookie = LerCookie('dadosRegisto');

    if (registosFromCookie.length != 0) {
        const registos = JSON.parse(registosFromCookie);

        dadosRegisto = registos.filter(function (item) {
            return (item.name === name);
        });

        return dadosRegisto;
    }
}