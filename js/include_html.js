/**
 * This function is used to load HTML content from different files and include it into the current page.
 * Once all content has been fetched and included, it calls a callback function.
 *
 * @param {Function} callback - The callback function to be executed once all includes are loaded.
 * @returns {Promise<void>} Returns a promise that resolves when all the fetch requests have been completed.
 */
async function includeHTML(callback) {
    // Get all elements that have the 'w3-include-html' attribute
    let includeElements = document.querySelectorAll('[w3-include-html]');
    // Initialize an array to store all the fetch promises
    let promises = [];

    // Loop over all elements with the 'w3-include-html' attribute
    for (let i = 0; i < includeElements.length; i++) {
        // Get the current element
        const element = includeElements[i];
        // Get the file path from the 'w3-include-html' attribute
        let file = element.getAttribute("w3-include-html"); // "includes/header.html"
        
        // Fetch the content of the file
        let promise = fetch(file)
            .then(resp => {
                // If the response is OK (status 200-299), return the text content of the file
                if (resp.ok) {
                    return resp.text();
                } else {
                    // If the response is not OK, throw an error
                    throw new Error('Page not found');
                }
            })
            .then(text => {
                // Replace the content of the element with the text content of the file
                element.innerHTML = text;
            });

        // Add the fetch promise to the array of promises
        promises.push(promise);
    }

    // Wait until all fetch promises have been fulfilled
    await Promise.all(promises);
    // All fetches are done, call the callback function
    callback();
}
