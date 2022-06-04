import { Component, OnInit } from '@angular/core';
import { blocks } from '../blocks';
import { patterns } from '../patterns';
import { SettingsModule } from '../components/settings/settings.module';
import { ProfileNameModule } from '../components/profile-name/profile-name.module';
import { ModalController } from '@ionic/angular';
import { ProfileNameComponent } from '../components/profile-name/profile-name.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  blocks = blocks;
  isDelete = false;
  isInsert = false;
  pattern = patterns;

  firstRandom = Math.floor(Math.random() * 54) + 1;
  secondRandom = Math.floor(Math.random() * 54) + 1;
  thirdRandom = Math.floor(Math.random() * 54) + 1;

  firstObject = this.blocks[this.firstRandom];
  secondObject = this.blocks[this.secondRandom];
  thirdObject = this.blocks[this.thirdRandom];

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


  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const first = document.querySelector('#drag2');
    const second = document.querySelector('#drag3');
    const third = document.querySelector('#drag4');
    first.addEventListener('dragstart', this.dragStart)
    second.addEventListener('dragstart', this.dragStart)
    third.addEventListener('dragstart', this.dragStart)
    first.addEventListener('dragend', this.dragEnd)
    second.addEventListener('dragend', this.dragEnd)
    third.addEventListener('dragend', this.dragEnd)
  }

  dragStart(ev){
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
    if(this.isDelete){
      const id = ev.target.id.split('x');
      let row = id[0];
      let column = id[1];
      this.playGround[row][column] = 0;
    }
    if(this.isInsert){
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

    console.debug();
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
    // console.log(this.lastSnapShot);
    // console.log(this.playGround);

    this.score = this.pattern(this.playGround, this.score);

    let newBlock = Math.floor(Math.random() * 54) + 1;
    if (this.sandName == 'second') {
      this.secondObject = this.blocks[newBlock];
      this.secondBlock = this.secondObject.block;
    }
    else if (this.sandName == 'third') {
      this.thirdObject = this.blocks[newBlock];
      this.thirdBlock = this.blocks[0].block;
    }
    else if (this.sandName == 'first') {
      this.firstObject = this.blocks[newBlock];
      this.firstBlock = this.firstObject.block;
    }


  }

  async settingsModal(){
    const modal = await this.modalCtrl.create({
      component: SettingsModule.component,
      cssClass: 'settings-modal-css',
    })
    await modal.present();
  }

  async profileNameModal(){
    const modal = await this.modalCtrl.create({
      component: ProfileNameComponent,
      cssClass: 'profile-modal-css',
      mode: 'ios'
    })
    await modal.present();
  }
}
