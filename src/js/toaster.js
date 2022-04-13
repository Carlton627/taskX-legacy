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
