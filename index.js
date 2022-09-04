// Sacamos los elementos del DOM
const input = document.querySelector(".input-text");
const addForm = document.querySelector(".add-form");
const tasksList = document.querySelector(".tasks-list"); // <ul></ul>
const deleteBtn = document.querySelector(".deleteAll-btn");


//  Obtenemos del Local Storage las listas, si no hay nada en el LS es un array vacío
let tasks = JSON.parse(localStorage.getItem("tareitas")) || [];

// Que el boton de borrar todas las tareas desaparezca cuando no haya ninguna
const hideDeleteAllButton = (tasksList) => {
    if (!tasks.length) {
      deleteBtn.classList.add("none");
      return;
    }
  
    deleteBtn.classList.remove("none");
  };

// Creamos la función para setear los elementos en el Local Storage
const saveToLocalStorage = (tasksList) => {
    // Seteamos en el LS con la misma KEY con la que geteamos, y convertimos con stringify (porque acepta sólo strings).
    localStorage.setItem("tareitas", JSON.stringify(tasksList));
}

// Creamos la funcion para pintar el nuevo texto html
const renderList = (list) => {tasksList.innerHTML = list.map((task) => `<li>${task.name} <img src="./img/trash2.png" alt="Boton para borrar tarea" class="delete-btn" data-id=${task.taskId} /> </li>`).join("");};



const addTask = (e) => {
  
    // Eliminamos el comportamiento por default del submit
    e.preventDefault();

    // Guardamos el valor del input en una variable, eliminando espacios en blanco
    const taskName = input.value.trim();

    // Condicional por si no se ingresa ningun valor
    if (!taskName.length){
        alert("Por favor ingrese una tarea")
    } else if (
        tasks.some((task) => task.name.toUpperCase() === taskName.toUpperCase())){
        alert("Ya existe esa tarea!")
        return;
    } else{

        // Traigo todo lo que tenga tasks y le agrego un objeto: Con el nombre de la tarea y el incremento de su id
        tasks = [...tasks, {name: taskName, taskId: tasks.length + 1}]
        
        // Llamamos a la funcion que envía el valor ingresado al Local Storage
        saveToLocalStorage(tasks)
        // Pintamos las tareas nuevas
        renderList(tasks)
        // Agregamos el botón de borrar todas las tareas
        hideDeleteAllButton(tasks)

        input.value = "";
    }
}

// Creamos la funcion para el boton de borrar tarea
const deleteTask = (e) => {
    
    // Si el ul no contiene esa clase, sali de la fn
    if (!e.target.classList.contains("delete-btn")) {
        return;
    } 
    
    // Sacamos el data id
    const id = +e.target.dataset.id;
    
    // Se crea un nuevo array filtrado con las tareas anteriores MENOS con la que tiene el id del evento al que hizo click
    tasks = tasks.filter((task) => task.taskId !== id);

    
    // Se modifica el LocalStorage
    saveToLocalStorage(tasks);

    // Pinta la nueva lista de tareas
    renderList(tasks);

    // Actualiza el btn de borrar todo
    hideDeleteAllButton(tasks);

}

const deleteAll = () => {

    tasks = [];

    saveToLocalStorage(tasks);
    renderList(tasks);
    hideDeleteAllButton(tasks);
}

// Creamos la función que añade un escuchador al iniciar la página
const init = () => {
    renderList(tasks);
    addForm.addEventListener("submit", addTask);
    tasksList.addEventListener("click", deleteTask);
    deleteBtn.addEventListener("click", deleteAll);
    hideDeleteAllButton(tasks);
};

init();