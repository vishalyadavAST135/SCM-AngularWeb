export class SaveUpDateCustomerToCustomerTransfer
{ 
    CTCId:number;
    UserId:number;
    CompanyId:number;
    WHId:string;
    Remarks:string
    CustomerItemList:CustomerToCustomerItemList[];
}

export class CustomerToCustomerItemList{
    CTCListId:number;
    ItemCodeId:any;
    EqpTypeId:number;
    OldClientId:number;
    UnitId:any;
    ChangeQty:number;
    NewClientId:number;
    Remarks:string;
    SerialNo:string;
}