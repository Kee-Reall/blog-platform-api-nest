import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const blogPlaceHolder = {
    name: 'connot',
    description: 'someSayYouWillLoveMeOneDay',
    websiteUrl: 'string.kz',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });

  describe('/blogs', () => {
    it('shoud had correct status', async () => {
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
      const {
        body: {
          items: [blog, ...other],
        },
      } = await request(app.getHttpServer()).get('/api/blogs');

      expect(blog.name).toEqual(expect.any(String));
      expect(blog.createdAt).toEqual(expect.any(String));
      expect(blog.isMembership).toEqual(expect.any(Boolean));
    });

    it('should clear all', async () => {
      await request(app.getHttpServer())
        .get('api/testing/all-data')
        .expect(204);
    });

    // const arys = [
    //   {
    //     name: 'Timma',
    //     description: 'description',
    //     websiteUrl: 'https://someurl.com',
    //   },
    //   {
    //     name: 'Alla',
    //     description: 'description',
    //     websiteUrl: 'https://someurl.com',
    //   },
    //   {
    //     name: 'Allex',
    //     description: 'description',
    //     websiteUrl: 'https://someurl.com',
    //   },
    //   {
    //     name: 'Morgan',
    //     description: 'description',
    //     websiteUrl: 'https://someurl.com',
    //   },
    //   {
    //     name: 'Frank',
    //     description: 'description',
    //     websiteUrl: 'https://someurl.com',
    //   },
    //   {
    //     name: 'Emma',
    //     description: 'description',
    //     websiteUrl: 'https://someurl.com',
    //   },
    //   {
    //     name: 'David',
    //     description: 'description',
    //     websiteUrl: 'https://someurl.com',
    //   },
    //   {
    //     name: 'Ciara',
    //     description: 'description',
    //     websiteUrl: 'https://someurl.com',
    //   },
    //   {
    //     name: 'Belly',
    //     description: 'description',
    //     websiteUrl: 'https://someurl.com',
    //   },
    // ];
    // it('create some entity,then get them',async ()=> {
    //   arys.forEach(async (dto,i)=>{
    //     await
    //   })
    // })
  });
});
