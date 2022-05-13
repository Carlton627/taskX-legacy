// model
import * as model from './model.js';

// toastr
import * as toaster from './helpers.js';

// views
import navbarView from './views/navbarView.js';
import navButtonsView from './views/navButtonsView.js';
import todoTasksView from './views/todoTasksView.js';
import inProgressTasksView from './views/inProgressTasksView.js';
import completedTasksView from './views/completedTasksView.js';
import addNewTaskView from './views/addNewTaskView.js';

// firebase
import { onAuthStateChanged } from 'firebase/auth';

/**
 * This controller function is used to sign in / register the user into app by calling the googleSignIn() method present in the model.
 * @author Carlton Rodrigues
 */
const controlSignIn = async function () {
    try {
        navButtonsView.toggleLoginBtnState(true);
        await model.googleSignIn();
    } catch (err) {
        toaster.renderErrorToast(err.message);
    } finally {
        navButtonsView.toggleLoginBtnState(false);
    }
};

/**
 * This controller function is used to sign out the user from the app by calling the signOutUser() function present in the model.
 * @author Carlton Rodrigues
 */
const controlSignOut = async function () {
    try {
        await model.signOutUser();
    } catch (err) {
        toaster.renderErrorToast(err.message);
    }
};

/**
 * This controller function is used to upload a new task document to cloud firestore by using the addTaskToFirestore(data) function present in the model.
 * @param {Object} data corrosponds to the new task data to be created in firestore and displayed in the UI.
 * @author Carlton Rodrigues
 */
const controlUploadTask = async function (data) {
    try {
        addNewTaskView.toggleSubmitButtonState(true);
        await model.addTaskToFirestore(data);
        toaster.renderSuccessToast('Task added successfully');
        data.status === 'todo'
            ? todoTasksView.render(model.getTodoTasks())
            : inProgressTasksView.render(model.getInProgressTasks());
    } catch (err) {
        toaster.renderErrorToast(err.message);
    } finally {
        addNewTaskView.toggleSubmitButtonState(false);
    }
};

/**
 * This controller function is used to get all the task documents belonging to the signed in user from cloud firestore by using the getTasksFromFirestore() function present in the model.
 * @author Carlton Rodrigues
 */
const controlGetTasks = async function () {
    try {
        todoTasksView.renderSpinner();
        await model.getTasksFromFirestore();
        todoTasksView.hideSpinner();
        todoTasksView.render(model.getTodoTasks());
        inProgressTasksView.render(model.getInProgressTasks());
        completedTasksView.render(model.getCompletedTasks());
    } catch (err) {
        toaster.renderErrorToast(err.message);
    }
};

/**
 * This controller function is like a helper function that sets all the required configuration for a particular taskType that is passed to it as a parameter.
 * This function is used in the controller itself for deleting a task and also for deleting all tasks of a particular type.
 * @param {string} taskType corrosponds to the status of the task ['todo', 'inProgress', 'completed']
 * @returns {Object} returns an object with the view (todoTasksView / inProgressTasksView / completedTasksView), type which is the state of the task and the function value from the model which retrives the data from the specific taskType.
 * @author Carlton Rodrigues
 */
const getTaskMetaData = function (taskType) {
    let type, view, getTasks;
    if (taskType.classList.contains('todo')) {
        type = 'todo';
        view = todoTasksView;
        getTasks = model.getTodoTasks;
    } else if (taskType.classList.contains('in-progress')) {
        type = 'inProgress';
        view = inProgressTasksView;
        getTasks = model.getInProgressTasks;
    } else {
        type = 'completed';
        view = completedTasksView;
        getTasks = model.getCompletedTasks;
    }
    return {
        type,
        view,
        getTasks,
    };
};

/**
 * This controller function is used to delete a task from cloud firestore using the deleteTaskFromFirestore(taskType, taskId) function present in the model.
 * Here you can see the usage of the controller function getTaskMetaData(taskType)
 * @param {string} taskType corrosponds to the status of the task ['todo', 'inProgress', 'completed']
 * @param {string} taskId corrosponds to the document id to be deleted from firestore.
 * @author Carlton Rodrigues
 */
const controlDeleteTask = async function (taskType, taskId) {
    const { type, view, getTasks } = getTaskMetaData(taskType);
    try {
        await model.deleteTaskFromFirestore(taskId, type);
        toaster.renderSuccessToast('Task deleted');
        view.render(getTasks());
    } catch (err) {
        toaster.renderErrorToast(err.message);
    }
};

