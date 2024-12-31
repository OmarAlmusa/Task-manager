const tasksList = document.getElementById("tasks-list");
const submitBtn = document.getElementById("submit-btn");
const taskTitle = document.getElementById("task-input");
const taskDesc = document.getElementById("task-desc-input");

const overlay = document.getElementById("overlay");

const editMenu = document.getElementById("edit-menu");
const editMenuTop = editMenu.querySelector(`div[id="edit-menu-top"] h3`);

const editInputs = document.getElementById("edit-inputs");

const editTitle = editInputs.querySelector(`div[id="input-boxes"] input[id="task-input"]`);
const editDescription = editInputs.querySelector(`div[id="input-boxes"] input[id="task-desc-input"]`);
const editFinished = editInputs.querySelector(`div[id="input-boxes"] input[type="checkbox"]`);

const exitBtn = document.getElementById("exit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const deleteBtn = document.getElementById("delete-btn");
const applyBtn = document.getElementById("apply-btn");

const API_URL = `http://localhost:8000/tasks`;

const tasksListChecker = () => {
    if(tasksList.innerHTML === ''){
        tasksList.className = "tasks-list hidden";
    }else{
        tasksList.className = "tasks-list";
    }
}

const handleCheckboxChange = (event) => {
    const checkbox = event.target;
    const taskId = checkbox.id; // Use the checkbox ID as the task ID
    const isFinished = checkbox.checked; // Get the new state of the checkbox

    // Send a PATCH request to update `isFinished`
    fetch(`${API_URL}/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ "isFinished": isFinished }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Task updated successfully:", data);

            const updatedTask = data["updated_task"];

            const taskText = checkbox.nextElementSibling; // Get the sibling div with the task text

            const titleElement = taskText.querySelector("h3"); // Find the <h3> element for the title
            const descElement = taskText.querySelector("p")

            if (isFinished) {
                // Add a strike-through
                titleElement.innerHTML = `<s>${updatedTask.title}</s>`;
                descElement.textContent = "";
            } else {
                // Remove the strike-through
                titleElement.innerHTML = updatedTask.title;
                descElement.textContent = updatedTask.description || "";
            }
        })
        .catch((error) => console.error("Error updating task:", error));
};


const handleEditButtonClick = (event) =>{
    const edit_button = event.target;
    const task_id = edit_button.id;

    overlay.className = 'overlay';
    editMenu.id = task_id;
    editMenuTop.textContent = `Edit task ${task_id}`;

    //fill the current info:
    fetch(`${API_URL}/${task_id}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)

        const foundTask = data["found task"];
        editTitle.value = foundTask.title;
        editDescription.value = foundTask.description;
        editFinished.checked = foundTask.isFinished;
    })
    .catch(error => console.log(error));
    

    const selectTaskToEdit = tasksList.querySelector(`div[id='${task_id}']`);

    const selectedTaskTitle = selectTaskToEdit.querySelector(`div[id="task-text"] h3`);
    const selectedTaskDesc = selectTaskToEdit.querySelector(`div[id="task-text"] p`);
    const selectedTaskFinished = selectTaskToEdit.querySelector(`input[class="checkbox-single-task"]`);
    
    //The delete button:
    const newDeleteListener = (event)=>{
        fetch(`${API_URL}/${task_id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            tasksList.removeChild(selectTaskToEdit);


            //Exit the edit menu:
            overlay.className = 'overlay hidden';

            //check if the list is empty:
            tasksListChecker();
        })
        .catch(error => console.log(error));
    }


    deleteBtn.removeEventListener("click", deleteBtn._currentListener); // Remove the previously stored listener (if any)
    deleteBtn._currentListener = newDeleteListener; // Store the new listener
    deleteBtn.addEventListener("click", newDeleteListener);

    const newPatchListener = (event) => {
        fetch(`${API_URL}/${task_id}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({ 
                "title": editTitle.value,
                "description": editDescription.value,
                "isFinished": editFinished.checked
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            const updated_task_data = data["updated_task"];

            selectedTaskTitle.textContent = updated_task_data["title"];
            selectedTaskDesc.textContent = updated_task_data["description"];
            selectedTaskFinished.checked = updated_task_data["isFinished"];

            if (updated_task_data["isFinished"]) {
                // Add a strike-through
                selectedTaskTitle.innerHTML = `<s>${updated_task_data["title"]}</s>`;
                selectedTaskDesc.textContent = "";
            } else {
                // Remove the strike-through
                selectedTaskTitle.innerHTML = updated_task_data["title"];
                selectedTaskDesc.textContent = updated_task_data["description"] || "";
            }

            //Exit the edit menu:
            overlay.className = 'overlay hidden';

        })
        .catch(error => console.log(error))
    }

    applyBtn.removeEventListener("click", applyBtn._currentListener);
    applyBtn._currentListener = newPatchListener;
    applyBtn.addEventListener("click", newPatchListener);

}

