import TaskView from './taskView.js';

class TodoTasksView extends TaskView {
    constructor() {
        const parentElement = document.querySelector('.todo');
        super(parentElement);
    }

    addHandlerMarkTaskInProgress(handler) {
        const buttonSpinner = this._renderBtnSpinner;
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.mark__in-progress');
            if (!btn) return;
            const taskId = btn.dataset.id;
            btn.disabled = true;
            btn.innerHTML = buttonSpinner('Marking in progress');
            handler(taskId);
        });
    }

    _generateMarkup(renderTasks = true) {
        return `
            <div class="task-header level">
                <div class="level-left">
                    <h1 class="title is-2 level-item">Todos</h1>
                </div>
                ${renderTasks ? this._generateDeleteAllButton() : ''}
            </div>
            ${
                renderTasks
                    ? this._generateTasksMarkup({
                          btn: 'Mark in progress',
                          tagClassName: 'is-warning',
                          btnClassName: 'mark__in-progress',
                      })
                    : ''
            }
        `;
    }
}

export default new TodoTasksView();
