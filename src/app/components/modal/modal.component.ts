import { Component, OnInit } from '@angular/core';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  constructor() { }



  ngOnInit() {}

  dismissModal() {
    const modal = document.querySelector('#settings-modal') as unknown as IonModal;
    modal.dismiss();
  }

}
