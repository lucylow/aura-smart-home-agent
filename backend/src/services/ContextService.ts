import logger from '../utils/logger';

export interface HomeContext {
  timeOfDay: string;
  hour: number;
  isWeekend: boolean;
  isQuietHours: boolean;
  weatherSummary: string;
  temperature: number;
  isRaining: boolean;
  isCloudy: boolean;
  occupancyStatus: string;
  userId?: string;
}

class ContextService {
  private weatherApiKey?: string;
  private mockMode: boolean;

  constructor() {
    this.weatherApiKey = process.env.WEATHER_API_KEY;
    this.mockMode = process.env.MODE === 'demo' || !this.weatherApiKey;
  }

  async getContext(userId?: string): Promise<HomeContext> {
    logger.debug(`[ContextService] Getting context for user: ${userId || 'default'}`);

    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    // Time-based context
    let timeOfDay: string;
    if (hour >= 5 && hour < 12) {
      timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 17) {
      timeOfDay = 'afternoon';
    } else if (hour >= 17 && hour < 21) {
      timeOfDay = 'evening';
    } else {
      timeOfDay = 'night';
    }

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isQuietHours = hour >= 22 || hour < 7;

    // Weather context (mock or real)
    let weatherSummary: string;
    let temperature: number;
    let isRaining: boolean;
    let isCloudy: boolean;

    if (this.mockMode) {
      // Generate semi-realistic mock weather
      const weatherConditions = ['clear', 'cloudy', 'rainy', 'partly_cloudy'];
      const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      
      temperature = 15 + Math.floor(Math.random() * 15); // 15-30°C
      isRaining = condition === 'rainy';
      isCloudy = condition === 'cloudy' || condition === 'partly_cloudy';
      weatherSummary = condition.replace('_', ' ');

      logger.debug(`[ContextService] Using mock weather: ${weatherSummary}, ${temperature}°C`);
    } else {
      // In production, fetch real weather data
      const weather = await this.fetchWeather();
      weatherSummary = weather.summary;
      temperature = weather.temperature;
      isRaining = weather.isRaining;
      isCloudy = weather.isCloudy;
    }

    // Occupancy status (could be integrated with presence sensors)
    const occupancyStatus = this.determineOccupancy(hour, isWeekend);

    const context: HomeContext = {
      timeOfDay,
      hour,
      isWeekend,
      isQuietHours,
      weatherSummary,
      temperature,
      isRaining,
      isCloudy,
      occupancyStatus,
      userId
    };

    logger.info(`[ContextService] Context: ${timeOfDay}, ${temperature}°C, ${weatherSummary}, occupancy: ${occupancyStatus}`);

    return context;
  }

  shouldPreHeatHome(context: HomeContext): boolean {
    // Pre-heat if it's cold outside and morning time
    return context.temperature < 10 && context.timeOfDay === 'morning';
  }

  shouldCloseWindows(context: HomeContext): boolean {
    // Close windows if raining or very cold
    return context.isRaining || context.temperature < 5;
  }

  isQuietHoursActive(context: HomeContext): boolean {
    return context.isQuietHours;
  }

  private determineOccupancy(hour: number, isWeekend: boolean): string {
    // Simple heuristic for occupancy
    if (hour >= 9 && hour < 17 && !isWeekend) {
      return 'away_work'; // Likely at work on weekdays
    } else if (hour >= 23 || hour < 6) {
      return 'sleeping';
    } else {
      return 'home';
    }
  }

  private async fetchWeather(): Promise<{
    summary: string;
    temperature: number;
    isRaining: boolean;
    isCloudy: boolean;
  }> {
    // Placeholder for real weather API integration
    // Could use OpenWeatherMap, WeatherAPI, etc.
    logger.info(`[ContextService] Would fetch weather from API`);

    // For now, return mock data
    return {
      summary: 'partly cloudy',
      temperature: 20,
      isRaining: false,
      isCloudy: true
    };
  }
}

export const contextService = new ContextService();
