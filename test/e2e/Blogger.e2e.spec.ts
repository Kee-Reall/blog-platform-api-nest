import request from 'supertest';
import { INestApplication } from '@nestjs/common';

export async function testPublic(app: INestApplication) {
  describe('sasa', () => {
    const blogPlaceHolder = {
      name: 'connot',
      description: 'someSayYouWillLoveMeOneDay',
      websiteUrl: 'string.kz',
    };
    it('/ (GET)', () => {
      return request(app.getHttpServer()).get('/').expect(404);
    });

    describe('/blogs', () => {
      it('should had correct status', async () => {
        request(app.getHttpServer()).get('/api/blogs').expect(200);
      });

      it('should return blogs with correct default pagination', async function () {
        const res = await request(app.getHttpServer()).get('/api/blogs');
        expect(res).toBeDefined();
        const {
          body: { pagesCount, totalCount, pageSize, page, items },
        } = res;
        for (const num of [page, pageSize, pagesCount, totalCount]) {
          expect(num).toEqual(expect.any(Number));
        }
        expect(page).toBe(1);
        expect(pageSize).toBe(10);
        expect(items).toEqual(expect.any(Array));
      });
      it('should be blogs array', async function () {
        const {
          body: { items: firstItem },
        } = await request(app.getHttpServer()).get('/api/blogs');
        if (firstItem.length === 0) {
          await request(app.getHttpServer())
            .post('/api/blogs')
            .send(blogPlaceHolder);
        }
        const res = await request(app.getHttpServer()).get('/api/blogs');
        const blog = res.body.items[0];

        expect(blog.name).toEqual(expect.any(String));
        expect(blog.createdAt).toEqual(expect.any(String));
        expect(blog.isMembership).toEqual(expect.any(Boolean));
      });
    });
  });
}
