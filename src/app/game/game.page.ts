import { Component, OnInit } from '@angular/core';
import { blocks } from '../blocks';
import { patterns } from '../patterns';
import { SettingsModule } from '../components/settings/settings.module';
import { ProfileNameModule } from '../components/profile-name/profile-name.module';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  blocks = blocks;
  isDelete = false;
  isInsert = false;
  isNext = false;
  pattern = patterns;
  moves = 3;
  emptyBlock = [[0]];

  firstObject = this.blocks[this.getRandom()];
  secondObject = this.blocks[this.getRandom()];
  thirdObject = this.blocks[this.getRandom()];

  nextFirst = this.blocks[this.getRandom()];
  nextSecond = this.blocks[this.getRandom()];
  nextThird = this.blocks[this.getRandom()];

  firstBlock = this.firstObject.block;
  secondBlock = this.secondObject.block;
  thirdBlock = this.thirdObject.block;

  lastSnapShot = [
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

  constructor(private modalCtrl: ModalController, private router: Router) { }

  ngOnInit() {
    const first = document.querySelector('#drag-1');
    const second = document.querySelector('#drag-2');
    const third = document.querySelector('#drag-3');

    first.addEventListener('dragstart', this.dragStart)
    second.addEventListener('dragstart', this.dragStart)
    third.addEventListener('dragstart', this.dragStart)
    first.addEventListener('dragend', this.dragEnd)
    second.addEventListener('dragend', this.dragEnd)
    third.addEventListener('dragend', this.dragEnd)
  }

  dragStart(ev) {
    const el = document.getElementById(ev.target.id);
    setTimeout(() => {
      el.classList.add('invisble');
    }, 0);
  }

  dragEnd(ev) {
    const el = document.getElementById(ev.target.id);
    setTimeout(() => {
      el.classList.remove('invisble');
    }, 0);
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

  toggleInsert() {
    this.isInsert = !this.isInsert;
    var div = document.querySelector('#insert');

    div.innerHTML = this.isInsert ? 'INSERT MOD ACTİVE' : 'INSERT MOD INACTIVE';
  }

  deleteOrInsert(ev) {
    if (this.isDelete) {
      const id = ev.target.id.split('x');
      let row = id[0];
      let column = id[1];
      this.playGround[row][column] = 0;
    }
    if (this.isInsert) {
      const id = ev.target.id.split('x');
      let row = id[0];
      let column = id[1];
      this.playGround[row][column] = 1;
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

    let referenceBox = this.sandName == 'second' ? this.secondBlock : (this.sandName == 'third' ? this.thirdBlock : this.firstBlock);
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

    this.moves--;
    this.score = this.pattern(this.playGround, this.score);
    let newBlock = this.getRandom();
    if (this.moves > 0) {
      if (this.sandName == 'second') {
        this.secondBlock = this.emptyBlock;
      }

      else if (this.sandName == 'third') {
        this.thirdBlock = this.emptyBlock;
      }

      else if (this.sandName == 'first') {
        this.firstBlock = this.emptyBlock;
      }
    }
    else {
      this.moves = 3;
      this.firstBlock = this.nextFirst.block;
      this.secondBlock = this.nextSecond.block;
      this.thirdBlock = this.nextThird.block;

      this.nextFirst = this.blocks[this.getRandom()];
      this.nextSecond = this.blocks[this.getRandom()];
      this.nextThird = this.blocks[this.getRandom()];
    }
  }

  showNext() {
    console.log(document.querySelector('#next').classList);
    if(!this.isNext){
      document.getElementById('present').style.display = "none";
      document.getElementById('next').style.display = "flex";
      this.isNext = true;
    }
    else{
      document.getElementById('present').style.display = "flex";
      document.getElementById('next').style.display = "none";
      this.isNext = false;
    }
  }

  async settingsModal() {
    const modal = await this.modalCtrl.create({
      component: SettingsModule.component,
      cssClass: 'settings-modal-css',
      mode : 'ios'
    })
    await modal.present();
  }

  routeGameOver() {
    this.router.navigate(['gameover']);
  }

  getRandom(): number {
    return Math.floor(Math.random() * 54) + 1;
  }
}
