class NavButtonsView {
    constructor() {
        this._btnLogin = document.querySelector('.button-login');
        this._userSignedIn = document.querySelectorAll('.user-signed-in');
        this._taskList = document.querySelector('.task-list');
        this._banner = document.querySelector('.banner');
        this._footer = document.querySelector('.footer');
        this._userSection = document.querySelector('.username');
    }

    renderUserSignedInButtons() {
        this._banner.classList.add('hidden');
        this._userSignedIn.forEach(element =>
            element.classList.remove('hidden')
        );
        this._btnLogin.classList.add('hidden');
        this._taskList.classList.remove('hidden');
        this._footer.classList.add('hidden');
    }

    toggleLoginBtnState(state) {
        this._btnLogin.disabled = state;
    }

    renderSignInButton() {
        this._btnLogin.classList.remove('hidden');
        this._userSignedIn.forEach(element => element.classList.add('hidden'));
        this._banner.classList.remove('hidden');
        this._footer.classList.remove('hidden');
        this._taskList.classList.add('hidden');
    }

    renderUserSection(userName, imgUrl) {
        const markup = this._generateUserSectionMarkup(userName, imgUrl);
        this._userSection.innerHTML = markup;
    }

    _generateUserSectionMarkup(username = 'user', imgUrl) {
        return `
        Hi ${username} &nbsp;
            <img
                src="${imgUrl}"
                alt=""
                class="user-img"
                
            />
        `;
    }
}

export default new NavButtonsView();
