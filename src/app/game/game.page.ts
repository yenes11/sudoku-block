import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { blocks } from '../blocks';
import { patterns, executePatterns, willBreakPatterns } from '../patterns';
import { SettingsModule } from '../components/settings/settings.module';
import { ProfileNameModule } from '../components/profile-name/profile-name.module';
import { Gesture, IonItem, IonPopover, ModalController } from '@ionic/angular';
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
import { LoadingController } from '@ionic/angular';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { languages } from '../language';
import { isNewGame, makeFalse } from '../components/new-game/new-game.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements AfterViewInit {
  selectedLanguage = "english";
  languageTexts = "";
  blocks = blocks;
  userInfo;
  sounds = true;
  isDelete = false;
  isInsert = false;
  isNext = false;
  isSaved = false;
  pattern = patterns;
  executePatterns = executePatterns;
  willBreakPatterns = willBreakPatterns;
  combo = 0;
  lastCombo = 0;
  comboText = "";
  plusPoint;
  plusPointText = "";
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
  
  emptyGround = [
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
  
  lastSnapShot = cloneDeep(this.emptyGround);
  
  hoverSnapShot = cloneDeep(this.emptyGround);
  
  playGround = cloneDeep(this.emptyGround);
  
  pieceRow: number;
  pieceColumn: number;
  targetId: string;
  score = 0;
  lastScore = 0;
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

  soundList = {
    "one": "/assets/sounds/1.wav",
    "two": "/assets/sounds/2.wav",
    "three": "/assets/sounds/3.wav",
    "four": "/assets/sounds/4.wav",
    "five": "/assets/sounds/5.wav",
    "six": "/assets/sounds/6.wav",
    "seven": "/assets/sounds/7.wav",
    "eight": "/assets/sounds/8.wav",
    "nine": "/assets/sounds/9.wav",
  }

  
  isLeftZone = false;
  
  constructor(private modalCtrl: ModalController, private router: Router,
    private gestureCtrl: GestureController, private detector: ChangeDetectorRef, private device: Device,
    private animationCtrl: AnimationController, private toastController: ToastController, private alertController: AlertController,
    private storageService: StorageService, private loadingController: LoadingController, private ngZone: NgZone) {
      
    }
    
    ngAfterViewInit(): void {
      setTimeout(() => {
        this.updateGestures()
        this.createAnimations()
        
        this.playSize = document.querySelector('.blue-play').clientWidth;
        this.sandSize = document.querySelector('.square-full').clientWidth;
      }, 500);
    }
    
    playSound(num) {
      var sound = new Howl({
        src: [this.soundList[num]]
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
        this.router.navigateByUrl('gameover',{
          replaceUrl: true,
          });
      }, 2000)
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

        this.selectedLanguage = this.userInfo.language;
        this.languageTexts = languages[this.selectedLanguage];
        
        var today = this.userInfo.today;
        if (today.date != (new Date()).toLocaleDateString('en-GB')) this.todayScore = 0;
        else this.todayScore = today.score;
        
        var weekly = this.userInfo.weekly;
        if(this.getCurrentWeek() != weekly.week) this.weeklyScore = 0;
        else this.weeklyScore = weekly.score;
        
        var monthly = this.userInfo.monthly;
        if (this.getCurrentMonth != monthly.month) this.monthlyScore = 0;
        else this.monthlyScore = monthly.score;

        this.sounds = this.userInfo['sounds'];
        
        this.overallScore = this.userInfo.overall;
        
        // var isSaved = this.userInfo['isSaved'];
        // this.isSaved = isSaved;
        this.isSaved = this.userInfo['isSaved'];
        if (this.isSaved) {
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
          
          this.didLottiePlayed = this.userInfo.lottie;
        }
        else {
          this.setEnv();
          this.detector.detectChanges();
        }
      })
    }
    
    @ViewChildren('item', { read: ElementRef }) items: QueryList<ElementRef>;
    gestureArray: Gesture[] = [];
    
    @ViewChildren('dropzone', { read: ElementRef }) dropZones: QueryList<ElementRef>;
    @ViewChildren('animate') animations: QueryList<ElementRef>;
    
    anim: Animation;
    @ViewChild('sample') sample: ElementRef;
    
    animationList = [];
    sampleList = {};
    createAnimations() {     
      const first = this.animations.first;


      this.anim = this.animationCtrl.create('sample');
      this.anim.addElement(this.sample.nativeElement)
      .duration(500)
      .keyframes([
        { offset: 0, transform: 'scale(1) rotate(0)', opacity: 1 },
        { offset: 0.5, transform: 'scale(.5) rotate(180deg)', opacity: 0.5 },
        { offset: 1, transform: 'scale(0) rotate(360deg)', opacity: 0 }
      ]);
      this.sampleList["x"] = this.anim;
      
      const fills = [...this.animations];
      
      // for(var fill of fills){//(fill => {
        const anim: Animation = this.animationCtrl.create(first.nativeElement.id);
        anim.addElement(first.nativeElement)
        .duration(500)
        .keyframes([
          { offset: 0, transform: 'scale(1) rotate(0)', opacity: 1 },
          { offset: 0.5, transform: 'scale(.5) rotate(180deg)', opacity: 0.5 },
          { offset: 1, transform: 'scale(0) rotate(360deg)', opacity: 0 }
        ]);
        this.animationList.push(anim);
        
        // this.animationList[fill.nativeElement.id] = x;
      // }
    }
    
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
                
                grandChildren.forEach(box => {     
                  
                  box.style.transition = '.07s ease-out';
                  box.style.width = `${this.playSize}px`;
                  box.style.height = `${this.playSize}px`;
                  box.style.backgroundColor = '#94BBED';
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
                  
                  this.playGround = cloneDeep(this.hoverSnapShot);
                  this.detector.detectChanges();
                  setTimeout(() => {
                    this.params = this.handleHover(div);
                    
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
                  box.style.backgroundColor = "#6F9DD7";
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
        console.log(this.didLottiePlayed);
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
            if(this.sounds) this.playSound("three");
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
                if(this.sounds) this.playSound("three");
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
          this.lastCombo = this.combo;
          var dropIndex = [];
          
          rw = 0;
          for (let i = row; i < row + plusRow; i++) {
            let cl = 0;
            for (let j = column; j < column + plusColumn; j++) {
              if (referenceBox[rw][cl] == 0) { //this.playGround[i][j] == 1 &&  deleted
                cl++;
                continue;
              }
              this.playGround[i][j] = referenceBox[rw][cl];
              dropIndex.push([i, j]);
              cl++;
            }
            rw++;
          }
          if(this.sounds) this.playSound("two");
          this.moves--;
          var patternOutput = this.pattern(this.playGround);
        //  debugger
          var allSquares;
          setTimeout(() => {
            allSquares = this.playAnimations(patternOutput[0], patternOutput[1], patternOutput[2]);
          },0)
          setTimeout(() => {
            allSquares.forEach(s => s.play())
          }, 0);
          
          setTimeout(() => {
            var output = executePatterns(this.score, this.playGround, patternOutput, dropIndex, this.combo);
            this.score = output[0];
            this.combo = output[1];
            this.comboText = output[2];
            this.plusPoint = this.score - this.lastScore;
            this.plusPointText = "+" + this.plusPoint;
            
            if(this.plusPoint > 0) {
              if(this.sounds) {
                if(this.combo == 1) this.playSound("four");
                else if (this.combo == 2) this.playSound("five")
                else this.playSound("six");
              }
              this.playPoints();
            }
            if (this.score > this.overallScore) {
              this.overallScore = this.score;
              if (!this.didLottiePlayed) this.playLottie();
            } 
            if (this.score > this.todayScore){
              this.todayScore = this.score;
              if (!this.didLottiePlayed) this.playLottie();
            }
            if (this.score > this.weeklyScore){
              this.weeklyScore = this.score;
              if (!this.didLottiePlayed) this.playLottie();
            } 
            this.detector.detectChanges();
          }, 500)
          setTimeout(() => {
            allSquares.forEach(s => s.destroy())
            this.detector.detectChanges();
          }, 500);
          
          
          let newBlock = this.getRandom();
          if (this.moves > 0) {
            if (this.sandId == 'drag-2') {
              this.lastReferenceBlock = cloneDeep(this.secondObject);
              this.secondObject = this.emptyObject;
              this.secondBlock = this.secondObject.block;
            }
            
            else if (this.sandId == 'drag-3') {
              this.lastReferenceBlock = cloneDeep(this.thirdObject);
              this.thirdObject = this.emptyObject;
              this.thirdBlock = this.thirdObject.block;
            }
            
            else if (this.sandId == 'drag-1') {
              this.lastReferenceBlock = cloneDeep(this.firstObject);
              this.firstObject = this.emptyObject;
              this.firstBlock = this.firstObject.block;
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
                  undo: this.undoCount,
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
                  overall: this.overallScore,
                  combo: this.combo
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
              .addElement(document.getElementById(name))
              .fill('none')
              .duration(1000)
              .iterations(Infinity)
              .keyframes([
                { offset: 0, opacity: 1 , backgroundColor: '#A3C5F1' },
                { offset: 0.5, opacity: 0.8, backgroundColor: '#A3C5F1' },
                { offset: 1, opacity: 1, backgroundColor: '#A3C5F1' }
              ]);
              square.play();
            }
          });
          
          column.forEach((c) => {
            for (var i = 0; i < 9; i++) {
              var name = `${i}x${c}-inside`; // i + 'x' + c;
              const square = this.animationCtrl.create()
              .addElement(document.getElementById(name))
              .fill('none')
              .duration(1000)
              .iterations(Infinity)
              .keyframes([
                { offset: 0, opacity: 1, backgroundColor: '#A3C5F1' },
                { offset: 0.5, opacity: 0.8, backgroundColor: '#A3C5F1' },
                { offset: 1, opacity: 1, backgroundColor: '#A3C5F1' }
              ]);
              square.play();
            }
          });
          
          square.forEach(s => {
            for (let i = s[0]; i < s[0] + 3; i++) {
              for (let j = s[1]; j < s[1] + 3; j++) {
                var name = `${i}x${j}-inside`
                const square = this.animationCtrl.create()
                .addElement(document.getElementById(name))
                .fill('none')
                .duration(1000)
                .iterations(Infinity)
                .keyframes([
                  { offset: 0, opacity: 1, backgroundColor: '#A3C5F1' },
                  { offset: 0.5, opacity: 0.8, backgroundColor: '#A3C5F1' },
                  { offset: 1, opacity: 1, backgroundColor: '#A3C5F1' }
                ]);
                square.play();
              }
            }
          })
        }
        
        async playPoints() {
          const divPoint = document.querySelector('.points') as HTMLElement;
          const divCombo = document.querySelector('.combo') as HTMLElement;
          divPoint.style.display = 'flex';
          divCombo.style.display = 'flex';
          const animationPoint = this.animationCtrl.create()
          .addElement(document.querySelector('.points'))
          .fill('none')
          .duration(1000)
          .keyframes([
            { offset: 0, transform: 'translateY(0px)', opacity: 1 },
            { offset: 0.5, transform: 'translateY(-30px)', opacity: 1 },
            { offset: 1, transform: 'translateY(-300px)', opacity: 0 }
          ])
          const animationCombo = this.animationCtrl.create()
          .addElement(document.querySelector('.combo'))
          .fill('none')
          .duration(1000)
          .keyframes([
            { offset: 0, transform: 'translateY(0px)', opacity: 1 },
            { offset: 0.5, transform: 'translateY(-30px)', opacity: 1 },
            { offset: 1, transform: 'translateY(-300px)', opacity: 0 }
          ])
          animationCombo.play();
          await animationPoint.play();
          divPoint.style.display = 'none';
          divCombo.style.display = 'none';
        }
        
        playAnimations(row, column, square) {          
          var allSquares = [];
          if(row.length > 0 || column.length > 0 || square.length > 0) {
            const scene = document.querySelector('.grid') as HTMLElement;
            scene.style.pointerEvents = 'none';
            setTimeout(() => {
              scene.style.pointerEvents = 'all';
            }, 500)
          }
          var rows = [];
          for(var r of row) //row.forEach((r) =>
          {
            for (var i = 0; i < 9; i++) {
              var name = `${r}x${i}-inside`; //  r + 'x' + i;
              const square = this.animationCtrl.create()
              .addElement(document.getElementById(name))
              .fill('none')
              .duration(500)
              .keyframes([
                { offset: 0, transform: 'scale(1) rotate(0)', opacity: 1 },
                { offset: 0.5, transform: 'scale(.5) rotate(180deg)', opacity: 0.5 },
                { offset: 1, transform: 'scale(0) rotate(360deg)', opacity: 0 }
              ]);
              allSquares.push(square);
            }
          };
          for(var c of column) //column.forEach((c) =>
          {
            for (var i = 0; i < 9; i++) {
              var name = `${i}x${c}-inside`; // i + 'x' + c ;
              const square = this.animationCtrl.create()
              .addElement(document.getElementById(name))
              .fill('none')
              .duration(500)
              .iterations(1)
              .keyframes([
                { offset: 0, transform: 'scale(1) rotate(0)', opacity: 1 },
                { offset: 0.5, transform: 'scale(.5) rotate(180deg)', opacity: 0.5 },
                { offset: 1, transform: 'scale(0) rotate(360deg)', opacity: 0 }
              ]);
              allSquares.push(square)
            }
          };
          for(var s of square)   //square.forEach(async s =>  
          {
            for (let i = s[0]; i < s[0] + 3; i++) {
              for (let j = s[1]; j < s[1] + 3; j++) {
                var name = `${i}x${j}-inside`;
                const nat = this.animations.find(el => el.nativeElement.id == name);
                const square = this.animationCtrl.create()
                  .addElement(nat.nativeElement)
                  .duration(500)
                  .fill("forwards")
                  .keyframes([
                        { offset: 0, transform: 'scale(1) rotate(0)', opacity: 1 },
                        { offset: 0.5, transform: 'scale(.5) rotate(180deg)', opacity: 0.5 },
                        { offset: 1, transform: 'scale(0) rotate(360deg)', opacity: 0 }
                      ]);
                allSquares.push(square);
              }
            }
          }
          return allSquares;
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
      if(this.sounds) this.playSound("eight");
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
      if(this.sounds) this.playSound("eight");

      let rotate = this.firstObject.rotate;
      this.firstObject = this.blocks.filter(obj => obj.id == rotate)[0];
      this.firstBlock = this.firstObject.block;
      this.detector.detectChanges();
    }
    rotateTwo() {
      if(this.sounds) this.playSound("eight");

      let rotate = this.secondObject.rotate;
      this.secondObject = this.blocks.filter(obj => obj.id == rotate)[0];
      this.secondBlock = this.secondObject.block;
      this.detector.detectChanges();
    }
    rotateThree() {
      if(this.sounds) this.playSound("eight");

      let rotate = this.thirdObject.rotate;
      this.thirdObject = this.blocks.filter(obj => obj.id == rotate)[0];
      this.thirdBlock = this.thirdObject.block;
      this.detector.detectChanges();
    }

    jokerPopover() {
      if(this.sounds) this.playSound("eight");
    }
    
    toggleDelete() {
      if(this.sounds) this.playSound("eight");
      this.isInsert = false;
      if (this.deleteCount > 0) {
        this.isDelete = true;
        const popup = document.getElementById('popup') as unknown as IonPopover;
        popup.dismiss();
        this.presentToast("Silmek istediğiniz bloğa dokunun.")
      }
      else this.presentToast('Silme hakınız kalmadı.')
    }
    
    toggleInsert() {
      if(this.sounds) this.playSound("eight");
      this.isDelete = false;
      if (this.addCount > 0) {
        this.isInsert = true;
        const popup = document.getElementById('popup') as unknown as IonPopover;
        popup.dismiss();
        this.presentToast("Ekleme yapmak istediğiniz bloğa dokunun.")
      }
      else this.presentToast('Ekleme hakınız kalmadı.')
    }

    playDelete(id) {
      const square = this.animationCtrl.create()
        .addElement(document.getElementById(id))
        .fill('none')
        .duration(200)
        .keyframes([
          { offset: 0, transform: 'scale(1) rotate(0)', opacity: 1 },
          { offset: 0.5, transform: 'scale(.5) rotate(180deg)', opacity: 0.5 },
          { offset: 1, transform: 'scale(0) rotate(360deg)', opacity: 0 }
        ]);
        square.play();
      return square;
    }

    playInsert(id) {

      const square = this.animationCtrl.create()
        .addElement(document.getElementById(id))
        .fill('none')
        .duration(200)  
        .keyframes([
          { offset: 0, backgroundColor: '#6F9DD7', transform: 'scale(0) rotate(0)', opacity: 0 },
          { offset: 0.5,backgroundColor: '#6F9DD7', transform: 'scale(.5) rotate(180deg)', opacity: 0.5 },
          { offset: 1,backgroundColor: '#6F9DD7', transform: 'scale(1) rotate(360deg)', opacity: 1 }
        ]);
        square.play();
      return square;
    }
    
    deleteOrInsert(ev) {
      if (this.isDelete && this.deleteCount > 0) {
        const id = ev.target.id.substring(0,3).split('x');
        let row = id[0];
        let column = id[1];
        if (this.playGround[row][column] == 0) {
          this.presentToast("Silmek istediğiniz alan zaten boş");
          return;
        }
        else {
          var s;
          setTimeout(() => {
            s = this.playDelete(ev.target.id);
          }, 0)
          setTimeout(() => {
            this.playGround[row][column] = 0;
          }, 200)
          setTimeout(() => {
            s.destroy();
          }, 200)
          
          this.isDelete = !this.isDelete;
          this.deleteCount--;
        }
      }
      if (this.isInsert && this.addCount > 0) {
        const id = ev.target.id.substring(0,3).split('x');
        let row = id[0];
        let column = id[1];
        if (this.playGround[row][column] == 1){
          this.presentToast("Ekleme yapmak istediğiniz alan zaten dolu");
          return;
        } 
        else {
          var s;
          setTimeout(() => {
            s = this.playInsert(ev.target.id);
          }, 0)
          setTimeout(() => {
            this.playGround[row][column] = 1;
          }, 200)
          setTimeout(() => {
            s.destroy();
          }, 200)
          this.isInsert = !this.isInsert;
          this.addCount--;
        }
      }

      setTimeout(() => {
        var patternOutput = this.pattern(this.playGround);
        var allSquares;
  
        setTimeout(() => {
          allSquares = this.playAnimations(patternOutput[0], patternOutput[1], patternOutput[2]);
        }, 0)
  
        setTimeout(() => {
          allSquares.forEach(s => s.play());
        }, 0);
  
        setTimeout(() => {
          allSquares.forEach(s => s.destroy());
        }, 500);
        
        if (patternOutput[0].length == 0 && patternOutput[1].length == 0 && patternOutput[2].length == 0) {
          setTimeout(() => {
            // var output = executePatterns(this.score, this.playGround, patternOutput, [], this.combo);
            this.detector.detectChanges();
          }, 1)
        }
        else {
          setTimeout(() => {
            var output = executePatterns(this.score, this.playGround, patternOutput, [], this.combo);
            this.score = output[0];
            this.combo = output[1];
            this.comboText = output[2];
            this.plusPoint = this.score - this.lastScore;
            this.plusPointText = "+" + this.plusPoint;
            
            if(this.plusPoint > 0) {
              if(this.sounds) {
                if(this.combo == 1) this.playSound("four");
                else if (this.combo == 2) this.playSound("five")
                else this.playSound("six");
              }
              this.playPoints();
            }
            if (this.score > this.overallScore) {
              this.overallScore = this.score;
              if (!this.didLottiePlayed) this.playLottie();
            } 
            if (this.score > this.todayScore){
              this.todayScore = this.score;
              if (!this.didLottiePlayed) this.playLottie();
            }
            if (this.score > this.weeklyScore){
              this.weeklyScore = this.score;
              if (!this.didLottiePlayed) this.playLottie();
            } 
            this.detector.detectChanges();
          }, 501)
        }
      }, 200)
      setTimeout(() => {
        this.userInfo = {
          ...this.userInfo,
          add: this.addCount,
          delete: this.deleteCount,
          playground: this.playGround,
          lastSnapshot: this.lastSnapShot
        }
        this.storageService.setData(this.userInfo);
      }, 500)
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
      if(this.sounds) {
        this.playSound("one")
      }
      const modal = await this.modalCtrl.create({
        component: SettingsModule.component,
        cssClass: 'settings-modal-css',
        mode: 'ios'
      })
      await modal.present();
      await modal.onWillDismiss();
      this.storageService.getData().subscribe(res => {
        this.selectedLanguage = res.language;
        this.languageTexts = languages[this.selectedLanguage];
        this.sounds = res.sounds;
      })
    }
    
    async newGameModal() {
      if(this.sounds) {
        this.playSound("one")
      }
      const modal = await this.modalCtrl.create({
        component: NewGameModule.component,
        cssClass: 'new-game-modal-css',
        mode: 'ios',
      })
      await modal.present();
      await modal.onWillDismiss();
      
      if(isNewGame) {
        makeFalse();         
          this.playGround = cloneDeep(this.emptyGround);
          this.hoverSnapShot = cloneDeep(this.emptyGround);
          this.lastSnapShot = cloneDeep(this.emptyGround);
          this.addCount = 3;
          this.deleteCount = 3;
          this.undoCount = 1;
          this.score = 0;
          this.moves = 3;
          this.combo = 0;
          this.didLottiePlayed = false;
          this.setEnv();
          this.detector.detectChanges();
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
    
    async presentLoading() {
      const loading = await this.loadingController.create({
        mode: 'ios',
        spinner: 'circular',
        message: 'Loading',
        duration: 100
      });
      await loading.present();
    }

    private animation: AnimationItem;
    didLottiePlayed = false;
    created(animation: AnimationItem) {
      this.animation = animation;
    }

    lottieOptions: AnimationOptions = {
      path: 'assets/lottie/confetti_orj.json',
      autoplay: false,
      loop: false
    }

    playLottie() {
      this.didLottiePlayed = true;
      const lottie = document.querySelector('.lottie') as HTMLElement;
      lottie.style.display = 'block';
      this.ngZone.runOutsideAngular(() => this.animation.play());
      this.userInfo = {
        ...this.userInfo,
        lottie: this.didLottiePlayed
      }
      this.storageService.setData(this.userInfo)
      const trophy = document.querySelector('.trophy') as HTMLImageElement;
      setTimeout(() => {
        lottie.style.display = 'none';
      }, 5000)
      trophy.style.opacity = '1';
    }

    stopLottie() {
      this.ngZone.runOutsideAngular(() => this.animation.stop());
    }
    
  }
  
      