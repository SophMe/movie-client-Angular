import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})

export class WelcomePageComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

    ngOnInit(): void {}

    /**
     * open dialog for registration
     */
    openUserRegistrationDialog(): void {
      this.dialog.open(UserRegistrationFormComponent, {
        width: '280px'
      });
  }

    /**
     * open dialog for login
     */
    openUserLoginDialog(): void {
      this.dialog.open(UserLoginFormComponent, {
        width: '280px'
      });
  }
}