let tasks = [];
let taskIdCounter = 0;
let currentDraggedElement;
let subtasks = [];
let colorIndex = 0;
let taskStatus = `toDo`;



async function addTaskWithPopup(event) {
    await prepareTaskAdding(event);
    let taskDetails = gatherTaskDetails();
    
    if (typeof taskPrio === 'undefined') {
        showTaskPrioAlert();
    } else {
        let taskPrio = getTaskPrio();
        await finalizeTaskAdding(taskDetails, taskPrio);
    }
    taskStatus = 'toDo';
}

async function addTask(event) {
    await prepareTaskAdding(event);
    let taskDetails = gatherTaskDetails();
    if (typeof taskPrio === 'undefined') {
        showTaskPrioAlert();
    } else {
        let taskPrio = getTaskPrio();
        await finalizeTaskAddingPopup(taskDetails, taskPrio);
    }
    taskStatus = 'toDo';
}


/**
 * Checks and updates the task ID based on the existing tasks.
 */
async function checkLastTaskId() {
    await loadTasks();
    if (tasks.length > 0) {
        const maxId = Math.max(...tasks.map(task => task.id));
        taskIdCounter = maxId + 1;
    }
}

/**
 * Adds a new task and stores it in the 'tasks' variable.
 * @returns {Promise<void>}
 */
// Funktion zur Erstellung eines Aufgabenelements
function createTaskElement(taskName, taskSubtask, taskDescription, taskCategory, taskCategorybc, taskAssign, taskDate, taskPrio, taskId) {
    return {
        id: taskId,
        name: taskName,
        subtask: taskSubtask,
        tasktext: taskDescription,
        category: taskCategory,
        categoryBackgroundColor: taskCategorybc,
        user: taskAssign,
        date: taskDate,
        priority: taskPrio,
        status: taskStatus,
    };
}

// Funktion zum Hinzufügen einer Aufgabe
async function addTaskToList(task) {
    tasks.push(task);
    await setItem('tasks', JSON.stringify(tasks));
    subtasks = [];
    await taskAddedToBoard();
}


function addTaskInProgress() {
    addTaskPopUp();
    taskStatus = "inProgress"

}

function addTaskAwaitingFb() {
    addTaskPopUp();
    taskStatus = "awaitingFeedback"

}

function addTaskDone() {
    addTaskPopUp();
    taskStatus = "done"

}

// Hauptfunktion



async function prepareTaskAdding(event) {
    event.stopPropagation();
    await checkLastTaskId();
    await loadSelectedUsers();
}

function gatherTaskDetails() {
    let taskName = document.getElementById('addTaskTitle').value;
    let taskSubtask = subtasks;
    let taskDescription = document.getElementById('addTaskDescription').value;
    let taskCategory = currentCategory;
    let taskCategorybc = currentColorOfCategory;
    let taskAssign = selectedUsers;
    let taskDate = document.getElementById('addTaskInputDate').value;
    return { taskName, taskSubtask, taskDescription, taskCategory, taskCategorybc, taskAssign, taskDate };
}

async function finalizeTaskAdding(taskDetails, taskPrio) {
    let taskId = taskIdCounter++;
    let task = createTaskElement(taskDetails.taskName, taskDetails.taskSubtask, taskDetails.taskDescription, 
                                taskDetails.taskCategory, taskDetails.taskCategorybc, taskDetails.taskAssign, 
                                taskDetails.taskDate, taskPrio, taskId);
    await addTaskToList(task);
    selectedUsers = [];
    await saveSelectedUsers();
    setTimeout(closePopup, 1000);
}




async function finalizeTaskAddingPopup(taskDetails, taskPrio) {
    let taskId = taskIdCounter++;
    let task = createTaskElement(taskDetails.taskName, taskDetails.taskSubtask, taskDetails.taskDescription, 
                                taskDetails.taskCategory, taskDetails.taskCategorybc, taskDetails.taskAssign, 
                                taskDetails.taskDate, taskPrio, taskId);
    await addTaskToList(task);
    selectedUsers = [];
    await saveSelectedUsers();
    setTimeout(() => window.open('board.html', '_self'), 1000);
}



