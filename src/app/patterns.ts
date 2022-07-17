export const patterns = (arr: Array<Array<number>>, score) => {
  var squares = [];
  var columns = [];
  var rows = [];
  //check
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

      if (isScore) {
        squares.push([row, col])
      }
      isScore = true;
    }
  }

  for (let i = 0; i < 9; i++) {
    var isOne = true;
    for (let j = 0; j < 9; j++) {
      if (arr[j][i] != 1) {
        isOne = false;
        break;
      }
    }
    if (isOne) {
      columns.push(i);
    }
  }

  const allOne = arr => arr.every(v => v === 1);

  for (let i = 0; i < 9; i++) {
    if (allOne(arr[i])) {
      rows.push(i);
    }
  }

//---------------------------------------- 0 -------------------------------------------//

  //execute squares
  // squares.forEach(l => {
  //   score++;
  //   for (let i = l[0]; i < l[0] + 3; i++) {
  //     for (let j = l[1]; j < l[1] + 3; j++) {
  //       arr[i][j] = 0;
  //     }
  //   }
  // })

  //execute columns
  // columns.forEach(i => {
  //   score++;
  //   for (let j = 0; j < 9; j++) {
  //     arr[j][i] = 0;
  //   }
  // })

  //execute rows
  // rows.forEach(i => {
  //   score++;
  //   arr[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  // })

  return [rows, columns, squares];
}

export const executePatterns = (score, playGround, props) => {
  var squares = props[2];
  var columns = props[1];
  var rows = props[0];

  squares.forEach(l => {
    score++;
    for (let i = l[0]; i < l[0] + 3; i++) {
      for (let j = l[1]; j < l[1] + 3; j++) {
        playGround[i][j] = 0;
      }
    }
  })

  //execute columns
  columns.forEach(i => {
    score++;
    for (let j = 0; j < 9; j++) {
      playGround[j][i] = 0;
    }
  })

  //execute rows
  rows.forEach(i => {
    score++;
    playGround[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  })

  return score;
}

export const willBreakPatterns = (arr: Array<Array<number>>) => {
  var squares = [];
  var columns = [];
  var rows = [];
  //check
  var isScore = true;
  for (let row = 0; row < 9; row += 3) {
    for (let col = 0; col < 9; col += 3) {
      for (let i = row; i < row + 3; i++) {
        for (let j = col; j < col + 3; j++) {
          if (arr[i][j] != 1 && arr[i][j] != 2) {
            isScore = false;
            break;
          }
        }
        if (!isScore) {
          break;
        }
      }

      if (isScore) {
        squares.push([row, col])
      }
      isScore = true;
    }
  }

  for (let i = 0; i < 9; i++) {
    var isOne = true;
    for (let j = 0; j < 9; j++) {
      if (arr[j][i] != 1 && arr[j][i] != 2) {
        isOne = false;
        break;
      }
    }
    if (isOne) {
      columns.push(i);
    }
  }

  const allOne = arr => arr.every(v => v === 1 || v === 2);

  for (let i = 0; i < 9; i++) {
    if (allOne(arr[i])) {
      rows.push(i);
    }
  }

  return [rows, columns, squares];
}
