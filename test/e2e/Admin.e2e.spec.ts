import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export function SuperAdmin(app: INestApplication, basicHeader: string) {
  return async function () {
    const res = await request(app.getHttpServer())
      .get('/api/sa/blogs')
      .set('Authorization', basicHeader);
    expect(res).toBeDefined();
    expect(res.statusCode).toBe(200);
    expect(res.body.items).toEqual(expect.any(Array));
    expect(res.body.items.length).toBe(0);
  };
}
