// model
import * as model from './model.js';

// views
import navbarView from './views/navbarView.js';
import navButtonsView from './views/navButtonsView.js';
import todoTasksView from './views/todoTasksView.js';
import inProgressTasksView from './views/inProgressTasksView.js';
import completedTasksView from './views/completedTasksView.js';
import addNewTaskView from './views/addNewTaskView.js';
import TaskView from './views/taskView.js';

// firebase
import { onAuthStateChanged } from 'firebase/auth';

const controlSignIn = async function () {
    try {
        navButtonsView.toggleLoginBtnState(true);
        await model.googleSignIn();
        navButtonsView.toggleLoginBtnState(false);
    } catch (err) {
        console.error(err.message);
    }
};

const controlSignOut = async function () {
    try {
        await model.signOutUser();
    } catch (err) {
        console.error(err.message);
    }
};

const controlUploadTask = async function (data) {
    try {
        addNewTaskView.toggleSubmitButtonState(true);
        await model.addTaskToFirestore(data);
        data.status === 'todo'
            ? todoTasksView.render(model.getTodoTasks())
            : inProgressTasksView.render(model.getInProgressTasks());
        // TODO: render some success message
        addNewTaskView.toggleSubmitButtonState(false);
    } catch (err) {
        console.log(err);
    }
};

const controlGetTasks = async function () {
    try {
        todoTasksView.renderSpinner();
        await model.getTasksFromFirestore();
        todoTasksView.hideSpinner();
        todoTasksView.render(model.getTodoTasks());
        inProgressTasksView.render(model.getInProgressTasks());
        completedTasksView.render(model.getCompletedTasks());
    } catch (err) {
        console.log(err.message);
    }
};

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

const controlDeleteTask = async function (taskType, taskId) {
    const { type, view, getTasks } = getTaskMetaData(taskType);
    try {
        await model.deleteTaskFromFirestore(taskId, type);
        view.render(getTasks());
    } catch (err) {
        console.log(err.message);
    }
};

const controlDeleteAllTasks = async function (taskType) {
    const { type, view, getTasks } = getTaskMetaData(taskType);
    try {
        await model.deleteAllTasksFromFirestore(type);
        view.render(getTasks());
    } catch (err) {
        console.log(err.message);
    }
};

const controlMarkTaskInProgress = async function (taskId) {
    try {
        await model.updateTaskStatus(taskId, 'todo', 'inProgress');
        todoTasksView.render(model.getTodoTasks());
        inProgressTasksView.render(model.getInProgressTasks());
    } catch (err) {
        console.log(err.message);
    }
};

const controlMarkTaskCompleted = async function (taskId) {
    try {
        await model.updateTaskStatus(taskId, 'inProgress', 'completed');
        inProgressTasksView.render(model.getInProgressTasks());
        completedTasksView.render(model.getCompletedTasks());
    } catch (err) {
        console.log(err.message);
    }
};

const onUserSignedIn = async function () {
    navButtonsView.renderUserSignedInButtons();
    await controlGetTasks();
};

const onUserSignOff = function () {
    navButtonsView.renderSignInButton();
};

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
