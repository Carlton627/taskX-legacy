export default class TaskView {
    _taskData;
    constructor(parentElement) {
        this._parentElement = parentElement;
        this._taskList = document.querySelector('.task-list');
    }

    render(data) {
        if (!data || (Array.isArray(data) && data.length === 0))
            return this._clear(); // error message here
        this._taskData = data;
        const markup = this._generateMarkup();
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderSpinner() {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;
        this._clear();
        this._taskList.insertAdjacentElement('afterbegin', markup);
    }

    _clear() {
        this._parentElement.innerHTML = '';
        // this._taskList.innerHTML = '';
    }

    // TODO: add delete animation by selecting the card element
    addHandlerDeleteTask(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.delete-task');
            if (!btn) return;
            const taskId = btn.dataset.id;
            handler(this, taskId);
        });
    }

    _generateMarkup() {}
}
