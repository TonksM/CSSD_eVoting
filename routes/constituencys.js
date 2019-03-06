Constituencyconst express = require('express');
const router = express.Router();

// constituencys model
const Constituency = require('../models/constituency');

// new constituency form
router.get('/add', function(req, res){
  res.render('add_constituency', {
    title: 'Add constituency'
  });
});

// submit new constituency
router.post('/add', function(req, res){
  // Express validator
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_constituency', {
      title: 'Add Constituency',
      errors: errors
    });
  } else {
    let constituency = new Constituency();
    constituency.title = req.body.title;
    constituency.author = req.body.author;
    constituency.body = req.body.body;

    constituency.save(function(err){
      if(err) {
        console.error(err);
        return;
      } else {
        req.flash('success', 'Constituency Added');
        res.redirect('/');
      }
    });
  }
});

// load edit form
router.get('/edit/:id', function(req, res){
  Constituency.findById(req.params.id, function(err, constituency){
    res.render('edit_constituency', {
      title: 'Edit Constituency',
      constituency: constituency
    });
  });
});

// update submit new constituency
router.post('/edit/:id', function(req, res){
  let constituency = {};
  constituency.title = req.body.title;
  constituency.author = req.body.author;
  constituency.body = req.body.body;

  let query = {_id: req.params.id};

  Constituency.update(query, constituency, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Constituency Updated');
      res.redirect('/');
    }
  })
});

// update submit new Constituency
router.post('/checkOut/:id', function(req, res){
  let constituency = {};
  constituency.title = req.body.title;
  constituency.author = req.body.author;
  constituency.body = req.body.body;
  console.log(constituency);

  let query = {_id: req.params.id};

  Constituency.update(query, constituency, function(err){
    if(err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Constituency Updated');
      res.redirect('/');
    }
  })
});

//NEED A DELETE POST

// get single Constituency
router.get('/:id', function(req, res){
  Constituency.findById(req.params.id, function(err, constituency){
    res.render('constituency', {
      constituency: constituency
    });
  });
});

module.exports = router;
