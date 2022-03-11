const request = require('supertest');
let server;

describe('/api/users', () => {
   beforeEach(() => { server = require('../../server.js'); });
   afterEach(async () => { server.close(); });
   describe('POST /', () => {
      let token;
      let name;
   
      const exec = async () => {
         return await request(server)
         .post('/register')
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
