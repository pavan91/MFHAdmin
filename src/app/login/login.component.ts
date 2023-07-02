import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import * as bcrypt from "bcryptjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  frm: FormGroup = new FormGroup({});
  salt = bcrypt.genSaltSync(16);
  rawString = "fetziLx4uNwPdhB67i1iFyVi8c3FmjhzZ";
  constructor(private toastr: ToastrService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.frm = this.fb.group({
      email: [''],
      password: ['']
    })
  }

  login() {
    const val = this.frm.value;
    let key = this.salt;
    let encodedPass = bcrypt.hashSync(val.password, key);

    if ( val.email && val.password ) {
      this.authService.login(val.email, encodedPass).subscribe((result: any) => {
        console.log("User log result :: ", result, result.hasOwnProperty('token'));
        if (result && result.hasOwnProperty('token')) {
          console.log("User logged in successfully..");
          localStorage.setItem('token', result.token);
          this.router.navigateByUrl('dashboard');
        } else {
          this.toastr.error(result.message)
        }
        // this.router.navigateByUrl('dashboard');
      })
    }
  }
}
  // this.router.navigateByUrl['dashboard'];