/**
 * This controller function is used to delete all the tasks belonging to a taskType which is passed as a argument to this function.
 * The function deleteAllTasksFromFirestore(type) present in the model is used to achieve this.
 * Here you can see the usage of the controller function getTaskMetaData(taskType)
 * @param {string} taskType corrosponds to the status of the task ['todo', 'inProgress', 'completed']
 * @author Carlton Rodrigues
 */
const controlDeleteAllTasks = async function (taskType) {
    const { type, view, getTasks } = getTaskMetaData(taskType);
    try {
        await model.deleteAllTasksFromFirestore(type);
        toaster.renderSuccessToast(
            `All ${
                type === 'inProgress' ? type.split('P').join(' p') : type
            } tasks deleted`
        );
        view.render(getTasks());
    } catch (err) {
        toaster.renderErrorToast(err.message);
    }
};

/**
 * This controller function is used to change a task status from 'todo' to 'inProgress', it uses the updateTaskStatus(id, fromStatus, toStatus) present in the model to achieve this.
 * @param {string} taskId corrosponds to the document id to be updated in cloud firestore.
 * @author Carlton Rodrigues
 */
const controlMarkTaskInProgress = async function (taskId) {
    try {
        await model.updateTaskStatus(taskId, 'todo', 'inProgress');
        todoTasksView.render(model.getTodoTasks());
        inProgressTasksView.render(model.getInProgressTasks());
    } catch (err) {
        toaster.renderErrorToast(err.message);
    }
};

/**
 * This controller function is used to change a task status from 'inProgress' to 'completed', it uses the updateTaskStatus(id, fromStatus, toStatus) present in the model to achieve this.
 * @param {string} taskId corrosponds to the document id to be updated in cloud firestore.
 * @author Carlton Rodrigues
 */
const controlMarkTaskCompleted = async function (taskId) {
    try {
        await model.updateTaskStatus(taskId, 'inProgress', 'completed');
        inProgressTasksView.render(model.getInProgressTasks());
        completedTasksView.render(model.getCompletedTasks());
    } catch (err) {
        toaster.renderErrorToast(err.message);
    }
};

/**
 * This controller function tells the app what to do when the user successfully signs in to the app.
 * The navigation buttons are changed, a user section is added and tasks for the user are fetched.
 * @author Carlton Rodrigues
 */
const onUserSignedIn = async function () {
    navButtonsView.renderUserSignedInButtons();
    navButtonsView.renderUserSection(
        model.state.user?.firstName,
        model.state.user?.photoURL
    );
    try {
        await controlGetTasks();
    } catch (err) {
        toaster.renderErrorToast(err.message);
    }
};

/**
 * This controller function tells the app what to do when the user signs out of the app.
 * @author Carlton Rodrigues
 */
const onUserSignOff = function () {
    navButtonsView.renderSignInButton();
};

/**
 * This is the main function of the application, a entry point of sorts.
 * The views are attached to the models in this function using the Publisher/Subscriber pattern.
 * The authentication state of the user is also managed in this function.
 * In order for this app to work the runApp function has to be called in the global scope of this file.
 * @author Carlton Rodrigues
 */
function runApp() {
    // handling for authentication
    navbarView.addHandlerSignIn(controlSignIn);
    navbarView.addHandlerSignOut(controlSignOut);

    // handling for creating new task
    addNewTaskView.addHandlerUploadTask(controlUploadTask);

    // handling for deleting a specific task
    todoTasksView.addHandlerDeleteTask(controlDeleteTask);
    inProgressTasksView.addHandlerDeleteTask(controlDeleteTask);
    completedTasksView.addHandlerDeleteTask(controlDeleteTask);

    // handling for deleting all tasks
    todoTasksView.addHandlerDeleteAllTasks(controlDeleteAllTasks);
    inProgressTasksView.addHandlerDeleteAllTasks(controlDeleteAllTasks);
    completedTasksView.addHandlerDeleteAllTasks(controlDeleteAllTasks);

    // handling for updating task status
    todoTasksView.addHandlerMarkTaskInProgress(controlMarkTaskInProgress);
    inProgressTasksView.addHandlerMarkTaskCompleted(controlMarkTaskCompleted);

    // managing auth state
    onAuthStateChanged(model.auth, user => {
        if (user) {
            model.setUserState(user);
            model.setLoggedInState(true);
            onUserSignedIn();
        } else {
            onUserSignOff();
        }
    });
}

runApp();
