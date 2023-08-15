import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { FetchApiDataService } from '../fetch-api-data.service'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit{
  user: any = {};
  favMovies: any[] = [];

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router ) {}

  ngOnInit(): void {
    this.fetchUser();
  }

  /**
   * display user data and filter movies for their favorites
   */
  fetchUser(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.getUser(username).subscribe((response: any) => {
        this.user = response;
        this.userData.Username = this.user.Username;
        console.log(this.user.Username)
        this.userData.Email = this.user.Email;
        this.user.Birthday = formatDate(this.user.Birthday, 'yyyy-MM-dd', 'en-US', 'UTC+0');    // change date format from db "2011-10-05T14:48:00.000Z"
        this.fetchApiData.getAllMovies().subscribe((response: any) => {
          this.favMovies = response.filter((m: { _id: any; }) => this.user.FavoriteMovies.indexOf(m._id) >= 0);
        });
      });
    }
  }

  /**
   * send updated data to db and save it in localStorage
   */
  editUserData(): void {  
    this.fetchApiData.editUser(this.userData).subscribe((data) => {     // call the API to update the user data using the 
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('Username', data.Username);
      console.log(data);
      this.snackBar.open('User data successfully updated', 'OK', {
        duration: 2000
      });
      location.reload();       // reload page after successful update
    },
      (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000
        });
      })
  };

  /**
   * delete profile permanently and redirect to welcome page
   */
  onDeleteUser(): void {
    if (confirm('Are you sure you want to delete your account?')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open('Account successfully deleted', 'OK', {
          duration: 2000,
        });
      });
      this.fetchApiData.deleteUser().subscribe((resp) => {
        localStorage.clear();
      });
    }
  }  

}
