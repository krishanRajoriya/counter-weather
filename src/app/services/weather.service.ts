import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ForecastResponse, WeatherResponse } from '../interfaces/weather';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private baseUrl = environment.apiBaseUrl;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) {}

  getWeatherByCity(city: string): Observable<WeatherResponse> {
    const url = `${this.baseUrl}weather?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get<WeatherResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  getWeatherByCoords(lat: number, lon: number): Observable<WeatherResponse> {
    const url = `${this.baseUrl}weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    return this.http.get<WeatherResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  getForecastByCity(city: string): Observable<ForecastResponse> {
    const url = `${this.baseUrl}forecast?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get<ForecastResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  
  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'An unknown error occurred.';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMsg = `Network error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMsg = 'Cannot connect to the server.';
          break;
        case 404:
          errorMsg = 'City not found.';
          break;
        case 401:
          errorMsg = 'Invalid API key.';
          break;
        case 429:
          errorMsg = 'API rate limit exceeded.';
          break;
        default:
          errorMsg = `Error ${error.status}: ${error.message}`;
      }
    }

    // Optionally log the error here
    console.error('WeatherService error:', error);

    return throwError(() => new Error(errorMsg));
  }
}
