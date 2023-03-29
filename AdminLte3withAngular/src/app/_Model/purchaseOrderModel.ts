// import { ClassField } from "@angular/compiler";

export class PoSearchModel
{
    CompanyId: number;
    ItemId: string;
    PoNo: string;
    VendorId: string;
    WHId: string;
    Startdate: string;
    Enddate: string;
    PoId :number;
    Flag:string
    PoStatusId:number
    State_Id: string;
    MakeId:string
    ItemCodeId:string
    CapacityId: string;
    VoucherTypeId:string;
    SearchIsAmended:string;
    UserId: any;
    CustomerId:number;
    ItemClassId:string;
    DescriptionId:string;
    IsAnnexure:number;
}
export class SCMJobModel
{
    jobstart: string;
    name: string;
    url: string;
   
}
export class VendorOrWhModel
{
    Id: string;
    flag:string;
    StateId: any;
}
export class POPdfModel
{
    POId: number;
    PONo: string;
    POPdf:string;
    UserId:number;
}
export class DynamicWHAddress
{
    WHAddress: string;
    Address:string
}
export class DynamicItemGrid{  
    Id:any; 
    RowId:any; 
    ItemCode:string; 
    ItemId:string;
    ItemNameId:string;
    ItemName:string;
    MakeName:string;
    UnitName:string  
    TaxWith:string='1';;  
    SiteId:number; 
    SiteName:string; 
    CustomerSiteId:string;
    ReasonCode:string;
    CustomerCode:string;
    CustomerId:number;
    ValueSiteName:string;
    ValueCustomerSite:string;
    Rate:any;  
    Qty:any;  
    FQty:any;
    MTQty:any; 
    POQty:any;
    HSN:any;
    EqpType:any;
    Discount:any;
    AcceptedQty:any;
    ValueQty:any;
    ChangeQty:any;
    Amount:string; 
    TotalAmount:any;
    GetTotalAmount:any;
    InvoiceTaxNo:any;
    InvoiceTaxDate:any;
    IGST:any;
    IGSTValue:any;
    EditItemCode =[];
    GSerialNumbers:Array<GSerialNumber> = [];
    ItemDescription:string;
    ItemMakeId:string;
    EditItemDesc =[];
    EditItemMake =[];
    SubDescription:string;
    SerialNo:string;
    ManufDate:any;
    EqTypeId:any;
    NewEqTypeId:any;
    ConversionUnit:any;
    ConversionValue:any;
    HideConversionValue:any
    HideShowConValue:boolean;
    IsConversion:any;
    ReceivedInWH:boolean;  
    ReceivedQty:any; 
    RejectedQty:any; 
    ExcessShort:any;
    ReasonId:any;  
    Remarks:any; 
    InitiallValue:string;
    lastValue:string;
    PoItemListId:any;
    MtlId:any; 
    CGST:any;
    SGST:any;  
    RateSGST:any;  
    ClientId:any; 
    ClassId:any;
    DispatchTypeId:any;
    UnitList =[];
    UnitId:any;
    ChangeUnitConversionUnit:any;
    ChangeUnitIsConversion:any;
    ChangeUnitHideConversionValue:any
    Scrap:any;
    Repaired:any;  
    TypeFaultyId :any;
    TestingTime :any;
    MaterialUsed :any;
    TestingLoad :any;
    RepairedBy :any;
    TestedBy :any;
    IsWarranty :any;
    Month :any;
    IsWarrantyReq:any;
    CGSTRate:any=0.00;
   
    FreightCharge:any=0.00;
    SGSTRate:any=0.00;
    //SGST:any;
    TCSRate:any=0.00;
    TotalAmountWithFreightCharge:any=0.00;
    TCS:any;
    IGSTRate:any=0.00;
    //IGST:any;
    TotalInvoiceValue:any=0.00;
    CustomerName:any;
    Unit:any;
    TypeFaulty:any;
    TestedById:any;
    RepairedById:any;
    RepairedName:any;
    TestedName:any;
    Class:any;
    NatureBerId:any;
    NatureBerName:any;
    IsDisabled:boolean;
    PreviewDispatchType:any;
    ClientName:any;
    IsCorrection:boolean=false;
    IsCorrectionDisabled:boolean=false;
    IsCorrectionCodeId:any;
    CorrectionEntryRemarks:any;
    IsCorrectionEntryReason:any;
    SaleUnitName:any;
    SaleQty:any;
    newClientId:any;
    NewCustomerName:string;
    OldCustomerName:string;
    DIList_Id:number;


   //vishal, 14/11/2022, for emp-toolkit
    ItemCodeId:number;
    Unit_Id: number;
    ToolkitName: any;

    // Hemant Tyagi
    FaultyQty:any;
    
}
export class DynamicAnxHeaderItemGrid{  
    ItemName:string;
    MakeName:string;
    ItemCode:string;  
    SiteId:string; 
    SiteName:string; 
    SNo:string; 
    ReasonCode:string;
    Rate:any;  
    Qty:any;  
    Amount:string; 
    SubDescription:string;
}
export class DynamicPdfItemGrid{     
    ItemNameId:string;
    UnitName:string; 
     Rate:any;  
    // Qty:any;  
    // MTQty:any; 
    ItemDescription:string
    
  
}
export class PoEditDetail{     
    PoId:number;  
    PoNo:string;  
    VendorName:string;  
    CountryTo:string;  
    DespatchThrough:string;  
    Destination:string;  
    GrossTotal:string;  
    ItemDescription:string;  
    Narration:string;  
    PdfSrc:string;  
    PlaceofReceiptbyShipper:string;  
    PoStatus:string;  
    Podate:string;  
    PortofDischarge:string;  
    PortofLoading:string;  
    StateName:string;  
    TermsofDelivery:string;  
    TermsofPayment:string;  
    VendorAddress:string;  
    VendorCode:string; 
    VendorPanNo:string;  
    VesselFlightNo:string;  
    VoucherType:string;  
    WHAddress:string;  
    WHGSTIN:string;  
    WHLocation:string;  
    Flag:string; 
}

