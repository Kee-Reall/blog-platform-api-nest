import { INestApplication } from '@nestjs/common';
import { applicationPromise } from './Helpers/setApp.function';
import request from 'supertest';
import { getBasicAuth } from './Helpers/basicAuth-header';
import * as process from 'process';
import { appConfig } from '../../src/Infrastructure';
import mongoose, { Model } from 'mongoose';
import {
  Post,
  Blog,
  BlogSchema,
  CommentSchema,
  LikeSchema,
  PostSchema,
  SessionSchema,
  UserSchema,
  User,
  Comment,
  Session,
  Like,
} from '../../src/Model';
import { create5users } from './Helpers/create5users';
import { response } from 'express';

describe('App (e2e)', () => {
  let app: INestApplication;
  mongoose.connect(appConfig.mongoUriForTest);
  const db = mongoose.connection;
  const modelBlog = db.model(Blog.name, BlogSchema);
  const modelPost = db.model(Post.name, PostSchema);
  const modelUser = db.model(User.name, UserSchema);
  const modelComment = db.model(Comment.name, CommentSchema);
  const modelSession = db.model(Session.name, SessionSchema);
  const modelLike = db.model(Like.name, LikeSchema);
  const allModels: Array<Model<any>> = [
    modelPost,
    modelSession,
    modelBlog,
    modelComment,
    modelLike,
    modelUser,
  ];

  beforeAll(async () => {
    app = await applicationPromise;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('test envs', () => {
    it('TEST MONGO URI', () => {
      expect(process.env.TEST_MONGO_URI).toBeDefined();
    });
  });

  describe('never change ', () => {
    describe('always same Status', () => {
      it('/ (GET) 404', () => {
        return request(app.getHttpServer()).get('/api/').expect(404);
      });

      it('/testing/always-ok (GET) 200', () => {
        return request(app.getHttpServer())
          .get('/api/testing/always-ok')
          .expect(200);
      });
    });

    describe('Always same pagination type', () => {
      it.each(['blogs', 'posts'])(
        '/api/%s (GET) always correct pagination body',
        async (value) => {
          const res = await request(app.getHttpServer()).get(`/api/${value}`);
          expect(res.statusCode).toBe(200);
          const {
            body: { pagesCount, totalCount, pageSize, page, items },
          } = res;

          for (const num of [page, pageSize, pagesCount, totalCount]) {
            expect(num).toEqual(expect.any(Number));
          }
          expect(page).toBe(1);
          expect(pageSize).toBe(10);
          expect(items).toEqual(expect.any(Array));
        },
      );
    });
  });
  describe('Admin opportunity', () => {
    beforeAll(async () => {
      await request(app.getHttpServer()).delete('/api/testing/all-data');
    });

    it('test db', async () => {
      const allCounts = await Promise.all(
        allModels.map(async (model) => await model.countDocuments({})),
      );
      allCounts.forEach((num) => {
        expect(num).toBe(0);
      });
    });

    const basicHeader = getBasicAuth();
    const mainRout = '/api/sa/';
    describe('401', () => {
      it.each([
        'blogs',
        'blogs/randomId/bind-with-user/randomId',
        'users',
        'users/randomId',
      ])('should response with 401 on endpoint /api/sa/%s', (endpoint) => {
        request(app.getHttpServer())
          .get(mainRout + endpoint)
          .expect(401);
      });
    });
    describe('get users', () => {
      it('get Users, users now do not exist', async () => {
        const res = await request(app.getHttpServer())
          .get(mainRout + 'users')
          .set('Authorization', basicHeader);
        expect(res).toBeDefined();
        expect(res.statusCode).toBe(200);
        expect(res.body.items).toEqual(expect.any(Array));
        expect(res.body.items.length).toBe(0);
      });
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

      const created = [];

      describe('create 5 users', () => {
        it.each(sendData)('create User', async (usInput) => {
          const date = new Date();
          const res = await request(app.getHttpServer())
            .post(mainRout + 'users')
            .set('Authorization', basicHeader)
            .send(usInput);
          expect(res.statusCode).toBe(201);
          expect(res.body).toBeDefined();
          const { id, login, banInfo, email, createdAt } = res.body;
          expect(id).toBeDefined();
          expect(login).toBeDefined();
          expect(login).toBe(usInput.login);
          expect(email).toBeDefined();
          expect(email).toBe(usInput.email);
          expect(createdAt).toBeDefined();
          expect(new Date(createdAt).getTime()).toBeCloseTo(
            date.getTime(),
            -10,
          );
          expect(banInfo).toBeDefined();
          const { isBanned, banDate, banReason } = banInfo;
          expect(isBanned).toBeDefined();
          expect(isBanned).toBe(false);
          expect(banDate).toBeDefined();
          expect(banDate).toBeNull();
          expect(banReason).toBeDefined();
          expect(banReason).toBeNull();
          created.unshift(res.body);
        });
        it.each(sendData)(
          'users Already exists should be 400',
          async (usInput) => {
            const res = await request(app.getHttpServer())
              .post(mainRout + 'users')
              .set('Authorization', basicHeader)
              .send(usInput);
            expect(res.statusCode).toBe(400);
            expect(res.body.errorsMessages).toBeDefined();
            expect(res.body.errorsMessages[0]).toBeDefined();
            expect(res.body.errorsMessages[1]).toBeDefined();
            expect(res.body.errorsMessages[0]['field']).toBe('login');
            expect(res.body.errorsMessages[1]['field']).toBe('email');
            expect(res.body.errorsMessages[0]['message']).toEqual(
              expect.any(String),
            );
            expect(res.body.errorsMessages[1]['message']).toEqual(
              expect.any(String),
            );
          },
        );
      });
      it('5 users in base', async () => {
        expect(await modelUser.countDocuments({})).toBe(5);
      });
      it('5 users in response', async () => {
        const res = await request(app.getHttpServer())
          .get(mainRout + 'users')
          .set('Authorization', basicHeader);
        expect(res).toBeDefined();
        expect(res.statusCode).toBe(200);
        expect(res.body.items).toEqual(expect.any(Array));
        expect(res.body.items.length).toBe(5);
        expect(JSON.stringify(res.body.items)).toBe(JSON.stringify(created));
      });
      it('try to login', async () => {
        const res = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            loginOrEmail: sendData[0].login,
            password: sendData[0].password,
          });
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.accessToken).toEqual(expect.any(String));
      });
    });
  });
});
