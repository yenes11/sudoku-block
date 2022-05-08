import { Component, OnInit } from '@angular/core';
import { blocks } from '../blocks';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  blocks = blocks;
  isDelete = false;

  firstRandom = Math.floor(Math.random() * 54) + 1;
  secondRandom = Math.floor(Math.random() * 54) + 1;
  thirdRandom = Math.floor(Math.random() * 54) + 1;

  firstObject = this.blocks[this.firstRandom];
  secondObject = this.blocks[this.secondRandom];
  thirdObject = this.blocks[this.thirdRandom];

  firstBlock = this.firstObject.block;
  secondBlock = this.secondObject.block;
  thirdBlock = this.thirdObject.block;

  jokerOneBlock = blocks[0].block;

  lastSnapShot = [];

  playGround =
    [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

  pieceRow: number;
  pieceColumn: number;
  targetId: string;
  score = 0;
  sandName: string;



  constructor() { }

  ngOnInit() {
  }

  undo() {
    console.log(this.lastSnapShot);
    this.playGround = this.lastSnapShot;
  }

  rotateOne() {
    let rotate = this.firstObject.rotate;
    this.firstObject = this.blocks.filter(obj => obj.id == rotate)[0];
    this.firstBlock = this.firstObject.block;
  }
  rotateTwo() {
    let rotate = this.secondObject.rotate;
    this.secondObject = this.blocks.filter(obj => obj.id == rotate)[0];
    this.secondBlock = this.secondObject.block;
  }
  rotateThree() {
    let rotate = this.thirdObject.rotate;
    this.thirdObject = this.blocks.filter(obj => obj.id == rotate)[0];
    this.thirdBlock = this.thirdObject.block;
  }

  allowDrop(ev: any) {
    ev.preventDefault();
  }

  drag(ev: any) {
    ev.dataTransfer.setData("text", ev.target.id);

  }

  getId(ev) {

    let id = ev.target.id.split('x');
    this.sandName = ev.target.getAttribute('name');
    this.pieceRow = parseInt(id[0]);
    this.pieceColumn = parseInt(id[1]);
  }

  toggleDelete() {
    this.isDelete = !this.isDelete;
    var div = document.querySelector('#del');

    div.innerHTML = this.isDelete ? 'DELETE MOD ACTİVE' : 'DELETE MOD INACTIVE';
  }

  deleteBox(ev) {
    if(this.isDelete){
      const id = ev.target.id.split('x');
      let row = id[0];
      let column = id[1];
      this.playGround[row][column] = 0;
    }
  }

  drop(ev: any) {
    //get a snapshot for undo
    this.lastSnapShot = [];
    this.playGround.forEach((arr) => {
      var x = [];
      arr.forEach((obj) => {
        x.push(obj);
      });
      this.lastSnapShot.push(x);
    });

    console.debug();
    let referenceBox = this.sandName == 'second' ? this.secondBlock : (this.sandName == 'third' ? this.thirdBlock : (this.sandName == 'jokerOne' ? this.jokerOneBlock : this.firstBlock));
    let plusRow = referenceBox.length;
    let plusColumn = referenceBox[0].length;
    let rowColumn = ev.target.id.split('x');
    let row = parseInt(rowColumn[0]);
    let column = parseInt(rowColumn[1]);
    console.log(row + " " + column);

    if (column + (plusColumn - this.pieceColumn - 1) >= 9 || column - this.pieceColumn < 0 || row - this.pieceRow + plusRow - this.pieceRow > 9) {
      return;
    }

    //check if available
    let rw = 0;
    for (let i = row - this.pieceRow; i < row - this.pieceRow + plusRow; i++) {
      let cl = 0;
      for (let j = column - this.pieceColumn; j < column - this.pieceColumn + plusColumn; j++) {
        if (this.playGround[i][j] == 1 && referenceBox[rw][cl] == 1) {
          return;
        }
        cl++;
      }
      rw++;
    }


    //execute

    rw = 0;
    for (let i = row - this.pieceRow; i < row - this.pieceRow + plusRow; i++) {
      let cl = 0;
      for (let j = column - this.pieceColumn; j < column - this.pieceColumn + plusColumn; j++) {
        if (this.playGround[i][j] == 1 && referenceBox[rw][cl] == 0) {
          cl++;
          continue;
        }
        this.playGround[i][j] = referenceBox[rw][cl];
        cl++;
      }
      rw++;
    }
    console.log(this.lastSnapShot);
    console.log(this.playGround);


    const allOne = arr => arr.every(v => v === 1)

    for (let i = 0; i < 9; i++) {
      if (allOne(this.playGround[i])) {
        this.playGround[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.score++;
      }
    }
    //firstBlock = this.blocks[this.firstRandom].block;
    let newBlock = Math.floor(Math.random() * 54) + 1;
    if (this.sandName == 'second') {
      this.secondBlock = this.blocks[newBlock].block;
    }
    else if (this.sandName == 'third') {
      this.thirdBlock = this.blocks[newBlock].block;
    }
    else if (this.sandName == 'first') {
      this.firstBlock = this.blocks[newBlock].block;
    }


  }

}
