window.onload = loadQuickData;
window.sendData = sendData;
window.loadQuickData = loadQuickData;

var count = 100; 

/**
 * Loads quick items from the database 
 */
function loadQuickData(){
    let lambda = document.getElementById("quick-tasks");
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        lambda.innerHTML = "<tr><th>Task Title</th><th>Task Details</th><th>Priority</th><th>Category</th><th>Action</th></tr>";

        const items = JSON.parse(xhr.response);
        const quickItems = items.filter(item => item.category === "Quick Add");
        const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
        quickItems.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        quickItems.forEach(item => {
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
function deleteData(id){
    let xhr = new XMLHttpRequest();
    let url = "https://lgffi88j6b.execute-api.us-east-2.amazonaws.com/items/"
    let toDelete = url.concat(id);

    xhr.open("DELETE", toDelete);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function() {
        loadQuickData();  // reloads items
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
        loadQuickData();  // reloads items
    });
    var title = document.getElementById("taskTitle").value.trim();

    // Check if the Task Title is empty
    if (!title) {
        alert("Task Title is required."); 
        return; 
    }

    var taskTitle = document.getElementById("taskTitle");
    var taskDetails = document.getElementById("taskDetails");
    if(taskDetails.value == null){
        taskDetails.value = " ";
    }

    var priority = document.getElementById("priority");
    if(priority.value == null){
        priority.value = "High"
    }

    var category = document.getElementById("category");
    if(category.value == null){
        category.value = "Quick Add";
    }


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
    count = newId + 1;
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