import { Interface } from "readline";
import { Observable } from "rxjs";


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
}


export interface IBOQRequestequestService {
    GetBOQRequestList(objBOQReqModel:BOQReqModel):Observable<any>;
    GetBOQNoORBOQRequestNo(objModel: BOQNOListModel): Observable<any>;
    GetBOQRequestPdfDetail(objBOQReqModel:BOQModel):Observable<any>;
}

