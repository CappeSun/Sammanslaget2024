import {WebSocketServer} from 'ws';

// Charcodes: 0x00=request server send player data (toServer) player data (toClient), 0x01=lobby card and player data object on reconnect (toClient), 0x02=lobby started (toClient), 0x03=keepalive (serverClient), 0x04=end lobby (toServer) lobby ended (toClient)
//            0x10=create new lobby (toServer, onConnect) lobby already exists (toClient), 0x11=name already taken (toClient), 0x12=lobby not found (toClient), 0x13=lobby created (toClient), 0x14=lobby full (toClient), 0x15=lobby and name needed (toClient)
//            0x1A=player added image to card (toServer), 0x1B=player removed image from card (toServer), 0x1C=player done with card (toServer) other player done with card (toClient)

const squareTexts = [
	"🛕Glenpire State Building som ser ut som en gylf",
	"🍬Hörnbutik, gymnasieelever, chokladboll",
	"🚢Stor grej som flyter över älven",
	"🧪Café, äldre vetenskap",
	"🐦Flygande råtta, tar ens mat, skriker",
	"⚓️Sjömanskrog, gammal kung",
	"🚢Hållplats, vatten, lunchställen",
	"📚Färgglad, studenter, kantigt men runt",
	"🏰Biograf, första byggnad med el, kulturminnesmärkt",
	"🎭Pjäser, gammal plåtverkstad",
	"🚲Två hjul, ingen respekt för gång- och biltrafikanter",
	"🚍Förseningar, väntkur, tidtabel",
	"👯Musikal- och danslinje som var första i sitt slag",
	"📽Produktionsbolag, känd för Smala Susie",
	"🚤Gammal salthamn, idag bryggplats för båtar",
	"🧠Staty bestående av bokstäver och hjärna",
	"🏢Studenter, grått och kantigt boende",
	"🍻Där chalmerister blir fulla",
	"🏊‍♀️Gräsplätt som blir en bassäng vid kraftig skyfall",
	"👩‍💼Plats där studenter förbereder sig för yrket",
	"🥼Plats för innovation",
	"🏃‍♀️Person som tränar med rappa steg",
	"☕️Bägare med svart varm dryck i",
	"🦴Lurvig varelse på fyra ben",
	"🧱Gångbana över vatten",
	"🛶Mindre fartyg som tar en över vattnet",
	"🚤Plats för att hyra båtar",
	"🏡Tidigare plats för en borg, nuförtiden trähus",
	"📞Företag, telekommunikation",
	"📺Public service-bolag för tv",
	"🌳Väg omringad av träd",
	"🍲Matställe som delar på ägarskapet",
	"🥐Café med utsikt över vattnet",
	"🧹Aktivitet där man sopar på isen",
	"🍝Matställe med hemmagjord pasta",
	"🎸Byggnad med 52 replokaler",
	"📻Samling med gamla radion",
	"📹Svensk tillverkare av kameror sedan 1941",
	"👩‍🍳Plats att köpa mat som elever har tillverkat",
	"🤝Mötesplats för hållbar samhällsutveckling"
];

const wss = new WebSocketServer({port: 443});
let lobbies = {};

/*
demoLobby = {
	card: ['mås', 'båt', 'etc', 'etc', 'etc', 'etc', 'etc', 'etc', 'etc'],
	isWon: false,
	isStarted: false,
	players: [
		{
			ws: ws,
			name: 'LordBean',
			card: [{img: null, crd: [null, null]}, {img: null, crd: [null, null]}, {img: null, crd: [null, null]}, {img: null, crd: [null, null]}, {img: null, crd: [null, null]}, {img: null, crd: [null, null]}, {img: null, crd: [null, null]}, {img: null, crd: [null, null]}, {img: null, crd: [null, null]}],
			time: null
		},
		{
			ws: ws,
			name: 'SirBean',
			card: [{img: null, crd: [null, null]}, {img: null, crd: [null, null]}, {img: null, crd: [null, null]}, {img: null, crd: [null, null]}, {img: null, crd: [null, null]}, {img: null, crd: [null, null]}, {img: null, crd: [null, null]}, {img: null, crd: [null, null]}, {img: null, crd: [null, null]}],
			time: null
		}
	]
}
*/

