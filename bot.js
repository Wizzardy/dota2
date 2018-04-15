    var fs = require("fs"),
        Steam = require("steam"),
        SteamID = require("steamid"),
        IntervalInt = null,
        readlineSync = require("readline-sync"),
        Protos = require("./protos/protos.js"),
        CountCommends = 0,
        Long = require("long"),
        process = require("process"),
        steamID = readlineSync.question("SteamID64 which will be commended: ");
     
    var ClientHello = 4006,
        ClientWelcome = 4004;
     
    var accounts = [];
     
    var arrayAccountsTxt = fs.readFileSync("accounts.txt").toString().split("\n");
    for (i in arrayAccountsTxt) {
        var accInfo = arrayAccountsTxt[i].toString().trim().split(":");
        var username = accInfo[0];
        var password = accInfo[1];
        accounts[i] = [];
        accounts[i].push({
            username: username,
            password: password
        });
    }
     
    function loginAndCommend(steamID) {
        if ((steamID == "") || !(steamID.indexOf("765") > -1) || (steamID.length < 17)) {
            console.log("That's not a valid SteamID!");
            process.exit();
        }
        if (accounts[0]) {
            var account = accounts[0][0];
            var account_name = account.username;
            var password = account.password;
            Client = new Steam.SteamClient();
            User = new Steam.SteamUser(Client);
            GC = new Steam.SteamGameCoordinator(Client, 570);
            Friends = new Steam.SteamFriends(Client);
     
            Client.connect();
     
            Client.on("connected", function() {
                User.logOn({
                    account_name: account_name,
                    password: password
                });
            });
     
            Client.on("logOnResponse", function(res) {
                if (res.eresult !== Steam.EResult.OK) {
                    if (res.eresult == Steam.EResult.ServiceUnavailable) {
                        console.log("\n[STEAM CLIENT - " + account_name + "] Login failed - STEAM IS DOWN!");
                        console.log(res);
                        Client.disconnect();
                        process.exit();
                    } else {
                        console.log("\n[STEAM CLIENT - " + account_name + "] Login failed!");
                        console.log(res);
                        Client.disconnect();
                        accounts.splice(0, 1);
                        loginAndCommend(steamID);
                    }
                } else {
                    console.log("\n[STEAM CLIENT - " + account_name + "] Logged in!");
     
                    Friends.setPersonaState(Steam.EPersonaState.Offline);
     
                    User.gamesPlayed({
                        games_played: [{
                            game_id: 570
                        }]
                    });
     
                    if (GC) {
                        IntervalInt = setInterval(function() {
                            GC.send({
                                msg: ClientHello,
                                proto: {}
                            }, new Protos.CMsgClientHello({}).toBuffer());
                        }, 2000);
                        console.log("[GC - " + account_name + "] Client Hello sent!");
                    } else {
                        console.log("[GC - " + account_name + "] Not initialized!");
                        Client.disconnect();
                        accounts.splice(0, 1);
                        loginAndCommend(steamID);
                    }
                }
            });
     
            Client.on("error", function(err) {
                console.log("[STEAM CLIENT - " + account_name + "] " + err);
                console.log("[STEAM CLIENT - " + account_name + "] Account is probably ingame!");
                Client.disconnect();
                accounts.splice(0, 1);
                loginAndCommend(steamID);
            });
     
            GC.on("message", function(header, buffer, callback) {
                switch (header.msg) {
                    case ClientWelcome:
                        clearInterval(IntervalInt);
                        console.log("[GC - " + account_name + "] Client Welcome received!");
                        console.log("[GC - " + account_name + "] Commend request sent!");
                        sendCommend(GC, Client, account_name, steamID);
                        break;
                    case Protos.EGCBaseClientMsg.k_EMsgGCClientHello:
                        console.log("[GC - " + account_name + "] MM Client Hello sent!");
                        break;
                    default:
                        console.log(header);
                        break;
                }
            });
        } else {
            console.log("\n\n" + CountCommends + " commend(s) successfully sent!");
            Client.disconnect();
        }
    }
     
    function sendCommend(GC, Client, account_name) {
        console.log("[GC - " + account_name + "] Commend request received!");
        console.log("[GC - " + account_name + "] Trying to commend the user!");
        var target_account_id = new SteamID(steamID).accountid;
    	
    	var commend_payload = new Protos.EMsgGCSubmitPlayerReportResponse ({

    		flags:3
		
    	});
    	
    	var commendProto = new Protos.EMsgGCSubmitPlayerReportResponse ({
            accountId: commend_account_id,
            matchId: 8,
    		commendation: commend_payload
        }).toBuffer();
    	
        GC.send({
            msg: Protos.ECsgoGCMsg.CMsgDOTAReportCountsResponse,
            proto: {}
        }, commendProto);
    	console.log("[GC - " + account_name + "] Commendation Sent!");
    	Client.disconnect();
        accounts.splice(0, 1);
        CountCommends++;
        loginAndCommend(steamID);
    }
     
    process.on('uncaughtException', function (err) {
    });
     
    loginAndCommend(steamID);
    console.log("Initializing CommendBot by xc0de...\nCredits: AskWrite for original node.");
