import TaskView from './taskView.js';
import _ from 'lodash';

class TodoTasksView extends TaskView {
    constructor() {
        const parentElement = document.querySelector('.todo');
        super(parentElement);
    }

    addHandlerMarkTaskInProgress(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.mark__in-progress');
            if (!btn) return;
            const taskId = btn.dataset.id;
            handler(taskId);
        });
    }

    _generateMarkup() {
        const markup = this._taskData
            .map(task => {
                if (!_.isEmpty(task))
                    return `
            <div class="card">
                    <div class="card-content">
                        <p class="subtitle is-6 tag is-warning">${task.status}</p>
                        <p class="title">${task.name}</p>
                        <div class="content">
                            ${task.description}
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="delete-task card-footer-item" data-id="${task.id}">Delete</button>
                        <button class="mark__in-progress card-footer-item" data-id="${task.id}">
                            Mark in progress
                        </button>
                    </div>
                </div>
        `;
            })
            .join('');

        return markup;
    }
}

export default new TodoTasksView();
