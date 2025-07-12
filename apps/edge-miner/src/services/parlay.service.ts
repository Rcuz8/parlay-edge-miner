import { Injectable } from '@nestjs/common';
import { OddsService } from './odds.service';
import { estimateWinProbability } from '@llm/client';
import { buildParlayCombos, Leg } from '@engine/index';
import { logger } from '@config/index';
import { OddsApiResponse } from '@odd/client';

@Injectable()
export class ParlayService {
  constructor(private readonly odds: OddsService) {}

  async findPositiveEdgeParlays(): Promise<ReturnType<typeof buildParlayCombos>> {
    const oddsData: OddsApiResponse = await this.odds.getMlbMoneylineOdds();

    const legs: Leg[] = [];
    for (const game of oddsData) {
      const bookmaker = game.bookmakers[0];
      if (!bookmaker) continue;
      const market = bookmaker.markets.find((m: { key: string; outcomes: { name: string; price: number }[] }) => m.key === 'h2h');
      if (!market) continue;
      for (const outcome of market.outcomes) {
        // American odds price
        const odds = outcome.price;
        try {
          const winProbability = await estimateWinProbability({
            homeTeam: game.home_team,
            awayTeam: game.away_team,
            homeTeamIsFavorite: outcome.name === game.home_team,
          });
          legs.push({ id: `${game.id}-${outcome.name}`, odds, winProbability });
        } catch (e) {
          logger.warn({ msg: 'LLM probability failed', error: e });
        }
      }
    }

    const parlays = buildParlayCombos(legs);
    const positiveEdge = parlays.filter((p) => p.edge > 0);
    return positiveEdge.slice(0, 5); // top 5 edges
  }
}