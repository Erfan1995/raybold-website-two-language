import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../users.service';
import {LoaderService} from '../../services/loader.service';
import {NotificationService} from '../../services/notification.service';
import {generalMessages, messages} from '../../../../../website/src/app/validation/commonErrorMessages';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessages = messages;


  constructor(private userServices: UsersService,
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
    this.registerForm = this.formBuilder.group({
      name: ['',
        [
          Validators.required,
          Validators.maxLength(62),
          Validators.minLength(3)
        ]
      ],
      last_name: ['',
        [
          Validators.required,
          Validators.maxLength(62),
          Validators.minLength(3)
        ]
      ],
      phone: ['',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),
          Validators.minLength(10)
        ]
      ],
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
      ],
      confirm_password: ['',
        [
          Validators.required
        ]
      ],
    });
  }

  registerUsers(value) {
    if (value.password !== value.confirm_password) {
      this.notificationServices.warn(messages.mustMatch);
    } else {
      value.user_status_id = 1;
      value.privilege_id = 3;
      value.full_name = value.name + '  ' + value.last_name;
      this.loader.openLoader();
      this.userServices.registerUser(value).subscribe(
        (result) => {
          if (result) {
            this.notificationServices.success(generalMessages.successInserted);
            this.router.navigate(['auth', 'login']);
          }
        }, (error: HttpErrorResponse) => {
          if (error.status === 302) {
            this.notificationServices.warn(generalMessages.userNameExists);
          } else {
            this.notificationServices.warn(generalMessages.serverProblem);
          }
        });
      this.loader.closeLoader();
    }

  }

  get f() {
    return this.registerForm.controls;
  }

  isValid() {
    return this.registerForm.valid;
  }

}
