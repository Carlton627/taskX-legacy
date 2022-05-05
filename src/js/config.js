export const firebaseConfig = {
    apiKey: 'AIzaSyB8jxEM9WEHfpDV2nH8Rj_OdhsbnjbVq5c',
    authDomain: 'fir-learn-b37a3.firebaseapp.com',
    projectId: 'fir-learn-b37a3',
    storageBucket: 'fir-learn-b37a3.appspot.com',
    messagingSenderId: '953774839776',
    appId: '1:953774839776:web:58563e4ee559273ccbfd85',
    measurementId: 'G-Y337WTLDC0',
};

export const errorMessages = {
    startDate: {
        lessThanCurrentDate: '⚠️ Start date cannot be in the past',
        startDateGreaterThanEndDate:
            '⚠️ Start date cannot be after deadline date',
    },
    endDate: {
        lessThanCurrentDate: '⚠️ Deadline date cannot be in the past',
        endDateLessThanStartDate:
            '⚠️ Deadline date cannot be before start date',
    },
};
