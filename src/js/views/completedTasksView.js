import TaskView from './taskView.js';
import _ from 'lodash';

class CompletedTasksView extends TaskView {
    constructor() {
        const parentElement = document.querySelector('.completed');
        super(parentElement);
    }

    _generateMarkup(renderTasks = true) {
        return `
            <div class="task-header level">
                <div class="level-left">
                    <h1 class="title is-2 level-item">Completed</h1>
                </div>
                ${renderTasks ? this._generateDeleteAllButton() : ''}
            </div>
            ${
                renderTasks
                    ? this._generateTasksMarkup({
                          btn: '',
                          tagClassName: 'is-success',
                          btnClassName: '',
                      })
                    : ''
            }
        `;
    }
}

export default new CompletedTasksView();
