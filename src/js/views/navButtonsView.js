class NavButtonsView {
    constructor() {
        this._parentElement = document.querySelector('.buttons');
        this._btnLogin = document.querySelector('.button-login');
        this._userSignedIn = document.querySelector('.user-signed-in');
        this._taskList = document.querySelector('.task-list');
    }

    renderUserSignedInButtons() {
        this._userSignedIn.classList.remove('hidden');
        this._btnLogin.classList.add('hidden');
        this._taskList.classList.remove('hidden');
    }

    renderSignInButton() {
        this._btnLogin.classList.remove('hidden');
        this._userSignedIn.classList.add('hidden');
        this._taskList.classList.add('hidden');
    }
}

export default new NavButtonsView();
