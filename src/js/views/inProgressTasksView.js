import TaskView from './taskView.js';

class InProgressTasksView extends TaskView {
    constructor() {
        const parentElement = document.querySelector('.in-progress');
        super(parentElement);
    }

    addHandlerMarkTaskCompleted(handler) {
        const buttonSpinner = this._renderBtnSpinner;
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.mark__completed');
            if (!btn) return;
            const taskId = btn.dataset.id;
            btn.disabled = true;
            btn.innerHTML = buttonSpinner('Marking complete');
            handler(taskId);
        });
    }

    _generateMarkup(renderTasks = true) {
        return `
            <div class="task-header level">
                <div class="level-left">
                    <h1 class="title is-2 level-item">In - Progress</h1>
                </div>
                ${renderTasks ? this._generateDeleteAllButton() : ''}
            </div>
            ${
                renderTasks
                    ? this._generateTasksMarkup({
                          btn: 'Mark completed',
                          tagClassName: 'is-info',
                          btnClassName: 'mark__completed',
                      })
                    : ''
            }
        `;
    }
}

export default new InProgressTasksView();
