export interface WeatherResponse {
    name: string;
    main: {
      temp: number;
      humidity: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
  }

  export interface ForecastItem {
    dt_txt: string; 
    main: { temp: number };
    weather: { icon: string; description: string }[];
  }

  export interface ForecastResponse {
    list: {
      dt_txt: string;
      main: { temp: number };
      weather: { icon: string; description: string }[];
    }[];
}
  

export interface DailyForecast {
    day: string;
    icon: string;
    temp: string;
    type?: string; 
  }
  
  