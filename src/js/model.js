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
    deleteDoc,
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

export const setLoggedInState = function (loggedIn) {
    state.loggedIn = loggedIn;
};

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

export const getTodoTasks = function () {
    return state.tasks.todo;
};

export const getInProgressTasks = function () {
    return state.tasks.inProgress;
};

export const getCompletedTasks = function () {
    return state.tasks.completed;
};

////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// FIREBASE ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

export const auth = getAuth();

const userExists = function (docId) {
    const userDoc = doc(db, 'users', docId);
    return getDoc(userDoc);
};

const addUserToFirestore = function (docId, userData) {
    const userDoc = doc(db, 'users', docId);
    return setDoc(userDoc, userData);
};

// tasks doc path: users/uid/tasks/taskid
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

export const getTasksFromFirestore = async function () {
    const q = query(
        collection(db, `users/${state.user.uid}/tasks`),
        where('author', '==', state.user.uid)
    );
    const tasks = await getDocs(q);
    setTasksState(tasks);
};

export const deleteTaskFromFirestore = async function (taskId, taskType) {
    try {
        taskDocRef = doc(db, `users/${state.user.uid}/tasks`, taskId);
        await deleteDoc(taskDocRef);
        const index = state.tasks[taskType].findIndex(el => el.id === taskId);
        state.tasks[taskType].splice(index, 1);
    } catch (err) {
        throw err;
    }
};

export const getUser = function () {
    return auth.currentUser;
};

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
