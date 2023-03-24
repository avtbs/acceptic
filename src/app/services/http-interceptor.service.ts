import { Injectable } from '@angular/core';
import { 
    HttpInterceptor,
    HttpHandler,
    HttpEvent, 
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageService } from './storage.service';

import response from './response';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
    constructor(private storageService: StorageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(req.method === 'GET') {
            let responseFromStorage = this.storageService.get('response');
            if (!responseFromStorage) {
                responseFromStorage = response;
                this.storageService.set('response', response);
            }
            return next.handle(req).pipe(
                map((resp) => new HttpResponse({
                    status: 200,
                    body: responseFromStorage,
                }))
            );
        }
        if(req.method === 'POST') {
            this.storageService.set('response', req.body);
            
            console.log('res', req.body);
            return next.handle(req).pipe(
                map((resp) => new HttpResponse({
                    status: 200,
                }))
            );
        }

        return next.handle(req).pipe(
            map((resp) => new HttpResponse({
                status: 200,
                body: response,
            }))
        );
    }
}