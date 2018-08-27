//Props to the guy who made the tutorial for getting me started. Link is posted below.
//https://www.youtube.com/watch?v=rVfjZrqoQ7o&index=1&list=LLQTRzuLImAUu4afOyN_jnaw

const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect:true});
const token = require('./settings.json').token;

var startTime = "7:00 pm";

client.on('ready',() => {
	console.log('I\'m Online!\nI\'m Online!');
	setInterval(function(){checkDay()},86400000);
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
	}
	else if(message.content.startsWith(prefix+'sudoEvent')){
		getEventJSON(true);
	}
	else if(message.content.startsWith(prefix + 'setgame')){
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

function checkDay(){
	var now = new Date().getDate();
	if(now == 1) getEventJSON(false);
}

function getEventJSON(forced){
	var currentMonth = parseInt(new Date().getMonth()+1);
	if(currentMonth < 6 || currentMonth > 7){
		var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
		var xhr = new XMLHttpRequest();
		xhr.open('GET','https://acmsemo.github.io/js/events-min.json',true);
		xhr.send();
		xhr.onreadystatechange = jFunc;
		
		function jFunc(e){
			if(xhr.readyState == 4 && xhr.status == 200){
				var json = JSON.parse(xhr.responseText);
				var currentYear = (new Date().getFullYear()).toString();
				if(currentMonth in json[currentYear]){
					var monthEvents = json[currentYear][currentMonth];
					var message = "List of events for this month:\n";
					for(var j = 0; j < monthEvents.length; j++){
						message += monthEvents[j]["day"] + ": " + monthEvents[j]["event"] + "\n";
					}
					//if(forced == true) client.channels.get('368617325902954518').send(message);
					//else
						client.channels.get('352601996643008516').send(message);
				}
			} else {
				printNo();
			}
		}
	}
}

function getNextEvent(info){
	var date = require("datejs");
	var currentDate = new Date().getMonth();
	if(currentDate === 12 || currentDate === 6 || currentDate === 7){
		return "I can't find a date that's currently scheduled...";
	}else{
		var currentEvent;
		if(info != null) currentEvent = "The event " + info + " will take place ";
		else currentEvent = "The next event is ";
		if(Date.today().is().monday() === 1) currentEvent += "today at " + startTime + "!";
		else{
			var eventDate = Date.parse("next monday");
			var stringDate = eventDate.toString("MMM-d-yyyy");
			currentEvent += "Monday " + stringDate + " at " + startTime + "!";
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

function printNo(){
	var n = Math.floor(Math.random() * 6);
	switch(n){
		case 0:
			console.log("No.");
			break;
		case 1:
			console.log("Nope.");
			break;
		case 2:
			console.log("Nuh uh.");
			break;
		case 3:
			console.log("I am the master of my own will!");
			break;
		case 4:
			console.log("Don't feel like it.");
			break;
		case 5:
			console.log("I'm sorry, but I can't let you do that.");
			break;
		default:
			console.log("Why?");
			break;
	}
}

client.login(token);
