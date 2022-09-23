import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { from } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { CreateAccountService } from '../create-account.service';
import { GetdataService } from '../getdata.service';

@Component({
  selector: 'app-getstarted',
  templateUrl: './getstarted.component.html',
  styleUrls: ['./getstarted.component.scss']
})
export class GetstartedComponent implements OnInit {
  public errorCode= 'true';

  constructor(private createAccountService:CreateAccountService,
     private route:Router ,private router:Router, private getData:GetdataService, private toast:HotToastService, private _authService:AuthenticationService) { }

  ngOnInit(): void {
    this.getData.pageUrl(this.router);
  }

  login(email:any, password:any, firstName:string, lastName:string){
    if(email==null && password==null && firstName==null && lastName==null){
      return;
    }else{
        const auth = getAuth();
        const createAccount= createUserWithEmailAndPassword(auth, email, password)
       .then(async (userCredential) => {
        // Signed in 
        this.toast.loading("Creating Account...",{
          duration:500
        });
        this.toast.success("Account created successfully");
        const user = userCredential.user;
        await this.createAccountService.addDataToFirestore(user, firstName, lastName, password);
        this.errorCode = 'false';
          // this.getData.getDataFromFireStore();
          this.route.navigateByUrl('/dashboard');

        // ...
       })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        this.errorCode= errorCode;
    
        this.toast.loading("Creating Account...",{
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
          this.route.navigateByUrl('/getstarted');
        // ..
       })
    }
  }
  
}

