document.addEventListener("DOMContentLoaded", () => {
  const todos = [];
  const RENDER_EVENT = "render_todo";
  const STORAGE_KEY = "TODO_APPS";

  document.addEventListener(RENDER_EVENT, () => {
    const uncompletedTODOList = document.getElementById("uncompleted-todos");
    uncompletedTODOList.innerHTML = "";

    const completedTODOList = document.getElementById("completed-todos");
    completedTODOList.innerHTML = "";

    for (let todoItem of todos) {
      let todoElement = makeTodo(todoItem);
      if (!todoItem.isCompleted) {
        uncompletedTODOList.append(todoElement);
      } else {
        completedTODOList.append(todoElement);
      }
    }
  });

  const title = document.getElementById("title");
  const tgl = document.getElementById("date");
  title.addEventListener("input", () => {
    if (title.value.length > 25) title.value = title.value.substring(0, 25);
  });
  const generateID = () => {
    return +new Date();
  };

  const generateTodoObject = (id, task, timestamp, isCompleted) => {
    return {
      id,
      task,
      timestamp,
      isCompleted,
    };
  };
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
    title.value = "";
    tgl.value = "";
  });

  const makeTodo = (todoObject) => {
    const textTitle = document.createElement("h2");
    textTitle.innerText = todoObject.task;

    const textTimestamp = document.createElement("p");
    textTimestamp.innerText = todoObject.timestamp;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.append(textContainer);
    container.setAttribute("id", `todo-${todoObject.id}`);

    if (todoObject.isCompleted) {
      const undoButton = document.createElement("button");
      undoButton.classList.add("undo-button");

      undoButton.addEventListener("click", () => {
        undoTaskFromCompleted(todoObject.id);
      });

      const trashButton = document.createElement("button");
      trashButton.classList.add("trash-button");

      trashButton.addEventListener("click", () => {
        removeTaskFromCompleted(todoObject.id);
      });

      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement("button");
      checkButton.classList.add("check-button");

      checkButton.addEventListener("click", () => {
        addTaskCompleted(todoObject.id);
      });

      container.append(checkButton);
    }

    return container;
  };

  const addTodo = () => {
    const textTodo = title.value;
    const timestamp = tgl.value;

    const generatedID = generateID();
    const todoObject = generateTodoObject(
      generatedID,
      textTodo,
      timestamp,
      false
    );
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  };

  const addTaskCompleted = (todoId) => {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  };

  const findTodo = (todoId) => {
    for (let todoItem of todos) {
      if (todoItem.id === todoId) {
        return todoItem;
      }
    }
    return null;
  };

  const findTodoIndex = (todoId) => {
    for (let index in todos) {
      if (todos[index].id === todoId) return index;
    }

    return -1;
  };
  const removeTaskFromCompleted = (idTodo) => {
    let todoTarget = findTodoIndex(idTodo);
    if (todoTarget === -1) return;
    todos.splice(todoTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  };

  const undoTaskFromCompleted = (idTodo) => {
    let todoTarget = findTodo(idTodo);

    if (todoTarget === null) return;

    todoTarget.isCompleted = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  };
  const saveData = () => {
    if (isStorageExist()) {
      const parsed = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, parsed);
    }
  };

  const isStorageExist = () => {
    if (typeof Storage === undefined) {
      alert("Browser tidak mendukung local storage");
      return false;
    }
    return true;
  };

  const loadDataFromStorage = () => {
    let data = localStorage.getItem(STORAGE_KEY);
    data = JSON.parse(data);

    if (data !== null) {
      for (let todo of data) {
        todos.push(todo);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  };

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
