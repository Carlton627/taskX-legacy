import { errorMessages } from '../config.js';
import { getDateWithMidnightTime, getBtnSpinnerMarkup } from '../helpers.js';

class AddNewTaskView {
    constructor() {
        this._parentElement = document.querySelector('.task-creator');
        this._overlay = document.querySelector('.overlay');
        this._btnCloseIcon = document.querySelector('.close-form');
        this._btnClose = document.querySelector('.btn-close');
        this._btnOpen = document.querySelector('.nav__btn--new-task');
        this._taskUploadForm = document.querySelector('.task-upload');
        this._submitFormBtn = document.querySelector('.submit-form');
        this._deadlineCheckbox = document.querySelector('.deadline-checkbox');
        this._deadlineDateInput = document.querySelector('.deadline-date');
        this._startDateInput = document.querySelector('.start-date');
        this._startErrorContainerCurrentDate = document.querySelector(
            '.start-error-text-1'
        );
        this._startErrorContainerEndDate = document.querySelector(
            '.start-error-text-2'
        );
        this._endErrorContainerCurrentDate =
            document.querySelector('.end-error-text-1');
        this._endErrorContainerStartDate =
            document.querySelector('.end-error-text-2');
        this._formValidityState = {
            startDate: {
                currentDateValidity: true,
                lessThanEndDateValidity: true,
            },
            endDate: {
                currentDateValidity: false,
                greaterThanStartDateValidity: false,
            },
        };
        this._addHandlerHideWindow();
        this._addHandlerShowWindow();
        this._addHandlerToggleDeadline();
        this._addHandlerValidateStartDate();
        this._addHandlerValidateDeadline();
    }

    _toggleFields(enable = true) {
        // toggling the deadline input disabled attribute
        this._deadlineDateInput.disabled = !enable;

        // toggling the start date input disabled attribute
        this._startDateInput.disabled = !enable;

        // toggling the deadline input required attribute
        this._deadlineDateInput.required = enable;

        // toggling the submit form button disabled attribute
        this._submitFormBtn.disabled = enable;
    }

    // INFO: clearing all validations and date inputs when set deadline is toggled
    _clearDatesAndErrorsOnToggle() {
        this._startErrorContainerCurrentDate.textContent = '';
        this._startErrorContainerEndDate.textContent = '';
        this._endErrorContainerCurrentDate.textContent = '';
        this._endErrorContainerStartDate.textContent = '';
        this._startDateInput.value = '';
        this._deadlineDateInput.value = '';
    }

    _addHandlerToggleDeadline() {
        this._deadlineCheckbox.addEventListener('change', () => {
            if (this._deadlineCheckbox.checked) {
                this._toggleFields();
            } else {
                this._toggleFields(false);
                this._clearDatesAndErrorsOnToggle();
            }
        });
    }

    _setValidationError(dateElement, message, showError = true) {
        dateElement.textContent = message;
        showError
            ? dateElement.classList.remove('hidden')
            : dateElement.classList.add('hidden');
    }

    _validateLessThanCurrentDate(
        date,
        currentDate,
        errorContainer,
        errorMessage
    ) {
        if (date < currentDate) {
            this._setValidationError(errorContainer, errorMessage);
            return false;
        } else {
            this._setValidationError(errorContainer, '', false);
            return true;
        }
    }

    _validateStartDateGreaterThanEndDate(startDate) {
        const endDate = getDateWithMidnightTime(
            new Date(this._deadlineDateInput.value)
        );
        if (startDate > endDate) {
            this._setValidationError(
                this._startErrorContainerEndDate,
                errorMessages.startDate.startDateGreaterThanEndDate
            );
            this._formValidityState.startDate.lessThanEndDateValidity = false;
        } else {
            this._setValidationError(
                this._startErrorContainerEndDate,
                '',
                false
            );
            this._formValidityState.startDate.lessThanEndDateValidity = true;
        }
    }

