(() => {
  // Этап 1. Создайте функцию, генерирующую массив парных чисел.
  // Пример массива, который должна возвратить функция:
  // [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].count - количество пар.
  function createNumbersArray(count) {
    const pairs = [];
    let localCount = count * count;
    localCount /= 2;
    for (let i = 1; i <= localCount; i++) {
      pairs.push(i);
      pairs.push(i);
    }
    return pairs;
  }

  // Этап 2. Создайте функцию перемешивания массива.Функция принимает
  // в аргументе исходный массив и возвращает перемешанный массив. arr - массив чисел
  // https://ru.hexlet.io/qna/javascript/questions/kak-peremeshat-elementy-massiva-js
  function shuffle(arr) {
    let m = arr.length;
    let t;
    let i;

    // Пока есть элементы для перемешивания
    while (m) {
      // Взять оставшийся элемент
      i = Math.floor(Math.random() * m--);
      // И поменять его местами с текущим элементом
      t = arr[m];
      arr[m] = arr[i];
      arr[i] = t;
    }
    return arr;
  }

  function clearDOM() {
    const element = document.getElementById('pairs-app');
    element.remove();
    const container = document.createElement('div');
    container.classList.add('container');
    container.setAttribute('id', 'pairs-app');
    document.body.append(container);
  }

  function createCards(container, pairs, filedSize = 4) {
    let id = 0;
    let clickedBtnId = null;

    for (let lineNumber = 0; lineNumber < filedSize; lineNumber++) {
      const row = document.createElement('div');
      row.classList.add('row');
      container.append(row);

      for (let columnNumber = 0; columnNumber < filedSize; columnNumber++) {
        const cardField = document.createElement('div');
        cardField.classList.add('col');
        cardField.classList.add('py-3');
        cardField.style.height = `${100 / filedSize}vh`;
        row.append(cardField);

        const button = document.createElement('button');
        button.setAttribute('id', id++);
        button.style.width = '100%';
        button.style.height = '100%';
        button.addEventListener('click', () => {
          if (clickedBtnId === null) {
            clickedBtnId = button.id;
            button.textContent = pairs[button.id];
            button.disabled = true;
          } else {
            button.textContent = pairs[button.id];
            button.disabled = true;
            setTimeout(() => {
              if (pairs[clickedBtnId] !== pairs[button.id]) {
                button.textContent = '';
                button.disabled = false;

                document.getElementById(clickedBtnId).textContent = '';
                document.getElementById(clickedBtnId).disabled = false;
              }
              clickedBtnId = null;
            }, 1000);
          }
        });
        cardField.append(button);
      }
    }
  }

  // Этап 3. Используйте две созданные функции для создания массива перемешанными номерами.
  // На основе этого массива вы можете создать DOM-элементы карточек.
  // У каждой карточки будет свой номер из массива произвольных чисел.
  // Вы также можете создать для этого специальную функцию. count - количество пар.
  function startGame(count) {
    clearDOM();
    let pairs = createNumbersArray(count);
    pairs = shuffle(pairs);
    console.log(pairs);

    createCards(document.getElementById('pairs-app'), pairs, count);
    setTimeout(() => {
      clearDOM();
      console.log('время вышло...');
    }, 60000);
  }

  function getSize(container) {
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.type = 'number';
    const buttonWrapper = document.createElement('div');
    const button = document.createElement('button');

    form.classList.add('input-group', 'mt-5');
    input.classList.add('form-control');
    input.placeholder = 'Введите размер поля';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Начать игру';

    button.disabled = true;

    input.addEventListener('input', () => {
      button.disabled = false;
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value % 2) {
        startGame(4);
      } else {
        startGame(input.value);
      }
    });

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);
    container.append(form);
  }

  document.addEventListener('DOMContentLoader', getSize(document.getElementById('pairs-app')));
})();
