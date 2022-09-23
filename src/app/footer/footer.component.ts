import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  windowScrolled:boolean=false;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener("window:scroll",[])
  onWindowScroll(){
    if(document.body.scrollTop >0 || document.documentElement.scrollTop >0){
      this.windowScrolled = true;
    }
  }

  home(){
    if(this.windowScrolled ==true){
      window.scrollTo(0,0);
    }
  }
}
