import {Component, OnInit} from '@angular/core';
import {DropDownService} from '../services/drop-down.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  constructor(private dropDownService: DropDownService) {
    this.dropDownService.performTheProcess();
  }

  ngOnInit(): void {
  }

}
