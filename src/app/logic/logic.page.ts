import { Component, OnInit } from '@angular/core';
import { languages } from '../language';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-logic',
  templateUrl: './logic.page.html',
  styleUrls: ['./logic.page.scss'],
})
export class LogicPage implements OnInit {
  selectedLanguage = "english";
  languageTexts = "";
  constructor(private storageService: StorageService) { }

  ngOnInit() {
    this.storageService.getData().subscribe(res => {
      this.selectedLanguage = res.language;
      this.languageTexts = languages[this.selectedLanguage];
    })
  }

}
