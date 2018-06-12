const expect = require('expect');
const request = require('supertest');
var {ObjectID} = require('mongodb');

//local
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
    {   _id: new ObjectID(),
        text: 'First test todo'},
    { _id: new ObjectID(),
    text: 'Second test todo'}
];

// clean todos before each test
beforeEach((done) => {
    Todo.remove({}).then( () => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos' , () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';
        request(app)
        .post('/todos')
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

describe('GET /todos' , () => {
    it('should get all todos' , (done) =>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect( (res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});


describe('GET /todos/:id' , () => {
    it('should return todo doc' , (done) =>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect( (res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo not found' , (done) =>{
        var id = new ObjectID() ;
        request(app)
        .get(`/todos/${id.toHexString()}`)
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
        .expect(404)
        .expect( (res) => {
            expect(res.body.message).toBe('ID not valid');
        })
        .end(done);
    });
});


describe('DELETE /todos/:id' , () => {
    it('should delete todo doc by id' , (done) =>{
        var hexId = todos[0]._id.toHexString() ; 
        request(app)
        .delete(`/todos/${hexId}`)
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

    it('should return 404 if todo not found' , (done) =>{
        var id = new ObjectID() ;
        request(app)
        .delete(`/todos/${id.toHexString()}`)
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
        .expect(404)
        .expect( (res) => {
            expect(res.body.message).toBe('ID not valid');
        })
        .end(done);
    });
});