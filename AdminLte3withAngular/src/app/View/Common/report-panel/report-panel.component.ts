import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/Service/common.service';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { CommonSearchPanelModel, CompanyStateVendorItemModel, DropdownModel, StockSearchPanelModel } from 'src/app/_Model/commonModel';
import { CompanyModel } from 'src/app/_Model/userModel';

@Component({
  selector: 'app-report-panel',
  templateUrl: './report-panel.component.html',
  styleUrls: ['./report-panel.component.sass']
})
export class ReportPanelComponent implements OnInit {
  model: any = {};
  CompanyId: any;
  //StartDateModel: NgbDateStruct; // start date
  //EndDateModel: NgbDateStruct;// end date
  apiCSVIData: any = {};
  apiItemCodeAndDescriptionData: any = {};
  SearchStateList = [];
  public MultidropdownSettings = {};
  public SingledropdownSettings = {};
  SelectedSearchStateList = [];
  SelectedSearchWHList = [];
  SearchWHList = [];
  SearchItemClassList = [];
  SelectedItemClassList = [];
  SearchItemNameList = [];
  ItemNameDetailData = [];
  SelectedSearchItemNameList = [];
  SelectedSearchItemMakeList = [];
  SelectedSearchItemCodeList = [];
  SelectedSearchItemCapacityList = [];
  SearchItemMakeList = [];
  SearchItemCodeList = [];
  SearchItemCapacityList = [];
  CompanyData = [];
  VendorEditList = [];
  TempItemCodeData = [];
  TempItemCapacityData = [];
  objStockSearchPanelModel: StockSearchPanelModel = {
    State_Id: '',WHId: '',ClientId: '',ItemClassId: '',ItemId: '',MakeId: '',
    ItemCodeId: '',CapacityId: '',ReportTypeId: '',Startdate: '', Enddate: ''    
  }
  EquipmentTypeList: any;
  UserId: any;
  WareHouseId: any;
  ClientList: any;
  UniqueItemkeyword = 'itemName';

  constructor(private SearchPanel: SearchpanelService,private _Commonservices: CommonService) { }

