const request = require('supertest');
const token = require('./../../src/Controllers/authController');
const db = require("./../../dbConfig")
let server;

beforeAll(async () => {
    // run the migrations and do any other setup here
    await db.migrate.latest()
})
  
test("select users", async () => {
    let users = await db.from("users").select("name")
    expect(users.length).toEqual(0)
  })

describe('/api/users', () => {
    beforeAll(async () => { 
        server = require('../../server.js');
        await db.migrate.latest()
    });
    
    afterEach(async () => {
        let users = await db.from("users").select("name");
        users.remove();
        server.close();
    });

    const exec = async () => {
        return await request(server)
        .post('/api/users/register')
        .set('x-auth-token', token)
        .send({ name: 'some name' });
    }

    beforeEach(() => {
        token = token.signToken;
    });

    it('should return 401 if token is not provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = 'a';
        
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
});
