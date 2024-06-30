import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginForm } from '../../models/login.model';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  protected loginForm: FormGroup<LoginForm>;
  protected errorMessage: string;

  constructor(private _authService: AuthService){
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
    this.errorMessage = '';
  }

  protected async onLogin(event: SubmitEvent){
    event.preventDefault();
    this.errorMessage='';
    const username = this.loginForm.get('username')!.value;
    const password = this.loginForm.get('password')!.value;

    try{
     const user = await this._authService.login(username, password);
     console.log(user);
    } catch (error: unknown){
      this.errorMessage = 'Error loggin in';
    }
  }

}
