/** @module Login Routes */

var express = require('express');
var router = express.Router();


/* GET login page */
/**
 * Route render the login page
 * @name Login Render Login Page
 * @param RequestType GET
 * @param Request The request being sent to the route.
 * @param Response The response being sent to the route.
 * @param Next The callback function.
 * @callback '/'
 */
router.get('/', function(req, res, next) {
  res.render('login',{err:{},loginError:req.flash("error")});
});

module.exports = router;
