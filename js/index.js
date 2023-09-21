// !  =========================================================================> HTML Elements
const root = document.querySelector(":root");
const modeBtn = document.getElementById("mode");
const AddBtn = document.getElementById("newTask");
const modal = document.getElementById("modal");
const searchInput = document.getElementById("searchInput");
const statusInput = document.getElementById("status");
const categoryInput = document.getElementById("category");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const AddTaskBtn = document.getElementById("addBtn");
const updateTaskBtn = document.getElementById("updateBtn");
const section = document.querySelectorAll("section");
const gridBtn = document.getElementById("gridBtn");
const barsBtn = document.getElementById("barsBtn");
const tasksContainer = document.querySelectorAll(".tasks");
const remainingCounterElement = document.getElementById("remainingCounter");
const Containers = {
  nextUp: document.querySelector("#toDo"),
  inProgress: document.querySelector("#inProgress"),
  done: document.querySelector("#done"),
};

// ^============================================================================>APP variables
let countContainer = {
  nextUp: 0,
  inProgress: 0,
  done: 0,
};
let tasksArr = JSON.parse(localStorage.getItem("tasks")) || [];
let updatedIndex = undefined;
for (let i = 0; i < tasksArr.length; i++) {
  displayTask(i);
}
// ^=====> Regular Expressions
var titleRegex = /^\w{3,}(\s\w+)*$/;
var descriptionRegex = /^(?=.{5,100}$)\w{1,}(\s\w*)*$/;

