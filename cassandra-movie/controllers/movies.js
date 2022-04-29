var cassandra = require('cassandra-driver');
var distance = cassandra.types.distance;
var options = {
    contactPoints: ['127.0.0.1'],
    protocolOptions: {
        port: 9042
    },
    localDataCenter: 'datacenter1',
    keyspace: 'movies',
    pooling: {
        coreConnectionsPerHost: {
            [distance.local]: 2,
            [distance.remote]: 1
        }
    },
    encoding: {
        map: Map,
        set: Set
    }
};
var client = new cassandra.Client(options);
client.connect(function (err, result) {
    console.log('movies: cassandra Database connected');
});


/*
 * GET users listing.
 */

exports.list = function (req, res) {
    const startTime = new Date();
    client.execute('SELECT * FROM movies.movieList', [], function (err, result) {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            const endTime = new Date().getTime() - startTime.getTime();
            let data = {};
            data['data'] = result.rows;
            data['queryTime'] = endTime
            res.render('movies', { page_title: "Movie Database - Cassandra", data })
        }
    });

};

exports.add = function (req, res) {
    res.render('add_movie', { page_title: "Add Movies" });
};

exports.bulkAdd = (req, res) => {
    res.render('add_bulk', { page_title: "Add Movie in Bulk" });
};


exports.bulkUpdate = (req, res) => {
    res.render('update_bulk', { page_title: "Update Bulk" });
};

exports.bulkDelete = (req, res) => {
    res.render('delete_bulk', { page_title: "Delete Bulk" });
};

exports.edit = function (req, res) {
    var id = req.params.id;
    client.execute("SELECT * from movies.movieList WHERE id = " + id + " ALLOW FILTERING", [], function (err, result) {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            res.render('edit_movie', { page_title: "Edit Movies", data: result.rows });
        }
    });

};


/*Save the movie*/
exports.save = function (req, res) {
    var input = JSON.parse(JSON.stringify(req.body));
    client.execute("INSERT INTO movies.movieList (id, movie, year, genre, rating, comment) VALUES (now(), '" + input.movie + "', '" + input.year + "', '" + input.genre + "', '" + input.rating + "', '" + input.comment + "')", [], function (err, result) {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            res.redirect('/movies');
        }
    });
};


exports.save_edit = function (req, res) {
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    client.execute("UPDATE movies.movieList set movie = '" + input.movie + "', year = '" + input.year + "', genre = '" + input.genre + "', rating = '" + input.rating + "', comment = '" + input.comment + "' WHERE id = " + id, [], function (err, result) {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            res.redirect('/movies');
        }
    });
};


exports.delete_movie = function (req, res) {
    var id = req.params.id;
    client.execute("DELETE FROM movies.movieList WHERE id = " + id, [], function (err, result) {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            res.redirect('/movies');
        }
    });

};


exports.bulkGet = (req, res) => {
    const startTime = new Date();
    client.execute('SELECT * FROM movies.movieList', [], function (err, result) {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            const endTime = new Date().getTime() - startTime.getTime();
            let data = {};
            data['data'] = result.rows;
            data['queryTime'] = endTime
            res.render('get_bulk', { page_title: "Bulk Get", data })
        }
    });
};


//GET BULK DATA BY LIMIT

exports.bulkGetLimit = function (req, res) {
    const limit = +req.body.limit;
    const startTime = new Date();
    var movies = [];
    client.stream(`SELECT * FROM movies.movieList LIMIT ${limit}`, []).on('readable',function(){
        var row;
        var count=1;
        while(row=this.read()){
            movies.push(row);
        //    console.log(count);
            count++;
        }
    }).on('end',function(){
        const endTime = new Date().getTime() - startTime.getTime();
        let data = {};
       // console.log(movies);
        data['data'] = movies;
        data['queryTime'] = endTime;
        res.render('get_bulk', { page_title: "Bulk Get By Limit", data });
    });
};


//BULK UPDATE

async function update_bulk (req, res) {
    let query1 = '';
    let movie_id = '';
    const startTime = new Date();
   var endTime = null; 
    var input = JSON.parse(JSON.stringify(req.body))
    await client.execute(`SELECT * FROM movies.movieList LIMIT ${input.limit}`, [], async function (err, result) {
        if (err) {
            res.status(404).send({ msg: err });
        } else { 
            for await (const row of result){ 
                movie_id = movie_id.concat(',',row['id']);
                movie_id = movie_id.replace(/^,/, '');
            }
        }
    //    console.log("In");
        query1 = "UPDATE movies.movieList set movie = '" + input.movie + "', year = '" + input.year + "', genre = '" + input.genre + "', rating = '" + input.rating + "', comment = '" + input.comment + "' WHERE id in(" + movie_id+")";
      
             client.execute(query1,{prepare:true} )
            .then(function () {
            endTime = new Date().getTime() - startTime.getTime();
          //    console.log('im in');
            let data = {};
            data['executionTime'] = endTime;
            res.render('update_bulk', { page_title: "Update By Limit", data });

          })
          .catch(function (err) {
              console.log(err);
              res.send(err);
          }); 
    });
};


// BULK DELETE

 async function delete_bulk (req, res) {
    let query1 = '';
    let movie_id = '';
    const limit = +req.body.limit;
    console.log(limit);
   const startTime = new Date();
   var endTime = null; 
    await client.execute(`SELECT * FROM movies.movieList LIMIT ${limit}`, [], async function (err, result) {
        if (err) {
            res.status(404).send({ msg: err });
        } else {      
            for await (const row of result){           
                movie_id = movie_id.concat(',',row['id']);
                movie_id = movie_id.replace(/^,/, '');
            }     
        }
     //   console.log("In");
            query1 = `DELETE FROM movies.movieList WHERE id in (${movie_id})`;
            client.execute(query1,{prepare:true} )
            .then(function () {
                 endTime = new Date().getTime() - startTime.getTime();
           //      console.log('im in');
            let data = {};
            data['executionTime'] = endTime;
            res.render("delete_bulk",{ page_title: "Bulk Delete", data });             
          })
          .catch(function (err) {
              console.log(err);
              res.send(err);
          });
        
    });
};


// BULK ADD

async function save_bulk (req, res) {
    var input = JSON.parse(JSON.stringify(req.body));
    let queries = [];
    const startTime = new Date();
    console.log('startTime', startTime);
    var endTime = null; 
    const query1 = 'INSERT INTO movies.movieList (id, movie, year, genre, rating, comment) VALUES (?, ?, ?,?,?, ?)';
    for (let index = 1; index <= input.limit; index++) {
    await client.execute(query1, [cassandra.types.Uuid.random(), `Movie${index}`, `${index}`, `Genre${index}`, `5`, `Comment${index}`],{prepare:true} )
      .then(function () {
                console.log("I'm in"+index);
    })
      .catch(function (err) {
        console.log(err);
        res.send(err);
    });      
    }
        endTime = (new Date().getTime() - startTime.getTime());
        let data = {};
        data['executionTime'] = endTime;
        res.render("add_bulk",{ page_title: "Bulk Add Movie List", data });  
};


module.exports.save_bulk = save_bulk;
module.exports.delete_bulk = delete_bulk;
module.exports.update_bulk = update_bulk;



//ps -ax|grep cassandra
//kill -9 PID

