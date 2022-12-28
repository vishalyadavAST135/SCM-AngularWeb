import { DispatchTrackingItemDetialModel } from "./DispatchModel";

export class StockQtyModel
{    
    Client_Id: any;
    ItemCode_Id: any;
    WH_Id: any;
    Equp_Id: any;
    Company_Id: any;
    IsEdit:any;
}

export class SaveUpdateStockQtyModel
{    
    WHId: any;
    UserId: any;
    CompanyId: any;
    FaultuRep_Id: any;
    RepairDate: any;
    Remarks:any;
    UploadCertificate: any;
    DocumentFile:any;
    DispatchId: any;
    RepairedType:any;
    InvoiceValue:any;
    InvoiceDate: any;
    InvoiceFile:any;
    VendorId:any;
    OkFaultyItemList:DispatchTrackingItemDetialModel[];
}
