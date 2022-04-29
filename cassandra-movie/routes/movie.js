module.exports = (app) => {
    const movies = require('../controllers/movies');
    app.get('/movies', movies.list);
    app.get('/movies/add', movies.add);
    app.post('/movies/add', movies.save);
    app.get('/movies/delete/:id', movies.delete_movie);
    app.get('/movies/edit/:id', movies.edit);
    app.post('/movies/edit/:id', movies.save_edit);
    app.get('/movies/bulkAdd', movies.bulkAdd);
    app.get('/movies/bulkUpdate', movies.bulkUpdate);
    app.post('/movies/bulkUpdate', movies.update_bulk);
    app.post('/movies/bulkDelete', movies.delete_bulk);
    app.get('/movies/bulkDelete', movies.bulkDelete);
    app.get('/movies/bulkGet', movies.bulkGet);
    app.post('/movies/bulkGet', movies.bulkGetLimit);
    app.post('/movies/bulkAdd', movies.save_bulk);
}