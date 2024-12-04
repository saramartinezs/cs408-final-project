window.onload = loadData;
window.sendData = sendData;
window.loadData = loadData;

var count = 1; 

/**
 * Loads items from the database 
 */
function loadData(){
    let lambda = document.getElementById("all-tasks");
    if (!lambda) {
        console.error("Element with ID 'all-tasks' not found.");
        return; // Exit the function if the element doesn't exist
    }
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        lambda.innerHTML = "<tr><th>Task Title</th><th>Task Details</th><th>Priority</th><th>Category</th><th>Action</th></tr>";

        var items = JSON.parse(xhr.response);
        items = sortTasksByPriority(items);
        items.forEach(item => {
            var row = lambda.insertRow();
            var id = row.insertCell(0);
            var taskTitle = row.insertCell(1);
            var taskDetails = row.insertCell(2);
            var priority = row.insertCell(3);
            var category = row.insertCell(4); 
            var action = row.insertCell(5);
            id.innerText = item.id;
            taskTitle.innerText = item.taskTitle;
            taskDetails.innerText = item.taskDetails;
            priority.innerText = item.priority;
            category.innerText = item.category;

            let button = document.createElement('button');
            button.innerText = "Done";
            button.onclick = function() {deleteData(item.id)};
            action.appendChild(button);
        });
    });

    xhr.open("GET", " https://lgffi88j6b.execute-api.us-east-2.amazonaws.com/items");
    xhr.send();
}

/**
 * Deletes an item from the database
 * @param {*} id The id of the item that will be deleted from the database
 */
export function deleteData(id){
    let xhr = new XMLHttpRequest();
    let url = "https://lgffi88j6b.execute-api.us-east-2.amazonaws.com/items/"
    let toDelete = url.concat(id);

    xhr.open("DELETE", toDelete);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function() {
        loadData();  // reloads items
    });
    xhr.send();
}

/**
 * Sends data about an item to the database
 */
function sendData(){
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", " https://lgffi88j6b.execute-api.us-east-2.amazonaws.com/items");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function() {
        loadData();  // reloads items
    });
    var title = document.getElementById("taskTitle").value.trim();

    // Check if the Task Title is empty
    if (!title) {
        alert("Task Title is required."); 
        return; 
    }

    var taskTitle = document.getElementById("taskTitle");
    var taskDetails = document.getElementById("taskDetails");
    var priority = document.getElementById("priority");
    var category = document.getElementById("category");

    // Get existing IDs from the table
    let existingIds = [];
    let rows = document.querySelectorAll("#all-tasks tr");
    rows.forEach((row, index) => {
        if (index > 0) { // Skip the header row
            let idCell = row.cells[0];
            existingIds.push(parseInt(idCell.innerText));
        }
    });

    count = generateUniqueId(existingIds, count);
    xhr.send(JSON.stringify({
        "id": count.toString(),
        "taskTitle": taskTitle.value,
        "taskDetails": taskDetails.value,
        "priority": priority.value,
        "category": category.value
    }));

    taskTitle.value = "";
    taskDetails.value = "";

}

export function sortTasksByPriority(items) {
    const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
    return items.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
}

export function generateUniqueId(existingIds, count) {
    let newId = count;
    console.log("newId before: " + newId);

    while (existingIds.includes(newId)) {
        newId++;
    }
    console.log("newId: " + newId);
    return newId;
}