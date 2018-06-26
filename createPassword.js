const randomPassword = Math.floor(Math.random() * (999999 - 111111) + 111111);
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const symbols = ['.', '!', '@', '#', '&'];
const array1 = [];
const array2 = [];

const random = () => {
  const chooseRandom = Math.floor(Math.random() * (7 - 0) + 0);
  return chooseRandom;
}

while (array1.length !== 5) {
  array1.push(letters[random()]);
}

while (array2.length !== 4) {
  let wowed = random();
  if (wowed <= symbols.length - 1) {
    array2.push(symbols[wowed]);
  }
}

const combineArray = array2.concat(array1).join('').toString();
const join = randomPassword + combineArray;
console.log(join);
