import { CommonSearchPanelModel } from './commonModel';
import { PoSearchModel,DynamicItemGrid } from './purchaseOrderModel';

export class SearchMaterialModel extends CommonSearchPanelModel
{    
    CompanyId:number;
    TrackerId: number;
    PoId :number;
    InvoiceNo :string;
    Flag :string;
    VoucherTypeId:number;

}
export class MaterialMovementModel
{
    TrackerId: number;    
    UserId: number;       
    PoId: number;
    CompanyId:number;
    WHStateId:string;
    WHId:string;
    VendorId:string;
    DispatchThrough :string;
    InvoiceNo :string;
    InvoiceDate:string
    InvoiceAmount:number;
    EwayBillNo: string;
    EwayBillDate:string;
    DispatchDate:string;
    ExpectedDeliveryDate:string
    ActualReceivedDate:string;
    TrackRef:string;    
    Remarks:string;
    ItemList:DynamicItemGrid[];
    TotalQty:number;
    TotalAmount:number;
    TransporterName:string;
    VehicleNo:string;
    DocketNo:string
    MobileNo:number;
}

