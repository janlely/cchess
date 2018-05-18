import express from 'express';
import Mongo from 'mongodb';
import graphqlHTTP from 'express-graphql';
import {buildSchema} from 'graphql';
import fs from 'fs';
import path from 'path';
import RootValue from './rootvalue.js';
import session from 'express-session';

let gqlFileName = path.resolve(__dirname, './graphql.gql');
console.log(gqlFileName);
let content = String(fs.readFileSync(gqlFileName));
let schema = buildSchema(content);


let app = express();
let url = "mongodb://localhost:27017";
let dataBaseName = 'cchess';
Mongo.connect(url, function(err, db){
    if(err) throw err;
    let root = new RootValue(db.db(dataBaseName));
    app.use(session({
        saveUninitialized: true,
        secret: 'cchess',
        resave: true,
        cookie:{
            maxAge: 300 * 1000
        }
    }), (req, res, next) => {
        console.log(req.path)
        if(['/login', '/logout', '/signup'].includes(req.path)){
            next();
        }else {
            if(!req.session.loginUser){
                res.status(403);
                res.send();
            }else{
                next()
            }
        }
    });
    app.get('/signup', async (req, res) => {
        let username = req.query.username;
        let password = req.query.password;
        let result = await db.db(dataBaseName).collection('user').findOne({name:username});
        if(result && result.name){
            res.send({error:"user exist"})
            return
        }
        let result2 = await db.db(dataBaseName).collection('user').insertOne({name:username, password: password});
        if(result2 && result2.insertedCount == 1){
            res.send({ok:"ok"});
        }else{
            res.send({error:"sign up failed"})
        }
    })
    app.get('/login', async (req, res) => {
        let username = req.query.username;
        let password = req.query.password;
        let result = await db.db(dataBaseName).collection('user').findOne({name:username, password: password});
        //console.log(result)
        if(result && result.name){
            req.session.loginUser = result.name;
            res.send({ok:"ok"});
        }else{
            res.send({error:'wrong username or password'})
        }
    });
    app.use('/logout', (req, res) => {
        req.session.destroy(err => {
            if(err){
                res.send('logout faild');
                return
            }
            res.clearCookie('cchess');
            res.send('ok')
        })
    });
    app.use('/graphql', graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    }));
    app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
});


