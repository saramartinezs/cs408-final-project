window.onload = loadChoresData;

/**
 * Loads chores items from the database 
 */
function loadChoresData(){
    let lambda = document.getElementById("chores-tasks");
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        lambda.innerHTML = "<tr><th>Task Title</th><th>Task Details</th><th>Priority</th><th>Category</th><th>Action</th></tr>";

        const items = JSON.parse(xhr.response);
        const choresItems = items.filter(item => item.category === "Chores");
        const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
        choresItems.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

        choresItems.forEach(item => {
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
        loadChoresData();  // reloads items
    });
    xhr.send();
}