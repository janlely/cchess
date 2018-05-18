import Mongo from 'mongodb';
 
//function findSync(dbo, clt, obj){
    //return new Promise((resovle, reject) => {
        //dbo.collection(clt).find(obj, function(err, res){
            //if(err){
                //reject(err)
            //}else{
                //resovle(res)
            //}
        //})
    //})
//}

class MongoClient {
    constructor(url, dbName) {
        this.url = url;
        this.dbName = dbName;
    }
    setClient(db){
        this.client = db;
    }
    init(func) {
        this.connection = Mongo.connect(this.url, function(err, db) {
            func(err, db);
        });
    }
    async createCollection(cln){
        let dbo = this.client.db(this.dbName);
        return await dbo.createCollection(cln);
    }
    insertOne(cln, obj){
        let dbo = this.client.db(this.dbName);
        dbo.collection(cln).insertOne(obj, function(err, res){
            if (err) throw err;
            console.log("文档插入成功");
        })
    }
    find(clt, obj, func){
        let dbo = this.client.db(this.dbName);
        console.log(obj)
        dbo.collection(clt).find(obj).toArray(func);
    }
}

export default MongoClient;
