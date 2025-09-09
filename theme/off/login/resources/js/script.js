// This script ensures that the user locale passed in from the application is saved against the user
// in cases where the user doesn't change the locale in Keycloak
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('ui_locales');
    if (lang) {
        const aTag = document.getElementById('kc-registration').getElementsByTagName('a')[0];
        aTag.setAttribute('href', `${aTag.getAttribute('href')}&kc_locale=${lang}`);
    }

    const cc = urlParams.get('cc');
    if (cc && cc !== 'world') {
        sessionStorage.setItem('country', cc);
    }
    const countrySelect = document.getElementById('country');
    if (countrySelect && !countrySelect.value) {
        const country = sessionStorage.getItem('country');
        if (country) {
            countrySelect.value = country;
        }
    }
});
