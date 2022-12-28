import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import { DropdownModel, WebAPIConfig } from '../_Model/commonModel';
import { Observable } from 'rxjs';
import { GSerialNumber, VendorOrWhModel } from '../_Model/purchaseOrderModel';
import { SaveUpdateStockQtyModel, StockQtyModel } from '../_Model/StockModel';
import { SearchDispatchTrackerModel } from '../_Model/DispatchModel';

const headers = new HttpHeaders({  'Content-Type': 'application/json', 
'Access-Control-Allow-Origin': '*',                                   
'Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
});
const options = { headers: headers, crossDomain: true, withCredentials: false };

@Injectable({
  providedIn: 'root'
})
export class StockserviceService {


  constructor(private httpclient: HttpClient,) { }

  GetAllStockQtyByItemCode(objParameter:StockQtyModel):Observable<any>{
    let Para =JSON.stringify(objParameter);
    let params = new HttpParams().set("para",Para);
    var objBaseUrl=new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl+"Stock/GetAllStockQtyByItemCode",{params: params});
  }

  SaveUpDateStStock(formdata:FormData):Observable<any>{ 
    var objBaseUrl=new WebAPIConfig();    
    return this.httpclient.post(objBaseUrl.ApIUrl+"Stock/SaveUpDateStock",formdata);  
  }

   
  SearchGetFaultyRepaired(objdata:SearchDispatchTrackerModel):Observable<any>{     
    let Para =JSON.stringify(objdata);
    let params = new HttpParams().set("para",Para);
    var objBaseUrl=new WebAPIConfig();    
    return this.httpclient.get(objBaseUrl.ApIUrl+"Stock/SearchGetFaultyRepaired",{params: params}); 
  }
  addInStock(objParameter:Array<GSerialNumber>):Observable<any>{
    let Para =JSON.stringify(objParameter);
    let params = new HttpParams().set("para",Para);
    var objBaseUrl=new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl+"Stock/AddSerialInStock",{params: params});
  }
  
  SearchFaultyRepEditById(objdata:SaveUpdateStockQtyModel):Observable<any>{     
    let Para =JSON.stringify(objdata);
    let params = new HttpParams().set("para",Para);
    var objBaseUrl=new WebAPIConfig();    
    return this.httpclient.get(objBaseUrl.ApIUrl+"Stock/GetFaultyRepairedEditById",{params: params}); 
  }

  SearchFaultyRepPDFDataById(objdata:SaveUpdateStockQtyModel):Observable<any>{     
    let Para =JSON.stringify(objdata);
    let params = new HttpParams().set("para",Para);
    var objBaseUrl=new WebAPIConfig();    
    return this.httpclient.get(objBaseUrl.ApIUrl+"Stock/GetFaultyRepairedPdfDataById",{params: params}); 
  }

  SearchFaultyRepByDispatchId(objdata:SearchDispatchTrackerModel):Observable<any>{     
    let Para =JSON.stringify(objdata);
    let params = new HttpParams().set("para",Para);
    var objBaseUrl=new WebAPIConfig();    
    return this.httpclient.get(objBaseUrl.ApIUrl+"Stock/SearchFaultyRepByDispatchId",{params: params}); 
  }
  

  SaveUpdateFaultyToRepairedPdf(objPOPdfModel:SaveUpdateStockQtyModel):Observable<any>{ 
    var objBaseUrl=new WebAPIConfig();    
    return this.httpclient.post(objBaseUrl.ApIUrl+"Stock/SaveUpdateFaultyToRepairedPdf",objPOPdfModel,options);
  }
  
  GetAllFaultyRepairedTestedBy(objParameter: DropdownModel):Observable<any>{ 
    var objBaseUrl=new WebAPIConfig();    
    return this.httpclient.post(objBaseUrl.ApIUrl+"Stock/GetAllFaultyRepairedTestedBy",objParameter,options);
  }




  CheckFaultySerialNo(objGSerialNumber:GSerialNumber):Observable<any>{
    // let Para =JSON.stringify(SerialNo);
    // let params = new HttpParams().set("para",Para);
    var objBaseUrl=new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl+"Stock/CheckFaultySerialNo",objGSerialNumber,options);
  }
}
