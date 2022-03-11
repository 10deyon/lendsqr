const db = require("./../../dbConfig")
let server;

beforeAll(async () => {
   server = require('../../server.js');
   
   // run the migrations and do any other setup here
   await db.migrate.latest()
 })
 afterEach(async () => { server.close(); });
 
 test("select users", async () => {
   let users = await db.from("users").select("name")
   expect(users.length).toEqual(0)
 })