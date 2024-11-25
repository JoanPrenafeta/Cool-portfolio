let userLanguage = navigator.language || navigator.userLanguage;
let baseURL = "https://joanprenafeta.github.io/Cool-portfolio/";
var basehtml = "index.html";
if (userLanguage == "es-ES" || userLanguage.includes("es")){
    basehtml="index_ES.html";
} 
else if (userLanguage == "ca" || userLanguage.includes("ca")){
    basehtml="index_CA.html";
}
var link = window.location.href;
if (!link.includes(basehtml) && link.includes("joanprenafeta.github.io/")){
    window.open(baseURL+basehtml, '_self');
}

