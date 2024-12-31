const tasksList = document.getElementById("tasks-list");
const submitBtn = document.getElementById("submit-btn");
const taskTitle = document.getElementById("task-input");
const taskDesc = document.getElementById("task-desc-input");
const overlay = document.getElementById("overlay");
const editMenu = document.getElementById("edit-menu");
const exitBtn = document.getElementById("exit-btn");
const cancelBtn = document.getElementById("cancel-btn");

const API_URL = `http://localhost:8000/tasks`;

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
    overlay.className = 'overlay';
}

fetch(API_URL)
.then(response=>response.json())
.then(data => data["all tasks"].forEach(element => {

    const new_div = document.createElement('div');

    new_div.id = "single-task-box";
    new_div.className = "single-task-box";

    const {date_created, description, isFinished, title, _id} = element;

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
.catch(error => console.log("ERROR:", error));


submitBtn.addEventListener("click", (event)=>{

    console.log(`title: ${taskTitle.value}`);
    console.log(`description: ${taskDesc.value}`);

    console.log("submit button clicked");

    if(!taskTitle.value){
        console.log("title is empty!");
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

            new_div.id = "single-task-box";
            new_div.className = "single-task-box";

            const {date_created, description, isFinished, title, _id} = data["new_added_data"];

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