  ngOnInit(): void {
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
    this.BindCompanyStateVendorItem();
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
    
    this.MultidropdownSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      // limitSelection:1
      badgeShowLimit: 1,
    };
    this.SingledropdownSettings = {
      singleSelection: true,
      text: "Select",
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 1,
    };
  }

  async BindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.CompanyArray = this.apiCSVIData.CompanyArray;
      objCSVTdata.StateArray = this.apiCSVIData.StateArray;
      objCSVTdata.ItemArray = this.apiCSVIData.ItemArray;
      objCSVTdata.EquipmentArray = this.apiCSVIData.EquipmentArray;
      objCSVTdata.ClientArray = this.apiCSVIData.ClientArray;
      objCSVTdata.ItemClassArray = this.apiCSVIData.ItemClassArray;
      this.WareHouseId = this.apiCSVIData.WHId;
      this.SearchStateList = objCSVTdata.StateArray;
      this.SearchItemNameList = objCSVTdata.ItemArray;
      this.EquipmentTypeList = objCSVTdata.EquipmentArray;
      this.ClientList = objCSVTdata.ClientArray;
      this.SearchItemClassList = objCSVTdata.ItemClassArray;
      sessionStorage.setItem("WareHouseIdes", this.WareHouseId);
    }
  }

  BindSearchWHList(para: string) {
    this.objStockSearchPanelModel.State_Id = '';
    this.SelectedSearchWHList = [];
    this.SearchWHList = [];
    
    if (para == "DelAll") {
      this.SelectedSearchStateList = [];
    } else if (this.SelectedSearchStateList.length > 0) {
      this.objStockSearchPanelModel.State_Id = this.SelectedSearchStateList.map(xx => xx.id).join(',');
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Other_Id = this.objStockSearchPanelModel.State_Id;
      objdropdownmodel.Parent_Id = this.CompanyId;
      objdropdownmodel.Flag = 'WHMaster';
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(wh => {
        this.SearchWHList = wh.Data;
      });
    }
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }

  onClickWH(para: string) {
    this.objStockSearchPanelModel.WHId = '';      
    if (para == "DelAll") {
      this.SelectedSearchWHList = [];
    } else if (this.SelectedSearchWHList.length > 0) {
      this.objStockSearchPanelModel.WHId = this.SelectedSearchWHList.map(xx => xx.id).join(',');;      
    }
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }

  BindSearchItemName(para: string) {
    this.objStockSearchPanelModel.ItemClassId = '';
    this.objStockSearchPanelModel.ItemId = '';
    this.objStockSearchPanelModel.MakeId = '';
    this.objStockSearchPanelModel.ItemCodeId = '';
    this.objStockSearchPanelModel.CapacityId = '';
    this.SearchItemNameList = [];
    this.SelectedSearchItemNameList = [];
    this.SearchItemMakeList = [];
    this.SelectedSearchItemMakeList = [];
    this.SearchItemCodeList = [];
    this.SelectedSearchItemCodeList = [];
    this.SearchItemCapacityList = [];
    this.SelectedSearchItemCapacityList = [];
    if (para == "DelAll") {
      this.SelectedItemClassList = [];
    }else if (this.SelectedItemClassList.length > 0) {
      this.objStockSearchPanelModel.ItemClassId = this.SelectedItemClassList.map(xx => xx.id).join(',');
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.objStockSearchPanelModel.ItemClassId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'ItemName';
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
        this.SearchItemNameList = item.Data;
      });
    }
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }

  BindSearchItemMake(para: string) {
    this.objStockSearchPanelModel.ItemId = '';
    this.objStockSearchPanelModel.MakeId = '';
    this.objStockSearchPanelModel.ItemCodeId = '';
    this.objStockSearchPanelModel.CapacityId = '';
    this.SearchItemMakeList = [];
    this.SelectedSearchItemMakeList = [];
    this.SearchItemCodeList = [];
    this.SelectedSearchItemCodeList = [];
    this.SearchItemCapacityList = [];
    this.SelectedSearchItemCapacityList = [];

    if (para == "DelAll") {
      this.SelectedSearchItemNameList = [];
    }else if (this.SelectedSearchItemNameList.length > 0) {
      this.objStockSearchPanelModel.ItemId = this.SelectedSearchItemNameList.map(xx => xx.id).join(',');
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.objStockSearchPanelModel.ItemId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'ItemMake';
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
        this.SearchItemMakeList = item.Data;
      });
    }
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);      
  }

  BindSearchItemCodeAndDescription(para: string) {
    this.objStockSearchPanelModel.MakeId = '';
    this.objStockSearchPanelModel.ItemCodeId = '';
    this.objStockSearchPanelModel.CapacityId = '';
    this.SearchItemCodeList = [];
    this.SelectedSearchItemCodeList = [];
    this.SearchItemCapacityList = [];
    this.SelectedSearchItemCapacityList = [];    
    if (para == "DelAll") {
      this.SelectedSearchItemMakeList = [];
    }else if (this.SelectedSearchItemMakeList.length > 0) {
      this.objStockSearchPanelModel.MakeId = this.SelectedSearchItemMakeList.map(xx => xx.id).join(',');
    }
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }

  async SearchChangeItemCode(items: any) {
    this.SearchItemCapacityList = [];
    this.SelectedSearchItemCapacityList = [];
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    if (this.objStockSearchPanelModel.ItemId == null || this.objStockSearchPanelModel.ItemId == '') {
      objdropdownmodel.Parent_Id = '0';
    } else {
      objdropdownmodel.Parent_Id = this.objStockSearchPanelModel.ItemId;
    }
    if (this.objStockSearchPanelModel.MakeId == null || this.objStockSearchPanelModel.MakeId == '') {
      objdropdownmodel.Other_Id = '0';
    } else {
      objdropdownmodel.Other_Id = this.objStockSearchPanelModel.MakeId;
    }
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.searchKey = items;
    this.apiItemCodeAndDescriptionData = await this._Commonservices.GetItemCodeAndItemDescription(objdropdownmodel);
    if (this.apiItemCodeAndDescriptionData.Status == 1) {
      this.SearchItemCodeList = this.apiItemCodeAndDescriptionData.ItemCodeArray;
      this.TempItemCodeData = this.apiItemCodeAndDescriptionData.ItemCodeArray;
      this.TempItemCapacityData = this.apiItemCodeAndDescriptionData.ItemDescriptionArray;
    }
  }

  onClickCapacity(para: string) {
    this.objStockSearchPanelModel.CapacityId = '';      
    if (para == "DelAll") {
      this.SelectedSearchItemCapacityList = [];
    } else if (this.SelectedSearchItemCapacityList.length > 0) {
      this.objStockSearchPanelModel.CapacityId = this.SelectedSearchItemCapacityList.map(xx => xx.id).join(',');;      
    }
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }

  onSelectAutoItemCodeId(items: any) {
    //this.SelectedSearchItemCodeList=items.id;
    var FilterData = this.TempItemCapacityData.filter(m => m.id === parseInt(items.id));
    this.SelectedSearchItemCapacityList = [{ "id": '' + FilterData[0].id + '', "itemName": '' + FilterData[0].itemName + '' }];
    this.SearchItemCapacityList.push(FilterData[0]);

    this.objStockSearchPanelModel.ItemCodeId = items.id;
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }

}
