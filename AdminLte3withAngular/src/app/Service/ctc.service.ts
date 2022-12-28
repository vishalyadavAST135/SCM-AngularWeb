import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebAPIConfig } from '../_Model/commonModel';
import { SaveUpDateCustomerToCustomerTransfer } from '../_Model/CustomerToCustomerModel';
import { SearchDispatchTrackerModel } from '../_Model/DispatchModel';
const headers = new HttpHeaders({  'Content-Type': 'application/json', 
'Access-Control-Allow-Origin': '*',                                   
'Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
});
const options = { headers: headers, crossDomain: true, withCredentials: false };

@Injectable({
  providedIn: 'root'
})
export class CtcService {

  constructor(private httpclient: HttpClient) { }

  SearchGetCustomerToCustomerList(objdata:SearchDispatchTrackerModel):Observable<any>{     
    var objBaseUrl=new WebAPIConfig();    
    return this.httpclient.post(objBaseUrl.ApIUrl+"CTC/GetCustomerToCustomerList",objdata,options); 
  }

  SaveUpDateCustomerToCustomerTransfer(objdata:SaveUpDateCustomerToCustomerTransfer):Observable<any>{     
    var objBaseUrl=new WebAPIConfig();    
    return this.httpclient.post(objBaseUrl.ApIUrl+"CTC/SaveCustomerToCustomer",objdata,options); 
  }

  GetCustomerToCustomerEditById(objdata:SaveUpDateCustomerToCustomerTransfer):Observable<any>{     
    // let Para =JSON.stringify(objdata);
    // let params = new HttpParams().set("para",Para);
    var objBaseUrl=new WebAPIConfig();    
    return this.httpclient.post(objBaseUrl.ApIUrl+"CTC/GetCustomerToCustomerEditById",objdata); 
  }
}
