import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export async function create5users(
  app: INestApplication,
  mainRout: string,
  authHeader: string,
) {
  const sendData = [
    {
      login: 'adam',
      password: 'justAnotherOne',
      email: 'adam@mail.com',
    },
    {
      login: 'boris',
      password: 'justAnotherOne',
      email: 'bdam@mail.com',
    },
    {
      login: 'kyle',
      password: 'justAnotherOne',
      email: 'kdam@mail.com',
    },
    {
      login: 'jordan',
      password: 'justAnotherOne',
      email: 'jdam@mail.com',
    },
    {
      login: 'journey',
      password: 'justAnotherOne',
      email: 'jumasinba@mail.com',
    },
  ];
  return await Promise.all(
    sendData.map((userInput) => {
      return request(app.getHttpServer())
        .post(mainRout + 'users')
        .set('Authorization', authHeader)
        .send(userInput);
    }),
  );
}
