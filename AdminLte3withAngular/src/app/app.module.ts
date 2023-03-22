import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { UserService } from './Service/user.service'
import { PurchaseOrderService } from './Service/purchase-order.service'
import { ButtonRendererComponent } from './renderer/button-renderer.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { PodetailComponent } from '../app/View/PurchaseManagement/podetail/podetail.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { from } from 'rxjs';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { GRNDetailComponent } from './View/StockIn/grndetail/grndetail.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrndetailComponent } from './View/StockIn/crndetail/crndetail.component';
import { CookieService } from 'ngx-cookie-service';
import * as $ from "jquery";
import { CustomTooltipComponent } from './renderer/customtooltip.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MaterialTransitComponent } from './View/Dispatch/MaterialTransit/material-transit.component';
import { NumFloatDirective } from './_Directive/num-float.directive';
import { SearchPanelComponent } from './View/Common/search-panel/search-panel.component';
import { SearchpanelService } from './Service/searchpanel.service';
import { StndetailComponent } from './View/StockIn/stndetail/stndetail.component';
import { DispatchTrackerComponent } from './View/Dispatch/DispatchTracker/dispatch-tracker.component';
import { GlobalErrorHandlerServiceService } from './Service/global-error-handler-service.service';
import { VendorMasterComponent } from './View/Masters/vendor-master/vendor-master.component';
import { AutofocusDirective } from './_Directive/autofocus.directive';
import { CopyPastNumFloatValueDirective } from './_Directive/copy-past-num-float-value.directive';
import { SrnComponent } from './View/StockIn/srn/srn.component';
import { ItemMasterComponent } from './View/Masters/item-master/item-master.component';
import { MakeMasterComponent } from './View/Masters/make-master/make-master.component';
import { UnitMasterComponent } from './View/Masters/unit-master/unit-master.component';
import { ItemEquipmentComponent } from './View/Masters/item-equipment/item-equipment.component';
import { ApprovalrendererComponent } from './renderer/approvalrenderer/approvalrenderer.component';
import { CheckBoxRendererComponent } from './renderer/CheckBoxrenderer.component';
import { approvalTooltipComponent } from './renderer/Approvaltooltip.component';
import { ViewApprovalpageComponent } from './View/Common/view-approvalpage/view-approvalpage.component';
import { MaterialInstallationComponent } from './View/Dispatch/material-installation/material-installation.component';
import { TimePeriodComponent } from './View/Common/time-period/time-period.component';
import { SitePanelComponent } from './View/Common/site-panel/site-panel.component';
import { DailyreportComponent } from './View/report/dailyreport/dailyreport.component';
import { SharedModuleModule } from './shared-module/shared-module.module';
import { StockreportComponent } from './View/report/stockreport/stockreport.component';
import { StocksearchpanelComponent } from './View/Common/stocksearchpanel/stocksearchpanel.component';
import { FaultytorepairComponent } from './View/StockIn/faultytorepair/faultytorepair.component';
import { MaterialReconciliationComponent } from './View/report/material-reconciliation/material-reconciliation.component';
import { ReportPanelComponent } from './View/Common/report-panel/report-panel.component';
import { ApprovalStatusReportComponent } from './View/Dispatch/approval-status-report/approval-status-report.component';
import { ApprovalButtonRendererComponent } from './renderer/approvalbutton.component';
import { UatloginComponent } from './uatlogin/uatlogin.component';
import { PurchaseReportComponent } from './View/report/purchase-report/purchase-report.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OnlyNumberDirective } from './_Directive/only-number.directive';
import { AgGridCheckboxComponent } from './renderer/ag-grid-checkbox/ag-grid-checkbox.component';
import { BOQRequestComponent } from './View/Dispatch/boqrequest/boqrequest.component';
import { WhmasterComponent } from './View/Masters/whmaster/whmaster.component';
import { DispatchreportComponent } from './View/report/dispatchreport/dispatchreport.component';
import { DispatchInstructionComponent } from './View/Dispatch/dispatch-instruction/dispatch-instruction.component';
import { PercentagerendererComponent } from './renderer/percentagerenderer/percentagerenderer.component';
import { CIpercentagerendererComponent } from './renderer/cipercentagerenderer/cipercentagerenderer.component';
import { HopercentagerendererComponent } from './renderer/hopercentagerenderer/hopercentagerenderer.component';
import { CirpercentagerendererComponent } from './renderer/cirpercentagerenderer/cirpercentagerenderer.component';
import { ScmrecpercentagerenderrerComponent } from './renderer/scmrecpercentagerenderrer/scmrecpercentagerenderrer.component';
import { CapacityMasterComponent } from './View/Masters/capacity-master/capacity-master.component';
import { SrnPortalUsesComponent } from './View/report/srn-portal-uses/srn-portal-uses.component';
import { WhCircleMappingComponent } from './View/Masters/wh-circle-mapping/wh-circle-mapping.component';
import { CustomerToCustomerComponent } from './View/StockIn/customer-to-customer/customer-to-customer.component';
import { AgingreportComponent } from './View/report/agingreport/agingreport.component';

