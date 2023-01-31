import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'
import { LoginComponent } from './login/login.component';
import { PodetailComponent } from '../app/View/PurchaseManagement/podetail/podetail.component';
import { GRNDetailComponent } from '../app/View/StockIn/grndetail/grndetail.component';
import { CrndetailComponent } from './View/StockIn/crndetail/crndetail.component';
import { MaterialTransitComponent } from './View/Dispatch/MaterialTransit/material-transit.component';
import { StndetailComponent } from './View/StockIn/stndetail/stndetail.component';
import { DispatchTrackerComponent } from './View/Dispatch/DispatchTracker/dispatch-tracker.component';
import { SrnComponent } from './View/StockIn/srn/srn.component';
import { VendorMasterComponent } from './View/Masters/vendor-master/vendor-master.component';
import { ItemMasterComponent } from './View/Masters/item-master/item-master.component';
import { UnitMasterComponent } from './View/Masters/unit-master/unit-master.component';
import { MakeMasterComponent } from './View/Masters/make-master/make-master.component';
import { ItemEquipmentComponent } from './View/Masters/item-equipment/item-equipment.component';
import { MaterialInstallationComponent } from './View/Dispatch/material-installation/material-installation.component';
import { DailyreportComponent } from './View/report/dailyreport/dailyreport.component';
import { StockreportComponent } from './View/report/stockreport/stockreport.component';
import { FaultytorepairComponent } from './View/StockIn/faultytorepair/faultytorepair.component';
import { MaterialReconciliationComponent } from './View/report/material-reconciliation/material-reconciliation.component';
import { ApprovalStatusReportComponent } from './View/Dispatch/approval-status-report/approval-status-report.component';
import { UatloginComponent } from './uatlogin/uatlogin.component';
import { PurchaseReportComponent } from './View/report/purchase-report/purchase-report.component';
import { BOQRequestComponent } from './View/Dispatch/boqrequest/boqrequest.component';
import { WhmasterComponent } from './View/Masters/whmaster/whmaster.component';
import { DispatchreportComponent } from './View/report/dispatchreport/dispatchreport.component';
import { DispatchInstructionComponent } from './View/Dispatch/dispatch-instruction/dispatch-instruction.component';
import { CapacityMasterComponent } from './View/Masters/capacity-master/capacity-master.component';
import { SrnPortalUsesComponent } from './View/report/srn-portal-uses/srn-portal-uses.component';
import { WhCircleMappingComponent } from './View/Masters/wh-circle-mapping/wh-circle-mapping.component';
import { CustomerToCustomerComponent } from './View/StockIn/customer-to-customer/customer-to-customer.component';
import { AgingreportComponent } from './View/report/agingreport/agingreport.component';
import { NewUserComponent } from './View/Masters/user-management/new-user/new-user.component';
import { WHMappingComponent } from './View/Masters/user-management/whmapping/whmapping.component';
import { RoleMappingComponent } from './View/Masters/user-management/role-mapping/role-mapping.component';
import { CompanyMappingComponent } from './View/Masters/user-management/company-mapping/company-mapping.component';
import { UserManagementComponent } from './View/Masters/user-management/user-management.component';
import { EmployeesAccessoriesComponent } from './View/Dispatch/employees-accessories/employees-accessories.component';
import { ToolkitMasterComponent } from './View/Masters/toolkit-master/toolkit-master.component';
import { MaterialAtSiteComponent } from './View/Dispatch/material-at-site/material-at-site.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard',pathMatch:'full', component:DashboardComponent}, 
  { path: 'PODetail',pathMatch:'full', component:PodetailComponent},
  { path: 'GRNDetail', pathMatch:'full', component:GRNDetailComponent},
  { path: 'CRNDetail',pathMatch:'full', component:CrndetailComponent},
  { path: 'SRNDetail', pathMatch:'full', component:SrnComponent},
  { path: 'STNDetail', pathMatch:'full', component:StndetailComponent},
  { path: 'MaterialInTransit', component:MaterialTransitComponent},
  { path: 'WHToSite', pathMatch:'full', component:DispatchTrackerComponent},
  { path: 'VendorMaster', pathMatch:'full', component:VendorMasterComponent},
  { path: 'ItemMaster', pathMatch:'full', component:ItemMasterComponent},
  { path: 'MakeMaster', pathMatch:'full', component:MakeMasterComponent},
  { path: 'UnitMaster', pathMatch:'full', component:UnitMasterComponent},
  { path: 'ItemEquipment', pathMatch:'full', component:ItemEquipmentComponent},
  { path: 'CapacityMaster', pathMatch:'full', component:CapacityMasterComponent},
  { path: 'MaterialInstallation', pathMatch:'full', component:MaterialInstallationComponent},
  { path: 'dailyreport', pathMatch:'full', component:DailyreportComponent},
  { path: 'StockReport', pathMatch:'full', component:StockreportComponent},
  { path: 'RepairedCertification', pathMatch:'full', component:FaultytorepairComponent},
  { path: 'MaterialReconciliation', pathMatch:'full', component:MaterialReconciliationComponent},
  { path: 'MaterialRequisitionReport', pathMatch:'full', component:ApprovalStatusReportComponent},
  { path: 'PurchaseReport', pathMatch:'full', component:PurchaseReportComponent},
  { path: 'MaterialIndent', pathMatch:'full', component:BOQRequestComponent},
  { path: 'uat', pathMatch:'full', component:UatloginComponent},
  { path: 'WHMaster', pathMatch:'full', component:WhmasterComponent},
  { path: 'OnlinePortalUsage', pathMatch:'full', component:DispatchreportComponent},
  { path: 'DispatchInstruction', pathMatch:'full', component:DispatchInstructionComponent},
  { path: 'SRNPortalUsage', pathMatch:'full', component:SrnPortalUsesComponent},
  { path: 'WhCircleMapping', pathMatch:'full', component:WhCircleMappingComponent},
  { path:'CustomerToCustomerTransfer', pathMatch:'full',component:CustomerToCustomerComponent},
  { path:'AgingReport', pathMatch:'full',component:AgingreportComponent},
  { path: 'UserManagement', component:UserManagementComponent},
  { path: 'ToolkitMaster', component:ToolkitMasterComponent},
  { path: 'EmployeesAccessories', component:EmployeesAccessoriesComponent},
  { path: 'MaterialAtSite', component:MaterialAtSiteComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
