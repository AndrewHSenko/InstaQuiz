// app.js
const express = require('express');
const session = require('express-session');
const app = express();
require( './db' );


const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');


app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));
const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false 
};
app.use(session(sessionOptions));

app.get('/test',function(req, res) {
    let movies = { name : "hello"};
    res.render('test', {movies});
});

const fakeNames= [ { name : "bill", } ]
app.get('/movies', function(req, res) {
    res.render('main', {fakeNames});
} )
app.get('/movies', function(req, res) {
    const searchBy = (req.query.director === undefined || req.query.director === "" ) 
    ? {} : { director : req.query.director}; 
    let allMovies;
    Movie.find(searchBy,function(err, result) {
        console.log(result)
        allMovies = result;
        res.render('main', {movies : allMovies});
    }); 
});

app.get('/movies/add',function(req, res) {
    res.render('add');
});

app.post('/movies/add',function(req, res) {
    const newTitle = String(req.body.title);
    const newDirector = String(req.body.director);
    const newYear = String(req.body.year);
    const newMovie = new Movie({
        title: newTitle ,
        director: newDirector,
        year: newYear
    });

    if (req.session.myMovies){
        req.session.myMovies.push(newMovie);
    }
    else{
        req.session.myMovies = [newMovie];
    }
    
    newMovie.save(function(err, movie) {
        console.log(movie);
        res.redirect('/movies');
    });

});

app.get('/mymovies',function(req, res) {
    const myMovies = req.session.myMovies;
    res.render('my',{movies : myMovies});
});




app.listen(3000);
