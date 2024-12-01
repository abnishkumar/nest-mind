import { Controller, Post, Get, Body } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('start')
  startIngestion(@Body() data: any) {
    return this.ingestionService.startIngestion(data);
  }

  @Get()
  getIngestions() {
    return this.ingestionService.getIngestions();
  }
}
