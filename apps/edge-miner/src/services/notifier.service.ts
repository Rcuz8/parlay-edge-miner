import { Injectable } from '@nestjs/common';
import { getConfig, logger } from '@config/index';
import Twilio from 'twilio';

const cfg = getConfig();

@Injectable()
export class NotifierService {
  private readonly client = Twilio(cfg.TWILIO_SID, cfg.TWILIO_TOKEN);

  async sendSms(body: string): Promise<void> {
    logger.info({ msg: 'Sending SMS', body });
    await this.client.messages.create({
      from: cfg.TWILIO_FROM,
      to: cfg.TWILIO_TO,
      body,
    });
  }
}