class Utilizador {
    constructor(name, password) {
        this.name = name;
        this.password = password;
    }
}

class DadosRegisto {
    constructor(name, email, password, address, postCode, localidade, country) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.address = address;
        this.postCode = postCode;
        this.localidade = localidade;
        this.country = country;
    }
}

/* Funcao Ler/Guardar Cookies do manual */
function GuardarCookie(n,v) {
    var exp = '';
    if(DuracaoCookieDias > 0) {
        var now = new Date();
        then = now.getTime() + (DuracaoCookieDias * 24 * 60 * 60 * 1000);
        now.setTime(then);
        exp = '; expires=' + now.toGMTString();
        }
        // escape codifica um string / unescape descodifica-o
    document.cookie = n + "=" + escape(String(v)) + '; path=/' + exp;
}

DuracaoCookieDias = 10;

function LerCookie(cookie) {
    var cookieConteudo = new String();

    if(document.cookie.length > 0) {
        var cookieNome = `${cookie}=`;
        var cookieInicio = document.cookie.indexOf(cookieNome);
        var cookieFim = 0;
        if(cookieInicio > -1) {
            cookieInicio += cookieNome.length;
            cookieFim = document.cookie.indexOf(";",cookieInicio);
            if(cookieFim < cookieInicio) { 
                cookieFim = document.cookie.length; 
            }
            cookieConteudo = document.cookie.substring(cookieInicio, cookieFim);
        }
    }
    return unescape(cookieConteudo);
}

function GetUser() {
    var user = new Utilizador();
    const utilizadorFromCookie = LerCookie('utilizador');
    if (utilizadorFromCookie.length != 0) {
        user = JSON.parse(utilizadorFromCookie);
    }

    return user;
}