import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';
import { logger } from '@config/index';

const BASE_URL = 'https://statsapi.mlb.com/api/v1';

const scheduleSchema = z.object({
  dates: z.array(
    z.object({
      date: z.string(),
      games: z.array(
        z.object({
          gamePk: z.number(),
          teams: z.object({
            away: z.object({ team: z.object({ id: z.number(), name: z.string() }) }),
            home: z.object({ team: z.object({ id: z.number(), name: z.string() }) }),
          }),
        }),
      ),
    }),
  ),
});

export type ScheduleResponse = z.infer<typeof scheduleSchema>;

export class MlbStatsClient {
  constructor(private readonly http: AxiosInstance = axios.create({ baseURL: BASE_URL })) {}

  async getSchedule(date: string): Promise<ScheduleResponse> {
    logger.debug({ msg: 'Fetching MLB schedule', date });
    const { data } = await this.http.get(`/schedule`, { params: { date } });
    return scheduleSchema.parse(data);
  }
}

export const defaultMlbStatsClient = new MlbStatsClient();