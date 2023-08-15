import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Provide data for the client app from my API  
 */ 

const apiUrl = 'https://nine0smovieapi-oyws.onrender.com/';
@Injectable({ providedIn: 'root' })             // decorator telling Angular that this service will be available everywhere (root)
  
export class FetchApiDataService {
  constructor(private http: HttpClient) {       // inject HttpClient module into constructor params to provide HttpClient to the entire class, making it available via this.http
  }

  /** 
   * API Calls
   * Observable: other parts of the code can use the userRegistration method and subscribe to the returned observable
   * to receive and process the response data asynchronously
   */

  /**
   * User registration endpoint
   * @param userDetails username, password, email and birthday
   * @returns POST request
   */
  public userRegistration(userDetails: any): Observable<any> {    // an observable is an object from the RxJS library that represents a stream of data that can be subscribed to asynchronously
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));                        // pipe() combines functions and when called runs them in sequence
  }
  
  /**
   * User login
   * @param userDetails username and password
   * @returns POST request
   */
  public userLogin(userDetails: any): Observable<any> {
  console.log(userDetails);
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: 'Bearer ' + token });
  return this.http
    .post(apiUrl + 'login', userDetails, { headers: headers })
    .pipe(catchError(this.handleError));
}

  /**
   * Get all movies
   * @returns GET request
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(map((response: any) => this.extractResponseData(response)), catchError(this.handleError));
  }

  /**
   * Get one movie
   * @param title movie title
   * @returns GET request
   */
  getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + title, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(map((response: any) => this.extractResponseData(response)), catchError(this.handleError));
  }

  /**
   * Get director
   * @param name director name
   * @returns GET
   */
  getDirector(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/Director/' + name, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(map((response: any) => this.extractResponseData(response)), catchError(this.handleError));
  }

  /**
   * Get genre
   * @param name genre name
   * @returns GET request
   */
  getGenre(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/Genre/' + name, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(map((response: any) => this.extractResponseData(response)), catchError(this.handleError));
  }

  /**
   * Get user
   * @param name username 
   * @returns GET request
   */
  getUser(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + name, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(map((response: any) => this.extractResponseData(response)), catchError(this.handleError));
  }

  /**
   * Get favorite movies for a user
   * @returns GET request
   */
  getFavMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('username');
    return this.http
      .get(apiUrl + 'users/' + userName, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(
        map((response: any) => this.extractResponseData(response)), 
        map((data) => data.FavoriteMovies), 
        catchError(this.handleError));
  }

  /**
   * Add movie to favorites
   * @param movieId movie id
   * @returns POST request
   */
  addFavMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('username');
    return this.http
      .post(apiUrl + 'users/' + userName + '/movies/' + movieId, null, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(
        map((response: any) => this.extractResponseData(response)), 
        map((data) => data.FavoriteMovies),
        catchError(this.handleError));
  }

  /**
   * Remove movie from favorites
   * @param movieId movie id
   * @returns DELETE request
   */
  removeFavMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('username');
    return this.http
      .delete(apiUrl + 'users/' + userName + '/movies/' + movieId, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(
        map((response: any) => this.extractResponseData(response)), 
        map((data) => data.FavoriteMovies),
        catchError(this.handleError));
  }

  /**
   * Edit user info
   * @param updatedUser updated user object
   * @returns PUT request
   */
  editUser(updatedUser: any): Observable<any> {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('username');
    return this.http
      .put(apiUrl + 'users/' + userName, updatedUser, {headers: new HttpHeaders(
      {Authorization: 'Bearer ' + token,})})
      .pipe(map((response: any) => this.extractResponseData(response)), catchError(this.handleError));
  }

  /**
   * Delete user
   * @returns DELETE request
   */
  deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('username');
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
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`
      );
    }
    return throwError(() => new Error('Something bad happened; please try again later')); // updated syntax
  }
}