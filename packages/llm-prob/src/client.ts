import OpenAI from 'openai';
import { z } from 'zod';
import { getConfig, logger } from '@config/index';

const { OPENAI_API_KEY } = getConfig();

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const responseSchema = z.object({ probability: z.number().gte(0).lte(1) });

export interface ProbabilityInput {
  homeTeam: string;
  awayTeam: string;
  homeTeamIsFavorite: boolean;
}

export const estimateWinProbability = async (
  input: ProbabilityInput,
): Promise<number> => {
  const prompt = `Provide an unbiased estimated probability that the ${input.homeTeam} will beat the ${input.awayTeam} in tonight's MLB game. Respond with a JSON object: {"probability": <number between 0 and 1>}.`;

  logger.debug({ msg: 'Requesting win probability', input });

  const chat = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    temperature: 0.4,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = chat.choices[0].message.content ?? '{}';
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    logger.warn('Failed to parse LLM response, defaulting to 0.5');
    return 0.5;
  }

  const { probability } = responseSchema.parse(parsed);
  return probability;
};