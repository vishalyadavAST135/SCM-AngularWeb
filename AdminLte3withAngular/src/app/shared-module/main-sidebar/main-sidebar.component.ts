import { Component, OnInit } from '@angular/core';
import { CompanyModel, UserModel } from 'src/app/_Model/userModel';
import { LoginModel} from 'src/app/_Model/loginModel';
import { MenuModel } from 'src/app/_Model/commonModel';
import { CommonService } from 'src/app/Service/common.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.sass']
})
export class MainSidebarComponent implements OnInit {
  
  public objUserModel: UserModel;
  public objMenuModel: MenuModel[];
  public UserName:string;
  public token:string;
  public cid:any;
public application:string;
  public IsUat:boolean=false;
   SubMenuFalse:false;

  constructor(private _CommonService: CommonService,private route: ActivatedRoute,private router: Router) {    
   }
   ngOnInit(){  
     
    this.objUserModel=JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserName=this.objUserModel.Name;
     this.token=this.objUserModel.Token;
    if(this._CommonService.checkUndefined(this.objUserModel.Token)!='')
    {
      this.application='live';
    }else{
      this.application='uat';
    }
     var objCompanyModel = new CompanyModel();
     objCompanyModel=JSON.parse(sessionStorage.getItem("CompanyIdSession"));
     this.cid=objCompanyModel.Company_Id;


     if(sessionStorage.getItem("UserMenu")==null || sessionStorage.getItem("UserMenu")=="null"){      
      this.bindMenu();
     }else{
      this.objMenuModel=JSON.parse(sessionStorage.getItem("UserMenu"));
     }
   }
   
  
   bindMenu(){
     console.log(this.application);
     //this.objUserModel.UATActive=this.application;
     //this.objUserModel.UATActive='uat';
    this._CommonService.getUserMenu(JSON.stringify(this.objUserModel)).subscribe(menu=>{  
      this.objMenuModel=menu.Data;
      
      sessionStorage.setItem("UserMenu", JSON.stringify(this.objMenuModel));
      console.log(sessionStorage.setItem("UserMenu", JSON.stringify(this.objMenuModel)));
         location.reload();
    });
  }
   
   gotoMenuRoute(path:string){
     if(path=='')
     {
      return false;
     }
     else
     {
      this.router.navigate(['/'+path]);
     }
   }
}
