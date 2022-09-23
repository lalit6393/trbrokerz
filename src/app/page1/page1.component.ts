import { Component, EventEmitter, OnInit, Output, } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { collection, addDoc, setDoc, doc, getFirestore, updateDoc } from "firebase/firestore"; 
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/firebaseConfiguration';
import { GetdataService } from '../getdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})
export class Page1Component implements OnInit {
  
  user:any;
  email:any="";
  photo:any="";
  uid:any="";


  @Output() public childEvent = new EventEmitter();

  constructor(private authService:AuthenticationService, private getData:GetdataService, private router:Router) { }

  ngOnInit(): void {
    this.getData.pageUrl(this.router);
    this.user= this.authService.userId;
    if (this.user != null) {
      // The user object has basic properties such as display name, email, etc.
      const displayName = this.user.displayName;
      const email = this.user.email;
      const photoURL = this.user.photoURL;
      const emailVerified = this.user.emailVerified;
      this.uid=this.user.uid;
      if(photoURL != null){
         this.photo=photoURL;
      }
        this.email=email;
        // console.log(email);
    }
  }

  async addData(name:string, state:string){
    // console.log(this.uid);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    await setDoc(doc(db, "User", this.uid ), {
      name: name,
      state: state,
      country: "India"
    }) 
    .catch((e)=>{
      console.error("Error adding document: ", e);
    })
  }

  async updateData(name:string, state:string){
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const frankDocRef = doc(db, "User", this.uid);
    await updateDoc(frankDocRef, {
      name: name,
      state: state,
      country: "India"
  })
  .catch((e)=>{
    console.error("Error adding document: ", e);
  })
  
  }
 

}