// ? ===========================================================================> Functions
function showModal() {
  modal.classList.replace("d-none", "d-flex");
  document.body.style.overflow = "hidden";
  scroll(0, 0);
}
function hideModal() {
  modal.classList.replace("d-flex", "d-none");
  resetInput();
  AddTaskBtn.classList.remove("d-none");
  updateTaskBtn.classList.replace("d-block", "d-none");
  document.body.style.overflow = "visible";
}
function addTask() {
  if (
    validate(titleRegex, titleInput) &&
    validate(descriptionRegex, descriptionInput)
  ) {
    const task = {
      status: statusInput.value,
      category: categoryInput.value,
      title: titleInput.value,
      description: descriptionInput.value,
    };
    tasksArr.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
    displayTask(tasksArr.length - 1);
    hideModal();
    resetInput();
  }
}
function generateColor() {
  let colorChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += colorChars[Math.floor(Math.random() * colorChars.length)];
  }
  return color + "22";
}
function changeColor(event) {
  let bgColor = generateColor();
  event.target.closest(".task").style.backgroundColor = bgColor;
}
function displayTask(index) {
  let taskHTML = `
<div class="task">
<h3 class="text-capitalize">${tasksArr[index].title}</h3>
<p class="description text-capitalize">${tasksArr[index].description}</p>
<h4 class="category ${tasksArr[index].category} text-capitalize">${tasksArr[index].category}</h4>
<ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
    <li><i class="bi bi-pencil-square" onClick="getTaskInfo(${index})"></i></li>
    <li><i class="bi bi-trash-fill" onClick="deleteTask(${index})"></i></li>
    <li><i class="bi bi-palette-fill" onClick="changeColor(event)"></i></li>
</ul>
</div>
`;
  Containers[tasksArr[index].status].querySelector(
    ".tasks"
  ).innerHTML += taskHTML;
  countContainer[tasksArr[index].status]++;
  Containers[tasksArr[index].status].querySelector("span").innerHTML =
    countContainer[tasksArr[index].status];
}
function deleteTask(index) {
  tasksArr.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
  emptyContainers();
  resetCount();
  for (let i = 0; i < tasksArr.length; i++) {
    displayTask(i);
  }
}
function emptyContainers() {
  for (item in Containers) {
    Containers[item].querySelector(".tasks").innerHTML = "";
  }
}
function getTaskInfo(index) {
  showModal();
  statusInput.value = tasksArr[index].status;
  categoryInput.value = tasksArr[index].category;
  titleInput.value = tasksArr[index].title;
  descriptionInput.value = tasksArr[index].description;
  AddTaskBtn.classList.add("d-none");
  updateTaskBtn.classList.replace("d-none", "d-block");
  updatedIndex = index;
}
function updateTask() {
  emptyContainers();
  resetCount();
  tasksArr[updatedIndex].status = statusInput.value;
  tasksArr[updatedIndex].category = categoryInput.value;
  tasksArr[updatedIndex].title = titleInput.value;
  tasksArr[updatedIndex].description = descriptionInput.value;
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
  for (let i = 0; i < tasksArr.length; i++) {
    displayTask(i);
  }
  hideModal();
  AddTaskBtn.classList.remove("d-none");
  updateTaskBtn.classList.replace("d-block", "d-none");
  resetInput();
}
function resetInput() {
  statusInput.value = document.querySelectorAll("[selected]")[0].value;
  categoryInput.value = document.querySelectorAll("[selected]")[1].value;
  titleInput.value = "";
  descriptionInput.value = "";
}
function changeMode() {
  if (modeBtn.classList.contains("bi-brightness-high-fill")) {
    root.style.setProperty("--main-black", "#f1f1f1");
    root.style.setProperty("--sec-black", "#ddd");
    root.style.setProperty("--text-color", "#222");
    root.style.setProperty("--gray-color", "#333");
    root.style.setProperty("--mid-gray", "#f1f1f1");
    modeBtn.classList.replace("bi-brightness-high-fill", "bi-moon-stars-fill");
  } else {
    root.style.setProperty("--main-black", "#0d1117");
    root.style.setProperty("--sec-black", "#161b22");
    root.style.setProperty("--text-color", "#a5a6a7");
    root.style.setProperty("--gray-color", "#dadada");
    root.style.setProperty("--mid-gray", "#474a4e");
    modeBtn.classList.replace("bi-moon-stars-fill", "bi-brightness-high-fill");
  }
}
function resetCount() {
  for (item in countContainer) {
    countContainer[item] = 0;
    Containers[item].querySelector("span").innerHTML = 0;
  }
}
function validate(regex, element) {
  if (regex.test(element.value)) {
    element.classList.remove("is-invalid");
    element.classList.add("is-valid");
    element.parentElement.nextElementSibling.classList.add("d-none");
    return true;
  } else {
    element.parentElement.nextElementSibling.classList.remove("d-none");
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
    return false;
  }
}
function changeToBar() {
  gridBtn.classList.remove("active");
  barsBtn.classList.add("active");
  for (let i = 0; i < section.length; i++) {
    section[i].classList.remove("col-md-6", "col-lg-4");
    // section[i].style.overflow = "auto";
  }
  for (let j = 0; j < tasksContainer.length; j++) {
    tasksContainer[j].setAttribute("data-view", "bars");
  }
}
function changeToGrid() {
  barsBtn.classList.remove("active");
  gridBtn.classList.add("active");
  for (let i = 0; i < section.length; i++) {
    section[i].classList.add("col-md-6", "col-lg-4");
    // section[i].style.overflow = "auto";
  }
  for (let j = 0; j < tasksContainer.length; j++) {
    tasksContainer[j].removeAttribute("data-view", "bars");
  }
}
function searchTask() {
  emptyContainers();
  resetCount();
  let searchKey = searchInput.value;
  for (var i = 0; i < tasksArr.length; i++) {
    if (
      tasksArr[i].title.toLowerCase().includes(searchKey.toLowerCase()) ||
      tasksArr[i].category.toLowerCase().includes(searchKey.toLowerCase())
    ) {
      displayTask(i);
    }
  }
}

// *=============================================================================> Events
AddBtn.addEventListener("click", showModal);
// *====================================> [1] Hide Modal using Escape keypress
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    hideModal();
  }
});
// *====================================> [2] Hide Modal when clicking on Div background
modal.addEventListener("click", function(e) {
  if (e.target.id === "modal") {
    hideModal();
  }
});
// *====================================> Add a Task
AddTaskBtn.addEventListener("click", addTask);
// *====================================> Update a Task
updateTaskBtn.addEventListener("click", updateTask);
// *====================================> change mode
modeBtn.addEventListener("click", changeMode);
// *====================================> Title Input validation
titleInput.addEventListener("input", () => {
  validate(titleRegex, titleInput);
});
// *====================================> Description Input validation
descriptionInput.addEventListener("input", () => {
  validate(descriptionRegex, descriptionInput);
  remainingCounter = 100 - descriptionInput.value.length;
  remainingCounterElement.innerHTML = remainingCounter;
});
// *====================================> Bar view display
barsBtn.addEventListener("click", changeToBar);
// *====================================> Grid view display
gridBtn.addEventListener("click", changeToGrid);
// *====================================> Search for tasks
searchInput.addEventListener("input", searchTask);
