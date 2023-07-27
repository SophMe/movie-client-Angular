import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { catchError } from 'rxjs';

import { FetchApiDataService } from '../fetch-api-data.service'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit{
  user: any = {};
  favMovies: any[] = [];
  hasChanges: boolean = false;

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };
  @Input() updatedUser = { Username: '', Password: '', Email: '', Birthday: '' };

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
      this.fetchApiData.getUser(username).subscribe((resp: any) => {
        this.user = resp;
        this.userData.Username = this.user.Username;
        this.userData.Email = this.user.Email;
        console.log(this.userData.Username)
        // change date format from db "2011-10-05T14:48:00.000Z"
        this.userData.Birthday = formatDate(this.user.Birthday, 'yyyy-MM-dd', 'en-US', 'UTC+0');
    
        this.fetchApiData.getAllMovies().subscribe((resp: any) => {
          this.favMovies = resp.filter((m: { _id: any; }) => this.user.FavoriteMovies.indexOf(m._id) >= 0);
        });
      });
    }
  }

  /**
   * handle input changes and check for changes in the user data
   */
  onInputChange(): void {
    this.hasChanges = JSON.stringify(this.userData) !== JSON.stringify(this.updatedUser);
  }

  /**
   * send updated data to db and save it in localStorage
   */
  editUserData(): void {
    // call the API to update the user data using the updatedUserData object
    this.fetchApiData.editUser(this.updatedUser).subscribe({
      next: (result) => {
        this.userData = this.updatedUser;
        localStorage.setItem('user', JSON.stringify(this.userData)); // save the updated user data to localStorage

        this.snackBar.open('User data successfully updated', 'OK', {
          duration: 2000
        });
        location.reload();       // reload page after successful update
      },
      error: (error) => {
        this.snackBar.open(error, 'OK', {
          duration: 2000
        });
      }
   });
  }

  /**
   * delete profile permanently and redirect to welcome page
   */
  onDeleteUser(): void {
    this.fetchApiData.deleteUser().pipe(
      catchError((error) => {
        this.snackBar.open('Error deleting user', 'OK', {
          duration: 2000
        });
        return []; // or any default value you want to return
      })
    ).subscribe(
      () => {
        this.snackBar.open('User deleted successfully', 'OK', {
          duration: 2000
        });
        this.router.navigate(['/welcome']);
      }
    );
  }

}
