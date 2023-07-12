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
  
  // user login
  public userLogin(userDetails: any): Observable<any> {
  console.log(userDetails);
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: 'Bearer ' + token });
  return this.http
    .post(apiUrl + 'login', userDetails, { headers: headers })
    .pipe(catchError(this.handleError));
}


  // get all movies
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(map((response: any) => this.extractResponseData(response)), catchError(this.handleError));
  }

  // get one movie
  getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + title, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(map((response: any) => this.extractResponseData(response)), catchError(this.handleError));
  }

  // get director
  getDirector(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/Director/' + name, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(map((response: any) => this.extractResponseData(response)), catchError(this.handleError));
  }

  // get genre
  getGenre(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/Genre/' + name, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(map((response: any) => this.extractResponseData(response)), catchError(this.handleError));
  }

  // get user
  getUser(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users' + name, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(map((response: any) => this.extractResponseData(response)), catchError(this.handleError));
  }

  // get favorite movies for a user
  getFavMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('user');
    return this.http
      .get(apiUrl + 'users/' + userName, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(
        map((response: any) => this.extractResponseData(response)), 
        map((data) => data.FavoriteMovies), 
        catchError(this.handleError));
  }

  // add movie to favorites
  addFavMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('user');
    return this.http
      .post(apiUrl + 'users/' + userName + 'movies/' + movieId, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(
        map((response: any) => this.extractResponseData(response)), 
        map((data) => data.FavoriteMovies),
        catchError(this.handleError));
  }

  // remove movie to favorites
  removeFavMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('user');
    return this.http
      .delete(apiUrl + 'users/' + userName + 'movies/' + movieId, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(
        map((response: any) => this.extractResponseData(response)), 
        map((data) => data.FavoriteMovies),
        catchError(this.handleError));
  }

  // edit user info
  editUser(updatedUser: string): Observable<any> {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('user');
    return this.http
      .put(apiUrl + 'users/' + userName, updatedUser, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(map((response: any) => this.extractResponseData(response)), catchError(this.handleError));
  }

  // delete user
  deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('user');
    return this.http
      .delete(apiUrl + 'users/' + userName, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(map((response: any) => this.extractResponseData(response)), catchError(this.handleError));
  }

  private extractResponseData(res: Response): any {
    const body = res;
    return body || {};
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