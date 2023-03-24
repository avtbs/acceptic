import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HealthData } from '../types';

@Injectable({
    providedIn: 'root',
})
export class DataService{
    private constructor(private http: HttpClient) { }
        
    getData(): Observable<any> {
        return this.http.get('https://jsonplaceholder.typicode.com/todos/1');
    }

    setData(data: HealthData): Observable<any> {
        return this.http.post('https://jsonplaceholder.typicode.com/todos/1', data);
    }
}