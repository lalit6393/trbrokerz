import { AUTO_STYLE } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, arrayUnion, collection, doc, getDoc, getFirestore, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { firebaseConfig } from 'src/environments/firebaseConfiguration';
import { GetdataService } from '../getdata.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  following:any[]=[];
 showMessage:(number | string | any)[][]=[[12,5,2002,13,24,'hi']];
 followName:any = '';
 followPhoto:any = '';
 public followUrl ='../../assets/follow.svg';

  arrayitm:any[]=[
    { Date:'',
      FullYear: '',
      email:'email123@gmail.com',
      Hours: '',
      Minutes: '',
      Month: '',
      message: "No Message",
      Name:this.getData.FirstName +' '+ this.getData.LastName,
      Photo:"../../assets/PlaceHolder image.png"
    }
  ];
  email:any;
  uid:any;
  photo="../../assets/PlaceHolder image.png";
  public date = new Date();

  constructor(public getData:GetdataService, private router:Router, private toast:HotToastService) { }

  ngOnInit(): void {
    this.getData.checkUserIsSignedIN();
    // console.log("itruns");
    // this.getData.getDataFromFireStore();
    // window.location.reload();
    this.getData.pageUrl(this.router);
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user!=null) {
               this.email = user.email;
               this.uid = user.uid;
               if(user.displayName!= null && user.displayName != undefined && user.displayName != ''){
                // console.log("user.displayName");
               }
              await this.recievedMessage();
              // console.log("tttttttt",this.getData.FirstName);
              //  console.log("itruns");
      }else{
        this.router.navigateByUrl("/home");
        // console.log("false from dash on auth state changed");
      }
    });
  }

  dropDown(){
   const textarea = document.getElementsByTagName("textarea");
  //  console.log(textarea);
  }

  @HostListener("keyup", ["$event.target"])
  function(){
    const textarea = document.querySelector("textarea");
    textarea!.style.height = '44px';
    let height:any= textarea!.scrollHeight;
    textarea!.style.height = height+'px';
  }


  async postMassage(message:any){
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const docData = {
      Date:this.date.getDate(),
      Month:this.date.getMonth(),
      FullYear:this.date.getFullYear(),
      Hours:this.date.getHours(),
      Minutes:this.date.getMinutes(),
      message:message,
      Name:this.getData.FirstName +' ' + this.getData.LastName,
      Photo:this.getData.url,
      followed:"i dont know",
      email:this.email
    };
    if(message != null && message!= undefined && message!=''){
      await updateDoc(doc(db, "message", "message"),{
        chat:arrayUnion(docData)
      })
      .then(()=>{
            this.toast.success('Posted Successfully');   
            this.recievedMessage();                                              
           }); 
    }else{
      this.toast.error("No Input");
    }
      }



  async recievedMessage(){
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const docRef = doc(db, "message", "message");
    const docSnap= await getDoc(docRef);

    if (docSnap.exists()) {
      if(docSnap.data()!= null && docSnap.data()!=undefined ){
        this.showMessage= docSnap.data()["chat"];
        if(this.showMessage.length !=0){
        this.arrayitm=this.showMessage;}
        // console.log("message=",this.showMessage, this.arrayitm);

      }else if(docSnap.data()['Message'] == null || docSnap.data()['Message'] ==undefined ){
        this.showMessage[0][0] = "No Post";
        // console.log("message failed");
      }
    } else {
      // doc.data() will be undefined in this case
      // console.log("No such document!");
    }
  }


  //going to follow
  async GoingToFollow(i:any,j:any){
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const docRef = doc(db, "User" , i);
    const Ref = doc(db, "User" , this.email);

    const storage = getStorage();
    const path = 'Image/'+ i;
    const imagesRef = ref(storage, path);

    await getDownloadURL(imagesRef)
    .then((url) => {
      this.followPhoto = url;
      // console.log(this.followPhoto);
         });

    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
           this.followName = docSnap.data()['FirstName'];
          //  console.log(this.followName,this.followPhoto );
    }
    if(this.followName != null && this.followPhoto!=null && this.followName != undefined && this.followPhoto!=undefined &&
      this.followName != '' && this.followPhoto!=''){
        await  updateDoc(Ref, {
          following:arrayUnion({
               name:this.followName,
               photo:this.followPhoto
          })
        }).then(()=>{
          document.getElementById(j)!.innerHTML= '<img src="../../assets/patch-check.svg">';
          document.getElementById(j)!.style.border ='none';
        })
        .catch((e)=>{
          //  console.log(e);
        })
      }
    
  }


  async followed(){
    if(document.getElementById('displayFollow')!.style.height == '0px' || document.getElementById('displayFollow')!.style.height == null
    || document.getElementById('displayFollow')!.style.height == undefined ||  document.getElementById('displayFollow')!.style.height == ''){
      document.getElementById('displayFollow')!.style.height = 'auto';
    }else{
      document.getElementById('displayFollow')!.style.height = '0px';
    }
    if(document.getElementById('displayFollow2')!.style.height == '0px' || document.getElementById('displayFollow2')!.style.height == null
    || document.getElementById('displayFollow2')!.style.height == undefined ||  document.getElementById('displayFollow2')!.style.height == ''){
      document.getElementById('displayFollow2')!.style.height = 'auto';
    }else{
      document.getElementById('displayFollow2')!.style.height = '0px';
    }
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const docRef = doc(db, "User", this.email);
    const snapshot = await getDoc(docRef);

    if(snapshot.exists()){
     this.following=snapshot.data()["following"];
    //  console.log(this.following);
    }else{
      // console.log("error");
    }

  }


  sidebarView(){
    if(document.getElementById('sideBar')!.style.left == '-300px' || document.getElementById('sideBar')!.style.left == null
    || document.getElementById('sideBar')!.style.left == undefined ||  document.getElementById('sideBar')!.style.left == ''){
      document.getElementById('sideBar')!.style.left = '0px';
    }else{
      document.getElementById('sideBar')!.style.left = '-300px';
    }
  }
}
