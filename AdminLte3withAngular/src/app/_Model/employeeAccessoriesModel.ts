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
    EmpAddress: string; //vishal
    Designation: string; //vishal
    MobileNo: string;
    CircleId: number;
    Circle: string;
    ToolkitItemList: ToolkitAccessoriesItemDet[] = [];    
}

export class ToolkitAccessoriesItemDet {
    Id: number;
    ItemCodeId: number;
    Unit_Id: number;
    EqpTypeId: number;
    Qty: number;
}


//vishal,
export class ReturnToolkitItemModel{
    Id: number;
    UserId: number;
    WHEmpAcrId: number
    ReturnToolkitItemList: ReturnToolkitItemdt[] = [];  
}

export class ReturnToolkitItemdt{
    Id: number;
    ItemCodeId: number;
    Qty: number;
    EqpTypeId: number;
   
}

//end-vishal

