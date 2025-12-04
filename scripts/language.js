let userLanguage = navigator.language || navigator.userLanguage;
let DEFAULT_LANG = 'ca';
var link = window.location.href;
let translationsMap = new Map();

function loadTranslations(langCode) {
    const filePath = "https://joanprenafeta.github.io/Cool-portfolio/translations/"+langCode+".xml";
    const xhr = new XMLHttpRequest();
    xhr.open('GET', filePath, true); 
    xhr.onload = function () {
        if (xhr.status === 200 || (xhr.status === 0 && filePath.startsWith('file:'))) {
            const xmlDoc = xhr.responseXML;
            if (xmlDoc) {
                processXML(xmlDoc);
            } else {
                console.error("Error: XMLHttpRequest. Error while parsing.");
            }
        } else {
            console.error("Error reading file: '"+filePath+"'.");
        }
    };
    
    xhr.onerror = function () {
        console.error("Error de xarxa en carregar el fitxer XML.");
    };

    xhr.send(null);
}

function processXML(xmlDoc) {
    translationsMap.clear(); 
    const strings = xmlDoc.querySelectorAll('string'); 
    
    strings.forEach(str => {
        const id = str.getAttribute('id');
        const text = str.textContent;
        translationsMap.set(id, text);
    });
    
    applyTranslations();
}

function applyTranslations() {
    const elementsToTranslate = document.querySelectorAll('[data-i18n-key]');
    
    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-i18n-key');
        const translation = translationsMap.get(key);
        
        if (translation) {
            const targetAttr = element.getAttribute('data-i18n-attr');
            
            if (targetAttr) {
                element.setAttribute(targetAttr, translation);
            } else if (element.tagName.toLowerCase() === 'title') {
                document.title = translation; 
            } else {
                element.innerHTML = translation;
            }
        }
    });
}

function getInitialLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang) {
        localStorage.setItem('userLang', urlLang);
        return urlLang;
    }
    
    const preferredLang = localStorage.getItem('userLang');
    if (preferredLang) {
        return preferredLang;
    }

    return DEFAULT_LANG;
}

function changeLanguage(newLangCode) {
    loadTranslations(newLangCode);
    localStorage.setItem('userLang', newLangCode); 

    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLangCode);
    window.history.pushState({ path: url.href }, '', url.href);
    
    updateLanguageSelector(newLangCode);
}

function updateLanguageSelector(currentLang) {
    $(".language-selector a").each(function(){
        if (this.attributes['lang'].value == currentLang) {
            this.setAttribute('aria-selected', 'true');
        } else {
            this.removeAttribute('aria-selected');
        }
    })
    $("html").attr("lang", currentLang)
}

document.addEventListener('DOMContentLoaded', () => {
    const initialLang = getInitialLanguage(); 
    loadTranslations(initialLang);
    updateLanguageSelector(initialLang); 
});