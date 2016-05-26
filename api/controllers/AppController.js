/**
 * AppController
 *
 * @description :: Server-side logic for managing apps
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require("request");

module.exports = {



  /**
   * `AppController.getLatestAppVersion()`
   */
  getLatestAppVersion: function (req, res) {

		request({
		    url: 'https://erinstioursbasseartooret:887abf020b060d6569fe72392a14e9ac6c761537@hash1492.cloudant.com/bumblebee/b864c9546e268a8fee43893f56fdd3b3',
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
						res.send({code: "APP_VERSION_SENT", data: body});

				}
		});

  }
};
