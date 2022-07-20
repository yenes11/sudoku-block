import { Injectable } from '@angular/core';
import { collectionData, docData, Firestore } from '@angular/fire/firestore';
import { collection, doc } from 'firebase/firestore';
import { addDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) { }

  getWeekly() {
    const weeklyRef = collection(this.firestore, 'Weekly');
    return collectionData(weeklyRef, {idField: 'id'});
  }

  getDaily() {
    const dailyRef = collection(this.firestore, 'Daily');
    return collectionData(dailyRef, {idField: 'id'});
  }

  getDailyById(id) {
    const dailyDocRef = doc(this.firestore, `Daily/${id}`);
    return docData(dailyDocRef, {idField: 'id'})
  }

  getWeeklyById(id) {
    const weeklyDocRef = doc(this.firestore, `Weekly/${id}`);
    return docData(weeklyDocRef, {idField: 'id'})
  }


  createWeekly(props) {
    // const weeklyDocRef = collection(this.firestore, 'Weekly');
    return setDoc(doc(this.firestore, 'Weekly', props.id), {name: props.name, score: 1234})
  }

  createDaily(props) {
    return setDoc(doc(this.firestore, 'Daily', props.id), {name: props.name, score: 1234})
  }


  createMonthly(props) {
    // const monthlyDocRef = collection(this.firestore, 'Weekly');
    return setDoc(doc(this.firestore, 'Monthly', props.id), {name: props.name, score: 1234})
  }

  getMonthlyById(id) {
    const monthlyDocRef = doc(this.firestore, `Monthly/${id}`);
    return docData(monthlyDocRef, {idField: 'id'})
  }
}