import { UserManagementComponent } from './View/Masters/user-management/user-management.component';
import { CompanyMappingComponent } from './View/Masters/user-management/company-mapping/company-mapping.component';
import { NewUserComponent } from './View/Masters/user-management/new-user/new-user.component';
import { RoleMappingComponent } from './View/Masters/user-management/role-mapping/role-mapping.component';
import { WHMappingComponent } from './View/Masters/user-management/whmapping/whmapping.component';
import { MatchPasswordDirective } from './_Directive/match-password.directive';
import { PageMappingComponent } from './View/Masters/user-management/page-mapping/page-mapping.component';
import { NgbDateCustomParserFormatter } from './ngb-date-custom-parser-formatter.service';
import { EmployeesAccessoriesComponent } from './View/Dispatch/employees-accessories/employees-accessories.component';
import { ToolkitMasterComponent } from './View/Masters/toolkit-master/toolkit-master.component';
import { SendMailComponent } from './View/Common/send-mail/send-mail.component';
import { MaterialAtSiteComponent } from './View/Dispatch/material-at-site/material-at-site.component';
import { PoDocumentComponent } from './View/PurchaseManagement/po-document/po-document.component';
import { MailHistoryComponent } from './View/Common/mail-history/mail-history.component';



@NgModule({
  declarations: [
    AppComponent, DashboardComponent, LoginComponent, PodetailComponent,
    GRNDetailComponent, CrndetailComponent, CustomTooltipComponent, DispatchTrackerComponent,
    NumFloatDirective, CopyPastNumFloatValueDirective,
    SearchPanelComponent, StndetailComponent, MaterialTransitComponent,
    SrnComponent, CopyPastNumFloatValueDirective,
    VendorMasterComponent, AutofocusDirective, ItemMasterComponent, MakeMasterComponent,
    UnitMasterComponent, ItemEquipmentComponent, approvalTooltipComponent,
    ApprovalrendererComponent, ViewApprovalpageComponent, MaterialInstallationComponent,
    TimePeriodComponent, SitePanelComponent, DailyreportComponent,
    StockreportComponent, StocksearchpanelComponent, FaultytorepairComponent,
    MaterialReconciliationComponent, ReportPanelComponent, ApprovalStatusReportComponent,
    UatloginComponent, PurchaseReportComponent, OnlyNumberDirective,
    AgGridCheckboxComponent, BOQRequestComponent, WhmasterComponent,
    DispatchreportComponent, DispatchInstructionComponent, PercentagerendererComponent,
    CIpercentagerendererComponent, HopercentagerendererComponent,
    CirpercentagerendererComponent, ScmrecpercentagerenderrerComponent,
    CapacityMasterComponent, SrnPortalUsesComponent,
    WhCircleMappingComponent, CustomerToCustomerComponent,
    AgingreportComponent, UserManagementComponent, CompanyMappingComponent,
    NewUserComponent, RoleMappingComponent, WHMappingComponent,MatchPasswordDirective, 
    PageMappingComponent, EmployeesAccessoriesComponent, ToolkitMasterComponent,
    SendMailComponent, MaterialAtSiteComponent, PoDocumentComponent, MailHistoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModuleModule,
    NgbModule,
    HttpClientModule,
    AgGridModule.withComponents([
      ButtonRendererComponent,
      CustomTooltipComponent,
      CheckBoxRendererComponent,
      approvalTooltipComponent,
      ApprovalButtonRendererComponent
    ]),
    AngularMultiSelectModule,
    AutocompleteLibModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule
    //SearchFilterPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    BrowserAnimationsModule,
  ],
  providers: [UserService, PurchaseOrderService, CookieService, SearchpanelService,
    ErrorHandler, GlobalErrorHandlerServiceService, 
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter, }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

