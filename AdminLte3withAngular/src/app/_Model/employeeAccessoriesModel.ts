export class SearchEmployeeAccessoriesModel{
    Id:number;
    CompanyId: number;
    UserId: number;
    WHStateId: number;
    WHId: number;
    EmpId: number;
    ToolkitId: number;
    Startdate: string;
    Enddate: string;
    SWHStateId: string;
    SWHId : string;
    EmpCode: string;
    EmpName: string;
    Flag:string;
    ToolkitItemList: ToolkitAccessoriesItemDet[] = [];
    
}

export class ToolkitAccessoriesItemDet {
    Id: number;
    ItemCodeId: number;
    Unit_Id: number;
    EqpTypeId: number;
    Qty: number;
}