import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { from, Observable, switchMap } from 'rxjs';
import { firebaseConfig } from 'src/environments/firebaseConfiguration';
import { CreateAccountService } from './create-account.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { Url } from 'url';
import { DashboardComponent } from './dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class GetdataService {
  static checkUserIsSignedIN(): (((this: GlobalEventHandlers, ev: Event) => any) & ((this: Window, ev: Event) => any)) | null {
    throw new Error('Method not implemented.');
  }

  public FirstName:string='Unknown';
  public LastName:string='';
  public uid='uid';
  public url="../../assets/PlaceHolder image.png";
  public PageView:boolean= true;
  public viewloginButton =false;
  public viewGetStartedButton = false;
  public email:any;

  constructor(private toast:HotToastService, private router:Router){ }

  pageUrl(router:any){
    if(router.url == '/home' || router.url == '/getstarted' || router.url == '/login' || router.url == '/resetpass'){
      this.PageView = true;
      this.viewloginButton =false;
      this.viewGetStartedButton= false;
    }else if(router.url == '/dashboard'){
      this.PageView = false;
      this.viewloginButton =true;
      this.viewGetStartedButton= true;
    }
    // console.log(this.PageView);
  }

  checkUserIsSignedIN(){
   const auth = getAuth();
   onAuthStateChanged(auth, (user) => {
   if (user) {
    // User is signed in, see docs for a list of available properties
    const uid = user.uid;
    this.uid = uid;
    this.email = user.email;
    // console.log("logged in");
    this.getDataFromFireStore();
    //storage reference
    // console.log("logged in 2");
    const storage = getStorage();
    const path = 'Image/'+ this.email;

    const imagesRef = ref(storage, path);
    this.retreiveImage(imagesRef);
  } else {
    // User is signed out
  }
   });
  }

   async getDataFromFireStore(){
    //getting information of logged in user
    // console.log("0");
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const docRef = doc(db, "User", this.email);
    // console.log("logged in 3");

    const docSnap= await getDoc(docRef);
    // console.log("logged in 4",docSnap,docRef);

    if (docSnap.exists()) {
      if(docSnap.data()['FirstName'] != null && docSnap.data()['FirstName'] !=undefined && docSnap.data()['LastName'] != null && docSnap.data()['LastName'] !=undefined ){
        this.FirstName= docSnap.data()['FirstName'];
        this.LastName= docSnap.data()['LastName'];
        // console.log("1");
      }else if(docSnap.data()['FirstName']!= null || docSnap.data()['FirstName'] !=undefined  && docSnap.data()['LastName'] == null && docSnap.data()['LastName'] ==undefined){
       this.FirstName = docSnap.data()['FirstName'];
       this.LastName= '';
      }
    } else {
      // doc.data() will be undefined in this case
      // console.log("No such document!");
    }
  }

  retreiveImage(imagesRef:any){
     // Get the download URL
    getDownloadURL(imagesRef)
    .then((url) => {
      // Insert url into an <img> tag to "download"
      // console.log("this is url",url);
      this.url = url;
      // console.log("this.url=",this.url);
      return url;
         })
    .catch((error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
        // ...
        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    });
}
  }

