import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginModel } from '../_Model/loginModel';
import { WebAPIConfig } from '../_Model/commonModel';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
});
const options = { headers: headers, crossDomain: true, withCredentials: false };
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<LoginModel>;
  public currentUser: Observable<LoginModel>;
  constructor(private httpclient: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<LoginModel>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): LoginModel {
    return this.currentUserSubject.value;
  }

  postUserLogin(objlogin: LoginModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "User/Login", objlogin, options).pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      //this.currentUserSubject.next(user);
      return user;
    }));
  }


  
  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
