import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];          // array of type 'any' to hold movie data from API
  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog 
  ) {}

  ngOnInit(): void {          // void is a type that represents absence of a value: function performs actions but does not return a value
    this.getMovies();         // fetch movies on component initialization
  }

  getMovies(): void {
    // call getAllMovies() method from UserRegistrationService
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;     // store retrieved movies in the 'movies' array...
      console.log(this.movies);
      return this.movies;     // ...and return them
    });
  }

  openGenre(name: string, description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name,
        content: description
      },
    });
  }
  
  openDirector(name: string, bio: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name,
        content: bio
      },
    });
  }
  
  openDescription(description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: "Movie Summary",
        content: description
      },
    });
  }  

}
