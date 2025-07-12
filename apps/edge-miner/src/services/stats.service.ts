import { Injectable } from '@nestjs/common';
import { defaultMlbStatsClient } from '@stats/client';
import { ScheduleResponse } from '@stats/client';

@Injectable()
export class StatsService {
  getSchedule(date: string): Promise<ScheduleResponse> {
    return defaultMlbStatsClient.getSchedule(date);
  }
}