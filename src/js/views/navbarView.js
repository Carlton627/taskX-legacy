class NavbarView {
    constructor() {
        this._parentElement = document.querySelector('.navbar-main');
    }

    addHandlerSignIn(handler) {
        this._parentElement.addEventListener('click', function (e) {
            e.preventDefault();
            const btn = e.target.closest('.button-login');
            if (!btn) return;
            handler();
        });
    }

    addHandlerSignOut(handler) {
        this._parentElement.addEventListener('click', function (e) {
            e.preventDefault();
            const btn = e.target.closest('.button-logoff');
            if (!btn) return;
            handler();
        });
    }
}

export default new NavbarView();
