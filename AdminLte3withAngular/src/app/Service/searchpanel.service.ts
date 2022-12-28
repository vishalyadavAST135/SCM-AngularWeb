import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchpanelService {

  constructor() { }
  SearchPanelSubject = new Subject<any>();
  StockSearchPanelSubject = new Subject<any>();
  SearchPanelDataChanges(value) {
    this.SearchPanelSubject.next(value);
  }

  StockSearchPanelDataChanges(value) {
    this.StockSearchPanelSubject.next(value);
  }

}
