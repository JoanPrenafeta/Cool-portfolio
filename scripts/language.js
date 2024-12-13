let userLanguage = navigator.language || navigator.userLanguage;
var link = window.location.href;
if (!(link.includes("/ca/") ||  link.includes("/en/") || link.includes("/es/"))){
    let baseURL = link.split("/Cool-portfolio/")[0];
    baseURL += "/Cool-portfolio/"
    var basehtml = "";
    if (userLanguage == "es-ES" || userLanguage.includes("es")){
        basehtml="es";
    } 
    else if (userLanguage == "ca" || userLanguage.includes("ca")){
        basehtml="ca";
    }
    else{
        basehtml="en"
    }
    basehtml += "/index.html"

debugger

    window.open(baseURL+basehtml, '_self');
}

