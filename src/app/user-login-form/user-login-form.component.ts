import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { UserRegistrationService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,   // display notifications back to the user
    private router: Router
    ) {}

  ngOnInit(): void {}

  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe({
      next: (result: any) => {
        localStorage.setItem('user', result.user.Username);
        localStorage.setItem('token', result.token);
        console.log(result.user, result.token);
        this.dialogRef.close(); // close modal
        this.router.navigate(['movies']);
        this.snackBar.open('user login successful', 'OK', { duration: 2000 });
      },
      error: (error) => {
        console.log(error);
        this.snackBar.open('user login failed', 'OK', { duration: 2000 });
      }
    });
  }  
}
