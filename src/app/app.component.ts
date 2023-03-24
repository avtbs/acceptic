import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { DataService } from './services/data.service';

import {
  HealthData,
  HealthEventItem
} from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []
  selectedIndex: number = -1;
  maxId: number = 0;

  data: HealthData = {
    offset: 0,
    limit: 0,
    total: 0,
    result: []
  };

  constructor(private dataService: DataService) {}

  ngOnInit(){
    this.getData();
  };

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  editRow(index: number) {
    this.selectedIndex = this.selectedIndex !== index ? index : -1;
  }
  
  deleteRow(index: number) {
    if(this.selectedIndex === index) {
      this.selectedIndex = -1;
    }
    this.data.result.splice(index, 1);
  }

  addRow() {
    this.maxId++;
    this.data.result.push(<HealthEventItem>{eventId: this.maxId});
  }

  getData() {
    this.subscriptions.push(
      this.dataService.getData().subscribe(
        (res) => {
          this.data = res as HealthData;
          res.result.forEach((item: HealthEventItem)=>{
            if(item.eventId > this.maxId) this.maxId = item.eventId;
          });
        },
        err => {
          console.error(err);
        }
      )
    );
  }

  saveData() {
    this.subscriptions.push(
      this.dataService.setData(this.data).subscribe(
        (res) => {
          alert('Data successfuly saved!')
        },
        err => {
          console.error(err);
        }
      )
    );
  }
}
