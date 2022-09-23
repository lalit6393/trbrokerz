import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GoogleAuthProvider, getRedirectResult, signInWithRedirect , getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithCredential, signInWithPopup, sendPasswordResetEmail, confirmPasswordReset, signOut} from "firebase/auth";
import {Router, Routes } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { HotToastService } from '@ngneat/hot-toast';
import { GetdataService } from '../getdata.service';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/firebaseConfiguration';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { CreateAccountService } from '../create-account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public Message='You have not created account yet.';
  public check= true;
 public  USER:any;
 public email='';
 public authfromServiceClass:any;
  
  constructor( private route:Router,
    private createAccountService:CreateAccountService,
    private _authService:AuthenticationService, private getData:GetdataService, private toast:HotToastService) { }

  ngOnInit(): void {
    this.authfromServiceClass = this._authService;
    this.getData.pageUrl(this.route);
  }

  Googlelogin(email:any, password:any){
    if(email == null && password ==null ){
      return;
    }
    else{
    this._authService.login(email, password);
  }
  
 }


 onclickicon2(){
  this.check=true;
 }

 
   redirectToGoogle(){
  const auth = getAuth();
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential!.accessToken;
    // The signed-in user info.
    const user = result.user;
    this.USER= user;
    this.createAccountService.addData(user);
    this.route.navigateByUrl('/dashboard');
    // console.log(user);
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // console.log(errorCode,errorMessage);
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    this.toast.show(errorCode, {
      autoClose: true,
      dismissible:true,
      style: {
        padding: '16px',
        color: '#b22222',
        cursor: 'pointer'
      }
    })
  });

   }
  }
const provider = new GoogleAuthProvider();