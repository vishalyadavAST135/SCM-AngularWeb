import { environment } from "src/environments/environment";

export class WebAPIConfig {
   public ApIUrl:string =environment.host;
}

export class CommonImageUrlModel {
    ImageUrl: string =environment.ImagePath;
}

export class MenuModel {
    MenuId: number;
    MenuName: string;
    MenuFilePath: string;
    MenuIcon: string;
    SubMenu: SubMenuModel[];
}

export class SubMenuModel {
    SubMenuId: number;
    SubMenuName: string;
    SubMenuFilePath: string;
    SubMenuIcon: string
}

export class PageActivity {
    public static GRN = 1;
    public static CRN = 2;
    public static STN = 4;
    public static Dis_SiteWithinState = 5;
    public static Dis_SiteOtherState = 6;
    public static Dis_WHWithinState = 7;
    public static Dis_WHOtherState = 8;
    public static Dis_Vendor = 9;
    public static Dis_VendorScrapSale = 14;
    public static Dis_VendorSale = 15;
    public static Srn_WHWithinState = 3;
    public static Srn_WHOtherState = 10;
    public static Srn_SiteWithinState = 3;
    public static Srn_SiteOtherState = 10;
    public static Dis_RepairingCenter = 16;
    public static Dis_CustomerReturn = 17;
}

export class MenuName{
    public static Dashboard = 11;
    public static DispatchTracker = 14;
    public static GRN = 7;
    public static SRN = 8;
    public static CRN = 9;
    public static RepairedCertification = 28;
    public static PurchaseOrder = 4;
    public static DispatchInstruction = 31;
    public static MaterialIndent = 29;
    public static MaterialInstallation = 21;
    public static MaterialInTransit = 10;
    public static VendorMaster = 16;
    public static ItemList = 17;
    public static MakeList = 18;
    public static UnitList = 19;
    public static ItemMasters = 20;
    public static WHMaster = 30;
    public static CustomerToCustomerTransfer = 36;
    public static WhCircleMapping = 37;
    public static CapacityMaster = 33;
    public static SRNPortalUsage = 34;
    public static PortalUsage = 32;
    public static AgingReport = 38;
    public static PurchaseReport = 27;
    public static Transactions = 23
    public static StockRegister = 24;
    public static MaterialReconciliation = 25;

}

export class AmountActivity {
    public static SameState = 50000;
    public static OtherState = 100000;
}
export class ReasonActivity {
    public static CorrectionReason = 2591; //forLocal "2587"

}
export class DropdownModel {
    User_Id: number;
    Other_Id: string;
    Parent_Id: string;    
    Flag:string;  
    Company_Id: number; 
    searchKey: string; 
    Circle_Id: string;
    
}
export class SearchItemLineTypeModel
{
    UserId: number;
    ItemId: string;
    CapacityId: string;    
    MakeId:string;  
    CompanyId: number; 
    searchKey: string; 
}


export class CompanyStateVendorItemModel {
    Status: number;
    Remarks: string;
    CompanyArray: any;
    EquipmentArray: any;
    StateArray: any;
    VendorArray: any;
    ItemArray: any;
    MenuArray:any;
    Parent_Id: string;
    Flag: string;
    Company_Id: number;
    User_Id: number;
    WHId: any;
    ClientArray: any;
    DispatchTypeArray: any;
    ItemClassArray: any;
    CircleArray:any;
    DispatchedStatus: string;
    DispatchedStatusArray: any;
}

export class EmailSendTotalDataModel {
    MailData: string;
    AttachmentFile: [];
}

export class EmailModel {
    MailTo: string;
    MailCc: string;
    MailBcc: string;
    MailSubject: string;
    MailBodyMessage: string;
    PdfUrl: string;
    UserId: string;
    PoId: number;
    
   //vishal
    DocumentFile: string;
    
}

export class ChangePasswordModel {
    UserId: string;
    CurrentPassword: string;
    NewPassword: string;
}

export class CommonSearchPanelModel {
    ItemId: string;
    VendorId: string;
    WHId: string;
    Startdate: string;
    Enddate: string;
    State_Id: string;
    MakeId: string;
    ItemCodeId: string;
    CapacityId: string;
    ItemClassId: string;
    CustomerId: string;
    DescriptionId: string;
}


export class StockSearchPanelModel {
    ItemId: string;
    WHId: string;
    Startdate: string;
    Enddate: string;
    State_Id: string;
    MakeId: string
    ItemCodeId: string
    CapacityId: string;
    ClientId: string;
    ReportTypeId: string;
    ItemClassId: string;
}
export class CommonTimePeriodPanelModel {
    Startdate: string;
    Enddate: string;

}

export class WebErrorLogModel {
    ErrorMsg: string;
    ErrorBy: string;
    ErrorFunction: string;
    ErrorPage: string;
    JsonData: string;
}

export class ApprovelStatusModel {
    Menu_Id: number;
    Table_Id: any;
    User_Id: number;
    ApprovalStatus_Id: number;
    Reason_Id: number;
    Remarks: string;
    Flag: string;
    ApprovelLevelId: number;
    CompanyId: number;
}

export class RoleNameModel {
    public static Admin = 3;
    public static ItCordinater = 10;
}
export class CommonAllReason {
    public static SRNReason = "1493";
}
export class CommonSiteSearchPanelModel {
    SiteId: any;
    PageFlag: string;
}
export class UserRole {
    public static DifferenceDayTime = 24;
    public static UserRoleId = "4";
    public static SCMLead = "4";
    public static Admin = "11";
    public static SCMHo = "1";
    public static MaterialIndentApr = "19";
    public static SRNCorrectionEntryRole = "15";
    public static DispatchCorrectionEntryRole = "16";
    public static GRNCorrectionEntryRole = "17";
    public static PoEditDocumentTypeRole = "12";
    public static PoEditUploadTypeRole = "21";
  
}

export class CommonStaticClass {
    public static DifferenceDay = 0;
    public static UserRoleId = "11";
    public static MSTItemNameId = "20";
    public static Reject = 1471;
    public static Approved = 1472;

}
export class MRNOAutoModel {
    Ids: any;
    Type: any;
    flag: any;
    CompanyId: any;
}

export class PageMenu {
    public static MaterialIndent = 29;
}


export class MailSenderModel {
    Id: number;
    flag: string;
}


export class mailFor {
    public static Dispatch = 'Dispatch';
}

export class TransPortModeType {
    public static ByRoad = 1438;
    public static ByBus = 1439;
    public static ByHand = 1440;
    public static ByCourier = 1441;
    public static Other = 1442;
}

export class JsonModel {
    public UserId: number;
    public JsonStr: string;
}

export class UserRightModel {
    public Create: number;
    public Edit: number;
    public Delete: number;
    public Print: number;
    public Export: number;
}

// export class CircleNameModel {
   
//     VendorArray: any;
//     Parent_Id: string;
//     Flag: string;
//     Company_Id: number;
//     User_Id: number;
//     WHId: any;
//     CircleArray:any;
// }