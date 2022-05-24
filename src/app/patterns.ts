export const patterns = (arr: Array<Array<number>>, score: number) => {
  //check
  // debugger;
  var isScore = true;
  for (let row = 0; row < 9; row += 3) {
    for (let col = 0; col < 9; col += 3) {
      for (let i = row; i < row + 3; i++) {
        for (let j = col; j < col + 3; j++) {
          if (arr[i][j] != 1) {
            isScore = false;
            break;
          }
        }
        if (!isScore) {
          break;
        }
      }

      //execute
      if (isScore) {
        score++;
        for (let i = row; i < row + 3; i++) {
          for (let j = col; j < col + 3; j++) {
            arr[i][j] = 0;
          }
        }
      }
      isScore = true;
    }
  }



  for(let i = 0; i < 9; i++){
    var isOne = true;
    for(let j = 0; j < 9; j++) {
      if(arr[j][i] != 1){
        isOne = false;
        break;
      }
    }
    if(isOne){
      score++;
      for(let j = 0; j < 9; j++){
        arr[j][i] = 0;
      }
    }
  }

  const allOne = arr => arr.every(v => v === 1)

  for (let i = 0; i < 9; i++) {
    if (allOne(arr[i])) {
      score++;
      arr[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
  }

  return score;
}
