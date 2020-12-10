import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {generalMessages, messages} from '../../../../../website/src/app/validation/commonErrorMessages';
import {UsersService} from '../users.service';
import {LoaderService} from '../../services/loader.service';
import {NotificationService} from '../../services/notification.service';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessages = messages;


  constructor(private authService: AuthService,
              private loader: LoaderService,
              private notificationServices: NotificationService,
              private formBuilder: FormBuilder,
              private router: Router
  ) {
  }


  ngOnInit(): void {
    this.initCreateUserRegisterForm();
  }

  initCreateUserRegisterForm() {
    this.loginForm = this.formBuilder.group({
      email: ['',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(62),
          Validators.minLength(3)
        ]
      ],
      password: ['',
        [
          Validators.required,
          Validators.maxLength(62),
          Validators.minLength(6)
        ]
      ]
    });
  }

  loginUsers(value) {
    this.loader.openLoader();
    this.authService.login(value).subscribe(
      (result) => {
        this.router.navigate(['dashboard']);
      }, (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.notificationServices.warn(generalMessages.unAuthorized);
        } else if (error.status === 404) {
          this.notificationServices.warn(generalMessages.notActivated);
        }
      });
    this.loader.closeLoader();
  }

  get f() {
    return this.loginForm.controls;
  }

  isValid() {
    return this.loginForm.valid;
  }


}
