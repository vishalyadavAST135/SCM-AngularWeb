import { CommonSearchPanelModel } from './commonModel';
import { GSerialNumber } from './purchaseOrderModel';

export class DispatchTrackingModel
{ 
    DispatchTracker_Id:number;
    Company_Id:number;
    Transporter_Id:number;
    UserId:number;
    State_Id:number;
    ToState_Id:number;
    VendorId:number;
    DocumentNo:string;
    DocumentDate:string;
    TrasporationMode:string;
    TransporterName: string;
    TransporterGSTNo: string;
    PlaceofDispatch: string;
    Destination:string;
    AmountChargeable:string;
    GRNo:string;
    GRDate: string;
    VehicleNumber: string;
    ShippedfromWHId:number;
    ShippedToWHId:number;
    SiteId:number;
    CustomerSiteId:string;
    SiteName:string;
    ClientName:string;
    SiteAddress:string;
    ShippedToStateName:string;
    ShippedToStateCode:string;
    ShippedToGSTNO:string;
    Note:string;
    ReceivedBy:string;
    ReceivedNo:string;
    TaxInvoiceNo:string;
    TaxInvoiceFile:string;
    ReceveingDocumentFile:string;
    DocumentFile:string;
    IstransferTypeId:number;
    EwayBillNo:string;
    EwayBillDocument:string;
    BilltyFile:string;
    DeliveredDate:string;
    DispatchFromId:number;
    VehicleType_Id:number;
    Pageflag:number;
    IsDispatch:number;
    CompanyName:string;
    GSTTypeId:number;
    TECHFE:number;
    COHCI:number;
    IsMultipleSite:any;
    EmployeeId:number;
    ExpDeliveryDate:string;
    IsReceived:number;
    SecTransCost:any;
    LoadingCost:any;
    UnloadingCost:any;
    OtherCharges:any;
    PrimaryUnloadingCost:any;
    DispatchNo:any;
    VenAddressId:number;  
    ReasonId:any;  
    ReasonRemarks:any;  
    Flag:any; 
    DispatchTrackerItemList:DispatchTrackingItemDetialModel[];
    MultiSite:Array<MultiSite>=[];
    CRNId:any;
    CodeAndNo:any;  
    PhoneNo:number; 
    DriverName:any;
    DispatchInstructionId:string;
    DIStatusId:any;
    TaxInvoiceDate: string //vishal, 03/12/2022
    DispatchNoId:number //vishal
    
    //vishal, 26/04/2023
    BillToState_Id:number;
    BillToVendor_Id:number;
    BillToStateCode:string; 
    BillToGSTNO:string;
    BillToVenAddressId: number;
    BillToStateName: string;//vishal
   

}
export class DispatchTrackingItemDetialModel
{ 
    Id:any;
    ItemCode_Id:any;
    DispatchType_Id:any;
    EqpType_Id:number;
    HSN_SAC:any;
    Rate:any;
    Qty:any;
    GSerialNumbers:Array<GSerialNumber> = [];
    Discount:any;
    ManufacturerDate:any;
    ManufacturerSerialNo:string;
    InvoiceTaxNo:string;
    InvoiceTaxDate:any;
    IGSTRate:any=0.00;
    IGSTValue:any=0.00;
    ConversionUnit:any;
    ConversionValue:any;
    SubDescription:any;
    HideConversionValue:any
    HideShowConValue:boolean
    ReceivedInWH:boolean=false;  
    ReceivedQty:any; 
    ReasonId:any;  
    Remarks:any; 
    ClientId:any; 
    ChangeQty:any; 
    NewType_Id:any;
    UnitId:any; 
    Scrap:any;
    Repaired:any;  
    TypeFaultyId :any;
    TestingTime :any;
    MaterialUsed :any;
    SerialNo:any;
    TestingLoad :any;
    RepairedBy :any;
    TestedBy :any;
    CGSTRate:any=0.00;
    CGST:any=0.00;
    SGSTRate:any=0.00;
    SGST:any=0.00;
    TCSRate:any=0.00;
    TCS:any=0.00;
    IGST:any=0.00;
    FreightCharge:any=0.00;
    TotalAmountWithFreightCharge:any=0.00;
    TotalInvoiceValue:any=0.00;
    GrossAmount:any;
    RepairedById :any;
    TestedById :any;
    NatureBerId:any;
    TaxWith:any;
    AcceptedQty:any;
    RejectedQty:any;
    ExcessShort:any;
    IsCorrectionCodeId:any;
    CorrectionEntryRemarks:any;
    IsCorrectionEntryReason:any;
    PoItemListId:any;
    SaleQty:any;
    SaleUnit:any;
    DIList_Id:number;
    ItemName: string;
    // Hemant Tyagi
    FaultyQty: any;
}
export class SearchMaterialInstallationModel
{ 
    MaterialInstallationId:any;
    UserId:any;
    DocumentNo:any;
    Company_Id:any;
    Site_Id:any;
    WH_Id:any;
    Approval_Id:any;
    Item_Id:any;
    Startdate:any;
    Enddate:any;
    Flag:any;
}
export class SearchDispatchTrackerModel extends CommonSearchPanelModel
{ 
    DispatchTracker_Id:number;
    CompanyId:number;
    Flag:any;
    DocumentNo:any;
    Site_Id:number;
    ClientId:string;
    PageFlag:string;
    IsReceived:any;
    IsActiveCancel:any;
    SiteId:string;
    DispatchNo :any;
    CircleId :string;
    CustomerId: string;
    FinalStatusId :string;
    DispatchFor:string;
    StatusId:any;
    DINo:string; //Brahamjot kaur 23/6/2022
    CustomerSiteId:string;
    WHStateId: number; //vishal
    DispatchNoId:number
    ApprovalLevelId:number; //vishal 13/04/2023 
    CusDispatchTracker_Id: number //vishal 
    CustomerFlag:number //vishal
  
}

