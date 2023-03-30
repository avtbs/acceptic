import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HealthData, HealthEventItem } from '../types';

@Injectable({
    providedIn: 'root',
})
export class DataService{
    public url = 'http://localhost:4200';
    constructor(private http: HttpClient) { }
        
    getData(): Observable<any> {
        return this.http.get(this.url);
    }

    addItem(item: HealthEventItem): Observable<any> {
        return this.http.post(this.url, item);
    }

    updateItem(itemId: number, item: HealthEventItem): Observable<any> {
        return this.http.put(
            this.url,
            item, 
            {
                params: {
                    itemId
                }
            }
        );
    }

    removeItem(itemId: number): Observable<any> {
        return this.http.delete(
            this.url,
            {
                params: {
                    itemId
                }
            }
        );
    }
}