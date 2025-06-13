import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { SubscribeDto } from './dto/subscribe/subscribe.dto';
import { MailchimpErrorResponse, MailchimpResponse } from './interfaces';

@Injectable()
export class MailchimpService {
  private readonly apiKey = process.env.MAILCHIMP_API_KEY;
  private readonly serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  private readonly audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  async subscribe(subscribeDto: SubscribeDto) {
    const url = `https://${this.serverPrefix}.api.mailchimp.com/3.0/lists/${this.audienceId}/members`;

    const data = {
      email_address: subscribeDto.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: subscribeDto.firstName ?? '',
        LNAME: subscribeDto.lastName ?? '',
      },
      tags: subscribeDto.tags || [],
      language: subscribeDto.language ?? '',
    };

    const authString = `anystring:${this.apiKey}`;
    const encodedAuth = Buffer.from(authString).toString('base64');
    const authorizationHeader = `Basic ${encodedAuth}`;

    try {
      const response: AxiosResponse<MailchimpResponse> = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorizationHeader,
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (err: unknown) {
      if (this.isAxiosError(err)) {
        const error = err as AxiosError<MailchimpErrorResponse>;
        return {
          success: false,
          error: {
            message: error.message,
            response: error.response?.data ?? undefined,
            statusCode: error.response?.status,
          },
        };
      }

      if (err instanceof Error) {
        return {
          success: false,
          error: {
            message: err.message,
          },
        };
      }

      return {
        success: false,
        error: {
          message: 'Unknown error occurred',
        },
      };
    }
  }

  private isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
  }
}
