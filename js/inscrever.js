/* utilizar variaveis globais para evitar repeti-las nas funcoes */
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const address = document.getElementById("address");
const postCode = document.getElementById("postCode");
const localidade = document.getElementById("localidade");
const country = document.getElementById("country");
const saveNote = document.getElementById("saveNote");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const addressError = document.getElementById("addressError");
const postCodeError = document.getElementById("postCodeError");
const localidadeError = document.getElementById("localidadeError");

function SaveUserData() {
    if(ValidateForm()) {
        const dadosRegisto = new DadosRegisto(name.value, email.value, password.value, address.value, postCode.value, localidade.value, country.value);
        if (SaveData(dadosRegisto)) {
            saveNote.innerText = "Registo efectuado com sucesso!";
            Clear();
        }
    }
}

function Clear() {
    name.value = "";
    email.value = "";
    password.value = "";
    address.value = "";
    postCode.value = "";
    localidade.value = "";
    country.value = `Portugal`;
}

function ValidateForm() {
    // limpar labels de erro
    nameError.innerText = '';
    emailError.innerText = '';
    passwordError.innerText = '';
    addressError.innerText = '';
    var sucess = true;

    //Validar Nome
    if(name.value.length === 0) {
        nameError.innerText = '* Preenchimento obrigatório';
        sucess &= false;
    } else if (name.value.length > 0) {
        // Utilizar Regexp Para a primeira ser minuscula e ter um minimo de 4 letras do alfabeto
        const regEx_nome = /^[A-Z][A-Za-z]{3,}/;      
        if(!regEx_nome.test(name.value)) {
            nameError.innerText = ' * Colocar a primeira letra maiuscula e um minimo de 4 letras';
            sucess &= false;
        }
    }

    //Validar Email
    if(email.value.length === 0) {
        emailError.innerText = '* Preenchimento obrigatório';
        sucess &= false;
    } else if (email.value.length > 0) {
        // Max 30 caracters , @ , dominio com 20 letras minusculas max , . , codigo 2 letras minusculas
        const regEx_email = /^\w{1,30}\@[a-z]{1,20}.[a-z][a-z]$/; 
        if (!regEx_email.test(email.value)) {
            emailError.innerText = ' * Formato: nome@dominio.codigo_pais -> tudo em minusculas';
            sucess &=false;
        }
    }

    //Validar Password
    if(password.value.length === 0) {
        passwordError.innerText = '* Preenchimento obrigatório';
        sucess &= false;
    } else if (password.value.length > 0) {
        // Deve conter min 1 caracter especial, 1 letra maiuscula, tem mais de 8 caracters
        const regEx_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*(\d))(?=.*[\_\-\#\!\=])(?=.{8,})/; 
        if (!regEx_password.test(password.value)) {
            passwordError.innerText = ' * Formato errado. Insira por exemplo: E-123aberta4';
            sucess &=false;
        }

        // Verificar se existe pelo menos 4 numeros
        const regEx_num = /\d/; // se existir pelo menos 1 numero
        if(!regEx_num.test(password.value)){
            passwordError.innerText = ' * Formato errado. Insira por exemplo: E-123aberta4';
            sucess &=false;
        } else {
            const numbers = password.value.match(/\d/g).map(Number);
            if (numbers.length < 4) {
                passwordError.innerText = ' * Formato errado. Insira por exemplo: E-123aberta4';;
                sucess &=false;
            }
        }
    }

    //Validar Morada
    if(address.value.length === 0) {
        addressError.innerText = '* Preenchimento obrigatório';
        sucess &= false;
    } else if(address.value.length < 10) {
        // Pelo menos 10 caracters
        addressError.innerText = '* Insira pelo menos 10 caracters';
        sucess &= false;
    }
    return sucess;
}

function SaveData(dadosRegisto) {
    // primeiro verificar se existe um user com o mesmo nome
    const registosFromCookie = LerCookie('dadosRegisto');
    var user = false;
    var registos = [];

    if(registosFromCookie.length != 0) {
        registos = JSON.parse(registosFromCookie);
        user = registos.filter(function (item) {
            return item.name === dadosRegisto.name;
        }).length > 0;
    }

    if(user) {
        // Mostrar erro visto que ja existe
        nameError.innerText = ' * Utilizador já registado';
        return false;
    } else {
        // novo user ira ser adicionado
        registos.push(dadosRegisto);
        GuardarCookie('dadosRegisto', JSON.stringify(registos));
        return true;
    }
}