
var generarPaletaCSS = function(accesibilityLevel, primaryColor, secondaryColor = "") {
    //funcions
    var hexToHSL = function(H) {
        // Convert hex to RGB first
        let r = 0,
            g = 0,
            b = 0;
        if (H.length == 4) {
            r = "0x" + H[1] + H[1];
            g = "0x" + H[2] + H[2];
            b = "0x" + H[3] + H[3];
        } else if (H.length == 7) {
            r = "0x" + H[1] + H[2];
            g = "0x" + H[3] + H[4];
            b = "0x" + H[5] + H[6];
        }
        // Then to HSL
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        if (delta == 0)
            h = 0;
        else if (cmax == r)
            h = ((g - b) / delta) % 6;
        else if (cmax == g)
            h = (b - r) / delta + 2;
        else
            h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        if (h < 0)
            h += 360;

        l = (cmax + cmin) / 2;
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return [h, s, l];
    }

    var HSLToHex = function(h, s, l) {
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (60 <= h && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (120 <= h && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (180 <= h && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (240 <= h && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else if (300 <= h && h < 360) {
            r = c;
            g = 0;
            b = x;
        }
        // Having obtained RGB, convert channels to hex
        r = Math.round((r + m) * 255).toString(16);
        g = Math.round((g + m) * 255).toString(16);
        b = Math.round((b + m) * 255).toString(16);

        // Prepend 0s, if necessary
        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;

        return "#" + r + g + b;
    }

    var ContrastCheck = function(hex) { //false = light; true = dark
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        //return (r + g + b <= 382.5);
        return (ContrastAccesibility(hex, "#000000") > ContrastAccesibility(hex, "#FFFFFF"));
    }

    var ContrastAccesibility = function(Color1, Color2) {
        var fnlluminositatColor = function(color) {
            var r = parseInt(color.slice(1, 3), 16);
            var g = parseInt(color.slice(3, 5), 16);
            var b = parseInt(color.slice(5, 7), 16);

            r = r / 255;
            g = g / 255;
            b = b / 255;
            if (r > 0.03928) { r = Math.pow(((r + 0.055) / 1.055), 2.4) } else { r = r / 12.92 }
            if (g > 0.03928) { g = Math.pow(((g + 0.055) / 1.055), 2.4) } else { g = g / 12.92 }
            if (b > 0.03928) { b = Math.pow(((b + 0.055) / 1.055), 2.4) } else { b = b / 12.92 }

            var result = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
            return result;
        }
        var lum1 = fnlluminositatColor(Color1);
        var lum2 = fnlluminositatColor(Color2);
        if (lum2 > lum1) {
            return (lum2 + 0.05) / (lum1 + 0.05)
        }
        return (lum1 + 0.05) / (lum2 + 0.05)
    }

    var ajustarLluminositatColor = function(color, percent, force = false) {
        var colorHSL = hexToHSL(color);
        if (colorHSL[2] > percent && percent > 50 && !force) {
            colorHSL[2] = 100 - ((100 - colorHSL[2]) / 2)
        } else if (colorHSL[2] <= percent && percent <= 50 && !force) {
            colorHSL[2] = colorHSL[2] / 2;
        } else {
            colorHSL[2] = percent;
        }
        return HSLToHex(colorHSL[0], colorHSL[1], colorHSL[2]);
    }
    var generateColorScale = function(H, S, L, steps) {
        var palette = [];

        var L1 = L;
        for (i = 0; i < steps; i++) {
            L1 = i * (100 / steps);
            if (L1 == 0) L1 = 5;
            else if (L1 == 100) L1 = 98;

            palette.push(HSLToHex(H, S, L1));
        }
        return palette;
    }
    var SuggerirColors = function(colorFixed, colorVariable, accesibilityLevel) {
        var colorVariableHSL = hexToHSL(colorVariable);
        var contrastLum = 500;
        var result = "";
        var contrast = 0;
        if (accesibilityLevel == "A") contrast = 3;
        else if (accesibilityLevel == "AA") contrast = 4.5;
        else if (accesibilityLevel == "AAA") contrast = 7;

        var generateFullColorScale = function(H, S, L, steps) {
            var palette = [];

            var L1 = L;
            for (i = 0; i < steps; i++) {
                L1 = i * (100 / steps);
                palette.push(HSLToHex(H, S, L1));
            }
            return palette;
        }

        var colorPalette = generateColorScale(colorVariableHSL[0], colorVariableHSL[1], colorVariableHSL[2], 100);

        if ((colorFixed == "#ffffff" || colorFixed == "#000000") && (colorVariable == "#ffffff" || colorVariable == "#000000")) {
            if (colorFixed == "#000000") {
                for (x = 0; x <= 100; x++) {
                    var tmpColor = ajustarLluminositatColor(colorVariable, x, true);
                    if (ContrastAccesibility(tmpColor, colorFixed) > contrast) {
                        return tmpColor;
                    }
                }
            } else {
                for (x = 100; x >= 0; x--) {
                    var tmpColor = ajustarLluminositatColor(colorVariable, x, true);
                    if (ContrastAccesibility(tmpColor, colorFixed) > contrast) {
                        return tmpColor;
                    }
                }
            }
        }

        if (ContrastCheck(colorFixed)) {
            //dark
            for (x = colorPalette.length - 1; x >= 0; x--) {
                var dif = ContrastAccesibility(colorPalette[x], colorFixed);

                if (dif >= contrast) {
                    var tmpcolor = hexToHSL(colorPalette[x]);
                    var TmpDif = Math.abs(tmpcolor[2] - colorVariableHSL[2]);
                    if (TmpDif < contrastLum) {
                        contrastLum = TmpDif;
                        result = colorPalette[x];
                    }
                }
            }
        } else {
            //light
            for (x = 0; x < colorPalette.length; x++) {
                var dif = ContrastAccesibility(colorPalette[x], colorFixed);

                if (dif >= contrast) {
                    var tmpcolor = hexToHSL(colorPalette[x]);
                    var TmpDif = Math.abs(tmpcolor[2] - colorVariableHSL[2]);
                    if (TmpDif < contrastLum) {
                        contrastLum = TmpDif;
                        result = colorPalette[x];
                    }
                }
            }
        }

        return result;
    }

    //end funcions
    var contrast = 0;
    if (accesibilityLevel == "A") contrast = 3;
    else if (accesibilityLevel == "AA") contrast = 4.5;
    else if (accesibilityLevel == "AAA") contrast = 7;

    if (secondaryColor == "") secondaryColor = primaryColor;

    var textColor = ajustarLluminositatColor(primaryColor, 5, true);
    if (ContrastAccesibility(textColor, "#ffffff") < contrast) {
        textColor = ajustarLluminositatColor(primaryColor, 1, true);
    }

    document.documentElement.style.setProperty('--primary-brand', primaryColor);
    document.documentElement.style.setProperty('--secondary-brand', secondaryColor);
    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--text-white', "#ffffff");

    //Color alt contrast
    var primaryContrastHSL = hexToHSL(primaryColor);
    var primaryContrast = HSLToHex(primaryContrastHSL[0], 5, 99);
    if (ContrastCheck(primaryColor)) {
        primaryContrast = HSLToHex(primaryContrastHSL[0], 5, 1);
    }
    
    var secondaryContrastHSL = hexToHSL(secondaryColor);
    var secondaryContrast = HSLToHex(secondaryContrastHSL[0], 5, 99);
    if (ContrastCheck(secondaryColor)) {
        secondaryContrast = HSLToHex(secondaryContrastHSL[0], 5, 1);
    }
    document.documentElement.style.setProperty('--primary-contrast', primaryContrast);
    document.documentElement.style.setProperty('--secondary-contrast', secondaryContrast);


    //Color de fons segons nivell d'accessibilitat (contrast minim d'un nivell inferior)
    var bgPrimary = primaryColor;
    var bgSecondary = secondaryColor;
    if (contrast >= 4.5) {
        var outerContrast = 3;
        if (accesibilityLevel == "AAA") outerContrast = 4.5;
        if (ContrastAccesibility(bgPrimary, "#ffffff") < outerContrast) {
            bgPrimary = SuggerirColors('#ffffff', primaryColor, accesibilityLevel.slice(0, accesibilityLevel.length - 1));
        }
        if (ContrastAccesibility(bgSecondary, "#ffffff") < outerContrast) {
            bgSecondary = SuggerirColors('#ffffff', secondaryColor, accesibilityLevel.slice(0, accesibilityLevel.length - 1))
        }
    }

    document.documentElement.style.setProperty('--primary-bg', bgPrimary);
    document.documentElement.style.setProperty('--secondary-bg', bgSecondary);

    //Color de text de colors amb contrast minim;
    var textPrimary = primaryColor;
    if (ContrastAccesibility(textPrimary, "#ffffff") < contrast) {
        textPrimary = SuggerirColors('#ffffff', primaryColor, accesibilityLevel);
        if (textPrimary == '') {
            textPrimary = ajustarLluminositatColor(primaryColor, 70);
        }
    }
    var textSecondary = secondaryColor;
    if (ContrastAccesibility(textSecondary, "#ffffff") < contrast) {
        textSecondary = SuggerirColors('#ffffff', secondaryColor, accesibilityLevel);
        if (textSecondary == '') {
            textSecondary = ajustarLluminositatColor(secondaryColor, 70);
        }
    }
    document.documentElement.style.setProperty('--primary-text', textPrimary);
    document.documentElement.style.setProperty('--secondary-text', textSecondary);

    //Variacio de colors
    var primaryDarkMinimum = SuggerirColors('#ffffff', primaryColor, accesibilityLevel);
    if (primaryDarkMinimum == '') {
        primaryDarkMinimum = ajustarLluminositatColor(primaryColor, 30);
    }
    var primaryDark = ajustarLluminositatColor(primaryColor, 20);
    var primaryLightMinimum = SuggerirColors('#000000', primaryColor, accesibilityLevel);
    if (primaryLightMinimum == '') {
        primaryLightMinimum = ajustarLluminositatColor(primaryColor, 70);
    }
    var primaryLight = ajustarLluminositatColor(primaryColor, 80);

    var secondaryDarkMinimum = SuggerirColors('#ffffff', secondaryColor, accesibilityLevel);
    if (secondaryDarkMinimum == '') {
        secondaryDarkMinimum = ajustarLluminositatColor(secondaryColor, 30);
    }
    var secondaryDark = ajustarLluminositatColor(secondaryColor, 20);
    var secondaryLightMinimum = SuggerirColors('#000000', secondaryColor, accesibilityLevel);
    if (secondaryLightMinimum == '') {
        secondaryLightMinimum = ajustarLluminositatColor(secondaryColor, 70);
    }

    var secondaryLight = ajustarLluminositatColor(secondaryColor, 80);

    document.documentElement.style.setProperty('--primary-dark', primaryDark);
    document.documentElement.style.setProperty('--primary-dark-min', primaryDarkMinimum);
    document.documentElement.style.setProperty('--primary-light', primaryLight);
    document.documentElement.style.setProperty('--primary-light-min', primaryLightMinimum);
    document.documentElement.style.setProperty('--secondary-dark', secondaryDark);
    document.documentElement.style.setProperty('--secondary-dark-min', secondaryDarkMinimum);
    document.documentElement.style.setProperty('--secondary-light', secondaryLight);
    document.documentElement.style.setProperty('--secondary-light-min', secondaryLightMinimum);


    //grayScale
    var primaryHSL = hexToHSL(primaryColor);
    var white = HSLToHex(primaryHSL[0], 10, 100);
    var grayscale0 = HSLToHex(primaryHSL[0], 10, 99);
    var grayscale1 = HSLToHex(primaryHSL[0], 10, 80);
    var grayscale2 = HSLToHex(primaryHSL[0], 10, 60);
    var grayscale3 = HSLToHex(primaryHSL[0], 10, 40);
    var grayscale4 = HSLToHex(primaryHSL[0], 10, 20);
    var grayscale5 = HSLToHex(primaryHSL[0], 10, 5);

    document.documentElement.style.setProperty('--white', white);
    document.documentElement.style.setProperty('--gray-scale-0', grayscale0);
    document.documentElement.style.setProperty('--gray-scale-1', grayscale1);
    document.documentElement.style.setProperty('--gray-scale-2', grayscale2);
    document.documentElement.style.setProperty('--gray-scale-3', grayscale3);
    document.documentElement.style.setProperty('--gray-scale-4', grayscale4);
    document.documentElement.style.setProperty('--gray-scale-5', grayscale5);
}

var hexFormatChecker = function(color) {
    if (color.length > 0) {
        let regEx = /^[0-9a-fA-F]+$/;
        color = color.replaceAll("#", "")
        let isHex = regEx.test(color);

        if (!isHex) {
            color = color.slice(0, -1);
        }

        if (color.length > 6) {
            color = color.slice(0, 6)
        }

        if (color.length > 0 && color.charAt(0) != "#") {
            color = "#" + color;
        }
    }
    return color
};

var hexToHSL = function(H) {
    // Convert hex to RGB first
    let r = 0,
        g = 0,
        b = 0;
    if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [h, s, l];
}

var HSLToHex = function(h, s, l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);

    // Prepend 0s, if necessary
    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    return "#" + r + g + b;
}

var starterPrimary = HSLToHex(Math.floor(Math.random() * (360 - 0 + 1)) + 0, Math.floor(Math.random() * (100 - 60 + 1)) + 50, Math.floor(Math.random() * (80 - 20 + 1)) + 20);
generarPaletaCSS("AA", starterPrimary);


const userLang = navigator.language || navigator.userLanguage;
console.log("L'idioma preferit de l'usuari és:", userLang);