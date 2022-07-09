import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { blocks } from '../blocks';
import { patterns } from '../patterns';
import { SettingsModule } from '../components/settings/settings.module';
import { ProfileNameModule } from '../components/profile-name/profile-name.module';
import { Gesture, IonItem, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GestureController } from '@ionic/angular';
import { Block } from '../block';
import { Device } from '@ionic-native/device/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import * as cloneDeep from 'lodash/cloneDeep';
import * as isEqual from 'lodash/isEqual';
import { Animation, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements AfterViewInit {
  blocks = blocks;
  userInfo: Object;
  isDelete = false;
  isInsert = false;
  isNext = false;
  isSaved = false;
  pattern = patterns;
  moves = 3;
  undoCount = 1;
  addCount = 3;
  deleteCount = 3;
  emptyBlock = [[]];
  emptyObject: Block = { id: -1, block: [[]], rotate: -1 };
  lastReferenceBox: number;
  lastReferenceBlock: Block;

  firstEmpty: boolean;
  secondEmpty: boolean;
  thirdEmpty: boolean;

  firstObject: Block;
  secondObject: Block;
  thirdObject: Block;

  firstBlock: Array<Array<number>>;
  secondBlock: Array<Array<number>>;
  thirdBlock: Array<Array<number>>;

  nextFirst: Block;
  nextSecond: Block;
  nextThird: Block;

  nextFirstBlock: Array<Array<number>>;
  nextSecondBlock: Array<Array<number>>;
  nextThirdBlock: Array<Array<number>>;

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
  sandId: string;
  zoneId: string;
  zoneIdCtrl = false;
  zoneIdCheck;
  params;

  constructor(private modalCtrl: ModalController, private router: Router,
    private gestureCtrl: GestureController, private detector: ChangeDetectorRef, private device: Device,
    private animationCtrl: AnimationController) { }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateGestures(), 1);

  }

  async playAnimation() {
    const squareA = this.animationCtrl.create()
    .addElement(document.getElementById('6x6'))
    .fill('none')
    .duration(500)
    .keyframes([
      { offset: 0, transform: 'scale(1) rotate(0)', opacity: 1 },
      { offset: 0.5, transform: 'scale(.5) rotate(90deg)', opacity: 0.5},
      { offset: 1, transform: 'scale(0) rotate(180deg)', opacity: 0 }
    ]);

    await squareA.play();
  }



  async ngOnInit() {
    await this.setSavedData();
    if (!this.isSaved) this.setEnv();
    this.detector.detectChanges();
    console.log(this.moves);
    // console.log(this.firstObject);
    // console.log(isEqual(this.firstObject,this.emptyObject));
    this.firstEmpty = isEqual(this.firstObject, this.emptyObject);
    this.secondEmpty = isEqual(this.secondObject, this.emptyObject);
    this.thirdEmpty = isEqual(this.thirdObject, this.emptyObject);


  }

  setSavedData = async () => {
    const contents = await Filesystem.readFile({
      path: 'user/info.txt',
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
    // debugger;
    var data = JSON.parse(contents.data);
    this.userInfo = data;
    var isSaved = data['isSaved'];
    if (isSaved) {
      this.playGround = cloneDeep(data.lastSnapshot);
      this.lastSnapShot = cloneDeep(data.lastSnapShot);

      this.firstObject = data.firstObject;
      this.secondObject = data.secondObject;
      this.thirdObject = data.thirdObject;

      this.firstBlock = this.firstObject.block;
      this.secondBlock = this.secondObject.block;
      this.thirdBlock = this.thirdObject.block;

      this.nextFirst = data.nextFirst;
      this.nextSecond = data.nextSecond;
      this.nextThird = data.nextThird;

      this.nextFirstBlock = this.nextFirst.block;
      this.nextSecondBlock = this.nextSecond.block;
      this.nextThirdBlock = this.nextThird.block;

      this.deleteCount = data.delete;
      this.addCount = data.add;
      this.undoCount = data.undo;

      this.moves = data.moves;

      this.isSaved = isSaved;
    }
  };

  writeSecretFile = async (info) => {
    await Filesystem.writeFile({
      path: 'user/info.txt',
      data: JSON.stringify(info),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
  };


  @ViewChildren('item', { read: ElementRef }) items: QueryList<ElementRef>;
  gestureArray: Gesture[] = [];

  @ViewChildren('dropzone', { read: ElementRef }) dropZones: QueryList<ElementRef>;

  updateGestures() {

    this.gestureArray.map(gesture => gesture.destroy());
    this.gestureArray = [];

    const arr = this.items.toArray();
    setTimeout(() => {
      arr.forEach((div) => {
        const drag = this.gestureCtrl.create({
          el: div.nativeElement,
          threshold: 0,
          gestureName: 'drag',
          onStart: ev => {
            this.getSnapshot();
            this.sandId = div.nativeElement.id;

            div.nativeElement.style.transition = '.07s ease-out';
            div.nativeElement.style.transform = `translate(0px, -70px)`;
            setTimeout(() => {
              div.nativeElement.style.transition = '0s';
            }, 70);
            const children = [...div.nativeElement.children];

            children.forEach(row => {
              const grandChildren = [...row.children];

              grandChildren.forEach(box => {
                box.style.transition = '.07s ease-out';
                box.style.width = '10vw';
                box.style.height = '10vw';
              });
            });

            setTimeout(() => {
              const close = document.elementFromPoint(ev.currentX, ev.currentY - 70);
              if (close && ['square-full', 'square-empty-sand'].indexOf(close.className) > -1) {
                console.log(close.id)
                let id = close.id.split('x');
                this.pieceRow = parseInt(id[0]);
                this.pieceColumn = parseInt(id[1]);

              }
            }, 100);
          },
          onMove: (ev) => {
            div.nativeElement.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY - 70}px)`;
            div.nativeElement.style.zIndex = 10;

            // this.logId(ev.currentX, ev.currentY - 70);

            var allGood = this.checkDropZoneHover(ev.currentX, ev.currentY - 70);
            if (allGood) {
              if (this.zoneId != this.zoneIdCheck) {
                this.zoneIdCtrl = !this.zoneIdCtrl;
                // if (this.params !== undefined) {
                //   this.placeBlocks(this.params[0], this.params[1], this.params[2], this.params[3], this.params[4])
                // }
                this.playGround = cloneDeep(this.lastSnapShot);
                // this.playGround = JSON.parse(JSON.stringify(this.lastSnapShot));
                this.detector.detectChanges();
              }

              setTimeout(() => {
                this.params = this.handleHover(div);
                this.detector.detectChanges();
              }, 1)
            }
            else {
              //fix it
            }
          },
          onEnd: ev => {
            this.playGround = cloneDeep(this.lastSnapShot);
            var allGood = this.checkDropZoneHover(ev.currentX, ev.currentY - 70);
            if (allGood) {
              this.handleDrop(div);
              div.nativeElement.style.transform = `translate(0px, 0px)`;
            }
            else {
              div.nativeElement.style.transition = '.2s ease-out';
              div.nativeElement.style.transform = 'translate(0px, 0px)';
            }

            const children = [...div.nativeElement.children];

            children.forEach(row => {
              const grandChildren = [...row.children];

              grandChildren.forEach(box => {
                box.style.width = '25px';
                box.style.height = '25px';
              });
            });

            setTimeout(() => {
              div.nativeElement.style.transition = '0s';
            }, 200);

            this.detector.detectChanges();
          }
        });
        drag.enable();
        this.gestureArray.push(drag);
      }, 200);
    })
  }

  getSize(el) {
    const children = el.nativeElement.children;
    const grandChild = children.nativeElement[0].children;

    return [children.length, grandChild.length];
  }

  checkDropZoneHover(x, y): boolean {
    // debugger;
    var isIt = false;
    const zones = [...this.dropZones];
    zones.forEach(z => {
      const dz = z.nativeElement.getBoundingClientRect();
      if (this.isInZone(x, y, dz)) {
        if (!this.zoneIdCtrl) {
          this.zoneIdCheck = z.nativeElement.id;
          this.zoneIdCtrl = !this.zoneIdCtrl;
        }
        this.zoneId = z.nativeElement.id;
        isIt = true;
      }
    })
    return isIt;
  }

  isInZone(x, y, z) {
    if (x < z.left || x >= z.right) {
      return false;
    }
    if (y < z.top || y >= z.bottom) {
      return false;
    }
    return true;
  }

  getSnapshot(): void {
    this.lastSnapShot = [];
    this.playGround.forEach((arr) => {
      var x = [];
      arr.forEach((obj) => {
        x.push(obj);
      });
      this.lastSnapShot.push(x);
    });
  }

  handleHover(div) {
    var referenceId = div.nativeElement.id;
    var referenceBox = referenceId == 'drag-1' ? this.firstBlock : referenceId == 'drag-2' ? this.secondBlock : this.thirdBlock;
    var plusRow = referenceBox.length;
    var plusColumn = referenceBox[0].length;
    var rowColumn = this.zoneId.split('x');
    var row = parseInt(rowColumn[0]);
    var column = parseInt(rowColumn[1]);

    if (column + plusColumn - this.pieceColumn - 1 >= 9 ||
      row + plusRow - this.pieceRow - 1 >= 9 ||
      column - this.pieceColumn < 0 ||
      row - this.pieceRow < 0) {
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

    rw = 0;
    for (let i = row - this.pieceRow; i < row - this.pieceRow + plusRow; i++) {
      let cl = 0;
      for (let j = column - this.pieceColumn; j < column - this.pieceColumn + plusColumn; j++) {
        if (referenceBox[rw][cl] == 0) {
          cl++;
          continue;
        }
        this.playGround[i][j] = 2;
        cl++;
      }
      rw++;
    }

    return [row, plusRow, column, plusColumn, referenceBox];
  }

  async placeBlocks(row, plusRow, column, plusColumn, referenceBox) {
    var rw = 0;
    for (let i = row - this.pieceRow; i < row - this.pieceRow + plusRow; i++) {
      let cl = 0;
      for (let j = column - this.pieceColumn; j < column - this.pieceColumn + plusColumn; j++) {
        if (referenceBox[rw][cl] == 0) {
          cl++;
          continue;
        }
        if (this.playGround[i][j] == 2) {
          this.playGround[i][j] = 0;
          cl++;
        }
      }
      rw++;
    }
  }

  handleDrop(div) {
    //get a snapshot for undo
    this.getSnapshot();

    var referenceId = div.nativeElement.id;
    var referenceBox = referenceId == 'drag-1' ? this.firstBlock : referenceId == 'drag-2' ? this.secondBlock : this.thirdBlock;
    var plusRow = referenceBox.length;
    var plusColumn = referenceBox[0].length;
    var rowColumn = this.zoneId.split('x');
    var row = parseInt(rowColumn[0]);
    var column = parseInt(rowColumn[1]);


    if (column + plusColumn - this.pieceColumn - 1 >= 9 ||
      row + plusRow - this.pieceRow - 1 >= 9 ||
      column - this.pieceColumn < 0 ||
      row - this.pieceRow < 0) {
      return;
    }

    //check if available
    let rw = 0;
    for (let i = row - this.pieceRow; i < row - this.pieceRow + plusRow; i++) {
      let cl = 0;
      for (let j = column - this.pieceColumn; j < column - this.pieceColumn + plusColumn; j++) {
        if (this.playGround[i][j] == 1 && referenceBox[rw][cl] == 1) {
          div.nativeElement.style.transition = '.2s ease-out';
          div.nativeElement.style.transform = 'translate(0px, 0px)';

          setTimeout(() => {
            div.nativeElement.style.transition = '0s';
          }, 100);
          return;
        }
        cl++;
      }
      rw++;
    }

    rw = 0;
    for (let i = row - this.pieceRow; i < row - this.pieceRow + plusRow; i++) {
      let cl = 0;
      for (let j = column - this.pieceColumn; j < column - this.pieceColumn + plusColumn; j++) {
        if (referenceBox[rw][cl] == 0) { //this.playGround[i][j] == 1 &&  deleted
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
      if (this.sandId == 'drag-2') {
        this.secondObject = this.emptyObject;
        this.secondBlock = this.secondObject.block;
        // this.secondEmpty = isEqual(this.secondObject, this.emptyObject);
        this.lastReferenceBlock = this.secondObject;
      }

      else if (this.sandId == 'drag-3') {
        this.thirdObject = this.emptyObject;
        this.thirdBlock = this.thirdObject.block;
        // this.thirdEmpty = isEqual(this.thirdObject, this.emptyObject);
        this.lastReferenceBlock = this.thirdObject;
      }

      else if (this.sandId == 'drag-1') {
        this.firstObject = this.emptyObject;
        this.firstBlock = this.firstObject.block;
        // this.firstEmpty = isEqual(this.firstObject, this.emptyObject);
        this.lastReferenceBlock = this.firstObject;
      }
    }
    else {
      this.moves = 3;
      this.setNext();
    }

    this.userInfo = {
      ...this.userInfo,
      lastSnapshot: this.playGround,
      firstObject: this.firstObject,
      secondObject: this.secondObject,
      thirdObject: this.thirdObject,
      nextFirst: this.nextFirst,
      nextSecond: this.nextSecond,
      nextThird: this.nextThird,
      moves: this.moves,
      isSaved: true
    }
    console.log(this.userInfo['moves'])
    this.writeSecretFile(this.userInfo);
  }

  async setNext() {
    this.firstObject = this.nextFirst;
    this.secondObject = this.nextSecond;
    this.thirdObject = this.nextThird;

    if (this.firstObject !== undefined) this.firstBlock = await JSON.parse(JSON.stringify(this.firstObject.block));
    else this.setNext();

    if (this.secondObject !== undefined) this.secondBlock = await JSON.parse(JSON.stringify(this.secondObject.block));
    else this.setNext();

    if (this.thirdObject !== undefined) this.thirdBlock = await JSON.parse(JSON.stringify(this.thirdObject.block));
    else this.setNext();


    await this.getRandom().then(obj => this.nextFirst = obj).then(() => {
      if (this.nextFirst !== undefined) this.nextFirstBlock = this.nextFirst.block;
      else this.setNext();
    })

    await this.getRandom().then(obj => this.nextSecond = obj).then(() => {
      if (this.nextSecond !== undefined) this.nextSecondBlock = this.nextSecond.block;
      else this.setNext();
    })

    await this.getRandom().then(obj => this.nextThird = obj).then(() => {
      if (this.nextThird !== undefined) this.nextThirdBlock = this.nextThird.block;
      else this.setNext();
    })

    this.detector.detectChanges();
  }



  async setEnv() {
    await this.getRandom().then(obj => this.firstObject = obj).then(res =>
      this.firstBlock = res.block)

    await this.getRandom().then(obj => this.secondObject = obj).then(res =>
      this.secondBlock = res.block)

    await this.getRandom().then(obj => this.thirdObject = obj).then(res =>
      this.thirdBlock = res.block)

    await this.getRandom().then(obj => this.nextFirst = obj).then(res =>
      this.nextFirstBlock = res.block)

    await this.getRandom().then(obj => this.nextSecond = obj).then(res =>
      this.nextSecondBlock = res.block)

    await this.getRandom().then(obj => this.nextThird = obj).then(res =>
      this.nextThirdBlock = res.block)
  }

  undo() {
    if (this.undoCount > 0) {
      this.playGround = cloneDeep(this.lastSnapShot);
      this.undoCount--;
      if (this.sandId == 'drag-1') {
        this.firstObject = this.lastReferenceBlock;
        this.firstBlock = this.firstObject.block;
      }
      else if (this.sandId == 'drag-2') {
        this.secondObject = this.lastReferenceBlock;
        this.secondBlock = this.secondObject.block;
      }
      else if (this.sandId == 'drag-3') {
        this.thirdObject = this.lastReferenceBlock;
        this.thirdBlock = this.thirdObject.block;
      }
    }
    this.userInfo = {
      ...this.userInfo,
      undo: this.undoCount
    }
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

  toggleDelete() {
    this.isDelete = !this.isDelete;
  }

  toggleInsert() {
    this.isInsert = !this.isInsert;
  }

  deleteOrInsert(ev) {
    if (this.isDelete) {
      const id = ev.target.id.split('x');
      let row = id[0];
      let column = id[1];
      this.playGround[row][column] = 0;
      this.isDelete = !this.isDelete;
      this.deleteCount--;
    }
    if (this.isInsert) {
      const id = ev.target.id.split('x');
      let row = id[0];
      let column = id[1];
      this.playGround[row][column] = 1;
      this.isInsert = !this.isInsert;
      this.addCount--;
    }
    this.score = this.pattern(this.playGround, this.score);
    this.detector.detectChanges();

    this.userInfo = {
      ...this.userInfo,
      add: this.addCount,
      delete: this.deleteCount,
      lastSnapshot: this.playGround
    }

    this.writeSecretFile(this.userInfo);
  }

  showNext() {
    if (!this.isNext) {
      document.getElementById('present').style.display = "none";
      document.getElementById('next').style.display = "grid";
      this.isNext = true;
    }
    else {
      document.getElementById('present').style.display = "grid";
      document.getElementById('next').style.display = "none";
      this.isNext = false;
    }
  }

  async settingsModal() {
    const modal = await this.modalCtrl.create({
      component: SettingsModule.component,
      cssClass: 'settings-modal-css',
      mode: 'ios'
    })
    await modal.present();
  }

  routeGameOver() {
    this.router.navigate(['gameover']);
  }

  async getRandom() {
    var random = Math.floor(Math.random() * 54);
    return this.blocks[random];
  }

  isEven(one, two) {
    return isEqual(one, two);
  }

}
