import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, User } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { from } from 'rxjs';
import { firebaseConfig } from 'src/environments/firebaseConfiguration';
import { GetdataService } from './getdata.service';

@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {

  public errorCode= 'false';
  public UserFirstName:string='';
  public UserLastName:string='';
  private userpass:any='';

  constructor(private route:Router, private toast:HotToastService, private getData:GetdataService) { }

  addDataToFirestore(user:User, firstName:string, lastName:string, password:any){
    this.UserFirstName=firstName;
    this.UserLastName=lastName;
    this.userpass=password;
    this.addData(user);
  }
   
  async addData(user:any){
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const docRef = doc(db, "User", user.email);
 
    const spanShot = await getDoc(docRef);
    if(spanShot.exists()){

    }else{
      await setDoc(docRef, {
        FirstName: this.UserFirstName || user.displayName,
        LastName: this.UserLastName,
        email: user.email,
        pass:this.userpass,
        country: "India",
        following:''
      }).then(()=>{
        this.getData.getDataFromFireStore();
      })
      .catch((e)=>{
        console.error("Error adding document: ", e);
      })
    }
}

}
