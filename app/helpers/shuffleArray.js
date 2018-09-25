const shuffleArray = arr => {
  var i = arr.length,
    j,
    temp;
  if (i == 0) return arr;
  while (--i) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

export default shuffleArray;
