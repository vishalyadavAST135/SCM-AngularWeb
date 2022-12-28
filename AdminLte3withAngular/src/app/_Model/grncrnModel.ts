import { CommonSearchPanelModel } from './commonModel';
import { DispatchTrackingItemDetialModel } from './DispatchModel';
import { DynamicItemGrid } from './purchaseOrderModel';

export class SearchGRNCRNPoModel extends CommonSearchPanelModel
{ 
    CompanyId:number;
    InvoiceNo: string;
    GRNCRNSRNSTNNo: string;
    Flag: string;
    PoStatusId:number;
    PoId:number;
    VoucherTypeId:number;
    ActiveId:any;
}

export class SiteCustomerAutoModel
{
    SCNo:string;
    CompanyId:number;
    StateId:number;
    flag:string;

}

export class SaveGRNCRNModelDetail
{
    GrnCrnId: number;
    PoId: number;
    UserId: number;
    SiteNameId: number;
    CustomerId: number;
    GRNNo: string;
    GRNDate: string;
    Podate:string;
    CRNNo: string;
    CRNDate: string;
    CompanyId:number;
    WHId:string;
    VendorId:string;
    CustomerName: string;
    InvChallanNo :string;
    InvChallanDate:string
    GateEntryNo: string;
    GateEntryDate:string
    TranspoterName:string
    EwayBillNo:string
    EwayBillDate: string;
    DispatchThrough:string
    EwayBillUpload:string
    DispatchDate: string;
    InvoiceAmount:any;
    VehicleNo: string;
    IndentorName: string;
    LRNo:string;
    LRDate:string;
    Remarks:string;
    SiteCustomerName:string;
    SiteCustomerAddress:string;
    Flag:string;
    GRNItemDetailList:GRNDynamicItemModel[];
    IsDespatch:number;
    TrasporationGSTNO:string;
    TransportId:number;
    CustomerAddress:string;
    EditFlag:string;
    GRNById:number;
    JobId:number;
    GRNSignedDocumentFile:string;
    GRNDocumentFile:string;
    TransporterId:number;
    TransporterGSTNO:string;
    SenderAddress:string;
    DocketNo:string;
    CompanyName:string;
}
export class GRNDynamicItemModel extends DynamicItemGrid {
    Id:number;
    RowId:number;
    ItemId:string;
    ChallanQty:string;
    ReceivedQty:string;
    AcceptedQty:string;
    RejectedQty:string;
    ExcessShort:string;
    Rate:string;
    CGSTRate:any;
    CGST:any;
    SGSTRate:any;
    SGST:any;
    TCSRate:any;
    TCS:any;
    IGSTRate:any;
    IGST:any;
    GrossAmount:any;
    SubDescription:string;
    PoItemListId:any;
   // FaultyFile:File;
}
export class FaultyImageModel {
    RowId:string;
    FaultyFile:File[];
}
export class STNModel extends SaveGRNCRNModelDetail 
 {
    DispatchId:number;
    FromWHId:number;
    TostateId:number;
    ToWHId:number;
    DispatchTrackerItemList:DispatchTrackingItemDetialModel[];
}