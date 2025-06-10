import { Routes } from '@angular/router';
import { CounterComponent } from './counter/counter/counter.component';
import { WeatherComponent } from './weather/weather.component';

export const routes: Routes = [
    { path: '', redirectTo: '/counter', pathMatch: 'full' },
    { path: 'counter', component: CounterComponent },
    { path: 'vatavaran', component: WeatherComponent }
];
