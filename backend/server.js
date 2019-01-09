import express from 'express';
import mongodb from 'mongodb';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
const dbUrl = "mongodb://127.0.0.0.1/";

const validate = (data) => {
    let errors = {};
    if(data.title === '') errors.title = "Cant't be empaty";
    if(data.cover === '') errors.conver = "Cant't be empaty";

    const isValid = Object.keys(errors).length === 0
    return {errors, isValid};
}

mongodb.MongoClient.connect(dbUrl, {useNewUrlParser: true} ,(error, client) => {
    if(error) throw err;

    const collection = client.db('curd').collection('games');

    app.get('/api/games', (req, res) => {
      //  setTimeout(()=>{
            collection.find({}).toArray((error, games) => {
                res.json({games});
            })
       // },2000)
    })

    app.get('/api/games/:_id', (req, res) => {
        collection.findOne({_id: new mongodb.ObjectId(req.params._id)}, (error, game) => {
            res.json({game});
        })
    })

    app.delete('/api/games/:_id', (req,res) => {
        collection.deleteOne({_id: new mongodb.ObjectId(req.params._id)}, (error, game) =>{
            if(error){
                res.status(500).json({errors: {global:error}});
                return;
            }

            res.json({});
        })
    })

    app.put('/api/games/:_id', (req, res) => {
        const { errors, isValid } = validate(req.body);
        if (isValid) {
          const { title, cover } = req.body;
          collection.findOneAndUpdate(
            { _id: new mongodb.ObjectId(req.params._id) },
            { $set: { title, cover } },
            { returnOriginal: false },
            (err, result) => {
              if (err) { res.status(500).json({ errors: { global: err } }); return; }
              res.json({ game: result.value });
            }
          )
        } else {
          res.status(400).json({ errors });
        }
      })

    app.post('/api/games', (req, res) => {
        const {errors, isValid} = validate(req.body);
        if(isValid) {
            const {title, cover} = req.body;
            collection.insert({title, cover}, (error, result) => {
                if(error) {
                    res.status(500).json({error: { global: "Something went wrong"}});
                } else {
                    res.json({game: result.ops[0]});
                }
            });
        }else{
            res.status(400).json({errors});
        }
    })

    app.use((req, res) => {
        res.status(404).json({
            error: {
                global: "still working on it."
            }
        })
    })
})

app.listen(8080, ()=> console.log('Server is running on localhost:8080'));