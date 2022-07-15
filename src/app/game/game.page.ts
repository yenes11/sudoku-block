import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { blocks } from '../blocks';
import { patterns, executePatterns } from '../patterns';
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
import { Animation, AnimationController, ToastController, AlertController } from '@ionic/angular';

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
  executePatterns = executePatterns;
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
  score: number | any[] = 0;
  lastScore: number | any[] = 0;
  sandId: string;
  zoneId: string;
  zoneIdCtrl = false;
  zoneIdCheck;
  params;

  constructor(private modalCtrl: ModalController, private router: Router,
    private gestureCtrl: GestureController, private detector: ChangeDetectorRef, private device: Device,
    private animationCtrl: AnimationController, private toastController: ToastController, private alertController: AlertController) { }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateGestures(), 1);
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      mode: 'ios',
      translucent: true,
    });
    toast.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'GAME OVER!',
      // message: 'GAME OVER!',
      cssClass: 'game-over-alert',
      backdropDismiss: false,
      mode:'ios',
      keyboardClose: false,
    });
    await alert.present();
    setTimeout(async () => {
      await alert.dismiss();
      this.router.navigate(['gameover']);
    },2000)
  }

  playAnimation() {
    const squareA = this.animationCtrl.create()
      .addElement(document.getElementById('6x6'))
      .fill('none')
      .duration(500)
      .keyframes([
        { offset: 0, transform: 'scale(1) rotate(0)', opacity: 1 },
        { offset: 0.5, transform: 'scale(.5) rotate(90deg)', opacity: 0.5 },
        { offset: 1, transform: 'scale(0) rotate(180deg)', opacity: 0 }
      ]);

    squareA.play();
  }


