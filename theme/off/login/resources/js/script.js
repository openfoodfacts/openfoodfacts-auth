// This script ensures that the user locale passed in from the application is saved against the user
// in cases where the user doesn't change the locale in Keycloak
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('ui_locales');
    if (lang) {
        const aTag = document.getElementById('kc-registration').getElementsByTagName('a')[0];
        aTag.setAttribute('href', `${aTag.getAttribute('href')}&kc_locale=${lang}`);
    }
});
