import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ParlayService } from './services/parlay.service';
import { NotifierService } from './services/notifier.service';
import { Leg } from '@engine/index';

export default async function handler() {
  const appContext = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  const parlayService = appContext.get(ParlayService);
  const notifier = appContext.get(NotifierService);

  const parlays = await parlayService.findPositiveEdgeParlays();
  if (parlays.length > 0) {
    const best = parlays[0];
    const legDesc = best.legs.map((l: Leg) => l.id).join(' | ');
    const body = `Parlay Edge: ${(best.edge * 100).toFixed(1)}%\n${legDesc}`;
    await notifier.sendSms(body);
  }

  await appContext.close();
  return { ok: true };
}