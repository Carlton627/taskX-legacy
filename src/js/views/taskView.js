import _ from 'lodash';

export default class TaskView {
    _taskData;
    constructor(parentElement) {
        this._parentElement = parentElement;
        this._loadingSpinner = document.querySelector('.spinner');
    }

    render(data) {
        if (!data || (Array.isArray(data) && data.length === 0))
            return this._renderNoTasks(); // error message here
        this._taskData = data;
        const markup = this._generateMarkup();
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    _renderNoTasks() {
        const markup = this._generateMarkup(false);
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderSpinner() {
        this._loadingSpinner.classList.remove('hidden');
    }

    hideSpinner() {
        this._loadingSpinner.classList.add('hidden');
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    addHandlerDeleteTask(handler) {
        const buttonSpinner = this._renderBtnSpinner;
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.delete-task');
            if (!btn) return;
            const taskId = btn.dataset.id;
            btn.disabled = true;
            btn.innerHTML = buttonSpinner('Delete');
            handler(this, taskId);
        });
    }

    addHandlerDeleteAllTasks(handler) {
        const buttonSpinner = this._renderBtnSpinner;
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.delete-all');
            if (!btn) return;
            btn.disabled = true;
            btn.innerHTML = buttonSpinner('Working');
            handler(this);
        });
    }

    _renderBtnSpinner(btnText) {
        return `
                <div class="level">
                    <div class="level-left">
                        <span class="level-item">${btnText}</span>
                    </div>
                    &nbsp;
                    <div class="level-right">
                        <i class="fa-solid fa-spinner fa-pulse level-item"></i>
                    </div>
                </div>
            `;
    }

    _generateDeleteAllButton() {
        return `
        <div class="level-right">
                    <button class="button delete-all is-danger is-light level-item">Delete all</button>
                </div>
                `;
    }

    _generateTasksMarkup(properties) {
        const markup = this._taskData
            .map(task => {
                if (!_.isEmpty(task))
                    return `
            <div class="card task-card">
                    <div class="card-content">
                        <p class="subtitle is-6 tag ${
                            properties.tagClassName
                        }">${task.status}</p>
                        <p class="title">${task.name}</p>
                        <div class="content">
                            ${task.description}
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="delete-task card-footer-item" data-id="${
                            task.id
                        }">Delete</button>
                        ${
                            properties.btn
                                ? this._generateTransitionBtn(
                                      properties.btn,
                                      properties.btnClassName,
                                      task.id
                                  )
                                : ''
                        }
                    </div>
                </div>
        `;
            })
            .join('');

        return markup;
    }

    _generateTransitionBtn(btn, btnClassName, taskId) {
        return `<button class="${btnClassName} card-footer-item" data-id="${taskId}">
                    ${btn}
                </button>`;
    }

    _generateMarkup() {}
}
