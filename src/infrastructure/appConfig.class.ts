import * as process from 'process';
import { CookieOptions } from 'express';

type EnvironmentsTypes = 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';

class EnvironmentSettings {
  constructor(private environment: string) {
    const available = ['DEVELOPMENT', 'STAGING', 'PRODUCTION'];
    if (!available.includes(environment)) {
      throw new Error('INCORRECT configuration');
    }
  }

  get env(): string {
    return this.environment;
  }

  isProduction(): boolean {
    return this.environment === 'PRODUCTION';
  }

  isStaging(): boolean {
    return this.environment === 'STAGING';
  }

  isDevelopment(): boolean {
    return this.environment === 'DEVELOPMENT';
  }
}

class AppConfig {
  private environment: any;
  constructor(public mod: EnvironmentSettings) {
    this.environment = process.env;
  }

  get mongoUri() {
    return this.environment.MONGO_URI;
  }

  get mailOptions() {
    return {
      transport: `smtps://${this.environment.MAIL_NAME}:${this.environment.MAIL_PASSWORD}@smtp.${this.environment.MAIL_DOMAIN}`,
      defaults: {
        from: `"Blog-platform-api" <${this.environment.MAIL_NAME}>`,
      },
    };
  }

  get corsOptions() {
    return {
      credentials: true,
      origin: this.environment.FRONTEND_DOMAIN ?? 'http//localhost:3000/',
    };
  }

  get port() {
    return this.environment.PORT ?? 3000;
  }

  get throttlerOptions() {
    return {
      limit: +this.environment.IP_RESTRICTION_LIMIT || 5,
      ttl: +this.environment.IP_RESTRICTION_TTL || 10,
    };
  }

  get jwtLifeTimePair(): [number, number] {
    return [
      this.environment.JWT_ACCESS_LIFETIME,
      this.environment.JWT_REFRESH_LIFETIME,
    ];
  }

  get jwtSecret() {
    return this.environment.JWT_SECRET;
  }

  get cookiesOptions(): CookieOptions {
    return {
      domain: this.environment.DOMAIN,
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    };
  }

  get basicAuthPair(): [string, string] {
    return [this.environment.LOGIN, this.environment.PASSWORD];
  }
}

export const appConfig = new AppConfig(
  new EnvironmentSettings(process.env.MOD ?? 'DEVELOPMENT'),
);
