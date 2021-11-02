import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { DateService } from '../date/date.service';

@Injectable()
export class LogService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly dateService: DateService,
  ) {}

  async createApiCallLog(
    body: any,
    header: any,
    domain: string,
    method: string,
    userId?: string,
  ) {
    const curDate = await this.dateService.getCurrentDate();
    return await this.esService.index({
      index: 'apis_call',
      type: '_doc',
      body: {
        date: curDate,
        req_body: body,
        req_header: header,
        http_method: method,
        call_domain: domain,
        user_id: userId,
      },
    });
  }

  async createErrorLog(
    body: any,
    header: any,
    domain: string,
    method: string,
    errContent: string,
    userId?: string,
  ) {
    const curDate = await this.dateService.getCurrentDate();
    return await this.esService.index({
      index: 'error',
      type: '_doc',
      body: {
        date: curDate,
        req_body: body,
        req_header: header,
        http_method: method,
        call_domain: domain,
        user_id: userId,
        err_content: errContent,
      },
    });
  }

  async createAccessLog(email: string) {
    const curDate = await this.dateService.getCurrentDate();
    return await this.esService.index({
      index: 'access',
      type: '_doc',
      body: {
        date: curDate,
        user_id: email,
      },
    });
  }

  async createBookLog(
    userId: string,
    book: any,
    startDate: Date,
    endDate: Date,
  ) {
    const curDate = await this.dateService.getCurrentDate();
    return await this.esService.index({
      index: 'book_log',
      type: '_doc',
      body: {
        date: curDate,
        user_id: userId,
        book: book,
        startDate,
        endDate,
      },
    });
  }

  async createSeriesLog(
    userId: string,
    series: any,
    startDate: Date,
    endDate: Date,
  ) {
    const curDate = await this.dateService.getCurrentDate();
    return await this.esService.index({
      index: 'series_log',
      type: '_doc',
      body: {
        date: curDate,
        user_id: userId,
        series: series,
        startDate,
        endDate,
      },
    });
  }
}
