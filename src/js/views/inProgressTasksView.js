import TaskView from './taskView.js';
import _ from 'lodash';

class InProgressTasksView extends TaskView {
    constructor() {
        const parentElement = document.querySelector('.in-progress');
        super(parentElement);
    }

    addHandlerMarkTaskCompleted(handler) {}

    _generateMarkup() {
        const markup = this._taskData
            .map(task => {
                if (!_.isEmpty(task))
                    return `
            <div class="card">
                    <div class="card-content">
                        <p class="subtitle is-6 tag is-info">${task.status}</p>
                        <p class="title">${task.name}</p>
                        <div class="content">
                            ${task.description}
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="delete-task card-footer-item" data-id="${task.id}">Delete</button>
                        <button class="card-footer-item">
                            Mark completed
                        </button>
                    </div>
                </div>
        `;
            })
            .join('');

        return markup;
    }
}

export default new InProgressTasksView();
