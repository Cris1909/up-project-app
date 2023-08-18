import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  environment: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.environment = configService.get<string>('environment');
  }

  getHello() {
    return {
      message: 'Welcome to my api',
      environment: this.environment,
    };
  }
}
