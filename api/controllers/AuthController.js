/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require("request");
var bcrypt = require("bcrypt");
var uuid = require("node-uuid");

module.exports = {



  /**
   * `AuthController.login()`
   */
  login: function (req, res) {
    var user = req.body;
    console.log(user);
    request({
		    url: 'https://erinstioursbasseartooret:887abf020b060d6569fe72392a14e9ac6c761537@hash1492.cloudant.com/bumblebee/_design/users/_view/users_by_email?keys=["'+ user.email +'"]&limit=1',
		    method: 'GET',
		    // json: user
		}, function(error, response, body){

		    if(error) {
            console.log("err===");
		        console.log(error);
		    } else {
          console.log("body===");
            console.log(body);
            body = JSON.parse(body);
            if(body.rows.length === 0){
              res.send({code: "INVALID_EMAIL"});
              return;
            }
            var tmp_user = body.rows[0].value;
		        // console.log(response.statusCode, body);
            bcrypt.compare(user.password, tmp_user.password, function(err, matching) {
                // Password is correct
                if(matching){
                  // delete tmp_user.password;
                  res.send({code: "LOGIN_SUCCESSFUL", data: tmp_user});
                }
                // Password is incorrect
                else{
                  res.send({code: "INCORRECT_PASSWORD"});
                }
            });

				}
		});
  },


  /**
   * `AuthController.register()`
   */
  register: function (req, res) {
    var user = req.body;

    user.doc_type = "user";
    delete user.confirm_password;
    user.db_name = "db_" + uuid.v4();

    // Hash the master password
    bcrypt.hash(user.password, 10, function(err, hash) {
      console.log(hash);
      user.password = hash;
      // Create the user's doc in the master database
      request({
  		    url: 'https://erinstioursbasseartooret:887abf020b060d6569fe72392a14e9ac6c761537@hash1492.cloudant.com/bumblebee?include_docs=true',
  		    method: 'POST',
  		    json: user
  		}, function(error, response, created_user){
  		    if(error) {
  		        console.log(error);
  		    } else {
  		        console.log(created_user);
              // Create the user's database
              request({
          		    url: 'https://hash1492:bumblebeepass@hash1492.cloudant.com/' + user.db_name,
          		    method: 'PUT'
          		}, function(error, response, user_db){
          		    if(error) {
          		        console.log(error);
          		    } else {
          		        console.log(user_db);
                      created_user.db_name = user.db_name;

          						res.ok(created_user);
          				}
          		});
  				}
  		});
    });



  }
};
