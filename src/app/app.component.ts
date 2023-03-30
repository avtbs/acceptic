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

  newRow: HealthEventItem | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(){
    this.getData();
  };

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  switchToEditRow(index: number) {
    if (this.selectedIndex !== -1){
      this.skipEditingRow(this.selectedIndex, index);
    } else {
      this.selectedIndex = index;
    }
  }

  saveEditingRow(index: number) {
    const item = this.data.result[index];
    this.subscriptions.push(
      this.dataService.updateItem(item.eventId, item).subscribe(
        (res) => {
          this.selectedIndex = -1;
        },
        err => {
          console.error(err);
        }
      )
    );
  }

  skipEditingRow(index: number, newIndex: number = -1) {
    if (this.selectedIndex !== -1){
      this.subscriptions.push(
        this.dataService.getData().subscribe(
          (res) => {
            const item = (res as HealthData).result.find((item) => 
              item.eventId === this.data.result[index].eventId
            )
            if (item) {
              this.data.result[index] = item;
              this.selectedIndex = newIndex;
            }
          },
          err => {
            console.error(err);
          }
        )
      );
    }    
  }
  
  deleteRow(index: number) {
    this.subscriptions.push(
      this.dataService.removeItem(this.data.result[index].eventId).subscribe(
        (res) => {
          if(this.selectedIndex === index) {
            this.selectedIndex = -1;
          }
          this.data.result.splice(index, 1);
        },
        err => {
          console.error(err);
        }
      )
    );
  }

  addRow() {
    this.maxId++;
    this.newRow = <HealthEventItem>{eventId: this.maxId}
  }

  saveNewRow(){
    if(this.newRow){
      this.subscriptions.push(
        this.dataService.addItem(this.newRow).subscribe(
          (res) => {
            if(this.newRow){
              this.data.result.push(this.newRow);
              this.newRow = null;
            }
          },
          err => {
            console.error(err);
          }
        )
      );
    }
  }

  skipSavingNewRow () {
    this.maxId--;
    this.newRow = null;
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
}
