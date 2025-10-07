import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(
    private formBuilder: FormBuilder,
    private router : Router 
  ) {}

  ngOnInit() {
    this.loginForms = this.formBuilder.group({
      username: ['123', Validators.required],
      password: ['123', Validators.required]
    });
  }
    onLogin() {
    if (this.loginForms.valid) {
      const loginData = this.loginForms.value;
      console.log('User ID:', loginData.username);
      console.log('Password:', loginData.password);
      console.log('Full Form Data:', loginData);
      this.router.navigateByUrl('/road-tag')
    } else {
      console.log('Form is invalid!');
    }
  }
}
