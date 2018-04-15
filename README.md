# node-dota2-plugin

A node-steam plugin for commending players in Dota2<br>
You can change this to report bot by just changing the variables/functions to
EMsgGCReportCountsRequest
EMsgGCSubmitPlayerReport


## Requirements

| Prerequisite    | How to check | How to install
| --------------- | ------------ | ------------- |
| Node.js 0.12.x  | `node -v`    | [nodejs.org](http://nodejs.org/) |

Additionally, you will need at least one or more Steam accounts, and Steamguard must be deactivated.

## Installation

1. Download the latest [stable](https://github.com/Wizzardy/dota2/) version.
2. Run `npm install` from your terminal.
3.  modify accounts.txt with your account credentials. You may enter multiple accounts.

## Usage

```
npm start
```

You will be prompted to enter the target player's SteamID64.


### Updating Protocol Definitions

```
npm run update
```

## Note
Don't kill the process by yourself!<br>
The process will be killed automatically after it finished to commend the target with all the accounts.

## Credits

* Based on [node-steam](https://github.com/seishun/node-steam) by [seishun](https://github.com/seishun)
* Askwrite for initial node version.
