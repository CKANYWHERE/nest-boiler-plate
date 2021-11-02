import { Global, Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { LogService } from './log.service';
import { DateService } from '../date/date.service';

@Global()
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: `http://${process.env.ELASTIC_SEARCH_HOST}`,
      }),
    }),
  ],
  providers: [LogService, DateService],
  exports: [LogService, DateService],
})
export class LogModule {}
