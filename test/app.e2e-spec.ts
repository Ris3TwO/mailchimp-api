import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { SubscribeDto } from './../src/mailchimp/dto/subscribe/subscribe.dto';
import { Server } from 'http';

describe('MailchimpController (e2e)', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    server = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /v1/mailchimp should return health check message', async () => {
    const res = await request(server).get('/v1/mailchimp').expect(200);

    expect(res.body).toEqual({
      message: 'The backend is working as expected!',
    });
  });

  it('POST /v1/mailchimp/subscribe should return success', async () => {
    const payload: SubscribeDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      tags: ['developer', 'newsletter'],
      language: 'en',
    };

    const res = await request(server).post('/v1/mailchimp/subscribe').send(payload).expect(201);

    expect(res.body).toBeDefined();
    expect(typeof res.body).toBe('object');
  });

  it('POST /v1/mailchimp/subscribe with invalid email should fail', async () => {
    const invalidPayload = {
      email: 'invalid-email',
    };

    await request(server).post('/v1/mailchimp/subscribe').send(invalidPayload).expect(400);
  });
});