d
  async ngOnInit() {
    await this.setSavedData();
    if (!this.isSaved) this.setEnv();
    this.d = JSON.stringify(this.userInfo);
    this.detector.detectChanges();
    this.firstEmpty = isEqual(this.firstObject, this.emptyObject);
    this.secondEmpty = isEqual(this.secondObject, this.emptyObject);
    this.thirdEmpty = isEqual(this.thirdObject, this.emptyObject);
    console.log(this.userInfo['isSaved'])
  }

  setSavedData = async () => {
    const contents = await Filesystem.readFile({
      path: 'info/user.txt',
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    // debugger;
    var data = JSON.parse(contents.data);
    this.userInfo = data;
    var isSaved = data['isSaved'];
    if (isSaved) {
      this.playGround = cloneDeep(data.playground);
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
      this.score = data.score;
      this.isSaved = isSaved;
    }
  };

  writeSecretFile = async (info) => {
    await Filesystem.writeFile({
      path: 'info/user.txt',
      data: JSON.stringify(info),
      directory: Directory.Documents,
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
            // setTimeout(() => {
            //   div.nativeElement.style.transition = '0s';
            // }, 70);
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
                let id = close.id.split('x');
                this.pieceRow = parseInt(id[0]);
                this.pieceColumn = parseInt(id[1]);
              }
            }, 100);
          },
          onMove: (ev) => {
            div.nativeElement.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY - 70}px)`;
            div.nativeElement.style.zIndex = 10;
            var dragEl = div.nativeElement.getBoundingClientRect();

            var x = dragEl.left + window.scrollX;
            var y = dragEl.top + window.scrollY;
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
    // this.lastSnapShot = [];
    // this.playGround.forEach((arr) => {
    //   var x = [];
    //   arr.forEach((obj) => {
    //     x.push(obj);
    //   });
    //   this.lastSnapShot.push(x);
    // });
    this.lastSnapShot = cloneDeep(this.playGround);
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
    this.lastScore = this.score;

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
    var patternOutput = this.pattern(this.playGround, this.score);
    setTimeout(() => {
      this.playAnimations(patternOutput[0], patternOutput[1], patternOutput[2]);
    }, 1)

    setTimeout(() => {
      this.score = executePatterns(this.score, this.playGround, patternOutput);
      this.detector.detectChanges();
    }, 501)
    let newBlock = this.getRandom();
    if (this.moves > 0) {
      if (this.sandId == 'drag-2') {
        this.lastReferenceBlock = cloneDeep(this.secondObject);
        this.secondObject = this.emptyObject;
        this.secondBlock = this.secondObject.block;
        // this.secondEmpty = isEqual(this.secondObject, this.emptyObject);
      }

      else if (this.sandId == 'drag-3') {
        this.lastReferenceBlock = cloneDeep(this.thirdObject);
        this.thirdObject = this.emptyObject;
        this.thirdBlock = this.thirdObject.block;
        // this.thirdEmpty = isEqual(this.thirdObject, this.emptyObject);
      }

      else if (this.sandId == 'drag-1') {
        this.lastReferenceBlock = cloneDeep(this.firstObject);
        this.firstObject = this.emptyObject;
        this.firstBlock = this.firstObject.block;
        // this.firstEmpty = isEqual(this.firstObject, this.emptyObject);
      }
    }
    else {
      this.moves = 3;
      this.setNext();
    }
    setTimeout(() => {
      this.userInfo = {
        ...this.userInfo,
        playground: this.playGround,
        lastSnapshot: this.lastSnapShot,
        firstObject: this.firstObject,
        secondObject: this.secondObject,
        thirdObject: this.thirdObject,
        nextFirst: this.nextFirst,
        nextSecond: this.nextSecond,
        nextThird: this.nextThird,
        moves: this.moves,
        isSaved: true,
        score: this.score
      }
      this.writeSecretFile(this.userInfo);
    }, 501)
    setTimeout(() => {
      var gameOver = this.isGameOver();
      if(gameOver) {
        setTimeout(() => {
          this.userInfo = {
            ...this.userInfo,
            isSaved: false
          }
          debugger
          this.writeSecretFile(this.userInfo);
        }, 500)
        this.presentAlert();
      }
    }, 502)
  }

  playAnimations(row, column, square) {
    var rows = [];
    row.forEach((r) => {
      for (var i = 0; i < 9; i++) {
        var id = r + 'x' + i;
        const square = this.animationCtrl.create()
          .addElement(document.getElementById(id))
          .fill('none')
          .duration(500)
          .keyframes([
            { offset: 0, transform: 'scale(1) rotate(0)', opacity: 1 },
            { offset: 0.5, transform: 'scale(.5) rotate(90deg)', opacity: 0.5 },
            { offset: 1, transform: 'scale(0) rotate(180deg)', opacity: 0 }
          ]);
        square.play();
      }
    });

    column.forEach((c) => {
      for (var i = 0; i < 9; i++) {
        var id = i + 'x' + c;
        const square = this.animationCtrl.create()
          .addElement(document.getElementById(id))
          .fill('none')
          .duration(500)
          .keyframes([
            { offset: 0, transform: 'scale(1) rotate(0)', opacity: 1 },
            { offset: 0.5, transform: 'scale(.5) rotate(90deg)', opacity: 0.5 },
            { offset: 1, transform: 'scale(0) rotate(180deg)', opacity: 0 }
          ]);
        square.play();
      }
    });

    square.forEach(s => {
      for (let i = s[0]; i < s[0] + 3; i++) {
        for (let j = s[1]; j < s[1] + 3; j++) {
          const square = this.animationCtrl.create()
            .addElement(document.getElementById(`${i}x${j}`))
            .fill('none')
            .duration(500)
            .keyframes([
              { offset: 0, transform: 'scale(1) rotate(0)', opacity: 1 },
              { offset: 0.5, transform: 'scale(.5) rotate(90deg)', opacity: 0.5 },
              { offset: 1, transform: 'scale(0) rotate(180deg)', opacity: 0 }
            ]);
          square.play();
        }
      }
    })
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
      if (isEqual(this.firstObject, this.emptyObject) || isEqual(this.secondObject, this.emptyObject) || isEqual(this.thirdObject, this.emptyObject)) {
        const allZero = arr => arr.every(v => v === 0);
        var con = true;
        this.playGround.forEach((row) => {
          if (!allZero(row)) con = false;
        })

        if (con) this.presentToast('Tüm bloklar boşken geri alamazsınız!');
        else {
          debugger
          this.playGround = cloneDeep(this.lastSnapShot);
          this.score = this.lastScore;
          this.undoCount--;
          this.moves++;
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
          this.userInfo = {
            ...this.userInfo,
            undo: this.undoCount,
            playground: this.playGround,
            lastSnapshot: this.lastSnapShot,
            firstObject: this.firstObject,
            secondObject: this.secondObject,
            thirdObject: this.thirdObject
          }
          this.writeSecretFile(this.userInfo);
        }
      }
      else {
        this.presentToast('Bloklar yenilendiğinde geri alamazsın.')
      }

    }
    else this.presentToast("Geri alma hakkınız kalmadı.")
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
    if (this.deleteCount > 0) this.isDelete = !this.isDelete;
    else this.presentToast('Silme hakınız kalmadı.')
  }

  toggleInsert() {
    if (this.addCount > 0) this.isInsert = !this.isInsert;
    else this.presentToast('Ekleme hakınız kalmadı.')
  }

  deleteOrInsert(ev) {
    if (this.isDelete && this.deleteCount > 0) {
      const id = ev.target.id.split('x');
      let row = id[0];
      let column = id[1];
      this.playGround[row][column] = 0;
      this.isDelete = !this.isDelete;
      this.deleteCount--;
    }
    if (this.isInsert && this.addCount > 0) {
      const id = ev.target.id.split('x');
      let row = id[0];
      let column = id[1];
      this.playGround[row][column] = 1;
      this.isInsert = !this.isInsert;
      this.addCount--;
    }
    // this.score = this.pattern(this.playGround, this.score);
    var patternOutput = this.pattern(this.playGround, this.score);
    setTimeout(() => {
      this.playAnimations(patternOutput[0], patternOutput[1], patternOutput[2]);
    }, 1)

    if (patternOutput[0].length == 0 && patternOutput[1].length == 0 && patternOutput[2].length == 0) {
      setTimeout(() => {
        this.score = executePatterns(this.score, this.playGround, patternOutput);
        this.detector.detectChanges();
      }, 1)
    }
    else {
      setTimeout(() => {
        this.score = executePatterns(this.score, this.playGround, patternOutput);
        this.detector.detectChanges();
      }, 501)
    }

    this.userInfo = {
      ...this.userInfo,
      add: this.addCount,
      delete: this.deleteCount,
      playground: this.playGround,
      lastSnapshot: this.lastSnapShot
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

  isGameOver() {
    var gameOver = false;
    var isSet = true;

    var rotateOne = this.firstObject.rotate;
    var rotateTwo = this.secondObject.rotate;
    var rotateThree = this.thirdObject.rotate;
    var rotatedOne = rotateOne == -1 ? [[]] : this.blocks.find(obj => obj.id == rotateOne).block;
    var rotatedTwo = rotateTwo == -1 ? [[]] : this.blocks.find(obj => obj.id == rotateTwo).block;
    var rotatedThree = rotateThree == -1 ? [[]] : this.blocks.find(obj => obj.id == rotateThree).block;
    var blocks = [this.firstBlock, this.secondBlock, this.thirdBlock, rotatedOne, rotatedTwo, rotatedThree];

    for (var obj of blocks) {
      isSet = true;
      var rowLen = obj.length;
      var colLen = obj[0].length;
      for (var i = 0; i < 9; i++) {
        if (rowLen + i > 8) continue;
        if (colLen == 0) break;

        for (var j = 0; j < 9; j++) {
          isSet = true;
          if (colLen + j > 8) continue;
          var plusRow = 0;
          for (var row = i; row < i + rowLen; row++) {
            var plusCol = 0;
            for (var col = j; col < j + colLen; col++) {
              if (this.playGround[row][col] == 1 && obj[plusRow][plusCol] == 1) {
                isSet = false;
              }
              plusCol++;
            }
            plusRow++;
          }
          if (isSet) return false;
        }
      }
    }

    // for (var i = 0; i < 9; i++) {
    //   if (rowLen + i > 8) continue;
    //   if (colLen == 0) break;

    //   for (var j = 0; j < 9; j++) {
    //     isSet = true;
    //     if (colLen + j > 8) continue;
    //     var plusRow = 0;
    //     for (var row = i; row < i + rowLen; row++) {
    //       // if (!isSet) break;
    //       var plusCol = 0;
    //       for (var col = j; col < j + colLen; col++) {
    //         if (this.playGround[row][col] == 1 && this.firstBlock[plusRow][plusCol] == 1) {
    //           isSet = false;
    //         }
    //         plusCol++;
    //       }
    //       plusRow++;
    //     }
    //     if (isSet) return false;
    //   }
    // }

    // isSet = true;
    // rowLen = this.secondBlock.length;
    // colLen = this.secondBlock[0].length;
    // // debugger
    // for (var i = 0; i < 9; i++) {
    //   if (rowLen + i > 8) continue;
    //   if (colLen == 0) break;

    //   for (var j = 0; j < 9; j++) {
    //     isSet = true;
    //     if (colLen + j > 8) continue;
    //     var plusRow = 0;
    //     for (var row = i; row < i + rowLen; row++) {
    //       var plusCol = 0;
    //       for (var col = j; col < j + colLen; col++) {
    //         if (this.playGround[row][col] == 1 && this.secondBlock[plusRow][plusCol] == 1) {
    //           isSet = false;
    //         }
    //         plusCol++;
    //       }
    //       plusRow++;
    //     }
    //     if (isSet) return false;
    //   }
    // }

    // rowLen = this.thirdBlock.length;
    // colLen = this.thirdBlock[0].length;
    // for (var i = 0; i < 9; i++) {
    //   if (rowLen + i > 8) continue;
    //   if (colLen == 0) break;
    //   for (var j = 0; j < 9; j++) {
    //     isSet = true;
    //     if (colLen + j > 8) continue;
    //     var plusRow = 0;
    //     for (var row = i; row < i + rowLen; row++) {
    //       // if (!isSet) break;
    //       var plusCol = 0;
    //       for (var col = j; col < j + colLen; col++) {
    //         if (this.playGround[row][col] == 1 && this.thirdBlock[plusRow][plusCol] == 1) {
    //           isSet = false;
    //         }
    //         plusCol++;
    //       }
    //       plusRow++;
    //     }
    //     if (isSet) return false;
    //   }
    // }

    return true;
  }

}
