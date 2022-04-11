// model
import * as model from './model.js';

// views
import navbarView from './views/navbarView.js';
import navButtonsView from './views/navButtonsView.js';
import todoTasksView from './views/todoTasksView.js';
import inProgressTasksView from './views/inProgressTasksView.js';
import completedTasksView from './views/completedTasksView.js';
import addNewTaskView from './views/addNewTaskView.js';

// firebase
import { onAuthStateChanged } from 'firebase/auth';

const controlSignIn = async function () {
    try {
        await model.googleSignIn();
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
        await model.addTaskToFirestore(data);
        data.status === 'todo'
            ? todoTasksView.render(model.getTodoTasks())
            : inProgressTasksView.render(model.getInProgressTasks());
        // TODO: render some success message
        setTimeout(() => {
            addNewTaskView.toggleWindow();
        }, 3000);
    } catch (err) {
        console.log(err.message);
    }
};

const controlGetTasks = async function () {
    try {
        // todoTasksView.renderSpinner();
        await model.getTasksFromFirestore();
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
    navbarView.addHandlerSignIn(controlSignIn);
    navbarView.addHandlerSignOut(controlSignOut);
    addNewTaskView.addHandlerUploadTask(controlUploadTask);
    todoTasksView.addHandlerDeleteTask(controlDeleteTask);
    inProgressTasksView.addHandlerDeleteTask(controlDeleteTask);
    completedTasksView.addHandlerDeleteTask(controlDeleteTask);
    todoTasksView.addHandlerMarkTaskInProgress(controlMarkTaskInProgress);
    inProgressTasksView.addHandlerMarkTaskCompleted(controlMarkTaskCompleted);
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
