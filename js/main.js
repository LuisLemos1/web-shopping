const user = document.getElementById("user");
const guest = document.getElementById("guest");
const greetings = document.getElementById("greetings");

function LoadUser() {
    const userCookie = LerCookie('utilizador');
    
    //verifica se exite alguem com login feito
    if (userCookie.length > 0) {
        const userLoggedIn = JSON.parse(userCookie);
        
        guest.style.display = "none";
        greetings.innerHTML = `
            Olá ${userLoggedIn.name}!
            <span id="sair" onclick="Logout()" style="cursor: pointer; font-weight: bold; font-size: small; color: darkblue; padding-left: 7px;"><u>Sair</u></span>
        `;
        user.style.display = "block";
        return true;
    }
    else {
        user.style.display = "none";
        guest.style.display = "block";
        return false;
    }
}

function Logout() {
    // Para efectuar o logout do utilizador simplesmente limpanhos a cookie e definimos a sua data de validade para -30 dias
    GuardarCookie('utilizador', "");
    
    // Limpar o local Storage
    localStorage.clear();

    // actualizar a pagina para o logout
    window.location.href = "index.html";
}