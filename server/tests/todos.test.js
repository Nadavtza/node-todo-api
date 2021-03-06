const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const { todos, populateToods,populateUsers ,users} = require('./seed/seed');

// init todos before each test
beforeEach(populateUsers);
beforeEach(populateToods);

//Test POST
describe('POST /todos' , () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';
        request(app)
        .post('/todos')
        .set('x-auth' , users[0].tokens[0].token)
        .send({text})
        .expect(200)
        .expect((res) => {
                expect(res.body.doc.text).toBe(text);
            }).end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a todo with invalid data', (done) => {
        request(app)
        .post('/todos')
        .set('x-auth' , users[0].tokens[0].token)
        .send({})
        .expect(400)
        .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a todo with invalid minlength', (done) => {
        var text = '';

        request(app)
        .post('/todos')
        .set('x-auth' , users[0].tokens[0].token)
        .send({text})
        .expect(400)
        .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

//Test GET
describe('GET /todos' , () => {
    it('should get all todos' , (done) =>{
        request(app)
        .get('/todos')
        .set('x-auth' , users[0].tokens[0].token)
        .expect(200)
        .expect( (res) => {
            expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });
});


describe('GET /todos/:id' , () => {
    it('should return todo doc' , (done) =>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth' , users[0].tokens[0].token)
        .expect(200)
        .expect( (res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should not return todo doc created by other user' , (done) =>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth' , users[1].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 if todo not found' , (done) =>{
        var id = new ObjectID() ;
        request(app)
        .get(`/todos/${id.toHexString()}`)
        .set('x-auth' , users[0].tokens[0].token)
        .expect(404)
        .expect( (res) => {
            expect(res.body.message).toBe('ID not found');
        })
        .end(done);
    });

    it('should return 404 if ID not valid' , (done) =>{
        var id = '123' ;
        request(app)
        .get(`/todos/${id}`)
        .set('x-auth' , users[0].tokens[0].token)
        .expect(404)
        .expect( (res) => {
            expect(res.body.message).toBe('ID not valid');
        })
        .end(done);
    });
});

//Test DELETE
describe('DELETE /todos/:id' , () => {
    it('should delete todo doc by id' , (done) =>{
        var hexId = todos[0]._id.toHexString() ; 
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth' , users[0].tokens[0].token)
        .expect(200)
        .expect( (res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.findById(hexId).then((todo) => {
                expect(todo).toBeFalsy();
                done();
            }).catch((e) => done(e));
        });
    });

    it('should not delete todo doc created by other user' , (done) =>{
        var hexId = todos[0]._id.toHexString() ; 
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth' , users[1].tokens[0].token)
        .expect(404)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.findById(hexId).then((todo) => {
                expect(todo).toBeDefined();
                done();
            }).catch((e) => done(e));
        });
    });

    it('should return 404 if todo not found' , (done) =>{
        var id = new ObjectID() ;
        request(app)
        .delete(`/todos/${id.toHexString()}`)
        .set('x-auth' , users[0].tokens[0].token)
        .expect(404)
        .expect( (res) => {
            expect(res.body.message).toBe('ID not found');
        })
        .end(done);
    });

    it('should return 404 if ID not valid' , (done) =>{
        var id = '123' ;
        request(app)
        .delete(`/todos/${id}`)
        .set('x-auth' , users[0].tokens[0].token)
        .expect(404)
        .expect( (res) => {
            expect(res.body.message).toBe('ID not valid');
        })
        .end(done);
    });
});

//Test PATCH

describe('PATCH /todos/:id' , () => {

    it('should update todo' , (done) =>{
        var hexId = todos[0]._id.toHexString() ; 
        var text = 'first todo updated' ; 
        var completed = true ;
        
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth' , users[0].tokens[0].token)
        .send({text , completed })
        .expect(200)
        .expect( (res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(completed);
            expect((typeof res.body.todo.completedAt)).toBe("number");
        })
        .end((err,res)=>{ // check in DB
            if(err){
                return done(err);
            }
            Todo.findById(hexId).then((todo) => {
                expect(todo.text).toBe(text);
                expect(todo.completed).toBe(completed);
                done();
            }).catch((e) => done(e));
        });
    });

    it('should not update todo created by other user' , (done) =>{
        var hexId = todos[0]._id.toHexString() ; 
        var text = 'first todo updated' ; 
        var completed = true ;
        
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth' , users[1].tokens[0].token)
        .send({text , completed })
        .expect(404)
        .end((err,res)=>{ // check in DB
            if(err){
                return done(err);
            }
            Todo.findById(hexId).then((todo) => {
                expect(todo.text).toBe(todos[0].text);
                expect(todo.completed).toBeFalsy();
                done();
            }).catch((e) => done(e));
        });
    });

    it('should clear completedAt when todo not completed' , (done) =>{
        var hexId = todos[1]._id.toHexString() ; 
        var completed = todos[1].completed ;
        var completedAt = 55 ;
        
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth' , users[1].tokens[0].token)
        .send({completed: false  , completedAt })
        .expect(200)
        .expect( (res) => {
            expect(res.body.todo.completedAt).toBe(null);
            expect(res.body.todo.completed).toBe(false);
        })
        .end((err,res)=>{ // check in DB
            if(err){
                return done(err);
            }
            Todo.findById(hexId).then((todo) => {
                expect(todo.completedAt).toBe(null);
                expect(todo.completed).toBe(false);
                done();
            }).catch((e) => done(e));
        });
    });


    it('should return 404 if todo not found' , (done) =>{
        var id = new ObjectID() ;
        request(app)
        .delete(`/todos/${id.toHexString()}`)
        .set('x-auth' , users[0].tokens[0].token)
        .expect(404)
        .expect( (res) => {
            expect(res.body.message).toBe('ID not found');
        })
        .end(done);
    });

    it('should return 404 if ID not valid' , (done) =>{
        var id = '123' ;
        request(app)
        .delete(`/todos/${id}`)
         .set('x-auth' , users[0].tokens[0].token)
        .expect(404)
        .expect( (res) => {
            expect(res.body.message).toBe('ID not valid');
        })
        .end(done);
    });
});