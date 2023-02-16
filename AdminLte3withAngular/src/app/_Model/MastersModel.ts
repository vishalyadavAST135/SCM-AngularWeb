
export class VendorModel {
    VendorId: number;
    UserId: number;
    CompanyId: number;
    State_Id: number;
    Contact: string;
    VendorName: string;
    VendorCode: string;
    Email: string;
    PinCode: number;
    PanNo: string;
    MobileNo: string;
    Flag: string;
    Status: number;
    VendorTypeId: number;

}


export class VendorAddresDetial {

    VendorAddressDetialList: DynamicVendorAddres[];
}
export class DynamicVendorAddres {
    Id: any;
    VendorId: any;
    UserId: any;
    CompanyId: any;
    StateId: any;
    GSTINNo: string;
    Address: string;
    Pincode: string;
    Email: string;
    MobileNo: any;
    ContactPerson: string;
    Isactive: any;
    CountryId: any;
    StateList: any = [];
}

export class ItemNameModel {
    Id: any;
    UserId: any;
    ItemName: string;
    HSNCode: string;
    Status: any;
    Flag: any;
    IsSerialReq: any;
    IsCertificate: any;
    ItemClass: any;
}
export class MakeModel {
    Id: any;
    UserId: any;
    MakeName: string;
    Status: string;
    Flag: any;
}

export class ItemEquipmentDetail {
    Id: any;
    UserId: any;
    ItemMasterId: any;
    MakeMasterId: any;
    UnitMasterId: any;
    CompanyMasterId: any;
    ItemCode: string;
    ItemSpecs: any;
    ItemDescription: any;  //brahamjot kaur 07-06-2022
    Status: any;
    IsActive: any;
    Flag: any;
    IsConversion: any;
    ConversionUnit: any;
    ConversionValue: any;
    CellVolt: any;
    CapacityId: any;
}

export class CapacityMasterDetail {
    CapacityId: any;
    UserId: any;
    CapacityName: string;
    ItemIds: string;
    Size: number;
    Flag: string;
    ItemClass: string;
}

export class WHModel {
    WHId: number;
    UserId: number;
    CompanyId: number;
    StateId: number;
    WHName: string;
    WHCode: string;
    Email: string;
    MobileNo: string;
    Flag: string;
    Status: string;
    GSTNo: string;
    CircleId: string;
    WHInChargeName: string //vishal

}
export class WHAddresDetial {

    WHAddressDetialList: DynamicWHAddress[];
}
export class DynamicWHAddress {
    Id: any;
    WHId: any;
    WHAddress: string;
    OfficeAddress: string;
    InChargeName: string;
    Email: string;
    ContactNo: any;
    Isactive: string;
}

//vishal 08-09-2022
export class WHCircleMappingModel {
    UserId: number;
    WHId: number;
    CircleId: string;
    SelectedCircleList: any[] = [];
}

export class SearchWHCircleMappingModel {
    CompanyId: number;
    WHId: string;
    CircleId: string;
    SelectedCircleList: any[] = [];
    Flag: string;
}



//by:vishal, 14/11/2022, desc: for ToolkitMaster 
export class EmpToolkitModel  {
    Id: number;
    UserId: number;
    CompanyId: number;
    ToolkitName: string;
    Startdate: string;
    Enddate: string;
    Flag: any;
    ToolkitItemList: EmpToolkitItemModel[] = [];
}

export class ReturnToolkitModel  {
    Id: number;
    UserId: number;
    ItemCodeId: number;
    EqpTypeId: number;
    Qty: number
 
}

//vishal
export class EmpToolkitItemModel {
    Id: number;
    ItemCodeId: number;
    Unit_Id: number;
    Qty: number;
}





