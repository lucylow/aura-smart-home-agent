// backend/services/ContextService.ts
import { IContextService, ContextData, WeatherData } from '../agents/types';

// In a real application, this would integrate with external APIs (Weather, Calendar)
export class ContextService implements IContextService {
  private weatherApiKey: string;

  constructor(weatherApiKey: string) {
    this.weatherApiKey = weatherApiKey;
  }

  private mockWeather(): WeatherData {
    return {
      summary: 'Clear sky',
      temperature: 75,
      humidity: 45,
      isRaining: false,
      feelsLike: 74,
    };
  }

  getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  async getContext(userId: string): Promise<ContextData> {
    // Mocking all external data for demo
    return {
      timeOfDay: this.getTimeOfDay(),
      dayOfWeek: new Date().getDay(),
      weather: this.mockWeather(),
      calendarBusy: false,
      upcomingEvents: [],
      userLocation: 'Home',
      occupancyCount: 2,
      isQuietHours: this.getTimeOfDay() === 'night',
      sensors: {
        indoorTemp: 70,
        indoorHumidity: 40,
        airQuality: 50,
        luminosity: 500,
      },
      preferences: {
        preferredTemp: 70,
        quietHoursStart: '22:00',
        quietHoursEnd: '06:00',
      },
    };
  }

  async getAmbientLight(): Promise<number> {
    // Mock ambient light sensor reading (lux)
    return 500;
  }
}
