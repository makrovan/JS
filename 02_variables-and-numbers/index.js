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
