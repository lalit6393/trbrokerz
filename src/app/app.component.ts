import { Component, HostListener } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'C-Pro';
  public background = true;
  
  constructor(public authService:AuthenticationService){}
  
  @HostListener("document:scroll")
  function(){
    if(document.body.scrollTop >0 || document.documentElement.scrollTop >0){
      this.background = false;
    }else{
      this.background = true;
    }
  }
}
