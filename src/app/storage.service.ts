import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { BehaviorSubject, from, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Device } from '@ionic-native/device/ngx';


const STORAGE_KEY = 'userInfo';



@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageReady = new BehaviorSubject(false);
  constructor(private storage: Storage, public device: Device) {
    this.init();


  }

  async init() {
    await this.storage.defineDriver(CordovaSQLiteDriver)
    await this.storage.create();
    this.storageReady.next(true);
  }

  getData() {
    return this.storageReady.pipe(
      filter(ready => ready),
      switchMap(_ => {
        return from(this.storage.get(STORAGE_KEY)) || of({});
      })
    )
  }

  async addData(item) {
    const storedData = await this.storage.get(STORAGE_KEY) || {};
    console.log(storedData)
    storedData.push(item);
    return this.storage.set(STORAGE_KEY, storedData);
  }

  async removeData(index) {
    const storedData = await this.storage.get(STORAGE_KEY) || {};
    storedData.splice(index, 1);
    return this.storage.set(STORAGE_KEY, storedData);
  }

  async setData(item) {
    return await this.storage.set(STORAGE_KEY, item);
  }
}

