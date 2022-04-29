
const Movie = require('../models/movie.js');

exports.add = (req, res) => {
    res.render('add_movie', { page_title: "Add Movie" });
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

exports.bulkGet = (req, res) => {
    const startTime = new Date();
    Movie.find()
        .then(movies => {
            const endTime = new Date().getTime() - startTime.getTime();
            let data = {};
            data['data'] = movies;
            data['queryTime'] = endTime
          //  console.log('Bulk Get Query API' + endTime);
         //   console.log(data);
            res.render('get_bulk', { page_title: "Bulk Get", data: data })
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Error occurred while retrieving movie List."
            });
        });
};

//BULK GET BY LIMIT
exports.bulkGetLimit = (req, res) => {
    const startTime = new Date();
    const limit = +req.body.limit;
    Movie.find()
        .limit(limit)
        .then(movies => {
            const endTime = new Date().getTime() - startTime.getTime();
            let data = {};
            data['data'] = movies;
            data['queryTime'] = endTime
          //  console.log('Bulk Get Query API' + endTime);
         //   console.log(data);
            res.render('get_bulk', { page_title: "Bulk Get by Limit", data: data })
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving movie List."
            });
        });
};

exports.save = (req, res) => {
    const movie = new Movie({
        movie: req.body.movie,
        year: req.body.year,
        rating: req.body.rating,
        comment: req.body.comment,
        genre: req.body.genre
    });
    Movie.create(movie)
        .then(data => {
            res.redirect('/movies');
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Movie."
            });
        });
};

// UPDATE BULK
exports.update_bulk = (req, res) => {
    const startTime = new Date();
    const movie = {
        movie: req.body.movie,
        year: req.body.year,
        rating: req.body.rating,
        comment: req.body.comment,
        genre: req.body.genre
    };
    const limit = +req.body.limit;
    Movie
        .find()
        .limit(limit)
        .exec(function (err, movies) {
            const ids = movies.map((doc) => doc._id);
            Movie.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                $set: movie
            },
                function (err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        endTime = (new Date().getTime() - startTime.getTime());
                        data = {};
                        data['executionTime'] = endTime;
                        res.render('update_bulk', { page_title: "Update Bulk By Limit", data });
                    }
                }
            );
        });
};

// DELETE BULK
exports.delete_bulk = (req, res) => {
    const startTime = new Date();
    const limit = +req.body.limit;
    Movie
        .find()
        .limit(limit)
        .exec(function (err, movies) {
            const ids = movies.map((doc) => doc._id);
            Movie.deleteMany(
                {
                    _id: {
                        $in: ids
                    }
                },
                function (err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        endTime = (new Date().getTime() - startTime.getTime());
                        let data = {};
                        data['executionTime'] = endTime;
                        res.render("delete_bulk", { page_title: "Bulk Delete", data });
                    }
                }
            );
        });
};

exports.list = (req, res) => {
    const startTime = new Date();
    Movie.find()
        .then(movies => {
            const endTime = new Date().getTime() - startTime.getTime();
            let data = {};
            data['data'] = movies;
            data['queryTime'] = endTime
        //    console.log('Query Time' + endTime);
            res.render('movies', { page_title: "Movie Database Mongo", data: data })
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Error occurred while retrieving movies."
            });
        });
};

exports.edit = (req, res) => {
    Movie.findById(req.params.id)
        .then(movie => {
            if (!movie) {
                return res.status(404).send({
                    message: "movie not found with id " + req.params.id
                });
            }
            res.render('edit_movie', { page_title: "Edit Movie", data: movie });
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Movie not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving movie with id " + req.params.id
            });
        });
};

exports.save_edit = (req, res) => {
    Movie.findByIdAndUpdate(req.params.id, {
        movie: req.body.movie,
        year: req.body.year,
        rating: req.body.rating,
        comment: req.body.comment,
        genre: req.body.genre
    }, { new: true })
        .then(movie => {
            if (!movie) {
                return res.status(404).send({
                    message: "Movie not found with id " + req.params.id
                });
            }
            res.redirect('/movies');
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "movie not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating book with id " + req.params.id
            });
        });
};

exports.delete_movie = (req, res) => {
    Movie.findByIdAndRemove(req.params.id)
        .then(movie => {
            if (!movie) {
                return res.status(404).send({
                    message: "movie not found with id " + req.params.id
                });
            }
            res.redirect('/movies');
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "movie not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete movie with id " + req.params.id
            });
        });
};

//ADD BULK
exports.save_bulk = (req, res) => {
    const startTime = new Date();
    const arr = [];
    for (let index = 1; index <= req.body.limit; index++) {
        const movie = new Movie({
            movie: `Movie${index}`,
            year: `${index}`,
            rating: `5`,
            comment: `comment${index}`,
            genre: `Genre${index}`
        });
        arr.push(movie);
    }
    Movie.insertMany(arr)
        .then(data => {
            endTime = (new Date().getTime() - startTime.getTime());
            data = {};
            data['executionTime'] = endTime;
            res.render("add_bulk", { page_title: "Bulk Add Movie List", data });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Error occurred while creating movie list."
            });
        });

};
