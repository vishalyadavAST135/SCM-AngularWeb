export class newUser {
    LogingUserId: number;
    User_Id: number;
    FirstName: string;
    LastName: string;
    MobileNo: string;
    EmailId: string;
    UserId: string;
    Password: string;
    Doj: string;
    RoleId: string;
    CompanyId: string;
    Flag: string;
    EmpCode: string;
    CompanyWHMappingList: CompanyWHMapping[];
    Menu_Id:number;
    MenuRightList : MenuRightModel[];
    UserStatus: string; //vishal
}

export class CompanyWHMapping {
    CompanyId: number;
    WHId: string;
}
export class SearchUserModel {
    CompanyId: number;
    EmpName: string;
    EmpCode: string;
}

export class DynamicWHMappingGrid {
    CompanyId: number;
    SelectWHId: any[] = [];
    WHList: any[] = [];
}

export class MenuRightModel{
        IsView : number; 
        IsSearch : number;  
        IsCreate : number;  
        IsEdit : number;  
        IsDelete : number;  
        IsApprove : number;  
        IsGenPdf : number;  
        IsPdfView : number;  
        IsExport : number;  
        IsImportExcel : number;  
        IsUploadDoc : number;  
        IsBulkPdfDwnload : number;  
}