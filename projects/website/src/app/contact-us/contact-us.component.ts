import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {generalMessages, messages} from '../validation/commonErrorMessages';
import {ContactUsService} from './contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  errorMessages = messages;
  contactUsForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private contactUsService: ContactUsService,
  ) {
  }

  ngOnInit(): void {
    this.initSendMessage();
  }

  initSendMessage() {
    this.contactUsForm = this.formBuilder.group({
      name: ['',
        [
          Validators.required
        ]
      ],
      message: ['',
        [
          Validators.required
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
      phone: ['',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(62),
          Validators.minLength(3)
        ]
      ]

    });
  }

  sendMessage(value) {
    if (value) {
      if (value.name !== '' && value.email !== '' && value.phone !== '' && value.message !== '') {
        this.contactUsService.sendMessage(value).subscribe(
          (result) => {
            if (result) {
              this.initSendMessage();
            }
          }
        );
      }
    }

  }

  get f() {
    return this.contactUsForm.controls;
  }

  isValid() {
    return this.contactUsForm.valid;
  }
}
