const request = require('supertest');
let server;

describe('/api/v1/endpoint', () => {
   beforeEach(() => { server = require('../../server.js'); });
   afterEach(async () => { 
      server.close();
      await ModelName.remove({});
   });

   describe('GET /', () => {
      it('should return all model data', async () => {
         await ModelName.collection.insertMany([
               { name: 'some name' },
               { name: 'another name' }
         ]);

         const res = await request(server).get('/api/v1/endpoint');
         
         expect(res.status).toBe(200);
         expect(res.body.length).toBe(2);
         expect(res.body.some(model => model.name === 'some name')).toBeTruthy();
         expect(res.body.some(model => model.name === 'another name')).toBeTruthy();
      });
   });
    
   describe('GET /:id', () => {
      it('should return a single model data', async () => {
         const modelName = new ModelName({ name: 'some name' });
         await modelName.save;

         const res = await request(server).get(`/api/v1/endpoint/${modelName._id}`);
         
         expect(res.status).toBe(200);
         expect(res.body.length).toBe(1);
         expect(res.body).toHaveProperty('name', modelName.name);
      });

      it('should return 404 if a model data is not found', async () => {
         const res = await request(server).get('/api/v1/endpoint/1');
         expect(res.status).toBe(404);
      });
   });

   describe('POST /', () => {
      let token;
      let name;
   
      const exec = async () => {
         return await request(server)
         .post('/api/register')
         .set('x-auth-token', token)
         .send({ name });
      }
   
      beforeEach(() => {
         token = knex('users').generateAuthToken();
         name = 'genre1'
      });

      it('should return 401 if client is not logged in', async () => {
         token = '';
         const res = await exec();
         expect(res.status).toBe(401);
      });

      it('should return 400 if min value is <5 characters', async () => {
         const name = '1234';
         const res = await exec();

         expect(res.status).toBe(400);
      });

      it('should return 400 if max value is >50 characters', async () => {
         name = new Array(52).join('a');
         const res = await exec();
         expect(res.status).toBe(400);
      });

      it('should return if data is saved on the database', async () => {
         const res = await exec();
         const modelName = await ModelName.find({ name: 'some name' });
         expect(modelName).not.toBeNull();
      });


      it('should return the value is it is valid', async () => {
         const res = await exec();

         expect(res.body).toHaveProperty('_id');
         expect(res.body).toHaveProperty('name', 'some name');
      });
   });
});
