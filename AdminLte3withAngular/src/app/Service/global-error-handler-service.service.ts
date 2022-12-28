import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable,ErrorHandler,Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { WebAPIConfig, WebErrorLogModel } from '../_Model/commonModel';
const headers = new HttpHeaders({ 'Content-Type': 'application/json', 
  'Access-Control-Allow-Origin': '*',                                   
  'Methods': 'POST'
  });

  const options = { headers: headers, crossDomain: true, withCredentials: false };
@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerServiceService implements ErrorHandler  {

  
  constructor(private injector: Injector, private httpclient: HttpClient) { }

  async handleError(objWebErrorLogModel: WebErrorLogModel){ 
    var objBaseUrl=new WebAPIConfig();    
    return await this.httpclient.post(objBaseUrl.ApIUrl+"SaveWebErrorLog",objWebErrorLogModel,options).toPromise();
    // throw new Error('Method not implemented.');
    //console.error(error.message);
    //alert(error);
  }

 // SavePoPDF(objPOPdfModel:POPdfModel):Observable<any>{ 
   
  //}
}
