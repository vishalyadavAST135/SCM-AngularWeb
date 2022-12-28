import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendmailService {

  childModal:Boolean;
  

  constructor() { }
  _getSendMailSubject = new BehaviorSubject <any>(null);

  _SetSendMailData(value) {
   
    this._getSendMailSubject.next(value);
     
  }

  _getDispatchId = new BehaviorSubject <any>(null);

  _SetDispatchId(value) {
   
    this._getDispatchId.next(value);
     
  }

  getMailData(){
  return 
  }



}