// Brahamjot kaur 22/6/2022
export class SearchSRNUsesModel extends CommonSearchPanelModel
{ 
    DispatchTracker_Id:number;
    CompanyId:number;
    Flag:any;
    DocumentNo:any;
    Site_Id:number;
    ClientId:string;
    PageFlag:string;
    IsReceived:any;
    IsActiveCancel:any;
    SiteId:string;
    DispatchNo :any;
    CircleId :string;
    CustomerId: string;
    FinalStatusId :string;
    DispatchFor:string;
    StatusId:any;
}

export class InstallationMetrialDetial{   
    NewEqupArr:[];
}
export class NewEqupArr{   
    BarCodeStatusId:any;  
    BarCode:any;  
    Img:any;  
}

export class AddUpdateInstallation{   
    MatId:any;  
    UserId:any;  
    CompanyId:any; 
    AppStatus:any; 
    OldQty:any;  
    NewQty:any; 
    OldInstallation: OldInstallation [];
    NewInstallation: NewInstallation [];
}
export class OldInstallation{   
    OldId:any; 
    BarCodeStatusId:any; 
    SerialNo:any;  
}
export class NewInstallation{   
    NewId:any; 
    BarCodeStatusId:any; 
    SerialNo:any;  
}
export class DownloadAllTabTypeData{   
    DispatchedNo:any; 
    DispatchDate:any; 
    DispatchQty:any;  
    DeliveredOn:any; 
    ReceivedBy:any; 
    NewQuantity:any;
    SiteName:any; 
    SiteId:any; 
    Installationby:any; 
    Circle:any;  
    Customer:any; 
    Make:any; 
    Capacity:any;
    SerialNo:any; 
    InstallationDate:any; 
    ExistingEquipmentStatus:any;
    MaterialInstallationType:any; 
    ItemClass:any; 
    ExistingEquipmentMovementStatus:any; 
}
export class SearchMaterialRequisitionModel{   
    UserId:any; 
    Site_Id:any; 
    Startdate:any;  
    Enddate:any; 
    Company_Id:any; 
    MRNNo:any;
    Item_Id:any; 
    CapacityId_Id:any; 
    State_Id:any; 
    Flag:any;  
    RequestId:any;  
    
}

export class DispatchMultiSite
{
     Company_Id:any;
     UserId:number;
     StateId:number;
     MultiSiteList:Array<MultiSite>=[];
}

export class MultiSite{  
    CustomerSiteId:any; 
}

export class DISearchModel{  
    DispatchInstruction_Id:string; 
    Flag:any; 
    SiteId:any; 
    UserId:any; 
    
}

export class SRNInstructionSearchModel{
    DispatchInstruction_Id:string;
    SiteId:number;
    Flag:string;
    UserId:number;
    WHId:string;
}

//vishal, 23/05/2023

export class CusDispatchTrackingModel
{ 
    CusDispatchTracker_Id:number;
    Company_Id:number;
    UserId:number;
    State_Id:number;
    SiteId:number;
    CustomerSiteId:string;
    ClientName:string;
    SiteName:string;
    TECHFE:number;
    COHCI:number;
    SiteAddress:string;
    DocumentNo:string;
    DocumentDate:string;
    DeliveredDate:string;
    ReceivedBy:string;
    ReceivedNo:string;
    ExpDeliveryDate:string;
    DocumentFile:string;
    ReceveingDocumentFile:string;
    DispatchInstructionId:string;
    DispatchForId:number;
    Flag:string;
    CustomerDispatchItemList:CustomerDispatchItemDetialModel[];


}

export class CustomerDispatchItemDetialModel
{ 
    Id:any;
    Qty:any;
    ItemMakeId:any;
    ItemNameId: any;
    ItemCapId:any;
    UnitId:any;
    SubDescription:any;
    SiteId:number;
    DIList_Id:number;
}