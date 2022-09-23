import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GetstartedComponent } from './getstarted/getstarted.component';
import { LoginComponent } from './login/login.component';
import { Page1Component } from './page1/page1.component';
import { ResetpassComponent } from './resetpass/resetpass.component';

const routes: Routes = [
  {path:'', redirectTo:"dashboard", pathMatch:"full" },
  {path:"home", component:Page1Component },
  {path:"login", component:LoginComponent },
  {path:"getstarted", component:GetstartedComponent },
  {path:"resetpass", component:ResetpassComponent},
  {path:"dashboard", component:DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
