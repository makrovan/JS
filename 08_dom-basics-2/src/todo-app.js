(function () {
  let todoArray = [];
  let todoArrayStorage;

  //заголовок приложения
  function createApiTitle(title) {
    let apiTitle = document.createElement('h2');
    apiTitle.innerHTML = title;
    return apiTitle;
  }

  //форма для создания тела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true;

    input.addEventListener('input', function () {
      button.disabled = false;
    })

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  //список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    for (todoInstance of todoArray) {
      let todoItem = createTodoItem(todoInstance.name, todoInstance.done, todoInstance.id);
      list.append(todoItem.item);
    }
    return list;
  }

  function createTodoItem(name, done, id = 0) {
    if (id === 0) {
      id = addNewItem(name, done);
    }
    let item = document.createElement('li');
    //элемент с кнопками
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    if (done) {
      item.classList.add('list-group-item-success');
    }
    item.setAttribute('id', id);
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    doneButton.addEventListener('click', function (e) {
      toggleItem(item.id);
      item.classList.toggle('list-group-item-success');
    });
    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        removeItem(item.id);
        item.remove();
      }
    });


    //добавляем кнопки в группу элементов
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton
    }
  }

  //-------------------------------------------------------------------
  function getNextId(todoArray) {
    if (todoArray.length === 0) {
      return 1;
    } else {
      return todoArray[todoArray.length - 1].id + 1;
    }
  }

  function addNewItem(name, done) {
    let id = getNextId(todoArray);
    let todoItem = {
      id,
      name,
      done
    }

    todoArray.push(todoItem);
    saveTodoArray();
    return id;
  }

  function removeItem(id) {
    for (index of Object.keys(todoArray)) {
      if (parseInt(todoArray[index].id) === parseInt(id)) {
        todoArray.splice(index, 1);
        break;
      }
    }
    saveTodoArray();
  }

  function toggleItem(id) {
    for (index of Object.keys(todoArray)) {
      if (parseInt(todoArray[index].id) === parseInt(id)) {
        todoArray[index].done = !todoArray[index].done;
        break;
      }
    }
    saveTodoArray();
  }

  function saveTodoArray() {
    let storageString = JSON.stringify(todoArray);
    localStorage.setItem(todoArrayStorage, storageString);
  }

  function getTodoArray() {
    let storageString = localStorage.getItem(todoArrayStorage);
    if (storageString) {
      todoArray = JSON.parse(storageString);
    }
  }

  //-------------------------------------------------------------------
  function createTodoApp(container, title, storageTitle) {
    todoArrayStorage = storageTitle;
    getTodoArray();

    let todoAppTitle = createApiTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    //событие submit по нажатию enter либо на кнопку
    todoItemForm.form.addEventListener('submit', function (e) {
      //отменяем стандартные действия браузера - перезагрузку страницы
      e.preventDefault();

      //проверка на то, что что-то введено
      if (!todoItemForm.input.value) {
        return;
      }

      let todoItem = createTodoItem(todoItemForm.input.value, false);

      //создаем и добавляем в список новое дело
      todoList.append(todoItem.item);
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    });

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);
  }

  // document.addEventListener('DOMContentLoaded', createTodoApp(document.getElementById('todo-app'), 'Список дел'))
  window.createTodoApp = createTodoApp;
})();
