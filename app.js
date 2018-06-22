//Props to the guy who made the tutorial for getting me started. Link is posted below.
//https://www.youtube.com/watch?v=rVfjZrqoQ7o&index=1&list=LLQTRzuLImAUu4afOyN_jnaw

const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect:true});
const token = require('./settings.json').token;

client.on('ready',() => {
	console.log('I\'m Online!\nI\'m Online!');
});

function isNaN(value){
	return Number.isNaN(Number(value));
}

var prefix = "bot<<";
client.on('message', message =>{
	if(!message.content.startsWith(prefix)) return;
	let args = message.content.split(' ').slice(1);
	var argresult = args.join(' ');
	if(message.author.bot) return;

	if(message.content.startsWith(prefix + 'ping')){
		message.channel.send('pong');
	}else if(message.content.startsWith(prefix + 'pong')){
		message.channel.send('ping');
	}else if(message.content.startsWith(prefix + 'help')){
		var help = "Hello World! I'm the bot for ACM-SEMO!\n"+
					   "(Use the prefix bot<< to call upon me)\n"+
					   "Here's some things I can do:\n"+
					   "event - tell when the next upcoming event is\n"+
					   "ping/pong - cause I love me some ping pong\n"+
					   "binary - convert decimal numbers to binary\n"+
					   "hex - convert decimal numbers to hexadecimal\n"+
					   "bhex - convert binary numbers to hexadecimal\n"+
					   "meme - I can fetch dank memes off of the ProgrammerHumor subreddit."+ 
					   "You can specify 0 1 or 2 for which of the top 3 hottest memes you'd like!";
		message.channel.send(help);
	}else if(message.content.startsWith(prefix + 'sendEvent')){
		var eventTime = getNextEvent(argresult);
		client.channels.get('352601996643008516').send(eventTime);
	}else if(message.content.startsWith(prefix + 'setgame')){
		if(!argresult) argresult = null;
		client.user.setGame(argresult);
	}else if(message.content.startsWith(prefix + 'setstatus')){
		if(!argresult) argresult = 'online';
		client.user.setStatus(argresult);
	}else if(message.content.startsWith(prefix + 'event')){
		if(!argresult) argresult = null;
		var eventTime = getNextEvent(argresult);
		message.channel.send(eventTime);
	}else if(message.content.startsWith(prefix + 'meme')){
		//grab a page from the programmerhumor subreddit
		var request = require('request');
		request('http://www.reddit.com/r/ProgrammerHumor/new.json?sort=hot', function(error, response, body){
				if(!error && response.statusCode == 200){
					var jsonData = JSON.parse(body);
					if(!argresult) argresult = 0;
					else{
						try{
							argresult = Number(argresult);
							var size = Object.keys(jsonData).length;
							if(argresult > size) argresult = size;
						}
						catch(err){
							argresult = 0;
						}
					}
					message.reply(
						"\n" +
						jsonData["data"]["children"][argresult]["data"]["title"] +
						"\n" +
						jsonData["data"]["children"][argresult]["data"]["url"]
					);
				}
			});
	}else if(message.content.startsWith(prefix + 'binary')){
		var num = toBinary(argresult);
		message.reply(num);
	}else if(message.content.startsWith(prefix + 'hex')){
		var num = toHex(argresult);
		message.reply(num);
	}else if(message.content.startsWith(prefix + 'bhex')){
		var num = binToHex(argresult);
		message.reply(num);
	}

});

/*
client.on('serverNewMember', (x,y)=>{
  if(x === client.servers.get('id',"SERVERID")){
    client.sendMessage(x.channels.get('name','general'),"Welcome to the ACM-SEMO Discord, " + y.mention() + "!");
  }
});
*/

function getEventJSON(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET','https://acmsemo.github.io/js/events-min.json',true);
	xhr.send();
	xhr.onreadystatechange = jFunc;
	function jFunc(e){
		if(xhr.readyState == 4 && xhr.status == 200){
			document.open();
			var json = JSON.parse(xhr.responseText);
			var currentYear = new Date().getFullYear();
			var currentMonth = new Date().getMonth() + 1;
			currentYear = currentYear.toString();
			var yearEvents = json[currentYear];
			/*
			for(var i = 1; i < 13; i++){
				if(i in yearEvents){
					var monthEvents = yearEvents[i];
					for(var j = 0; j < monthEvents.length; j++){
						document.write(monthEvents[j]["event"] + "<br/>");
					}
				}
			}
			document.close();
			*/
		}
	}
}

function getNextEvent(info){
	var date = require("datejs");
	var currentDate = new Date().getMonth();
	if((currentDate === 12) || (currentDate > 5 && currentDate < 8)){
		return "I can't find a date that's currently scheduled...";
	}else{
		var currentEvent;
		if(info != null) currentEvent = "The event " + info + " will take place ";
		else currentEvent = "The next event is ";
		if(Date.today().is().monday() === 1) currentEvent += "today at 5:30pm!";
		else{
			var eventDate = Date.parse("next monday");
			var stringDate = eventDate.toString("MMM-d-yyyy");
			currentEvent += "Monday " + stringDate + " at 5:30pm!";
		}
		return currentEvent;
	}
}

function toBinary(n){
	if(!isNaN(n)) return (+n).toString(2);
	else return "Something doesn't seem right...";
}

function toHex(n){
	if(!isNaN(n)) return ((+n).toString(16)).toUpperCase();
	else return "Something doesn't seem right...";
}

function binToHex(n){
	if(!isNaN(n)) return (parseInt(+n, 2).toString(16)).toUpperCase();
	else return "Something doesn't seem right...";
}

client.login(token);