function showTaskPrioAlert() {
    document.getElementById('prioalert').classList.remove('d-none');
}

/**
 * Modifies an existing task.
 * @param {number} i - The index of the task to be changed in the 'tasks' list.
 * @returns {Promise<void>}
 */
async function changeTask(i, event) {
    event.stopPropagation();
    let task = tasks[i];
    let taskId = task.id;
    let taskName = document.getElementById('addTaskTitle').value;
    let taskSubtask = task['subtask'];
    let taskDescription = document.getElementById('addTaskDescription').value;
    let taskCategory = currentCategory;
    let taskCategorybc = currentColorOfCategory;
    let taskAssign = selectedUsers;
    let taskDate = document.getElementById('addTaskInputDate').value;
    let taskPrio = getTaskPrio();
    let taskStatus = task.status;
    task.id = taskId;
    task.name = taskName;
    task.subtask = taskSubtask;
    task.tasktext = taskDescription;
    task.category = taskCategory;
    task.categoryBackgroundColor = taskCategorybc,
        task.user = taskAssign;
    task.date = taskDate;
    task.priority = taskPrio;
    task.status = taskStatus;
    await setItem('tasks', JSON.stringify(tasks));
    selectedUsers = [];
    await saveSelectedUsers();
    // Displays the animation in add Task
    await taskAddedToBoard();
    closePopup();
};

/**
 * Prepares the user interface to edit an existing task.
 * @param {number} i - The index of the task to be edited in the 'tasks' list.
 */
// Funktion um Aufgabendetails in Eingabefelder zu laden
async function loadTaskDetails(task) {
    document.getElementById('addTaskHeaderText').innerHTML = `Edit Task`;
    document.getElementById('addTaskTitle').value = task.name;
    document.getElementById('addTaskDescription').value = task.tasktext;
    document.getElementById('addTaskCategorySelect').value = task.category;
    await checkboxUsers(task);
    document.getElementById('addTaskInputDate').value = task.date;
    taskStatus = task.status;
    taskId = task.id;
}

function clearAllTasks() {
    tasks = []; // Lösche alle Tasks im Array
    const taskStatusContainers = ['toDo', 'inProgress', 'awaitingFeedback', 'done'];

    for (const containerId of taskStatusContainers) {
        document.getElementById(containerId).innerHTML = ''; // Leere die HTML-Container für die einzelnen Task-Status
    }
}


// Hauptfunktion um Aufgabenbearbeitung zu initialisieren
async function editTask(i) {
    let task = tasks[i];
    closeTask();
    await addTaskPopUp();
    let taskprio = task['priority'];
    getTaskPrio(taskprio);
    await loadTaskDetails(task);
    document.getElementById('buttonEdit').classList.add('d-none');
    document.getElementById('buttonAfterEdit').innerHTML = `<div id="buttonAfterEditNone"  class="create-btn btn d-none" onclick="changeTask(${i},event)">Change Task <img src="assets/img/add_task_check.png" alt="cancel"></div>`;
    document.getElementById('buttonAfterEditNone').classList.remove('d-none');
    subtasks = [];
    renderSubtasksEdit(task);
}

/**
 * Checks the Boxes for the users that already are assigned in task when edit task.
 */
function checkboxUsers(task) {
    // Durchlaufen Sie jedes Element in task.user
    for (let i = 0; i < task.user.length; i++) {
        let checkboxes = document.querySelectorAll(`input[name="${task.user[i]}"]`);
        for (let j = 0; j < checkboxes.length; j++) {
            checkboxes[j].checked = true;
            checkboxes[j].dispatchEvent(new Event('click'));
        }
    }
}

/**
 * Removes all inputs in the task form.
 */
function clearTask(event) {
    event.stopPropagation();
    document.getElementById('addTaskTitle').value = '';
    document.getElementById('addTaskInputSubtask').value = '';
    document.getElementById('addTaskDescription').value = '';
    document.getElementById('addTaskCategorySelect').value = '';
    document.getElementById('addTaskInputDate').value = '';
    document.getElementById('showSubtasks').innerHTML = '';
}

/**
 * Returns the priority of the task based on the provided string.
 * @param {string} prio - The priority value as a string ('urgent', 'medium', 'low').
 */
