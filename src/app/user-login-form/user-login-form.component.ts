import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})

export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,   // display notifications back to the user
    private router: Router
  ) {}

  ngOnInit(): void {}

/**
 * store Username and token in localStorage
 * redirect to movie view
 */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        localStorage.setItem('username', result.user.Username);
        localStorage.setItem('token', result.token);
        console.log(result.user, result.token);
        this.dialogRef.close();
        this.snackBar.open('user login successful', 'OK', { duration: 2000 });
        this.router.navigate(['movies']);
      },
      (result) => {
        console.log(result);
        this.snackBar.open('user login failed', 'OK', { duration: 2000 });
      }
    )}  
}
