import { Component, OnInit } from '@angular/core';
import { Router, ROUTES } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { from } from 'rxjs';
import { GetdataService } from '../getdata.service';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.scss']
})
export class ResetpassComponent implements OnInit {

  public check= true;
  public Message='';
  public errorCode= 'true';

  constructor(private route:Router, private toast:HotToastService, private getData:GetdataService) {  }

  ngOnInit(): void {
    this.getData.pageUrl(this.route);
  }

  ResetEmail(email:any){
    const auth = getAuth();
   return from(sendPasswordResetEmail(auth, email)
  .then(() => {
    this.check=true;
    this.errorCode = 'true';
    this.toast.loading("sending...",{
      duration:500
    });
    this.toast.success("Email sent sucessfully.");
    // ..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    this.errorCode= errorCode;

    this.toast.loading("sending...",{
      duration:500
    });
     this.toast.show(this.errorCode, {
        autoClose: true,
        dismissible:true,
        style: {
          padding: '16px',
          color: '#b22222',
          cursor: 'pointer'
        }
      })
    // console.log("errorCode",errorCode,"errorMessage",errorMessage);
    // ..
  })
   ).subscribe(()=>{
    if(this.errorCode == 'true'){
      this.route.navigateByUrl('/login');
    }else{
      this.route.navigateByUrl('/resetpass');
    }
    });
  

  }
}