import { Injectable } from '@nestjs/common';
import { defaultClient as oddsApi } from '@odd/client';
import { OddsApiResponse } from '@odd/client';

@Injectable()
export class OddsService {
  getMlbMoneylineOdds(): Promise<OddsApiResponse> {
    return oddsApi.getMoneylineOdds('baseball_mlb');
  }
}