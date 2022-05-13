import { firebaseConfig } from './config.js';
import { initializeApp } from 'firebase/app';
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import {
    doc,
    getDoc,
    getFirestore,
    setDoc,
    Timestamp,
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    deleteDoc,
    writeBatch,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { async } from 'regenerator-runtime';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const state = {
    loggedIn: false,
    user: {},
    tasks: {
        completed: [],
        inProgress: [],
        todo: [],
    },
};

/**
 * Set the login state to true or false.
 * @param {boolean} loggedIn The login state of the user.
 * @returns {undefined} this function is just used to set a state variable and doesn't return anything.
 * @author Carlton Rodrigues
 */
export const setLoggedInState = function (loggedIn) {
    state.loggedIn = loggedIn;
};

/**
 * Set the tasks for each task category [todo, in-progress, completed].
 * @param {Object | Object[]} tasks task objects recieved from firebase.
 * @returns {undefined} this function is just used to set a state variable and doesn't return anything.
 * @author Carlton Rodrigues
 */
export const setTasksState = function (tasks) {
    if (!tasks) {
        state.tasks.todo = [];
        state.tasks.inProgress = [];
        state.tasks.completed = [];
    } else {
        tasks.forEach(task => {
            const taskData = task.data();
            if (taskData.status === 'todo') {
                state.tasks.todo.push(taskData);
            } else if (taskData.status === 'inProgress') {
                state.tasks.inProgress.push(taskData);
            } else if (taskData.status === 'completed') {
                state.tasks.completed.push(taskData);
            }
        });
    }
};

/**
 * Set the information on the current user logged into the app.
 * @param {Object} user user credential object recieved upon signing in to firebase.
 * @returns {undefined} this function is just used to set a state variable and doesn't return anything.
 * @author Carlton Rodrigues
 */
export const setUserState = function (user) {
    state.user = {};
    if (user)
        state.user = {
            uid: user?.uid,
            photoURL: user?.photoURL,
            firstName: user?.displayName.split(' ')[0],
            email: user?.email,
            creationTime: user?.metadata?.creationTime,
        };
};

/**
 * Getter for todo tasks
 * @returns {Object[]} todo tasks present in the state variable.
 * @author Carlton Rodrigues
 */
export const getTodoTasks = function () {
    return state.tasks.todo;
};

/**
 * Getter for in progress tasks
 * @returns {Object[]} in progress tasks present in the state variable.
 * @author Carlton Rodrigues
 */
export const getInProgressTasks = function () {
    return state.tasks.inProgress;
};

/**
 * Getter for completed tasks
 * @returns {Object[]} completed tasks present in the state variable.
 * @author Carlton Rodrigues
 */
export const getCompletedTasks = function () {
    return state.tasks.completed;
};

////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// FIREBASE ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

export const auth = getAuth();

/**
 * Function to check whether the logged in user is a registered user.
 * @param {string} docId document id to be fetched from cloud firestore.
 * @returns {DocumentSnapshot<documentData>} returns the document if found, or else return undefined.
 * @author Carlton Rodrigues
 */
const userExists = function (docId) {
    const userDoc = doc(db, 'users', docId);
    return getDoc(userDoc);
};

/**
 * Function to register a user into cloud firestore
 * @param {string} docId passing the uid of the newly signed in user to be used as the document id.
 * @param {Object} userData passing the state.user property to create a new user in firestore.
 * @returns {Promise} promise which will be fulfilled in the calling function
 */
const addUserToFirestore = function (docId, userData) {
    const userDoc = doc(db, 'users', docId);
    return setDoc(userDoc, userData);
};

/**
 * Function to add a new task to cloud firestore, tasks doc path: users/uid/tasks/taskid
 * @param {Object} data data recieved from the user via the task creation form
 * @returns {undefined} this function is just used to set task state variable and doesn't return anything.
 * @author Carlton Rodrigues
 */
export const addTaskToFirestore = async function (data) {
    const task = {
        ...data,
        id: uuidv4(),
        author: state.user.uid,
        createdAt: Timestamp.fromDate(new Date()),
    };
    try {
        const taskDocRef = doc(db, `users/${state.user.uid}/tasks`, task.id);
        await setDoc(taskDocRef, task);
        task.status === 'todo'
            ? state.tasks.todo.push(task)
            : state.tasks.inProgress.push(task);
    } catch (err) {
        throw err;
    }
};

/**
 * Function get all the tasks from cloud firestore.
 * @returns {undefined} this function is just used to set task state variable and doesn't return anything.
 * @author Carlton Rodrigues
 */
export const getTasksFromFirestore = async function () {
    try {
        const q = query(
            collection(db, `users/${state.user.uid}/tasks`),
            where('author', '==', state.user.uid)
        );
        const tasks = await getDocs(q);
        setTasksState(tasks);
    } catch (err) {
        throw err;
    }
};

/**
 * Function delete a task from firestore
 * @param {string} taskId corrosponds to the document id to be deleted from firestore.
 * @param {string} taskType is used to delete the task from the task state variable, can have values ['todo', 'inProgress', 'completed'].
 * @author Carlton Rodrigues
 */
export const deleteTaskFromFirestore = async function (taskId, taskType) {
    try {
        const taskDocRef = doc(db, `users/${state.user.uid}/tasks`, taskId);
        await deleteDoc(taskDocRef);
        const index = state.tasks[taskType].findIndex(el => el.id === taskId);
        state.tasks[taskType].splice(index, 1);
    } catch (err) {
        throw err;
    }
};

/**
 * Function to delete all tasks of a specific category
 * @param {string} taskType corrosponds to the type of task for which the delete all button was clicked, can have values ['todo', 'inProgress', 'completed'].
 * @author Carlton Rodrigues
 */
export const deleteAllTasksFromFirestore = async function (taskType) {
    try {
        const batch = writeBatch(db);
        const taskDocRefs = state.tasks[taskType].map(task =>
            doc(db, `users/${state.user.uid}/tasks`, task.id)
        );
        taskDocRefs.forEach(taskDoc => batch.delete(taskDoc));
        await batch.commit();
        state.tasks[taskType] = [];
    } catch (err) {
        throw err;
    }
};

/**
 * Function to transition task status from todo -> inProgress -> completed.
 * @param {string} taskId corrosponds to the document id that has to be updated.
 * @param {string} fromTaskType corrosponds to the previous task status of the task to be updated.
 * @param {string} toTaskType corrosponds to status to which the task has to updated.
 * @author Carlton Rodrigues
 */
export const updateTaskStatus = async function (
    taskId,
    fromTaskType,
    toTaskType
) {
    try {
        const index = state.tasks[fromTaskType].findIndex(
            el => el.id === taskId
        );
        const [updatedTask] = state.tasks[fromTaskType].splice(index, 1);
        updatedTask.status = toTaskType;
        state.tasks[toTaskType].push(updatedTask);
        const taskDocRef = doc(db, `users/${state.user.uid}/tasks`, taskId);
        await updateDoc(taskDocRef, { status: toTaskType });
    } catch (err) {
        throw err;
    }
};

export const getUser = function () {
    return auth.currentUser;
};

/**
 * Function to sign in user with their Google accounts.
 * @author Carlton Rodrigues
 */
export const googleSignIn = async function () {
    try {
        const credential = await signInWithPopup(
            auth,
            new GoogleAuthProvider()
        );
        setUserState(credential.user);
        setLoggedInState(true);
        const userDocSnap = await userExists(state.user.uid);
        if (!userDocSnap.exists()) {
            // store doc in users
            await addUserToFirestore(state.user.uid, state.user);
        }
    } catch (err) {
        throw err;
    }
};

/**
 * Function to signout user from the app
 * @author Carlton Rodrigues
 */
export const signOutUser = async function () {
    try {
        await signOut(auth);
        setUserState(false);
        setLoggedInState(false);
        setTasksState(false);
    } catch (err) {
        throw err;
    }
};
