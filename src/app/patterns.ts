export const patterns = (arr) => {
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      if(arr[i][j] != 1){
        return;
      }
    }
  }

}