fetch(API_URL)
.then(response=>response.json())
.then(data => data["all tasks"].forEach(element => {

    const new_div = document.createElement('div');

    
    new_div.className = "single-task-box";

    const {date_created, description, isFinished, title, _id} = element;

    new_div.id = _id;

    if(isFinished){
        new_div.innerHTML = `<input type="checkbox" id="${_id}" name="${title}" class="checkbox-single-task" checked />
                            <div class="task-text" id="task-text">
                                <h3><s>${title}</s></h3>
                                <p></p>
                            </div>
                            <button id="${_id}" class="edit-btn">Edit</button>`;
    }else{
        new_div.innerHTML = `<input type="checkbox" id="${_id}" name="${title}" class="checkbox-single-task" />
                            <div class="task-text" id="task-text">
                                <h3>${title}</h3>
                                <p>${description || ""}</p>
                            </div>
                            <button id="${_id}" class="edit-btn">Edit</button>`;
    }

    tasksList.appendChild(new_div);

    // Attach the change event listener to the checkbox
    const checkbox = new_div.querySelector(".checkbox-single-task");
    checkbox.addEventListener("change", handleCheckboxChange);

    const editBtn = new_div.querySelector(".edit-btn");
    editBtn.addEventListener("click", handleEditButtonClick);

}))
.then(()=>{
    //check if the list is empty:
    tasksListChecker();
})
.catch(error => console.log("ERROR:", error));


submitBtn.addEventListener("click", (event)=>{

    if(!taskTitle.value){
        console.log("title is empty!");
        Swal.fire({
            icon: 'warning', // Exclamation icon
            title: 'Oops...',
            text: 'Please fill the title!',
        });
        return;


    }else{
        fetch(API_URL,
            {
                method: 'POST',
                body: JSON.stringify({
                    title: taskTitle.value,
                    description: taskDesc.value
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }
        ).then(response => response.json())
        .then((data) => {
            console.log('SUCCESS:', data);

            const new_div = document.createElement('div');

            
            new_div.className = "single-task-box";

            const {date_created, description, isFinished, title, _id} = data["new_added_data"];

            new_div.id = _id;

            new_div.innerHTML = `<input type="checkbox" id="${_id}" name="${title}" class="checkbox-single-task" />
                        <div class="task-text" id="task-text">
                            <h3>${title}</h3>
                            <p>${description || ""}</p>
                        </div>
                        <button id="${_id}" class="edit-btn">Edit</button>`;
            
            tasksList.appendChild(new_div);

            const checkbox = new_div.querySelector(".checkbox-single-task");
            checkbox.addEventListener("change", handleCheckboxChange);

            const editBtn = new_div.querySelector(".edit-btn");
            editBtn.addEventListener("click", handleEditButtonClick);

            taskTitle.value = "";
            taskDesc.value = "";

            //check if the list is empty:
            tasksListChecker();

        })
        .catch(error => console.log('ERROR:', error));
    }

    
})

overlay.addEventListener("click", (event)=>{
    if(event.target === overlay){
        
        overlay.className = "overlay hidden";

    }
})

exitBtn.addEventListener("click", (event)=>{
    overlay.className = "overlay hidden";
})

cancelBtn.addEventListener("click", (event)=>{
    overlay.className = "overlay hidden";
})