    _validateEndDateLesserThanStartDate(endDate) {
        const startDate = getDateWithMidnightTime(
            new Date(this._startDateInput.value)
        );
        if (endDate < startDate) {
            this._setValidationError(
                this._endErrorContainerStartDate,
                errorMessages.endDate.endDateLessThanStartDate
            );
            this._formValidityState.endDate.greaterThanStartDateValidity = false;
        } else {
            this._setValidationError(
                this._endErrorContainerStartDate,
                '',
                false
            );
            this._formValidityState.endDate.greaterThanStartDateValidity = true;
        }
    }

    _checkFormValidity() {
        if (
            this._formValidityState.startDate.currentDateValidity &&
            this._formValidityState.startDate.lessThanEndDateValidity &&
            this._formValidityState.endDate.currentDateValidity &&
            this._formValidityState.endDate.greaterThanStartDateValidity
        ) {
            return false;
        } else {
            return true;
        }
    }

    _addHandlerValidateStartDate() {
        this._startDateInput.addEventListener('input', e => {
            const startDate = getDateWithMidnightTime(new Date(e.target.value));
            const currentDate = getDateWithMidnightTime();

            const isValidCurrentDate = this._validateLessThanCurrentDate(
                startDate,
                currentDate,
                this._startErrorContainerCurrentDate,
                errorMessages.startDate.lessThanCurrentDate
            );

            this._formValidityState.startDate.currentDateValidity =
                isValidCurrentDate;

            if (this._deadlineDateInput.value) {
                this._validateStartDateGreaterThanEndDate(startDate);
                this._validateEndDateLesserThanStartDate(
                    getDateWithMidnightTime(
                        new Date(this._deadlineDateInput.value)
                    )
                );
            }

            this._submitFormBtn.disabled = this._checkFormValidity();
        });
    }

    _addHandlerValidateDeadline() {
        this._deadlineDateInput.addEventListener('input', e => {
            const endDate = getDateWithMidnightTime(new Date(e.target.value));
            const currentDate = getDateWithMidnightTime();

            const isValidCurrentDate = this._validateLessThanCurrentDate(
                endDate,
                currentDate,
                this._endErrorContainerCurrentDate,
                errorMessages.endDate.lessThanCurrentDate
            );

            this._formValidityState.endDate.currentDateValidity =
                isValidCurrentDate;

            if (this._startDateInput.value) {
                this._validateEndDateLesserThanStartDate(endDate);
                this._validateStartDateGreaterThanEndDate(
                    getDateWithMidnightTime(
                        new Date(this._startDateInput.value)
                    )
                );
            } else {
                this._formValidityState.endDate.greaterThanStartDateValidity = true;
            }

            this._submitFormBtn.disabled = this._checkFormValidity();
        });
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this._toggleWindow.bind(this));
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this._toggleWindow.bind(this));
        this._btnCloseIcon.addEventListener(
            'click',
            this._toggleWindow.bind(this)
        );
        this._overlay.addEventListener('click', this._toggleWindow.bind(this));
    }

    _toggleWindow() {
        this._parentElement.classList.toggle('is-active');
        this._clearForm();
    }

    _clearForm() {
        this._taskUploadForm.reset();
    }

    _renderBtnSpinner(btnText) {
        return getBtnSpinnerMarkup(btnText);
    }

    toggleSubmitButtonState(state) {
        this._submitFormBtn.disabled = state;
        let btnDisplay;
        state
            ? (btnDisplay = this._renderBtnSpinner('Adding Task'))
            : (btnDisplay = 'Submit');
        this._submitFormBtn.innerHTML = btnDisplay;
    }

    addHandlerUploadTask(handler) {
        const resetFormState = this._toggleFields.bind(this);
        this._taskUploadForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const dataArr = [...new FormData(this)];
            let data = Object.fromEntries(dataArr);
            !data?.setDeadline
                ? (data.setDeadline = false)
                : (data.setDeadline = true);
            // clearing the form
            this.reset();
            if (data?.setDeadline) resetFormState(false);
            handler(data);
        });
    }
}

export default new AddNewTaskView();
