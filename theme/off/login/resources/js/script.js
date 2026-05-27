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

    initUsernameAvailability();
});

// Live username-availability indicator on the registration page. Debounced fetch to the
// unauthenticated /realms/{realm}/off/username-available endpoint; result renders into a
// sibling div under the username input. Translated strings come from data-msg-* attributes
// set in user-profile-commons.ftl.
function initUsernameAvailability() {
    const usernameInput = document.getElementById('username');
    const registerForm = document.getElementById('kc-register-form');
    if (!usernameInput || !registerForm) return;

    const realmPath = window.location.pathname.match(/^(\/realms\/[^/]+)/);
    if (!realmPath) return;

    const messages = {
        available: usernameInput.dataset.msgAvailable || '',
        taken: usernameInput.dataset.msgTaken || '',
        checking: usernameInput.dataset.msgChecking || '',
    };

    const indicator = document.createElement('div');
    indicator.id = 'username-availability';
    indicator.className = 'username-availability';
    indicator.setAttribute('aria-live', 'polite');
    usernameInput.parentElement.after(indicator);

    let debounceTimer;
    let abortController;

    const setState = (state) => {
        indicator.className = state ? `username-availability username-availability--${state}` : 'username-availability';
        indicator.textContent = state ? messages[state] : '';
    };

    const check = async (value) => {
        if (abortController) abortController.abort();
        abortController = new AbortController();
        try {
            const response = await fetch(`${realmPath[1]}/off/username-available?u=${encodeURIComponent(value)}`, { signal: abortController.signal });
            if (!response.ok) return;
            const data = await response.json();
            if (value !== usernameInput.value) return;
            setState(data.available ? 'available' : 'taken');
        } catch (e) {
            // Network error or aborted — fail silent; form submission will catch any real collision.
        }
    };

    usernameInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const value = usernameInput.value;
        if (!value) {
            setState('');
            return;
        }
        setState('checking');
        debounceTimer = setTimeout(() => check(value), 300);
    });
}
