class RootValue{
    constructor(db){
        this.db = db;
    }
    user(param){
        return new Promise((resolve, reject) => {
            this.db.collection('user').findOne(param, function(err, res){
                if(res != null){
                    res.id = res._id
                    resolve(res)
                    return
                }
                resolve()
            })
        })
    }
    checkUserExist(param){
        return new Promise((resolve, reject) => {
            this.db.collection('user').findOne(param, function(err, res){
                if(res != null){
                    resolve(true)
                    return
                }
                resolve(false)
            })
        })
    }
    checkUserPass(param){
        return new Promise((resolve, reject)  => {
            this.db.collection('user').findOne(param, function(err, res){
                if(res != null){
                    resolve(true)
                    return
                }
                resolve(false)
            })
        })
    }
    addUser({input}){
        return new Promise((resolve, reject) => {
            this.db.collection('user').insertOne(input, function(err, res) {
                if(err){
                    resolve(false);
                    return;
                }
                resolve(true);
            })
        })
    }
    updateUser({name, input}){
        return new Promise((resolve, reject) => {
            this.db.collection('user').updateOne({name: name}, {$set: input}, function(err, res){
                if(err){
                    resolve(false)
                    return
                }
                resolve(true)
            })
        })
    }
}

export default RootValue;
