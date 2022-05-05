import _ from 'lodash';
import { getDateWithMidnightTime, getBtnSpinnerMarkup } from '../helpers.js';

export default class TaskView {
    _taskData;
    constructor(parentElement) {
        this._parentElement = parentElement;
        this._loadingSpinner = document.querySelector('.spinner');
    }

    render(data) {
        if (!data || (Array.isArray(data) && data.length === 0))
            return this._renderNoTasks();
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
        return getBtnSpinnerMarkup(btnText);
    }

    _generateDeleteAllButton() {
        return `
        <div class="level-right">
                    <button class="button delete-all is-danger is-light level-item">Delete all</button>
                </div>
                `;
    }

    // TODO: check for all conditions
    // Does it have a startsOn greater than current date
    // Does it have a startsOn = current date or no startsOn at all
    // Did the current date go beyond endDate

    _findDaysLeft(dateDiff) {
        return Math.ceil(dateDiff / (1000 * 3600 * 24));
    }

    _generateDeadlineMarkup(taskData) {
        // dateDiff = startDate/deadlineDate - currentDate
        const currentDate = getDateWithMidnightTime();
        const deadline = getDateWithMidnightTime(new Date(taskData?.deadline));
        let startDateExists = false;
        let dateMessage = '';
        let styleClass = '';
        if (taskData?.startsOn) {
            const startDate = getDateWithMidnightTime(
                new Date(taskData?.startsOn)
            );
            if (startDate > currentDate) {
                // task has not started yet
                const daysLeft = this._findDaysLeft(startDate - currentDate);
                dateMessage =
                    daysLeft > 1
                        ? `Starts in ${daysLeft} days`
                        : 'Starts Tomorrow';
                startDateExists = true;
            }
        }
        if (!startDateExists) {
            if (deadline >= currentDate) {
                // task has not reached its deadline
                const daysLeft = this._findDaysLeft(deadline - currentDate);
                dateMessage = daysLeft ? `${daysLeft} days left` : 'Due Today';
                styleClass = 'text-green';
            } else {
                // task deadline expired
                dateMessage = 'Deadline crossed';
                styleClass = 'text-red';
            }
        }
        return `
            <span class="deadline ${styleClass}">
                <i class="fa-regular fa-clock"></i>
                ${dateMessage}
            </span>
        `;
    }

    _generateTasksMarkup(properties) {
        const markup = this._taskData
            .map(task => {
                if (!_.isEmpty(task))
                    return `
            <div class="card task-card">
                    <div class="card-content">
                        <div class="level">
                            <div class="level-left">
                                <div class="level-item">
                                    <p class="subtitle is-6 tag ${
                                        properties.tagClassName
                                    }">${
                        task.status === 'inProgress'
                            ? task.status.split('P').join(' p')
                            : task.status
                    }</p>
                                </div>
                            </div>
                            <div class="level-right">
                                <div class="level-item">
                                    ${
                                        task.setDeadline
                                            ? this._generateDeadlineMarkup(task)
                                            : ''
                                    }
                                </div>
                            </div>
                        </div>
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
