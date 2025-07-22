import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /users/ returns an array of users with an OK status code', async () => {
    const req = await request(app.getHttpServer()).get('/users');
    console.log(req.body);
    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);
  });

  it('GET /users/:id returns an user with an OK status code', async () => {
    const req = await request(app.getHttpServer()).get(
      '/users/63f57e7d-2749-4d95-886c-e685dfc42b37',
    );
    console.log(req.body);
    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Object);
  });

  // it('GET /users/:id throws an exception if the user doesnt exists with a message Usuario no encontrado', async () => {
  //   const req = await request(app.getHttpServer()).get(
  //     '/users/63f57e7d-2749-4d95-886c-e685dfc42b17',
  //   );

  //   console.log(req.body);

  //   expect(req.status).toBe(404);
  //   expect(req.body.message).toBe('Usuario no encontrado');
  // });

  it('GET /users/:id throws an error if id is not a UUID', async () => {
    const req = await request(app.getHttpServer()).get('/users/not-a-uuid');

    console.log(req.body);

    expect(req.status).toBe(400);
    expect(req.body).toBeInstanceOf(Object);
  });

  it('Post /users/signup creates an user with an OK status code', async () => {
    const req = await request(app.getHttpServer()).post('/users/signup').send({
      email: 'test1@mail.com',
      password: '123456',
      name: 'Test',
    });
    expect(req.status).toBe(201);
    expect(req.body).toBeInstanceOf(Object);
  });
});
