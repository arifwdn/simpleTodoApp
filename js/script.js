document.addEventListener("DOMContentLoaded", () => {
  const todos = [];
  const RENDER_EVENT = "render_todo";
  document.addEventListener(RENDER_EVENT, () => {
    const uncompletedTODOList = document.getElementById("todos");
    uncompletedTODOList.innerHTML = "";

    for (let todoItem of todos) {
      let todoElement = makeTodo(todoItem);
      uncompletedTODOList.append(todoElement);
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

    return container;
  };
});
