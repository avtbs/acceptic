import { Injectable } from '@angular/core';
import { 
    HttpInterceptor,
    HttpHandler,
    HttpEvent, 
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { StorageService } from './storage.service';
import { HealthData, HealthEventItem } from '../types';

import response from './response.json';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
    constructor(private storageService: StorageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let responseFromStorage = this.storageService.get('response');
        if (!responseFromStorage) {
            responseFromStorage = response;
            this.storageService.set('response', response);
        }

        if (req.method === 'GET') {
            return of(new HttpResponse({
                status: 200,
                body: responseFromStorage,
            }));
        }

        if (req.method === 'POST') {
            responseFromStorage.result.push(req.body);
            responseFromStorage.total = responseFromStorage.result.length;
            this.storageService.set('response', responseFromStorage);
            return of(new HttpResponse({
                status: 200,
            }));
        }

        if (req.method === 'DELETE') {
            const itemId = +(req.params.get('itemId') || -1);
            responseFromStorage.result = responseFromStorage.result
                .filter((item: HealthEventItem) => item.eventId !== itemId);
            responseFromStorage.total = responseFromStorage.result.length;
            this.storageService.set('response', responseFromStorage);
            
            return of(new HttpResponse({
                status: 200,
            }));
        }


        if (req.method === 'PUT') {
            const itemId = +(req.params.get('itemId') || -1);
            
            responseFromStorage.result = responseFromStorage.result
                .map((item: HealthEventItem) => {
                    if(item.eventId === itemId) {
                        return req.body;
                    }
                    return item;
                });
            responseFromStorage.total = responseFromStorage.result.length;
            this.storageService.set('response', responseFromStorage);
            
            return of(new HttpResponse({
                status: 200,
            }));  
        }
 
        return of(new HttpResponse({
            status: 404,
        }));  
    }
}