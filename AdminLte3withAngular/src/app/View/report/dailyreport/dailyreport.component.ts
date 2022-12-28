import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { CommonService } from 'src/app/Service/common.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { CommonSearchPanelModel, CompanyStateVendorItemModel, DropdownModel, MenuName } from 'src/app/_Model/commonModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';

@Component({
  selector: 'app-dailyreport',
  templateUrl: './dailyreport.component.html',
  styleUrls: ['./dailyreport.component.sass'],
  providers: [DatePipe]
})
export class DailyreportComponent implements OnInit {
  apiCSVIData: any;
  //#region  grid 
  public columnDefs = [];  //grid column
  public rowData = [];  //  grid data
  public multiSortKey: string; //grid multy sort key
  SelectedSearchStateList = [];
  SearchStateList = [];
  SelectedSearchWHList = [];
  SearchWHList = [];
  CompanyId: any;
  CommonSearchPanelData: any;
  ExcelData: any;
  stateId: any;
  whId: any;
  public MultidropdownSettings = {};
  objCommonSearchPanelModel: CommonSearchPanelModel = {
    Startdate: '', Enddate: '', State_Id: '', MakeId: '',
    ItemCodeId: '', CapacityId: '', ItemId: '', VendorId: '', WHId: '',ItemClassId:'',
    CustomerId:'',DescriptionId:''
  }
  UserId: any;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  //#endregion
  constructor(private _Commonservices: CommonService, private datePipe: DatePipe,
    private SearchPanel: SearchpanelService, private _PurchaseOrderService: PurchaseOrderService) { }

  ngOnInit(): void {
    this.stateId = '';
    this.whId = '';
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
    this.MultidropdownSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      // limitSelection:1
      badgeShowLimit: 1,
    };
    this.loadGrid();
    this.columnDefs = [
      {
        name: 'Sr.No',
        field: '',
        displayName: 'Sr.No',
        cellTemplate: '<span>{{rowRenderIndex+1}}</span>',
        width: '10%'
      },
      { headerName: 'State Name', field: 'StateName', pinned: 'left', width: 110, resizable: true, filter: false, },
      { headerName: 'WH Name', field: 'WHName', pinned: 'left', width: 120, resizable: true, filter: false, },
      { headerName: 'GRN', field: 'GRN', pinned: 'left', width: 120, resizable: true, filter: false, },
      { headerName: 'Last GRN Date', field: 'LastGRNDate', pinned: 'left', width: 120, resizable: true, filter: false, },
      { headerName: 'Dispatch', field: 'Dispatch', pinned: 'left', width: 100, resizable: true, filter: false, },
      { headerName: 'Last Dispatch Date', field: 'LastDispatchDate', pinned: 'left', width: 100, resizable: true, filter: false, },
      { headerName: 'SRN', field: 'SRN', pinned: 'left', width: 100, resizable: true, filter: false, },
      { headerName: 'Last SRN Date', field: 'LastSRNDate', pinned: 'left', width: 100, resizable: true, filter: false, },
      { headerName: 'Material Transit', field: 'MaterialTransit', pinned: 'left', width: 100, resizable: true, filter: false, },
      { headerName: 'Last Material Transit Date', field: 'LastMaterialTransitDate', pinned: 'left', width: 130, resizable: true, filter: false, },
    ];
    this.multiSortKey = 'ctrl';
    if (sessionStorage.getItem("CompStatVenItmSession") == null || sessionStorage.getItem("CompStatVenItmSession") == "null") {
      this.BindCompanyStateVendorItem();
    } else {
      var objCSVTdata = new CompanyStateVendorItemModel();
      objCSVTdata = JSON.parse(sessionStorage.getItem("CompStatVenItmSession"));
      this.SearchStateList = objCSVTdata.StateArray;
    }
    //brahamjot kaur 31/10/2022
    this.GetUserPageRight();
  }

  //brahamjot kaur 31/10/2022
  async GetUserPageRight() {
    this._Commonservices.GetUserPageRight(this.UserId, MenuName.Transactions).subscribe(data => {
      if (data.Status == 1) {
        console.log(data);
        this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
        this.ObjUserPageRight.IsExport = data.Data[0].IsExport;
      }
    })
  }
  async BindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.CompanyArray = this.apiCSVIData.CompanyArray;
      objCSVTdata.StateArray = this.apiCSVIData.StateArray;
      objCSVTdata.EquipmentArray = this.apiCSVIData.EquipmentArray;
      this.SearchStateList = objCSVTdata.StateArray;
      //this.ItemNameDetailData=objCSVTdata.ItemArray;
      sessionStorage.setItem("CompStatVenItmSession", JSON.stringify(objCSVTdata));
    }
  }
  // async loadGrid()
  // {
  //   debugger;
  //   this.apiCSVIData=await this._Commonservices.getScmReport("21/03/2021");
  // }
  SearchWHValues() {
    var WHereid = '';
    let WH = this._Commonservices.checkUndefined(this.SelectedSearchWHList);
    for (var i = 0, len2 = WH.length; i < len2; i++) {
      WHereid += WH[i].id + ',';
    }
    this.objCommonSearchPanelModel.WHId = WHereid;
    this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
    this.whId = WHereid;
  }


  loadGrid() {
    this._Commonservices.getScmReport(this.stateId, this.whId, this.CompanyId)
      .pipe(first())
      .subscribe(
        data => {
          this.rowData = data.Data;
          this.ExcelData = data.Data;
        },
        error => {

        });
  }



  search() {
    this.loadGrid();
  }

  ExcelExport() {
    try {
      var CurrentDate = this.datePipe.transform(Date(), "dd/MM/yyyy");
      this._PurchaseOrderService.exportAsExcelFile(this.ExcelData, 'DailyReport' + CurrentDate);
    } catch (Error) {
      console.log(Error.message)
    }
  }


  BindSearchWHList(para: string) {
    if (para == "DelAll") {
      this.SelectedSearchStateList = [];
    }
    var StateId = '';
    if (this.SelectedSearchStateList.length > 0) {
      var State = this._Commonservices.checkUndefined(this.SelectedSearchStateList);
      for (var i = 0, len = State.length; i < len; i++) {
        StateId += State[i].id + ',';
      };
    }

    this.stateId = StateId;
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Other_Id = StateId;
    objdropdownmodel.Parent_Id = this.CompanyId;
    objdropdownmodel.Flag = 'WHMaster';
    this.SearchWHList = [];
    this._Commonservices.getdropdown(objdropdownmodel).subscribe(wh => {
      this.SearchWHList = wh.Data;
    });

  }
  onSearchWHDeSelectAll(items: any) {
    this.SelectedSearchWHList = [];
    this.objCommonSearchPanelModel.WHId = '';
    this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
  }

}
