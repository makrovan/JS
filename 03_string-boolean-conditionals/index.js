// task1
let password = '123456789';

if (password.length >= 4 && (password.includes('_') || password.includes('-'))) {
    console.log('Пароль надежный');
} else {
    console.log('Пароль недостаточно надёжный');
}

// task2
let userName = 'userName';
let userSurname = 'userSurname';

function correctWord(word) {
    let first = word.substring(0, 1);
    first = first.toUpperCase();

    let last = word.substring(1);
    last = last.toLowerCase();

    let result = first + last;
    return result;
}

let correctUserName = correctWord(userName);
let correctUserSurname = correctWord(userSurname);

console.log(`${correctUserName}`);
console.log(`${correctUserSurname}`);

let resultString = (userName === correctUserName) && (userSurname === correctUserSurname) ? "Имя осталось без изменений" : "Имя было преобразовано";
console.log(`${resultString}`)

// task3
let num = 131;

if (num % 2 === 0) {
    console.log(`Число ${num} четное`);
} else {
    console.log(`Число ${num} нечетное`);
}