wss.on('connection', (ws, req) =>{
	req.url = decodeURI(req.url);
	let name = req.url.substring(1).split(charCode(0x5C))[0];
	let lobby = req.url.substring(1).split(charCode(0x5C))[1];
	let active = true;

	if (lobby == '' || name == ''){
		ws.send(charCode(0x15));
		console.log('someone didn\'t pick a good name');
		ws.close();
		return;
	}

	if (lobby[0] == charCode(0x40)){		// Check if create lobby
		lobby = lobby.substring(1);
		if (lobbies[lobby]){			// Check if lobby exists
			ws.send(charCode(0x10));
			console.log(`${name} tried to create a lobby but ${lobby} was already taken`);
			ws.close();
			return;
		}else{						// Lobby not exists
			lobbies[lobby] = {
				card: createCard(),
				isWon: false,
				isStarted: false,
				players: []
			};
			lobbies[lobby].players.push({ws: ws, name: name, card: [null, null, null, null, null, null, null, null, null], time: null});
			ws.send(charCode(0x13));

			console.log(`${name} created and connected to ${lobby}, currently ${lobbies[lobby].players.length} players in ${lobby}`);
		}
	}else{						// Not create lobby
		if (lobbies[lobby]){							// Check if lobby exists
			if (lobbies[lobby].players.find((player) => player.name === name)){		// Check if name in lobby
				if (lobbies[lobby].players[lobbies[lobby].players.findIndex((player) => player.name === name)].ws){			// Check if player already connected
					ws.send(charCode(0x11));
					console.log(`${name} tried to connect to ${lobby} but that name was already connected`);
					ws.close();
					return;
				}else{					// Player not connected
					lobbies[lobby].players[lobbies[lobby].players.findIndex((player) => player.name === name)].ws = ws;
					ws.send(charCode(0x01) + JSON.stringify({lobby: lobbies[lobby].card, player: lobbies[lobby].players[lobbies[lobby].players.findIndex((player) => player.name === name)].card, isStarted: lobbies[lobby].isStarted}));

					console.log(`${name} reconnected to ${lobby}`);
				}
			}else{				// Name not in lobby
				if (lobbies[lobby].players.length < 2){		// Check if lobby not full
					lobbies[lobby].players.push({ws: ws, name: name, card: [null, null, null, null, null, null, null, null, null], time: null});

					console.log(`${name} connected to ${lobby}, currently ${lobbies[lobby].players.length} players in ${lobby}`);

					sendMsg(charCode(0x02) + JSON.stringify(lobbies[lobby].card));
					lobbies[lobby].isStarted = true;
				}else{							// Lobby full
					ws.send(charCode(0x14));
					console.log(`${name} tried to connect to ${lobby} but that lobby was already full`);
					ws.close();
					return;
				}
			}
		}else{						// Lobby not exists
			ws.send(charCode(0x12));
			console.log(`${name} tried to connect to ${lobby} but that lobby was not found`);
			ws.close();
			return;
		}
	}

	let recoplayernames = [];							// Send player data on connect
	lobbies[lobby].players.forEach((player) =>{
		recoplayernames.push(player.name);
	});
	sendMsg(charCode(0x00) + JSON.stringify(recoplayernames));

	console.log(lobbies);		// Debug

	console.log('if player failed to connect, this shouldn\'t be here :p (just testing)');

	ws.on('message', (msg) =>{
		active = true;

		switch (msg[0]){
			case 0x00:
				let playernames = [];
				lobbies[lobby].players.forEach((player) =>{
					playernames.push({name: player.name/*, card: player.card, time: player.time*/});
				});
				ws.send(charCode(0x00) + JSON.stringify(players));
				break;
			case 0x03:		// Keepalive
				break;
			case 0x04:		// Lobby ended by player
				sendMsg(charCode(0x04));
				break;
			case 0x1A:
				setCard(msg[1], `https://sputnik.zone/school/Sammanslaget2024/image/images/${lobby + name + msg[1]}.jpg`);
				break;
			case 0x1B:
				fetch(`https://sputnik.zone/school/Sammanslaget2024/image/removeImage.php?lobbynameid=${lobby + name + msg[1]}`);
				setCard(msg[1], null);
				break;
			case 0x1C:
				if (!lobbies[lobby].isWon && lobbies[lobby].isStarted){
					lobbies[lobby].isWon = true;
					sendMsg(charCode(0x1C) + name);
					console.log(`${lobby} done, ${name} won`);
				}
				break;
			default:
				//sendMsg({player: name, msg: msg});
		}
	});

	let interval = setInterval(() =>{		// Keepalive
		if (active){
			active = false;
			ws.send(charCode(0x03));
			console.log(name, 'ping');
		}else{
			lobbies[lobby].players.splice(lobbies[lobby].players.findIndex((player) => player.name === name), 1);
			ws.terminate();
			console.log(`${name} does not respond, terminating`);
		}
	},600000);

	ws.on('close', () =>{
		clearInterval(interval);
		if (lobbies[lobby] && lobbies[lobby].players.find((player) => player.name === name))
			lobbies[lobby].players[lobbies[lobby].players.findIndex((player) => player.name === name)].ws = null;
	});

	function getCard(){
		return lobbies[lobby].players[lobbies[lobby].players.findIndex((player) => player.name === name)].card;
	}

	function setCard(i, data){
		return lobbies[lobby].players[lobbies[lobby].players.findIndex((player) => player.name === name)].card[i] = data;
	}

	function sendMsg(msg){
		lobbies[lobby].players.forEach((player) =>{
			player.ws.send(msg);
		});
	}

	function sendTo(msg, name){						// Remove if unused
		lobbies[lobby].players.forEach((player) =>{
			if (player.name == name) player.ws.send(msg);
		});
	}
});

function charCode(code){
	return String.fromCharCode(code);
}

function createCard(){
	let card = [];
	for (let i = 0; i < 9; i++){
		let square;
		do{
			square = squareTexts[Math.floor(Math.random() * squareTexts.length)];
		}while(card.includes(square));
		card[i] = square;
	}
	return card;
}