import { Component, OnInit, inject } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { DailyForecast, ForecastResponse, WeatherResponse } from '../interfaces/weather';
import { FormGroup, FormControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
  
export class WeatherComponent implements OnInit {
  weatherForm: FormGroup;
  weatherData: WeatherResponse | null = null;
  error = '';
  currentTime = '';
  currentDay = '';
  city = '';

  forecast: DailyForecast[] = [...DEFAULT_FORECAST];  

  constructor(private weatherService: WeatherService, private fb: FormBuilder) {
    this.weatherForm = this.fb.group({
      city: new FormControl(''),
    });
  } 


  ngOnInit(): void {
    this.updateTime();
    this.getWeatherByLocation();
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.currentDay = now.toLocaleDateString(undefined, { weekday: 'long' });
  }

  getWeatherByLocation() {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
  
          this.weatherService.getWeatherByCoords(lat, lon).subscribe({
            next: (data) => {
              this.weatherData = data;
              this.city = data.name;
              this.error = '';
  
              // Fetch forecast for current location city
              this.getForecastByCity(this.city);
  
            },
            error: () => {
              this.error = 'Unable to fetch weather for your location.';
            }
          });
        },
        () => {
          this.error = 'Location permission denied.';
        }
      );
    } else {
      this.error = 'Geolocation is not supported by this browser.';
    }
  }
  

  
  getWeatherByCity() {
    const cityName = this.weatherForm.value.city?.trim();
    if (!cityName) return;

    this.weatherService.getWeatherByCity(cityName).subscribe({
      next: (data: WeatherResponse) => {
        this.weatherData = data;
        this.city = data.name;
        this.error = '';
      },
      error: () => {
        this.error = 'Could not fetch weather for the given city.';
      }
    });

    this.getForecastByCity(cityName);
  }

  getForecastByCity(city: string) {
    this.weatherService.getForecastByCity(city).subscribe({
      next: (data: ForecastResponse) => {
        // console.log('Forecast API response:', data);
        const daily: DailyForecast[] = [];
        const seenDays = new Set<string>();

        for (let entry of data.list) {
          const date = new Date(entry.dt_txt);
          const day = date.toLocaleDateString('en-US', { weekday: 'short' });

          if (!seenDays.has(day)) {
            seenDays.add(day);
            daily.push({
              day,
              temp: Math.round(entry.main.temp) + '°',
              icon: `https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`,
              type: entry.weather[0].description,
            });
          }

          if (daily.length === 7) break;
        }

        this.forecast = daily;
      },
      error: () => {
        this.error = 'Could not fetch forecast for the given city.';
      }
    });

  }

}

const DEFAULT_FORECAST: DailyForecast[] = [
  { day: 'Mon', icon: 'https://img.icons8.com/color-glass/42/000000/rain.png', temp: '2°', type: 'Rain' },
  { day: 'Tue', icon: 'https://img.icons8.com/color-glass/42/000000/cloud.png', temp: '4°', type: 'Cloudy' },
  { day: 'Wed', icon: 'https://img.icons8.com/color-glass/42/000000/partly-cloudy-day.png', temp: '6°', type: 'Partly cloudy' },
  { day: 'Thu', icon: 'https://img.icons8.com/color-glass/42/000000/sun.png', temp: '8°', type: 'Sunny' },
  { day: 'Fri', icon: 'https://img.icons8.com/color-glass/42/000000/wind.png', temp: '5°', type: 'Windy' },
  { day: 'Sat', icon: 'https://img.icons8.com/color-glass/42/000000/snow.png', temp: '1°', type: 'Snow' },
  { day: 'Sun', icon: 'https://img.icons8.com/color-glass/42/000000/thunderstorm.png', temp: '3°', type: 'Thunderstorm' }
];
