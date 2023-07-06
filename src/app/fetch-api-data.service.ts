import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// provide data for the client app from my API
const apiUrl = 'https://nine0smovieapi-oyws.onrender.com/';
@Injectable({                                   // decorator telling Angular that this service will be available everywhere (root)
  providedIn: 'root'
})
export class UserRegistrationService {
  constructor(private http: HttpClient) {       // inject HttpClient module into constructor params to provide HttpClient to the entire class, making it available via this.http
  }

  // API CALLS

  // Observable: other parts of the code can use the userRegistration method and subscribe to the returned observable
  // to receive and process the response data asynchronously

  // user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {    // an observable is an object from the RxJS library that represents a stream of data that can be subscribed to asynchronously
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));                        // pipe() combines functions and when called runs them in sequence
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occured:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`
      );
    }
    return throwError(() => new Error('Something bad happened; please try again later')); // updated syntax
  }
}