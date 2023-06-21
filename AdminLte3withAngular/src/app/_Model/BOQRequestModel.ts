import { Interface } from "readline";
import { Observable } from "rxjs";
import { CommonSearchPanelModel, CommonSiteSearchPanelModel } from "./commonModel";


export class BOQReqModel
{
    circleId:string="";
    CompanyId:number=0;
    customerId:string="";
    ProjectType:string="";
    fromDate:string="";
    toDate:string="";
    BOQId:number=0;
    Flag:number=1;
    UserId:number=0;
}

export class BOQNOListModel
{
    circleId:number=0;
    CompanyId:number=0;
    SearchText:string="";
    Flag:number=0;
    WHId:number=0;
    DTId:number=0;
    customerId:number=0 ;//vishal
    SiteId:number=0 //vishal
}

export class BOQModel
{
    BOQId:number=0;
    CompanyId:number=0;
    UserId:number=0;
}

export class SearchDIRequestModel{   
    UserId:any; 
    SiteId:any; 
    fromDate:any;  
    toDate:any; 
    CompanyId:any; 
    MRNo:any;
    ItemClass:any;
    Item_Id:any; 
    CapacityId_Id:any; 
    State_Id:any; 
    flag2:any;  
    //flag2:any;  
    RequestId:any;  
    IsSRN:number;
    DIType:string;
    DispatchStatus: string;
    Responsibility: string
}


export interface IBOQRequestequestService {
    GetBOQRequestList(objBOQReqModel:BOQReqModel):Observable<any>;
    GetBOQNoORBOQRequestNo(objModel: BOQNOListModel): Observable<any>;
    GetBOQRequestPdfDetail(objBOQReqModel:BOQModel):Observable<any>;
}


//by:vishal, 29/12/2022
export class SearchMaterialAtSiteModel  {   
    UserId:any; 
    siteId:any; 
    circleId: any;
    zoneId: any;
    clusterId: any;
    customerId: any;
    vendorId: any;
    siteStatus: any;
    SiteKeys: any;
    fromDate: any;
    toDate: any;
    CompanyId: any;
    ItemClass:any;
    Item_Id:any; 
    CapacityId:any; 
    State_Id:string; 
    flag:string;  
    SRNStatus: number;
    //DispatchStatus: string;
    
 
}