export class PoBasicDetial {   
    UserId:number;  
    PoId:number;  
    PoNo:string;  
    VendorAddress_Id:number;
    VendorId:number; 
    Podate:string; 
    WHId:number;  
    IsAmended:number;
    VoucherTypeId:number;
    TermsofDelivery:string;  
    TermsofPayment:string;
    OtherReference:string;
    DespatchThrough:string;  
    PoStatusId:number; 
    CompanyId:number; 
    ClientListId:number;
    EMIListId:number;
    POCategoryListId:number;
    PurchaseTypeListId:number;
    ExpenseTypeListId:number;
    BOQRequestId:number;
    ProjectTypeId:number;
    ReportNameId:number;

}

export class PoOtherDetial{     
    PoId:number; 
    UserId:number;  
    NarrationTypeId:number; 
    PlaceofReceiptbyShipper:string;  
    VesselFlightNo:string;  
    PortofDischarge:string;  
    PortofLoading:string;  
    Narration:string;  
    Flag:string; 
    AdditionalRemarks:string;  
    ActivityDay:string;
    DocumentTypeId:number;
    TypeId:number;
    Remarks:string;
}

export class DownLoadZipFileDetial{     
    DownloadFileData=[]; 
}
export class UpdatePoItemDetial{     
    AmountInWord:string; 
    PONO:any; 
  
    PoItemDetialList:PoItemDetial[]; 
}
export class PoItemDetial{   
    PoId:number;  
    UserId:number;  
    ItemId:string;  
    ItemCode:any; 
    Rate:string;  
    Quantity:string;  
    TotalAmount:string;  
    SubDescription:string;  
    SiteId:any; 
    CustomerId:number;
    CustomerCode:string; 
    SiteName:string; 
    CustomerSiteId:string; 
    ReasonCode:string; 
    ValueSiteName:string; 
    ValueCustomerSite:string; 
    
    SearchPOStatusListId:number;
    POStatusListId:number;
    NarrationTypeListId:number;
    UnitId:any;
    IsWarranty :any;
    WarrantyMonth :any;
    CGSTRate:any;
    CGST:any;
    SGSTRate:any;
    SGST:any;
    TCSRate:any;
    TCS:any;
    IGSTRate:any;
    IGST:any;
    GrossAmount:any;
    CurrencyType:any; 
    CurrencyValue:any; 
    OverHeadExpenses:string;
}
export class GRNDynamicItemGrid extends DynamicItemGrid{
    Id:any;
    ChallanQty:any;
    ReceivedQty:any;
    AcceptedQty:any;
    RejectedQty:any;
    ExcessShort:any;
    IsConversion:any;
    InitiallValue:any;
    lastValue:any;
    EqpType:any;
    CGSTRate:any=0.00;
    CGST:any=0.00;
    SGSTRate:any=0.00;
    SGST:any=0.00;
    TCSRate:any=0.00;
    TCS:any=0.00;
    IGSTRate:any=0.00;
    IGST:any=0.00;
    GrossAmount:any;
    FaultyFile :File[];
    PoItemListId:any;
}

export class GSerialNumber
{
    UniqueId:string;
    InitialSrno:string;
    Sequance:string;
    BBInitial:string;
    BBLast:string;
    Ischecked:boolean;
    IsDisabled:boolean=false;
    ItemCode_Id:string;
    WH_Id:string;
    Mode:string;
    Equp_Id:string;
    Company_Id:string;
    CellNos:Array<CellNo> = [];
}
export class CellNo
{
    Sequance:string;
    CellValue:string;
    IsDisabled:boolean=false;
    Ischecked:boolean;
}



export class PODropDownModel{
    ClientList:[];
    SearchClientList:[];
    EMIList:any[]=[];
    POCategoryList:any[]=[];
    PurchaseTypeList:any[]=[];
    ExpenseTypeList:any[]=[];
    SearchPOStatusList:[];
    POStatusList:[];
    NarrationTypeList:[];
    POSearchCategoryList:[];
}

export class MakePOSeriesModel{
    CompanyId:number;
    ClientId:number;
    EMITypeId:number;
    POCategoryId:number; 
}
export class DynamicStockPdfGrid{  
    Id:any; 
    RowId:any; 
    ItemDescription:string; 
    ScrapQty:string;
    RepairedQty:string;
    MaterialUsed:string;
    TestingTime:string;
    TypeOfFaulty:string;  
    EqpName:string; 
    SerialNo:string;
    Load:string;
    TestedBy:string;
    RepairBy:string;
    StockQty:string;
    FaultyQty:string
}

//by:visha, 14/11/2022

// export class DynamicToolkitItemGrid
// {
//     Id: any;
//     EmployeeToolkitItem: number;
//     ItemCode:number;
//     UnitName: number;
//     Qty: number;

//     EmployeeToolkit_Id: number;
//     ItemCodeId:number;
//     Unit_Id: number;
 
// }

//by: vishal, 02/03/2023

export class PoSeriesDetailModel {
    Id: number;
    UserId: number;
    CompanyId: number;
    CustomerId: number;
    EMITypeId: number;
    PoCategoryId: number;
    ExpenseTypeId: number;
    ReportNameId: number;
    MakePOSeries: string;
    Flag: string;
}