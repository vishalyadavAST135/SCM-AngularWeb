import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiteServiceService {

  constructor() { }
  SearchSitesPanelSubject = new Subject<any>();

  SearchSitesChanges(value){
    this.SearchSitesPanelSubject.next(value);
}
}
