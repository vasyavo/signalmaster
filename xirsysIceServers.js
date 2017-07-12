var https = require("https");

module.exports = {
    getIceServers: function (client, config, cb) {
        var xirsys = config.xirsys;
        var options = {
            host: xirsys.gateway,
            path: "/_turn/" + xirsys.info.channel,
            method: "PUT",
            headers: {
                "Authorization": "Basic " + new Buffer(xirsys.info.ident + ":" + xirsys.info.secret).toString("base64")
            }
        };
        console.log('getIceServers ', options);
        var httpreq = https.request(options, function (httpres) {
            var str = "";
            httpres.on("data", function (data) { str += data; });
            httpres.on("error", function (e) {
                console.log("error: ", e);
                cb(e, null);
            });
            httpres.on("end", function () {
                console.log("response: ", str);
                var result = JSON.parse(str),
                    iceServers = result.v.iceServers;

                var turnservers = [],
                    stunservers = [];
                if (result.s != 'success') {
                    
                } else {
                    iceServers.forEach(function (server) {
                        if (server.url.indexOf("stun:") != -1) {
                            stunservers.push(server);
                        } else {
                            turnservers.push(server);
                        }
                    });
                }
                
                
                cb(null, {turnservers: turnservers, stunservers: stunservers});
            });
        });
        httpreq.end();
    }
};

