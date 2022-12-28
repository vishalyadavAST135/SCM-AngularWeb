import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimePeriodService {

  constructor() { }

  SearchTimePeriodPanelSubject = new Subject<any>();

  SearchTimePeriodPaneChanges(value){
    this.SearchTimePeriodPanelSubject.next(value);
}
}