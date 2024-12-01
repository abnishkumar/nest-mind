import { Injectable } from '@nestjs/common';

@Injectable()
export class IngestionService {
  private ongoingIngestions = [];

  startIngestion(data: any) {
    const ingestion = { id: Date.now(), data, status: 'started' };
    this.ongoingIngestions.push(ingestion);
    return ingestion;
  }

  getIngestions() {
    return this.ongoingIngestions;
  }
}
