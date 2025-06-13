import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailchimpModule } from './mailchimp/mailchimp.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailchimpModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: parseInt(process.env.THROTTLE_TTL ?? '60'),
          limit: parseInt(process.env.THROTTLE_LIMIT ?? '10'),
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
