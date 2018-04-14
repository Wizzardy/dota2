var Protobuf = require("protobufjs");

Protobuf.convertFieldsToCamelCase = true;

var builder = Protobuf.newBuilder();
Protobuf.loadProtoFile(__dirname + "/base_gcmessages.proto", builder);
Protobuf.loadProtoFile(__dirname + "/dota_gcmessages_msgid.proto", builder);
Protobuf.loadProtoFile(__dirname + "/gcsdk_gcmessages.proto", builder);
Protobuf.loadProtoFile(__dirname + "/gcsystemmsgs.proto", builder);
module.exports = builder.build();