function getTaskPrio(prio) {
    if (prio === 'urgent' || prio === `assets/img/priohigh.png`) {
        taskPrio = `assets/img/priohigh.png`;
        prioColorRed();
    }
    if (prio === 'medium' || prio === `assets/img/priomedium.png`) {
        taskPrio = `assets/img/priomedium.png`;
        prioColorOrange();
    }
    if (prio === 'low' || prio === `assets/img/priolow.png`) {
        taskPrio = `assets/img/priolow.png`;
        prioColorGreen();
    }
    return taskPrio;
}

// Coloring the urgency level in the detailed view
function colorUrgency(index) {
    // Retrieves the task and its priority level
    task = tasks[index]
    prio = task['priority'];

    // Changes the display depending on the priority level
    if (prio === 'assets/img/priohigh.png') {
        document.getElementById('colorPrioBigTask').classList.add('urgent');
        document.getElementById('prioBigTask').innerHTML = `Urgent`;
        document.getElementById('urgencyImg').innerHTML = `<img src="assets/img/prio.png">`;
    }
   
    if (prio === 'assets/img/priomedium.png') {
        document.getElementById('colorPrioBigTask').classList.add('medium');
        document.getElementById('prioBigTask').innerHTML = `Medium`;
        document.getElementById('urgencyImg').innerHTML = `=`;
    }
    if (prio === 'assets/img/priolow.png') {
        document.getElementById('colorPrioBigTask').classList.add('low');
        document.getElementById('prioBigTask').innerHTML = `Low`;
        document.getElementById('urgencyImg').innerHTML = `<img src="assets/img/priolowwhite.png">`;
    }
}

/**
 * Loads the existing tasks.
 * @returns {Promise<void>}
 */
