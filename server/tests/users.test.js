const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {User} = require('./../models/user');
const {populateUsers ,users} = require('./seed/seed');

beforeEach(populateUsers);


//Test GET /users/me
describe('GET /users/me' , ()=>{
    it('should return user if autenticated' , (done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth' , users[0].tokens[0].token)
        .expect(200)
        .expect((res) =>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
            expect(res.body.name).toBe(users[0].name);
        })
        .end(done);
    });

    it('should return 401 if user not autenticated' , (done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) =>{
            expect(res.body).toEqual({message: 'Error'});
        })
        .end(done);
    });
});

//Test POST /users

describe('POST /users' , ()=>{
    it('should create a user' , (done)=>{
       var email = 'exam3333ple@gmail.com';
       var name = 'nadav123';
       var password = '123456' ;

       request(app)
       .post('/users')
       .send({email , password , name})
       .expect(200)
       .expect((res) =>{
           expect(res.headers['x-auth']).toBeDefined()  ; 
           expect(res.body._id).toBeDefined() ; 
           expect(res.body.email).toBe(email);
           expect(res.body.name).toBe(name);
       })
       .end((err)=>{
            if(err){
                return done(err);
            }
            User.findOne({email}).then((user)=>{
                expect(user).toBeDefined() ;
                expect(user.password).not.toBe(password) ;
                done();
            }).catch((e) => done(e));
       });
    });

    it('should return validation errors if request invalid' , (done)=>{
        var email = 'exam333.com';
        var name = 'nadav123';
        var password = '12345' ;
 
        request(app)
        .post('/users')
        .send({email , password , name})
        .expect(400)
        .end((err)=>{
             if(err){
                 return done(err);
             }
             User.findOne({email}).then((user)=>{
                 expect(user).toBe(null) ;
                 done();
             });
        });
    });

    it('should not create user if email/name in use' , (done)=>{
        request(app)
        .post('/users')
        .send({
            email :users[0].email,
            password :users[0].password ,
            name :users[0].name})
        .expect(400)
        .end((err)=>{
            if(err){
                return done(err);
            }
            User.findOne({email: users[0].email}).then((user)=>{
                expect(user.email).toBe(users[0].email) ;
                done();
            });
       });
    });

});

describe('POST /users/login' , ()=>{
    it('should login user and return auth token' , (done) =>{
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toBeDefined() ; 
        })
        .end((err ,res)=>{
            if(err){
                return done(err);
            }
            User.findById(users[1]._id).then( (user) =>{
                expect(user.tokens[0]).toHaveProperty('access' , 'auth');
                expect(user.tokens[0]).toHaveProperty('token' , res.headers['x-auth']);
                done();
            }).catch((e) => done(e));
        }); 
    });

    it('should reject invalid token' , (done) =>{
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password + '2'
        })
        .expect(400)
        .expect((res)=>{
            expect(res.headers['x-auth']).not.toBeDefined() ; 
        })
        .end((err ,res)=>{
            if(err){
                return done(err);
            }
            User.findById(users[1]._id).then( (user) =>{
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e) => done(e));
        }); 
    });
})


describe('DELETE /users/me/token' , ()=>{
    it('should remove auth token when logout' , (done) =>{
        request(app)
        .delete('/users/me/token')
        .set('x-auth' , users[0].tokens[0].token)
        .send()
        .expect(200)
        .end((err ,res)=>{
            if(err){
                return done(err);
            }
            User.findById(users[0]._id).then( (user) =>{
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e) => done(e));
        }); 
    });
})