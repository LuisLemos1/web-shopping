const login = document.getElementById("login");
const name = document.getElementById("name");
const password = document.getElementById("password");
const errorLogin = document.getElementById("errorLogin");

// Limpar campo de erro
errorLogin.innerHTML = "";

function Login() {
    // voltar a limpar, para varias tentativas e validar
    errorLogin.innerHTML = "";
    if (SucessLogin(name.value, password.value)) {
        window.location.href = "./index.html";
    }
    else {
        errorLogin.innerText = "Nome de utilizador ou palavra chave inválidos!";
    }
}

function SucessLogin(name, password) {
    // Procurar nos registos 
    const registosFromCookie = LerCookie('dadosRegisto')/**/;
    
    if (registosFromCookie.length != 0) {
        const registos = JSON.parse(registosFromCookie);

        // devolver na lista se encontrar
        const tempUser = registos.filter(function (key) {
            return (/**/key.name === name && key.password === password);
        });

        // se encontrar, entao guarda uma cookie com o utilizador
        if (tempUser.length > 0) {
            const user = new Utilizador(name, password);
            GuardarCookie('utilizador', JSON.stringify(user));
            return true;
        }
    }
    return false;
}