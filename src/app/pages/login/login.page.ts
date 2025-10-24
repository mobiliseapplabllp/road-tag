import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from 'src/app/provider/api';
import { Common } from 'src/app/provider/common/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  public loginForms! : FormGroup;
  isLoading = false;
  mypass = true;
  currentView = 'login';
  sendMobileMsg!: string; 
  otp!: string; 
  constructor(
    private formBuilder: FormBuilder,
    private router : Router,
    private httpApi: Api,
    private common: Common
  ) {}

  ngOnInit() {
    this.loginForms = this.formBuilder.group({
      username: ['Admin', Validators.required],
      password: ['Mobilise01020304', Validators.required]
    });
  }

  onLogin() {
    const obj = {
      username: this.loginForms.value.username,
      password: this.loginForms.value.password,      
      source: environment.source
    }
    this.common.presentLoading().then(preLoad => {
      this.httpApi.loginAuth(obj).subscribe({
        next:(data) => {        
          if (data === null) return
          if (data === false) {
            this.common.presentToast(environment.errMsg, 'danger');
          } else {
            if (data.status === false ) {
              this.common.presentToast(data.msg, 'warning');
            } else  if (data.status === true) {
              this.sendMobileMsg =  data.msg
              this.currentView = 'otp';
            }
          }
        },
        error:(err: any) => {
          if (err.error.status === false) {
            this.common.presentToast(err.error.msg, 'warning');
          } else {
            this.common.presentToast(environment.errMsg, 'danger');
          }
          this.common.dismissloading();
        },
        complete:() => {
          this.common.dismissloading();
        }
      });
    });
    // if (this.loginForms.valid) {
    //   const loginData = this.loginForms.value;
    //   console.log('User ID:', loginData.username);
    //   console.log('Password:', loginData.password);
    //   console.log('Full Form Data:', loginData);
    //   this.router.navigateByUrl('/road-tag')
    // } else {
    //   console.log('Form is invalid!');
    // }
  }

  changeOtp(ev: any) {    
    let otp = ev.detail.value;    
    if (otp.length === 4) {      
      this.otp = otp;
    } else {
      this.otp = '';
    }
  }

  verifyOtp() {    
    const formData = new FormData();
    formData.append('user_name', this.loginForms.value.username);
    formData.append('otp', this.otp);    
    this.common.presentLoading().then(preLoad => {
      this.httpApi.verifyOtp(formData).subscribe({
        next:(data) => {
          if (data.status === true) {
            localStorage.setItem('loginvalue', JSON.stringify(this.loginForms.value));
            localStorage.setItem('token1', data.token);
            localStorage.setItem('enc_id', data.enc_id);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('isAlreadyLogin', 'true');            
            this.router.navigateByUrl('/road-tag')
            // this.multiFactorSubmit();
          } else {
            this.common.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.common.presentToast(environment.errMsg, 'danger');
          this.common.dismissloading();
        },
        complete:() => {
          this.common.dismissloading();
        }
      });
    })
  }
}
