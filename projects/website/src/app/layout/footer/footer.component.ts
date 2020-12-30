import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {messages} from '../../validation/commonErrorMessages';
import {FooterService} from './footer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  subscribeForm: FormGroup;
  errorMessages = messages;
  services;

  constructor(private formBuilder: FormBuilder,
              private footerService: FooterService) {
  }

  ngOnInit(): void {

    this.subInitForm();
    // this.footerService.listServices().subscribe(
    //   result => {
    //     this.services = result;
    //   }
    // );
  }

  subInitForm() {
    this.subscribeForm = this.formBuilder.group({
      subscribe: ['', []]
    });
  }

  subscribe(value) {
    console.log(value);
    this.footerService.subscribe(value).subscribe(
      result => {
        if (result) {
          this.subInitForm();
        }
      }
    );
  }

  get f() {
    return this.subscribeForm.controls;
  }

  isValid() {
    return this.subscribeForm.valid;
  }

}
