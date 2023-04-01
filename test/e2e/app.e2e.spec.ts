import { INestApplication } from '@nestjs/common';
import { applicationPromise } from './Helpers/setApp.function';
import request from 'supertest';
import { getBasicAuth } from './Helpers/basicAuth-header';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await applicationPromise;
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
    const basicHeader = getBasicAuth();
    const mainRout = '/api/sa/';
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
});
