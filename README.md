![Discord Shield](https://discordapp.com/api/guilds/285603678885511170/widget.png?style=shield)
[![Generic badge](https://img.shields.io/badge/Made%20with-Discord.js-8080ff.svg)](https://discord.js.org/#/)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

# ACM-SEMO Discord Bot
This is a bot for the ACM-SEMO organization's Discord channel.

<img src="https://github.com/StaneCobalt/acm-discord-chatbot/blob/master/images/acmsemo-discord-logo.png" width="50%" />

### Current functionality
- Display date for next upcoming event
- Convert Decimal to Binary
- Convert Binary to Hex
- Convert Decimal to Hex
- Fetch top 3 posts from the programmerhumor subreddit

### Packages used
- Discord.js https://discord.js.org/#/
- Datejs http://www.datejs.com/
- request https://github.com/request/request
- XMLHttpRequest https://www.w3schools.com/xml/xml_http.asp

### Tutorial
#### Setting up a Discord Bot on Raspbian
This tutorial assumes you've already built a bot and you're now transferring it onto a new Raspberry Pi.

<img src="https://github.com/StaneCobalt/acm-discord-chatbot/blob/master/images/botHome.JPG" width="50%" />

1. Make sure everything is up to date.

`sudo apt-get update`

`sudo apt-get install build-essential checkinstall libssl-dev`

2. Get node.js and npm. Discord.js requires node version 6 or higher.

`curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`

3. Check that it's installed. If you don't see nvm as the response, close and reopen the terminal.

`command -v nvm`

4. Install node.js and npm

`nvm install 8.11.2`

`nvm use 8.11.2`

`nvm alias default node`

5. Navigate to your project folder then type the following.

`npm init`

Fill out the name of the bot, the version, and description.
Set the entry point to app.js
You can skip the test, git repo, and keywords by just pressing enter.
Fill in the author field, and then tell which license you'd like to use if any.
Press Y to continue.

6. Install the discord api wrapper. You will want to also install opus if you're making a bot that uses audio.

`npm install --save discord.js`

In my case I also installed these dependencies.

`npm install datejs`

`npm install request`

`npm install xmlhttprequest`

Copy in your app.js, and settings.json files and you're good to go!
Use `node app.js` to start running your bot.
