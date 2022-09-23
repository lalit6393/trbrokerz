import { Component, OnInit, HostListener, Input} from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { from } from 'rxjs';
import { firebaseConfig } from 'src/environments/firebaseConfiguration';
import { AuthenticationService } from '../authentication.service';
import { CreateAccountService } from '../create-account.service';
import { GetdataService } from '../getdata.service';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() public parentData: any;
  backgroundTrans=true;
  boolB:boolean= false;
  profileView:boolean= true;
  firstname='User';
  lastname='Name';
  noLargeProfileImage= true;
  // url:any="../../assets/PlaceHolder image.png";

  constructor(public authService:AuthenticationService,
     private createAccountService:CreateAccountService,
     public getData:GetdataService,
     private toast:HotToastService,
     private router: Router
     ) { }

   ngOnInit() {
    // this.getData.checkUserIsSignedIN();
   }

   //for header transparent
  @HostListener("document:scroll")
  function(){
    this.backgroundTrans= this.parentData;
  }
  home(){
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  profileClick(element:Element){
    // profile motion 
    if(element.className =="profile"){
      if(this.getData.FirstName != null && this.getData.FirstName != undefined && this.getData.FirstName !='' ){
        this.firstname=this.getData.FirstName;
        this.lastname= this.getData.LastName;
        // console.log(this.lastname);
      }
      this.boolB=true;
    }else if(element.className!= 'profile'){
      this.boolB=false;
    }
  }

   uploadImage(event:any){
     if(event.target.files[0] !=null && event.target.files[0] !=undefined){
            //toast
      this.toast.loading("Uploading image...",{
        duration:2000
      });
      const storage = getStorage();
      const path = 'Image/'+ this.getData.email;
      const imagesRef = ref(storage, path);
      const uploadTask = uploadBytes(imagesRef, event.target.files[0]).then((snapshot) => {
        this.toast.success("Image Uploaded Successfully");
        this.getData.retreiveImage(imagesRef);
      })
      .catch((e)=>{
         this.toast.show(e.code, {
            autoClose: true,
            dismissible:true,
            style: {
              padding: '16px',
              color: '#b22222',
              cursor: 'pointer'
            }
          })
        // console.log("e for Error: ",e.code);
      })
     }
    
  }


  
  async signOutFunc(){
    const auth = getAuth();
    await from(signOut(auth).then(() => {
      // console.log("Sign-out successful");
    }).catch((error) => {
      // console.log("An error happened");
    })
    ).subscribe(()=>{
      this.toast.show("Logged out", {
        duration:1000
      })
      // this.getData.pageUrl('/home');
      this.router.navigateByUrl('/home');
    })
   }

   profileImageClick(){
     this.noLargeProfileImage= false;
   }

   goBackFromProfile(){
    this.noLargeProfileImage= true;
   }


   //edit profile
   editProfile(){
     if( document.getElementById('editButton')!.innerHTML== 'Edit'){
      document.getElementById('userName')!.style.display= 'none';
      document.getElementById('spanVisiblity')!.style.display= 'block';
      document.getElementById('inputBox')!.style.display= 'block';
      document.getElementById('saveButton')!.style.display= 'block';
      document.getElementById('editButton')!.innerHTML='Cancel';
     }else if(document.getElementById('editButton')!.innerHTML== 'Cancel'){
      document.getElementById('userName')!.style.display= 'block';
      document.getElementById('spanVisiblity')!.style.display= 'none';
      document.getElementById('inputBox')!.style.display= 'none';
      document.getElementById('saveButton')!.style.display= 'none';
      document.getElementById('editButton')!.innerHTML='Edit';
     }
        
  }

   SaveName(InputDiv:any){
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const docRef = doc(db, "User", this.getData.email);
    if(InputDiv.value !=null && InputDiv.value !=undefined && InputDiv.value !=""
    && InputDiv.value !=" " && InputDiv.value !="  " && InputDiv.value !="   " && InputDiv.value !="    "
    ){
      updateDoc(docRef, {
        FirstName:InputDiv.value
      }).then(()=>{
        window.location.reload();
        })
      .catch((e)=>{
        // console.error("Error adding document: ", e);
      });
    }else{
      this.toast.error('Invalid Input');
    }

    document.getElementById('inputBox')!.style.display= 'none';
    document.getElementById('saveButton')!.style.display= 'none';
    document.getElementById('spanVisiblity')!.style.display= 'none';
    document.getElementById('userName')!.style.display= 'block';
    // document.getElementById('editImage')!.style.display= 'block';
   }

   threeDot(){
     if(document.getElementById('editFullProfile1')?.style.left == null || 
     document.getElementById('editFullProfile1')?.style.left == undefined ||
     document.getElementById('editFullProfile1')?.style.left == '' ||
     document.getElementById('editFullProfile1')?.style.left == '75px'){
      document.getElementById('editFullProfile1')!.style.left = '0px';
     }else{
      document.getElementById('editFullProfile1')!.style.left = '75px';
     }
    
   }
}