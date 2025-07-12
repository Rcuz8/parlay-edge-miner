import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';
import { getConfig, logger } from '@config/index';

const { ODDS_API_KEY } = getConfig();

const BASE_URL = 'https://api.the-odds-api.com/v4';

const responseSchema = z.array(
  z.object({
    id: z.string(),
    sport_key: z.string(),
    sport_title: z.string(),
    commence_time: z.string(),
    home_team: z.string(),
    away_team: z.string(),
    bookmakers: z.array(
      z.object({
        key: z.string(),
        title: z.string(),
        markets: z.array(
          z.object({
            key: z.string(),
            outcomes: z.array(
              z.object({
                name: z.string(),
                price: z.number(),
              }),
            ),
          }),
        ),
      }),
    ),
  }),
);

export type OddsApiResponse = z.infer<typeof responseSchema>;

export class OddsClient {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance = axios.create({ baseURL: BASE_URL })) {
    this.http = http;
  }

  async getMoneylineOdds(
    sport: string,
    regions = 'us',
    markets = 'h2h',
  ): Promise<OddsApiResponse> {
    const url = `/sports/${sport}/odds`;
    const params = {
      apiKey: ODDS_API_KEY,
      regions,
      markets,
    };

    logger.debug({ msg: 'Fetching odds', sport, regions, markets });

    const { data } = await this.http.get(url, { params });
    return responseSchema.parse(data);
  }
}

export const defaultClient = new OddsClient();