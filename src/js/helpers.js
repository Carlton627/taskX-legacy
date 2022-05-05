import { toast } from 'bulma-toast';

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

export const getDateWithMidnightTime = function (date = new Date(), hours = 0) {
    return new Date(date.setHours(hours, 0, 0, 0));
};

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
