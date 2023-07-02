import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
    constructor() {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if account is logged in and request is to the api url
        // const account = this.accountService.accountValue;
        const token = localStorage.getItem('token');
        request = request.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });

        return next.handle(request);
    }
    //   intercept(req: HttpRequest<any>, next: HttpHandler):   Observable<HttpEvent<any>> {
    //     if (req.body) {
    //         const duplicate = req.clone({body: req.body.replace(/pizza/gi, '')});
    //         return next.handle(this.addAuthToken(this.addAuthToken(req)));
    //     }
    //     return next.handle(req);
    //   }

    //   addAuthToken(request: HttpRequest<any>) {
    //       const token = 'my auth token';
    //       return request.clone({
    //           setHeaders: {
    //               Authorization: `SSAUTH Basic ${token}`
    //           }
    //       })
    //   }
  }