window.onload = loadData;
window.sendData = sendData;
window.loadData = loadData;

var count = 0; 

/**
 * Loads items from the database 
 */
function loadData(){
    let lambda = document.getElementById("all-tasks");
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        lambda.innerHTML = "<tr><th>ID</th><th>Task Title</th><th>Task Details</th><th>Priority</th><th>Category</th><th>Action</th></tr>";

        const items = JSON.parse(xhr.response);

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
            button.innerText = "Delete";
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
function deleteData(id){
    let xhr = new XMLHttpRequest();
    let url = "https://lgffi88j6b.execute-api.us-east-2.amazonaws.com/items/"
    let toDelete = url.concat(id);

    xhr.open("DELETE", toDelete);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function() {
        document.getElementById("load-data-button").click();  // reloads items
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
        document.getElementById("load-data-button").click();  // reloads items
    });

    count += 1;
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

    // Generate a unique ID - just in case page is reloaded
    let newId = count;
    while (existingIds.includes(newId)) {
        newId++;
    }

    xhr.send(JSON.stringify({
        "id": newId.toString(),
        "taskTitle": taskTitle.value,
        "taskDetails": taskDetails.value,
        "priority": priority.value,
        "category": category.value
    }));

    taskTitle.value = "";
    taskDetails.value = "";

}