async function loadTasks() {
    try {
        const loadedTasks = JSON.parse(await getItem('tasks'));
        if (Array.isArray(loadedTasks)) {
            tasks = loadedTasks;
        } else if (typeof loadedTasks === 'object' && loadedTasks !== null) {
            tasks = Object.values(loadedTasks);
        } else {
            console.error('Loaded tasks are not an array:', loadedTasks);
        }
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Calls the 'loadTasks()' function and updates the HTML.
 * @returns {Promise<void>}
 */
async function renderTasks() {
    await loadTasks();
    updateHTML();
}

/**
 * Updates the HTML to display the tasks in the respective status columns.
 */
function updateHTML() {
    renderToDo();
    renderInProgress();
    renderAwaitFb();
    renderDone();
}

/**
 * Updates the HTML representation of the 'to-do' tasks.
 */
async function renderToDo() {
    let toDo = tasks.filter(t => t['status'] == 'toDo');
    document.getElementById('toDo').innerHTML = '';
    for (let index = 0; index < toDo.length; index++) {
        const task = toDo[index];
        document.getElementById('toDo').innerHTML += await taskTemplate(task);
        await renderUsersInTask(task);
        await renderSubtasks(task);
    }
    
}

async function renderUsersInTask(task) {
    await loadContacts(); // Kontakte werden benötigt, um auf die gespeicherte Farbe zuzugreifen
    userTasks = task['user'];
    let idTask = task.id;
    let userContainer = document.getElementById(`usersInTask${idTask}`);
    for (let i = 0; i < userTasks.length; i++) {
        const element = userTasks[i];
        let nameParts = element.split(' '); // Name in Teile aufteilen
        let firstLetter = nameParts[0].charAt(0); // Erster Buchstabe des Vornamens
        let secondLetter = nameParts.length > 1 ? nameParts[1].charAt(0) : '';
        let contact = getContactFromName(nameParts.join(' ')); // Suche nach Name
        let randomColor = contact ? contact.color : getRandomColor(); // Wenn Name da, dann contact.color, wenn nicht function ... 
        userContainer.innerHTML += await taskUserTemplate(randomColor, firstLetter, secondLetter);
    };
}

function getContactFromName(name) {
    return contacts.find(contact => contact.name === name);
}

function renderUsersInOpenTask(index) {
    let task = tasks[index];
    const userTasks = task['user'];
    const userContainer = document.getElementById(`usersInOpenTask${task.id}`);
    for (let i = 0; i < userTasks.length; i++) {
        const element = userTasks[i];
        let nameParts = element.split(' '); // Name in Teile aufteilen
        let firstLetter = nameParts[0].charAt(0); // Erster Buchstabe des Vornamens
        let secondLetter = nameParts.length > 1 ? nameParts[1].charAt(0) : '';
        // Suche nach dem Namen im Kontakt und erhalte die Farbe (oder eine zufällige Farbe, wenn der Name nicht gefunden wird)
        let contact = getContactFromName(nameParts.join(' '));
        let randomColor = contact ? contact.color : getRandomColor();
        // Erstelle den User-Container und füge ihn direkt in den Task-Details-Container ein
        const userElement = document.createElement('div');
        userElement.classList.add('contact-container');
        userElement.innerHTML = createUserHTML(randomColor, firstLetter, secondLetter, nameParts);
        userContainer.appendChild(userElement);
    };
}


/**
 * Updates the HTML representation of the 'in-progress' tasks.
 */
async function renderInProgress() {
    let inProgress = tasks.filter(t => t['status'] == 'inProgress');
    document.getElementById('inProgress').innerHTML = '';
    for (let index = 0; index < inProgress.length; index++) {
        const task = inProgress[index];
        document.getElementById('inProgress').innerHTML += await taskTemplate(task);
        renderUsersInTask(task);
        await renderSubtasks(task);
    }
}

/**
 * Updates the HTML representation of the 'awaitingFeedback' tasks.
 */
async function renderAwaitFb() {
    let awaitingFeedback = tasks.filter(t => t['status'] == 'awaitingFeedback');
    document.getElementById('awaitingFeedback').innerHTML = '';
    for (let index = 0; index < awaitingFeedback.length; index++) {
        const task = awaitingFeedback[index];
        document.getElementById('awaitingFeedback').innerHTML += await taskTemplate(task);
        renderUsersInTask(task);
        await renderSubtasks(task);
    }
}

/**
 * Updates the HTML representation of the 'done' tasks.
 */
async function renderDone() {
    let done = tasks.filter(t => t['status'] == 'done');
    document.getElementById('done').innerHTML = '';
    for (let index = 0; index < done.length; index++) {
        const task = done[index];
        document.getElementById('done').innerHTML += await taskTemplate(task);
        await renderUsersInTask(task);
        await renderSubtasks(task);
    }
}

async function openTask(i) {
    document.getElementById('showTask').classList.remove('d-none');
    let index = tasks.findIndex(task => task.id === i);
    let taskDetailsHTML = await generateTaskDetailsHTML(index);
    document.getElementById('showTask').innerHTML = await taskDetailsHTML;
    colorUrgency(index);
   renderUsersInOpenTask(index);
   renderSubtasksBig(task);
}

/**
 * Closes the detailed view of a task.
 */
function closeTask() {
    // Adds the 'd-none' class to hide the task details and removes it from the task container to make the tasks visible again
    document.getElementById('taskContainer').classList.remove('d-none');
    document.getElementById('showTask').classList.add('d-none');
    initBoard();
}


/**
 * Deletes a specific task and updates the view.
 * @param {number} i - The index of the task to be deleted in the 'tasks' list.
 * @returns {Promise<void>}
 */
async function deleteTask(i) {
    // Removes the task from the array
    tasks.splice(i, 1);
    // Updates the stored tasks and the displayed tasks
    await setItem('tasks', JSON.stringify(tasks));
    await renderTasks();
    // Closes the task details
    closeTask();
}

// Animates the addition of a task to the board
function taskAddedToBoard() {
    // Adds the 'show' class to animate the container
    const container = document.querySelector('.addedTaskToBoard_content');
    container.classList.add('show');

    // Removes the 'show' class after 3 seconds to end the animation
    setTimeout(() => {
        container.classList.remove('show');
    }, 3000);
}

// Adds new Subtasks under subtask-field
function addNewSubtask() {
    const newSubtask = document.getElementById('addTaskInputSubtask').value;
    let currentSubtasks = document.getElementById('showSubtasks');
    if (newSubtask === '')
        alert('Bitte Feld ausfüllen!!')
    else {
        if (subtasks.length >= 3) {
            alert('Maximal drei Subtasks erstellen');
        } else {
            renderSubtask(currentSubtasks, newSubtask);
            subtasks.push({
                name: newSubtask,
                clicked: `false`,
                
            });
            document.getElementById('addTaskInputSubtask').value = '';
        }
    }
}

function renderSubtask(currentSubtasks, newSubtask) {
    currentSubtasks.innerHTML += /*html*/`
    <div class="subtasksbig">
        <img class="donesign" src="assets/img/subtask_square.png" alt="Subtasks">
        <span class="subtasknumber"></span> <span>${newSubtask}</span>
    </div>    
    `;
    return;
}

async function renderSubtasks(task) {
    await loadTasks();
    let subtask = task.subtask;
    let taskCount = subtask.length;
    let tasksClicked =  await countClickedSubtasks(subtask);
    let id = task.id;
    if (taskCount > 0) {
        document.getElementById(`subtasks${id}`).innerHTML += await /*html*/`
        <div class="subtaskssmall">
            <div><div class="subtaskprogressbar"><div id="subtaskprogressbar${id}"></div></div></div>
            <span>${tasksClicked}/${subtask.length} Subtasks</span>
        </div>    
        `;
        await colorSubtaskProgress(tasksClicked,taskCount,id);
    }
    }


async function colorSubtaskProgress(tasksClicked, taskCount,id) {
    let progressBar = document.getElementById(`subtaskprogressbar${id}`);
    let colorPercent = tasksClicked/taskCount * 100;
    progressBar.style.width = `${colorPercent}%`;
    progressBar.style.backgroundColor = '#4589FF';
    progressBar.style.height = '10px';
    progressBar.style.borderRadius = '10px';
}


async function countClickedSubtasks(subtask) {
    let count = 0;
    for (let i = 0; i < subtask.length; i++) {
        let element = subtask[i];
        if (element['clicked'] === 'true') {
            count++;
        }
    }
    return count;
}




async function renderSubtasksBig(task) {
    await loadTasks();
    const subtask = task.subtask;
    const id = task.id;
    for (let i = 0; i < subtask.length; i++) {
        let element = subtask[i];
        elementString = JSON.stringify(element);
        let imgSrc = "assets/img/subtask_square.png";
        let clicked = element['clicked']
        if (clicked == 'true') {
            imgSrc = "assets/img/done_white.png";
            clicked = 'true'; }
        document.getElementById(`subtasksbig${id}`).innerHTML += /*html*/`
        <div class="subtasksbig">
            <img class="donesign" onclick="addDoneSignToSquare(event,'${id}',${i})" src="${imgSrc}" alt="Subtasks" data-clicked="${clicked}">
            <span>${element['name']}</span>
        </div>    
        `;
    }
}






async function renderSubtasksEdit(task) {
    await loadTasks();
    const subtask = task.subtask;
    const id = task.id;
    for (let i = 0; i < subtask.length; i++) {
        let element = subtask[i];
        elementString = JSON.stringify(element);
        let imgSrc = "assets/img/subtask_square.png";
        let clicked = element['clicked']
        if (clicked == 'true') {
            imgSrc = "assets/img/done_white.png";
            clicked = 'true';
        }
        document.getElementById(`showSubtasks`).innerHTML += /*html*/`
        <div class="subtasksbig">
        <img class="donesign" onclick="addDoneSignToSquare(event,'${id}',${i})" src="${imgSrc}" alt="Subtasks">
        <span>${element['name']}</span> 
    </div>    
        `;
    }
}

// ADDS 'done-sign'
async function addDoneSignToSquare(event,id,i) {
    event.stopPropagation();
    await loadTasks();
    let taskIndex = tasks.findIndex(task => task.id.toString() === id.toString());
        let task = tasks[taskIndex];
        let subtask = task['subtask'];
    if (event.target.src.includes("subtask_square.png")) {
        event.target.src = "assets/img/done_white.png";
        subtask[i].clicked = 'true'; 
    } else {
        event.target.src = "assets/img/subtask_square.png";
        subtask[i].clicked = 'false'; 
    }
    setItem('tasks', JSON.stringify(tasks));
    console.log('clicked');
}


