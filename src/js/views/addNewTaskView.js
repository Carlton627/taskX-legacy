class AddNewTaskView {
    constructor() {
        this._parentElement = document.querySelector('.task-creator');
        this._overlay = document.querySelector('.overlay');
        this._btnCloseIcon = document.querySelector('.close-form');
        this._btnClose = document.querySelector('.btn-close');
        this._btnOpen = document.querySelector('.nav__btn--new-task');
        this._taskUploadForm = document.querySelector('.task-upload');
        this._addHandlerHideWindow();
        this._addHandlerShowWindow();
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._btnCloseIcon.addEventListener(
            'click',
            this.toggleWindow.bind(this)
        );
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    toggleWindow() {
        this._parentElement.classList.toggle('is-active');
        this._clearForm();
    }

    _clearForm() {
        this._taskUploadForm.reset();
    }

    addHandlerUploadTask(handler) {
        this._taskUploadForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);
            // clearing the form
            this.reset();
            handler(data);
        });
    }
}

export default new AddNewTaskView();
