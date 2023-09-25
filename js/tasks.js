let tasks = [];
let taskIdCounter = 0;
let currentDraggedElement;
let subtasks = [];
let colorIndex = 0;
let taskStatus = `toDo`;


/**
 * Adds a task using a popup interface.
 * 
 * This function prepares for task addition, gathers task details, and
 * checks if the task priority is set. If the priority is undefined, 
 * it displays an alert. If defined, it finalizes the task addition process.
 * 
 * @async
 * @function addTaskWithPopup
 * @param {Event} event - The event triggering the function call.
 * @returns {Promise<void>} Returns a promise that resolves when the 
 * task has been added using the popup interface.
 */
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

/**
 * Adds a task.
 * 
 * This function prepares for task addition, gathers task details, and
 * checks if the task priority is set. If the priority is undefined, 
 * it displays an alert. If defined, it finalizes the task addition process
 * without using a popup.
 * 
 * @param {Event} event - The event triggering the function call.
 * task has been added.
 */
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

/**
 * Adds a task to the task list and updates storage.
 * 
 * @async
 * @function addTaskToList
 * @param {Object} task - The task object to be added to the list.
 * @returns {Promise<void>} Returns a promise that resolves when the task has been added to storage.
 */
async function addTaskToList(task) {
    tasks.push(task);
    await setItem('tasks', JSON.stringify(tasks));
    subtasks = [];
    await taskAddedToBoard();
}

/**
 * Prepares to add a task with status "inProgress".
 * 
 * @function addTaskInProgress
 */
function addTaskInProgress() {
    addTaskPopUp();
    taskStatus = "inProgress";
}

/**
 * Prepares to add a task with status "awaitingFeedback".
 * 
 * @function addTaskAwaitingFb
 */
function addTaskAwaitingFb() {
    addTaskPopUp();
    taskStatus = "awaitingFeedback";
}

/**
 * Prepares to add a task with status "done".
 * 
 * @function addTaskDone
 */
function addTaskDone() {
    addTaskPopUp();
    taskStatus = "done";
}

/**
 * Handles the initial task adding preparation.
 * 
 * @async
 * @function prepareTaskAdding
 * @param {Event} event - The event triggering the function call.
 * @returns {Promise<void>} Returns a promise that resolves when preparation steps are done.
 */
async function prepareTaskAdding(event) {
    event.stopPropagation();
    await checkLastTaskId();
    await loadSelectedUsers();
}

/**
 * Gathers task details from UI elements.
 * 
 * @function gatherTaskDetails
 * @returns {Object} Returns an object containing task details.
 */
function gatherTaskDetails() {
    /* ... (rest of your code) */
}

/**
 * Finalizes the task addition process.
 * 
 * @async
 * @function finalizeTaskAdding
 * @param {Object} taskDetails - An object containing task details.
 * @param {string} taskPrio - The priority of the task.
 * @returns {Promise<void>} Returns a promise that resolves when the task addition is finalized.
 */
async function finalizeTaskAdding(taskDetails, taskPrio) {
    /* ... (rest of your code) */
}

/**
 * Finalizes the task addition process and navigates to the board page.
 * 
 * @param {Object} taskDetails - An object containing task details.
 * @param {string} taskPrio - The priority of the task..
 */
async function finalizeTaskAddingPopup(taskDetails, taskPrio) {
    /* ... (rest of your code) */
}

/**
 * Displays an alert for task priority.
 * 
 * @function showTaskPrioAlert
 */
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


/**
 * Clears all tasks from both the tasks array and the DOM.
 * 
 * This function resets the tasks array and clears the content of 
 * all task status containers on the DOM.
 * 
 */
function clearAllTasks() {
    tasks = [];
    const taskStatusContainers = ['toDo', 'inProgress', 'awaitingFeedback', 'done'];
    for (const containerId of taskStatusContainers) {
        document.getElementById(containerId).innerHTML = '';
    }
}



/**
 * Saves the edited task, closes the popup and renders the tasks again.
 */
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


/**
 * Sets the urgency color and content based on a task's priority.
 * This function checks the priority of the task at the given index
 * and updates the DOM elements to reflect the urgency (Urgent, Medium, or Low)
 * based on the priority image path.
 * @param {number} index - The index of the task in the 'tasks' array.
 */
