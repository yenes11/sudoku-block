import { Injectable } from '@angular/core';
import { collectionData, docData, Firestore } from '@angular/fire/firestore';
import { collection, doc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) { }

  getWeekly() {
    const weeklyRef = collection(this.firestore, 'Weekly');
    return collectionData(weeklyRef, {idField: 'id'});
  }

  getWeeklyById(id) {
    const weeklyDocRef = doc(this.firestore, `Weekly/${id}`);
    return docData(weeklyDocRef, {idField: 'id'})
  }

}
