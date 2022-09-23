import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { Page1Component } from './page1/page1.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { HotToastModule } from '@ngneat/hot-toast';

//Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// authentication
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { GetstartedComponent } from './getstarted/getstarted.component';
import { ResetpassComponent } from './resetpass/resetpass.component';
import { AuthenticationService } from './authentication.service';
// Firestore
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from 'src/environments/firebaseConfiguration';
import { getStorage } from "firebase/storage";
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    Page1Component,
    FooterComponent,
    LoginComponent,
    GetstartedComponent,
    ResetpassComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HotToastModule.forRoot(),
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const storage = getStorage(app, "gs://tr-brokerz.appspot.com");