
let https = require('https');
const bbCore = require('sdk');

// funcation to do server side validation of the captcha with Google

exports.before_public_create_client = (data, callback) => {

    // get the passed in params
    const params = data.params;

    // params to pass to google to validate the catcha
    const secret = bbCore.getConfigValue('server_key');
    const response = params.extra_info.captcha;
    const options = {host: 'www.google.com', port: 443, path: "/recaptcha/api/siteverify?secret=" + secret + "&response=" + response, headers: {'Content-Type': 'application/json'}, method: 'GET'};

    const req = https.request(options, (result) => {
      var dataQueue = "";    
      result.on("data", function (dataBuffer) {
          dataQueue += dataBuffer;
      });
      result.on("end", function () {
        // get a result form google
        const body = JSON.parse(dataQueue)
        console.log(body)
        // was it a success
        if(body.success !== undefined && !body.success) {
          callback("Failed captcha verification", {status: "error"});
        } else {
          callback(null, {status: "success", params: params});
        }
      });        
    });
    req.on('error', (e) => {
        // error use the fallback
        console.error(e);
        callback("Failed captcha check", {status: "error" });
    });
    req.end();


};

