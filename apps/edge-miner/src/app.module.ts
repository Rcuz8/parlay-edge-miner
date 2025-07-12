import { Module } from '@nestjs/common';
import { OddsService } from './services/odds.service';
import { StatsService } from './services/stats.service';
import { ParlayService } from './services/parlay.service';
import { NotifierService } from './services/notifier.service';

@Module({
  providers: [OddsService, StatsService, ParlayService, NotifierService],
})
export class AppModule {}