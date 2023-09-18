// GENERAL FUNCTIONS ....
/**
 * Allows for dropping an element.
 * @param {Event} ev - The drop event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Assigns a new status to the task depending on where it is moved.
 */
function moveTo(category) {
    tasks[currentDraggedElement]['status'] = category;
    updateTaskStatus(currentDraggedElement, category);
    updateHTML();

}

function highlight(id) {
    document.getElementById(id).classList.add('task-status-container-highlight');
}

function removeHighlight(id) {
    // Entferne das Highlight von allen anderen Containern
    const containerIds = ['toDo', 'inProgress', 'awaitingFeedback', 'done'];
    containerIds.forEach(containerId => {
        if (containerId !== id) {
            document.getElementById(containerId).classList.remove('task-status-container-highlight');
        }
    });
}

/**
 * Updates the status of a task when it's moved between categories.
 * @param {number} taskIndex - The index of the task in the 'tasks' list.
 * @param {string} newStatus - The new status of the task.
 */
function updateTaskStatus(taskIndex, newStatus) {
    tasks[taskIndex]['status'] = newStatus;
    setItem('tasks', JSON.stringify(tasks));
}

/**
 * Starts the dragging of an element.
 * @param {number} index - The index of the element to be dragged.
 */
function startDragging(index) {
    currentDraggedElement = index;
}