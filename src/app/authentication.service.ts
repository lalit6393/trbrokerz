import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import {Auth, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, User } from 'firebase/auth';
import { from, Subject, timeout } from 'rxjs';
import { GetdataService } from './getdata.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public userId: string | null | any=null;
  private errorCode ='true';
  
  private _userInfo = new Subject<string | null>();
  userInfo$ = this._userInfo.asObservable();

  constructor(private route:Router, private toast:HotToastService,
    private getData:GetdataService
    ) { }

  login(username:string, password:string){
    // console.log("service",username,password);
    const auth = getAuth();
   return  from(signInWithEmailAndPassword(auth, username, password)
    .then((result) => {
    // Signed in 
    const user = result.user;
    this.userId = user;
    this.errorCode = 'true';
    this.toast.loading("logging in...",{
      duration:500
    });
    this.toast.success("logged in successfully");
    this.getData.checkUserIsSignedIN();
    this.route.navigateByUrl('/dashboard');
    })
   .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    this.errorCode=errorCode;
    this.toast.loading("logging in...",{
      duration:800
    });
      this.toast.show(this.errorCode,{
        autoClose: false,
        dismissible:true
      })
    })
   )
  }

}