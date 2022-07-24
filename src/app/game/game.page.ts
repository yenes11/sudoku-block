import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { blocks } from '../blocks';
import { patterns, executePatterns, willBreakPatterns } from '../patterns';
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
import { StorageService } from '../storage.service';
import { NewGameModule } from '../components/new-game/new-game.module';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { Howl, Howler } from 'howler';
import { IonRefresher } from '@ionic/angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements AfterViewInit {
  blocks = blocks;
  userInfo;
  isDelete = false;
  isInsert = false;
  isNext = false;
  isSaved = false;
  pattern = patterns;
  executePatterns = executePatterns;
  willBreakPatterns = willBreakPatterns;
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

  hoverSnapShot = [
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
  lastSandId: string;
  zoneId: string;
  zoneIdCtrl = false;
  zoneIdCheck;
  params;
  todayScore: number | any[];
  overallScore: number | any[];
  weeklyScore: number | any[];
  monthlyScore: number | any[];

  playSize;
  sandSize;

  isLeftZone = false;

  constructor(private modalCtrl: ModalController, private router: Router,
    private gestureCtrl: GestureController, private detector: ChangeDetectorRef, private device: Device,
    private animationCtrl: AnimationController, private toastController: ToastController, private alertController: AlertController,
    private storageService: StorageService, private nativeAudio: NativeAudio) {

     }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateGestures()
      this.playSize = document.querySelector('.blue-play').clientWidth;
      this.sandSize = document.querySelector('.square-full').clientWidth;
    }, 500);
  }

  playClick() {
    // this.nativeAudio.play('click');
    var sound = new Howl({
      src: ['assets/sounds/click.wav']
    });
    sound.play();
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
      mode: 'ios',
      keyboardClose: false,
    });
    await alert.present();
    setTimeout(async () => {
      await alert.dismiss();
      this.router.navigate(['gameover']);
    }, 2000)
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


  cl() {
    console.log(this.userInfo);

  }
  async ngOnInit() {
    
    await this.getSavedData();
    this.detector.detectChanges();
    this.firstEmpty = isEqual(this.firstObject, this.emptyObject);
    this.secondEmpty = isEqual(this.secondObject, this.emptyObject);
    this.thirdEmpty = isEqual(this.thirdObject, this.emptyObject);
  }



  async getSavedData() {
    this.storageService.getData().subscribe(res => {

      this.userInfo = res;

      var today = this.userInfo.today;
      if (today.date != (new Date()).toLocaleDateString('en-GB')) this.todayScore = 0;
      else this.todayScore = today.score;

      var weekly = this.userInfo.weekly;
      if(this.getCurrentWeek() != weekly.week) this.weeklyScore = 0;
      else this.weeklyScore = weekly.score;

      var monthly = this.userInfo.monthly;
      if (this.getCurrentMonth != monthly.month) this.monthlyScore = 0;
      else this.monthlyScore = monthly.score;

      this.overallScore = this.userInfo.overall;

      var isSaved = this.userInfo['isSaved'];
      this.isSaved = isSaved;
      if (isSaved) {
        this.playGround = cloneDeep(this.userInfo.playground);
        this.lastSnapShot = cloneDeep(this.userInfo.lastSnapshot);
        this.firstObject = this.userInfo.firstObject;
        this.secondObject = this.userInfo.secondObject;
        this.thirdObject = this.userInfo.thirdObject;

        this.firstBlock = this.firstObject.block;
        this.secondBlock = this.secondObject.block;
        this.thirdBlock = this.thirdObject.block;

        this.nextFirst = this.userInfo.nextFirst;
        this.nextSecond = this.userInfo.nextSecond;
        this.nextThird = this.userInfo.nextThird;

        this.nextFirstBlock = this.nextFirst.block;
        this.nextSecondBlock = this.nextSecond.block;
        this.nextThirdBlock = this.nextThird.block;

        this.deleteCount = this.userInfo.delete;
        this.addCount = this.userInfo.add;
        this.undoCount = this.userInfo.undo;

        this.moves = this.userInfo.moves;
        this.score = this.userInfo.score;
        this.lastSandId = this.userInfo.lastSandId;
        this.lastReferenceBlock = this.userInfo.lastReferenceBlock;
      }
      else {
          this.setEnv();
          this.detector.detectChanges();
      }
    })
  }

  // setSavedData = async () => {
  //   var isSaved = this.userInfo['isSaved'];
  //   this.isSaved = isSaved;
  //   if (isSaved) {
  //     this.playGround = cloneDeep(this.userInfo.playground);
  //     this.lastSnapShot = cloneDeep(this.userInfo.lastSnapShot);

  //     this.firstObject = this.userInfo.firstObject;
  //     this.secondObject = this.userInfo.secondObject;
  //     this.thirdObject = this.userInfo.thirdObject;

  //     this.firstBlock = this.firstObject.block;
  //     this.secondBlock = this.secondObject.block;
  //     this.thirdBlock = this.thirdObject.block;

  //     this.nextFirst = this.userInfo.nextFirst;
  //     this.nextSecond = this.userInfo.nextSecond;
  //     this.nextThird = this.userInfo.nextThird;

  //     this.nextFirstBlock = this.nextFirst.block;
  //     this.nextSecondBlock = this.nextSecond.block;
  //     this.nextThirdBlock = this.nextThird.block;

  //     this.deleteCount = this.userInfo.delete;
  //     this.addCount = this.userInfo.add;
  //     this.undoCount = this.userInfo.undo;

  //     this.moves = this.userInfo.moves;
  //     this.score = this.userInfo.score;
  //   }
  // };

  writeSecretFile = async (info) => {
    await Filesystem.writeFile({
      path: 'secret/user.txt',
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
            // const cc = document.getElementsByClassName('play-row')[0].style.borderWidth;
            // console.log(cc);
            
            this.getHoverSnapshot();
            this.sandId = div.nativeElement.id;
            
            div.nativeElement.style.transition = '.07s ease-out';
            div.nativeElement.style.transform = `translate(0px, -70px)`;
            const children = [...div.nativeElement.children];          

            children.forEach(row => {
              const grandChildren = [...row.children];

              var el = grandChildren[0].getBoundingClientRect();

              var y = el.top + (el.height / 2);
              var y = el.left;
              console.log(y);
              

              grandChildren.forEach(box => {     

                box.style.transition = '.07s ease-out';
                box.style.width = `${this.playSize}px`;
                box.style.height = `${this.playSize}px`;
              });
            });

            setTimeout(() => {
              const close = document.elementFromPoint(ev.currentX, ev.currentY - 70);
              if (close && ['square-full', 'square-empty-sand'].indexOf(close.className) > -1) {
                let id = close.id.split('x');
                this.pieceRow = parseInt(id[0]);
                this.pieceColumn = parseInt(id[1]);
                if (typeof this.pieceColumn === 'undefined' || typeof this.pieceRow === 'undefined') {
                  return;
                }
              }
            }, 70);
          },
          onMove: (ev) => {           
            var pieceColumn;
            var pieceRow;

            div.nativeElement.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY - 70}px)`;
            div.nativeElement.style.zIndex = 10;

            var element;
            if(this.sandId == "drag-1") element = document.querySelector("div[name='first']")
            if(this.sandId == "drag-2") element = document.querySelector("div[name='second']")
            if(this.sandId == "drag-3") element = document.querySelector("div[name='third']")

            const info = element.getBoundingClientRect();
            var positionX = info.left + (info.width / 2);
            var positionY = info.top + (info.height / 2);
            
            var allGood = this.checkDropZoneHover(positionX, positionY);    

            if (allGood) {
              this.isLeftZone = true;
              if (this.zoneId != this.zoneIdCheck) {
                this.zoneIdCtrl = !this.zoneIdCtrl;
                this.pieceColumn = pieceColumn;
                this.pieceRow = pieceRow;
                // console.log("zone" + this.zoneId);
                
                this.playGround = cloneDeep(this.hoverSnapShot);
                this.detector.detectChanges();
                setTimeout(() => {
                  this.params = this.handleHover(div);
                  // console.log(div);
                  
                  // console.log(this.params);
                  
                  const breakable = this.willBreakPatterns(this.playGround);
                  setTimeout(() => {
                    this.handleBreakable(breakable[0], breakable[1], breakable[2]);
                  }, 1)
                  this.detector.detectChanges();
                }, 71)
              }

            }
            else {
              if(this.isLeftZone) {
                this.isLeftZone = !this.isLeftZone;
                this.zoneIdCheck = '';
                this.playGround = cloneDeep(this.hoverSnapShot); // optimize
              }
            }
            this.detector.detectChanges();
          },
          onEnd: ev => {
            const close = document.elementFromPoint(ev.currentX, ev.currentY - 70);
            if (close && ['square-full', 'square-empty-sand'].indexOf(close.className) > -1) {
              let id = close.id.split('x');
              this.pieceRow = parseInt(id[0]);
              this.pieceColumn = parseInt(id[1]);
              if (typeof this.pieceColumn === 'undefined' || typeof this.pieceRow === 'undefined') {
                return;
              }
            }

            const breakable = this.willBreakPatterns(this.playGround);
            this.playGround = cloneDeep(this.hoverSnapShot);


            var element;
            if(this.sandId == "drag-1") element = document.querySelector("div[name='first']")
            if(this.sandId == "drag-2") element = document.querySelector("div[name='second']")
            if(this.sandId == "drag-3") element = document.querySelector("div[name='third']")

            const info = element.getBoundingClientRect();

            var positionX = info.left + (info.width / 2);
            var positionY = info.top + (info.height / 2);


            var allGood = this.checkDropZoneHover(positionX, positionY);

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
                box.style.width = `${this.sandSize}px`;
                box.style.height = `${this.sandSize}px`;
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
    if (x  < z.left  || x > z.right ) {
      return false;
    }
    if (y  < z.top  || y > z.bottom ) {
      return false;
    }
    return true;
  }

  getSnapshot(): void {
    this.lastSnapShot = cloneDeep(this.playGround);
  }

  getHoverSnapshot(): void {
    this.hoverSnapShot = cloneDeep(this.playGround);
  }

  handleHover(div) {
    var referenceId = div.nativeElement.id;
    var referenceBox = referenceId == 'drag-1' ? this.firstBlock : referenceId == 'drag-2' ? this.secondBlock : this.thirdBlock;
    var plusRow = referenceBox.length;
    var plusColumn = referenceBox[0].length;
    var rowColumn = this.zoneId.split('x');
    var row = parseInt(rowColumn[0]);
    var column = parseInt(rowColumn[1]);

    if (column + plusColumn - 1 >= 9 ||
      row + plusRow - 1 >= 9 ||
      column < 0 ||
      row < 0 ||
      row > 8 ||
      column > 8) {
      return;
    }

    //check if available
    let rw = 0;
    for (let i = row; i < row + plusRow; i++) {
      let cl = 0;
      for (let j = column; j < column + plusColumn; j++) {
        if (this.playGround[i][j] == 1 && referenceBox[rw][cl] == 1) {
          return;
        }
        cl++;
      }
      rw++;
    }

    rw = 0;
    for (let i = row; i < row + plusRow; i++) {
      let cl = 0;
      for (let j = column; j < column + plusColumn; j++) {
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
    var referenceId = div.nativeElement.id;
    var referenceBox = referenceId == 'drag-1' ? this.firstBlock : referenceId == 'drag-2' ? this.secondBlock : this.thirdBlock;
    var plusRow = referenceBox.length;
    var plusColumn = referenceBox[0].length;
    var rowColumn = this.zoneId.split('x');
    var row = parseInt(rowColumn[0]);
    var column = parseInt(rowColumn[1]);


    if (column + plusColumn - 1 >= 9 ||
      row + plusRow - 1 >= 9 ||
      column < 0 ||
      row < 0) {
      return;
    }

    //check if available
    let rw = 0;
    for (let i = row ; i < row + plusRow; i++) {
      let cl = 0;
      for (let j = column; j < column + plusColumn; j++) {
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

    //get a snapshot for undo
    this.getSnapshot();
    this.lastScore = this.score;
    this.lastSandId = this.sandId;

    rw = 0;
    for (let i = row; i < row + plusRow; i++) {
      let cl = 0;
      for (let j = column; j < column + plusColumn; j++) {
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
      if (this.score > this.overallScore) this.overallScore = this.score;
      if (this.score > this.todayScore) this.todayScore = this.score;
      if (this.score > this.weeklyScore) this.weeklyScore = this.score;
      if (this.score > this.monthlyScore) this.monthlyScore = this.score;

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
      var gameOver = this.isGameOver();

      if(gameOver) {
        this.userInfo = {
          ...this.userInfo,
          isSaved: false
        }
        this.storageService.setData(this.userInfo);
        setTimeout(() => {
          this.presentAlert();
        }, 1)
      }
      else {
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
            score: this.score,
            lastSandId: this.lastSandId,
            lastReferenceBlock: this.lastReferenceBlock,
            today: {
              date: (new Date()).toLocaleDateString('en-GB'),
              score: this.todayScore
            },
            weekly: {
              week: this.getCurrentWeek(),
              score: this.weeklyScore
            },
            monthly: {
              month: this.getCurrentMonth(),
              score: this.monthlyScore
            },
            overall: this.overallScore
          }
          this.storageService.setData(this.userInfo);
        }, 501)
      }
    }, 550)
  }

  handleBreakable(row, column, square) {
    row.forEach((r) => {
      for (var i = 0; i < 9; i++) {
        var name = `${r}x${i}-inside`; //  r + 'x' + i;
        const square = this.animationCtrl.create()
          .addElement(document.querySelector(`[name='${name}']`))
          .fill('none')
          .duration(1000)
          .iterations(Infinity)
          .keyframes([
            { offset: 0, opacity: 1 },
            { offset: 0.5, opacity: 0.8 },
            { offset: 1, opacity: 1 }
          ]);
        square.play();
      }
    });

    column.forEach((c) => {
      for (var i = 0; i < 9; i++) {
        var name = `${i}x${c}-inside`; // i + 'x' + c;
        const square = this.animationCtrl.create()
          .addElement(document.querySelector(`[name='${name}']`))
          .fill('none')
          .duration(1000)
          .iterations(Infinity)
          .keyframes([
            { offset: 0, opacity: 1 },
            { offset: 0.5, opacity: 0.8 },
            { offset: 1, opacity: 1 }
          ]);
        square.play();
      }
    });

    square.forEach(s => {
      for (let i = s[0]; i < s[0] + 3; i++) {
        for (let j = s[1]; j < s[1] + 3; j++) {
          var name = `${i}x${j}-inside`
          const square = this.animationCtrl.create()
            .addElement(document.querySelector(`[name='${name}']`))
            .fill('none')
            .duration(1000)
            .iterations(Infinity)
            .keyframes([
              { offset: 0, opacity: 1 },
              { offset: 0.5, opacity: 0.8 },
              { offset: 1, opacity: 1 }
            ]);
          square.play();
        }
      }
    })
  }

  async playPoints() {
    const div = document.querySelector('.points') as HTMLElement;
    div.style.display = 'flex';
    const animation = this.animationCtrl.create()
          .addElement(document.querySelector('.points'))
          .fill('none')
          .duration(1000)
          .keyframes([
            { offset: 0, transform: 'translateY(0px)', opacity: 1 },
            { offset: 0.5, transform: 'translateY(-30px)', opacity: 1 },
            { offset: 1, transform: 'translateY(-300px)', opacity: 0 }
          ])
          // .fromTo('transform', 'translateY(0px)', 'translateY(-300px)')
          // .fromTo('opacity', '1', '0');
          await animation.play();
    div.style.display = 'none';
  }

  playAnimations(row, column, square) {
    if(row.length > 0 || column.length > 0 || square.length > 0) {
      const scene = document.querySelector('.grid') as HTMLElement;
      scene.style.pointerEvents = 'none';
      setTimeout(() => {
        scene.style.pointerEvents = 'all';
      }, 500)
    }
    var rows = [];
    row.forEach((r) => {
      for (var i = 0; i < 9; i++) {
        var name = `${r}x${i}-inside`; //  r + 'x' + i;
        const square = this.animationCtrl.create()
          .addElement(document.querySelector(`[name='${name}']`))
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
        var name = `${i}x${c}-inside`; // i + 'x' + c ;
        const square = this.animationCtrl.create()
          .addElement(document.querySelector(`[name='${name}']`))
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
      console.log(row, column, square)
      for (let i = s[0]; i < s[0] + 3; i++) {
        for (let j = s[1]; j < s[1] + 3; j++) {
          var name = `${i}x${j}-inside`;
          const square = this.animationCtrl.create()
            .addElement(document.querySelector(`[name='${name}']`))
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
          this.playGround = cloneDeep(this.lastSnapShot);
          this.score = this.lastScore;
          this.undoCount--;
          this.moves++;
          if (this.lastSandId == 'drag-1') {
            this.firstObject = this.lastReferenceBlock;
            this.firstBlock = this.firstObject.block;
          }
          else if (this.lastSandId == 'drag-2') {
            this.secondObject = this.lastReferenceBlock;
            this.secondBlock = this.secondObject.block;
          }
          else if (this.lastSandId == 'drag-3') {
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
          this.storageService.setData(this.userInfo);
        }
      }
      else {
        this.presentToast('Bloklar yenilendiğinde geri alamazsın.')
      }

    }
    else this.presentToast("Geri alma hakkınız kalmadı.")
    this.detector.detectChanges();
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
      const id = ev.target.getAttribute('name').substring(0,3).split('x');
      let row = id[0];
      let column = id[1];
      this.playGround[row][column] = 0;
      this.isDelete = !this.isDelete;
      this.deleteCount--;
    }
    if (this.isInsert && this.addCount > 0) {
      const id = ev.target.getAttribute('name').substring(0,3).split('x');
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
    this.storageService.setData(this.userInfo);
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

  async newGameModal() {
    const modal = await this.modalCtrl.create({
      component: NewGameModule.component,
      cssClass: 'new-game-modal-css',
      mode: 'ios',
      
    })

    await modal.present();
    const data = await modal.onDidDismiss();
    if(data) {
      debugger
      await this.getSavedData();
    }
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
        if (rowLen + i > 9) continue;
        if (colLen == 0) break;

        for (var j = 0; j < 9; j++) {
          isSet = true;
          if (colLen + j > 9) continue;
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

  getCurrentWeek() {
    var currentdate: any = new Date();
    var oneJan: any = new Date(currentdate.getFullYear(),0,1);
    var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    var result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
    return result;
  }

  getCurrentMonth() {
    var date = new Date();
    return date.getMonth();
  }


}