function colorUrgency(index) {
    task = tasks[index]
    prio = task['priority'];
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


/**
 * Renders users associated with a task based on the task's user data.
 * 
 * This function loads the contacts, processes each user's name to create a user representation,
 * and updates the corresponding container in the DOM with the user's template.
 * @param {Object} task - The task object containing user and other details.
 */
async function renderUsersInTask(task) {
    await loadContacts();
    userTasks = task['user'];
    let idTask = task.id;
    let userContainer = document.getElementById(`usersInTask${idTask}`);
    for (let i = 0; i < userTasks.length; i++) {
        const element = userTasks[i];
        let nameParts = element.split(' ');
        let firstLetter = nameParts[0].charAt(0);
        let secondLetter = nameParts.length > 1 ? nameParts[1].charAt(0) : '';
        let contact = getContactFromName(nameParts.join(' '));
        let randomColor = contact.color;
        userContainer.innerHTML += await taskUserTemplate(randomColor, firstLetter, secondLetter);
    };
}


/**
 * Retrieves a contact from the contacts array based on a name.
 * @param {string} name - The full name of the contact to retrieve.
 */
function getContactFromName(name) {
    return contacts.find(contact => contact.name === name);
}

/**
 * Renders users in the task that is currently open or being viewed.
 * This function processes each user's name to create a user representation,
 * and updates the corresponding container in the DOM with the user's HTML content.
 */
function renderUsersInOpenTask(index) {
    let task = tasks[index];
    const userTasks = task['user'];
    const userContainer = document.getElementById(`usersInOpenTask${task.id}`);
    for (let i = 0; i < userTasks.length; i++) {
        const element = userTasks[i];
        let nameParts = element.split(' ');
        let firstLetter = nameParts[0].charAt(0);
        let secondLetter = nameParts.length > 1 ? nameParts[1].charAt(0) : '';
        let contact = getContactFromName(nameParts.join(' '));
        let randomColor = contact ? contact.color : getRandomColor();
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


/**
 * Opens and displays the details of a task.
 * 
 * This function fetches the task's details, renders them, sets the urgency color,
 * displays associated users, and renders the subtasks for the opened task.
 * @param {number} i - The ID of the task to open.
 */
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
    tasks.splice(i, 1);
    await setItem('tasks', JSON.stringify(tasks));
    await renderTasks();
    closeTask();
}


/**
 * Displays a notification on the board when a task is added.
 * This function briefly displays a container to notify the user 
 * that a task has been successfully added to the board.
 */
function taskAddedToBoard() {
    const container = document.querySelector('.addedTaskToBoard_content');
    container.classList.add('show');
    setTimeout(() => {
        container.classList.remove('show');
    }, 3000);
}


/**
 * Adds a new subtask based on user input.
 * This function captures the user's subtask input, checks certain conditions
 * (like not exceeding a maximum limit), then renders the subtask and adds it to 
 * the subtasks list.
 */
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

/**
 * Renders a single subtask in the user interface.
 * @param {HTMLElement} currentSubtasks - The container element for displaying subtasks.
 * @param {string} newSubtask - The subtask name or content to render.
 */
function renderSubtask(currentSubtasks, newSubtask) {
    currentSubtasks.innerHTML += /*html*/`
    <div class="subtasksbig">
        <img class="donesign" src="assets/img/subtask_square.png" alt="Subtasks">
        <span class="subtasknumber"></span> <span>${newSubtask}</span>
    </div>    
    `;
    return;
}


/**
 * Renders a list of subtasks for a task.
 * This function loads the tasks, processes the subtasks for the given task, 
 * and updates the corresponding DOM elements to display the subtasks and their progress.
 * @param {Object} task - The task object containing subtasks and other details.
 */
async function renderSubtasks(task) {
    await loadTasks();
    let subtask = task.subtask;
    let taskCount = subtask.length;
    let tasksClicked = await countClickedSubtasks(subtask);
    let id = task.id;
    if (taskCount > 0) {
        document.getElementById(`subtasks${id}`).innerHTML += await /*html*/`
        <div class="subtaskssmall">
            <div><div class="subtaskprogressbar"><div id="subtaskprogressbar${id}"></div></div></div>
            <span>${tasksClicked}/${subtask.length} Subtasks</span>
        </div>    
        `;
        await colorSubtaskProgress(tasksClicked, taskCount, id);
    }
}

/**
 * Colors the subtask progress bar based on the number of clicked subtasks.
 * This function calculates the percentage of clicked subtasks and adjusts 
 * the progress bar width and color accordingly.
 * @param {number} tasksClicked - The number of subtasks that are clicked (completed).
 * @param {number} taskCount - The total count of subtasks.
 * @param {number} id - The task's ID.
 */
async function colorSubtaskProgress(tasksClicked, taskCount, id) {
    let progressBar = document.getElementById(`subtaskprogressbar${id}`);
    let colorPercent = tasksClicked / taskCount * 100;
    progressBar.style.width = `${colorPercent}%`;
    progressBar.style.backgroundColor = '#4589FF';
    progressBar.style.height = '10px';
    progressBar.style.borderRadius = '10px';
}

/**
 * Counts the number of subtasks that are clicked (completed).
 * @param {Array<Object>} subtask - An array of subtask objects.
 */
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


/**
 * Renders the detailed (big) view of subtasks for a task.
 * This function processes each subtask for the given task and updates
 * the DOM to display them in a detailed view, including interactivity.
 * @param {Object} task - The task object containing subtasks and other details.
 */
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
            clicked = 'true';}
        document.getElementById(`subtasksbig${id}`).innerHTML += /*html*/`
        <div class="subtasksbig">
            <img class="donesign" onclick="addDoneSignToSquare(event,'${id}',${i})" src="${imgSrc}" alt="Subtasks" data-clicked="${clicked}">
            <span>${element['name']}</span>
        </div>    
        `;
    }
}

/**
 * Renders the subtasks for a task in edit mode.
 * This function processes each subtask for the given task and updates
 * the DOM to display them in a format suitable for editing.
 * @param {Object} task - The task object containing subtasks and other details.
 */
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

/**
 * Toggles the completion status of a subtask.
 * This function updates the visual representation of a subtask (square/done sign) 
 * based on user interaction and also updates the task's data to reflect the change.
 * @param {Event} event - The DOM event that triggered the function.
 * @param {number|string} id - The task's ID.
 * @param {number} i - The index of the subtask being toggled.
 * @returns {Promise<void>} A promise that resolves when the subtask's completion status is updated.
 */
async function addDoneSignToSquare(event, id, i) {
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


