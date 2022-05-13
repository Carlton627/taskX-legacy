import { toast } from 'bulma-toast';

/**
 * This helper function renders an error message as a toast notification for the user using bulma-toast.
 * @param {string} errMessage error text to be displayed in the toast notification.
 * @author Carlton Rodrigues
 */
export const renderErrorToast = function (errMessage) {
    toast({
        message: errMessage,
        type: 'is-danger',
        position: 'top-right',
        duration: 2000,
        dismissible: true,
        closeOnClick: true,
        opacity: 0.8,
    });
};

/**
 * This helper function renders an success message as a toast notification for the user using bulma-toast.
 * @param {string} successMessage success text to be displayed in the toast notification.
 * @author Carlton Rodrigues
 */
export const renderSuccessToast = function (successMessage) {
    toast({
        message: successMessage,
        type: 'is-success',
        position: 'top-right',
        duration: 2000,
        dismissible: true,
        closeOnClick: true,
        opacity: 0.8,
    });
};

/**
 * This helper function returns a new date with time set to midnight.
 * @param {Date} date this parameter recieves a date
 * @param {number} hours this parameter recieves a number from 0 - 24 which decides the hour part of the time
 * @returns {Date} a date with time set 00:00:00 midnight
 * @author Carlton Rodrigues
 */
export const getDateWithMidnightTime = function (date = new Date(), hours = 0) {
    return new Date(date.setHours(hours, 0, 0, 0));
};

/**
 * This helper function pulls out a common markup for generating spinner for buttons in different views.
 * @param {string} btnText corrosponds to the text that the button should have.
 * @returns {string} html markup to be rendered to the button.
 * @author Carlton Rodrigues
 */
export const getBtnSpinnerMarkup = function (btnText) {
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
};
