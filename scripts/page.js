var starterPrimary = new Color(Colors.randomColor());
//generarPaletaCSS("AA", starterPrimary.hex);
var pagePalette = Colors.generatePalette(starterPrimary.hex);

document.documentElement.style.setProperty('--primary-brand', pagePalette.basic.hex);
document.documentElement.style.setProperty('--primary-dark', pagePalette.dark.hex);
document.documentElement.style.setProperty('--primary-dark-min', pagePalette.darkMin.hex);
document.documentElement.style.setProperty('--primary-light', pagePalette.light.hex);
document.documentElement.style.setProperty('--primary-light-min', pagePalette.lightMin.hex);
