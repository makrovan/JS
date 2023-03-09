//task1

let x1 = 5;
let y1 = 8;

let x2 = 5;
let y2 = 5;

let x3 = x1;
let y3 = y2;

let x4 = x2;
let y4 = y1;

function sideLength(x1, y1, x2, y2) {
  let cathenus1 = Math.abs(x1 - x2);
  let cathenus2 = Math.abs(y1 - y2);

  return Math.sqrt(
    Math.pow(cathenus1, 2) + Math.pow(cathenus2, 2))
}

console.log(
  sideLength(x1, y1, x4, y4) * sideLength(x1, y1, x3, y3)
);


// task2
let precision = 3;
let a = 13.890123;
let b = 2.891564;

function getFraction(a) {
  return Math.round(
    a % 1 * Math.pow(10, precision))
}

let firstFraction = getFraction(a);
let secondFraction = getFraction(b);

console.log('Дробные части:', firstFraction, ',', secondFraction);
console.log('Дробная часть первого больше второго:', firstFraction > secondFraction);
console.log('Дробная часть первого меньше второго:', firstFraction < secondFraction);
console.log('Дробная часть первого больше либо равна второго:', firstFraction >= secondFraction);
console.log('Дробная часть первого меньше либо равна второго:', firstFraction <= secondFraction);
console.log('Дробные части равны:', firstFraction === secondFraction);
console.log('Дробные части не равны:', firstFraction !== secondFraction);
