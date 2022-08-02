import { Component, OnInit } from '@angular/core';
import { languages } from '../language';
import { StorageService } from '../storage.service';
import { Howl, Howler } from 'howler';

@Component({
  selector: 'app-logic',
  templateUrl: './logic.page.html',
  styleUrls: ['./logic.page.scss'],
})
export class LogicPage implements OnInit {
  selectedLanguage = "english";
  languageTexts = "";
  sounds = true;
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
  constructor(private storageService: StorageService) { }

  ngOnInit() {
    this.storageService.getData().subscribe(res => {
      this.selectedLanguage = res.language;
      this.languageTexts = languages[this.selectedLanguage];
    })
  }

  playSound(num) {
    var sound = new Howl({
      src: [this.soundList[num]]
    });
    sound.play();
  }

}
