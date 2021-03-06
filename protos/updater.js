var fs = require("fs");
var https = require("https");

var baseUrl = "https://raw.githubusercontent.com/SteamRE/SteamKit/master/Resources/Protobufs/dota/";
var protos = [
    "base_gcmessages.proto",
    "steammessages.proto",
    "dota_gcmessages_client.proto",
    "gcsdk_gcmessages.proto",
    "dota_match_metadata.proto",
    "dota_clientmessages.proto",
    "dota_gcmessages_client_chat.proto",
    "dota_gcmessages_common.proto",
    "gcsystemmsgs.proto"
];

fs.readdir(__dirname, function(err, filenames) {
    if (err) {
        return err;
    }

    filenames.forEach(function(filename) {
        if (filename != "protos.js" && filename != "updater.js") {
            fs.unlinkSync(__dirname + "/" + filename);
        }
    });

    protos.forEach(function(proto) {
        var file = fs.createWriteStream(__dirname + "/" + proto);
        https.get(baseUrl + proto, function(response) {
            response.pipe(file);
        });
    });
});
