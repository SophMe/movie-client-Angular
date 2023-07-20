import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieInfoComponent } from '../movie-info/movie-info.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];          // array of type 'any' to hold movie data from API
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {          // void is a type that represents absence of a value: function performs actions but does not return a value
    this.getMovies();         // fetch movies on component initialization
  }

  getMovies(): void {
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

  addFavMovie(id: string): void {
    this.fetchApiData.addFavMovie(id).subscribe((result) => {

      this.snackBar.open('Movie added to favorites.', 'OK', {
        duration: 2000
      });
    });
  }

  isFavorite(id: string): boolean {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
      const favoriteMovies = JSON.parse(favorites) as string[];
      return favoriteMovies.includes(id);
    }
    return false;
  }

  removeFavMovie(id: string): void {
    this.fetchApiData.removeFavMovie(id).subscribe((result) => {
      this.snackBar.open('Movie removed from favorites.', 'OK', {
        duration: 2000
      });
    });
  } 

}
