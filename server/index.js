import {WebSocketServer} from 'ws';

// Charcodes: 0x00=request server send user (name) data (toServer), 0x01=player (card) data on reconnect (toClient), 0x02=start lobby (toClient), 0x03=keepalive (serverClient)
//            0x10=create new lobby (toServer) lobby already exists (toClient), 0x11=name already taken (toClient), 0x12=lobby not found (toClient), 0x13=player already connected (toClient), 0x14=lobby full (toClient), 0x15=lobby and name needed
//            0x1A=player added image to card (toServer), 0x1B=player removed image from card (toServer), 0x1C=player done with card (toServer) other player done with card (toClient)

const squareTexts = ['temp1', 'temp2', 'temp3', 'temp4', 'temp5', 'temp6', 'temp7', 'temp8', 'temp9'];

const wss = new WebSocketServer({port: 444});
let lobbies = {};

/*
demoLobby = {
	card: ['mås', 'båt', 'etc', 'etc', 'etc', 'etc', 'etc', 'etc', 'etc'],
	isWon: false,
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
	let name = req.url.substring(1).split(charCode(0x00))[0];
	let lobby = req.url.substring(1).split(charCode(0x00))[1];
	let active = true;

	if (lobby == '' || name == ''){
		ws.send(charCode(0x15));
		console.log('someone didn\'t pick a good name');
		ws.close();
		return;
	}

	if (lobby[0] == charCode(0x10)){		// Check if create lobby
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
				players: []
			};
			lobbies[lobby].players.push({ws: ws, name: name, card: [null, null, null, null, null, null, null, null, null], time: null});
			ws.send('yuppi c:');

			console.log(`${name} created and connected to ${lobby}, currently ${lobbies[lobby].players.length} players in ${lobby}`);
		}
	}else{						// Not create lobby
		if (lobbies[lobby]){							// Check if lobby exists
			if (lobbies[lobby].players.find((player) => player.name === name)){		// Check if name in lobby
				if (lobbies[lobby].players[lobbies[lobby].players.findIndex((player) => player.name === name)].ws){			// Check if player already connected
					ws.send(charCode(0x13));
					console.log(`${name} tried to connect to ${lobby} but that name was already connected`);
					ws.close();
					return;
				}else{					// Player not connected
					lobbies[lobby].players[lobbies[lobby].players.findIndex((player) => player.name === name)].ws = ws;
					ws.send(charCode(0x01) + JSON.stringify(lobbies[lobby].players[lobbies[lobby].players.findIndex((player) => player.name === name)].card));

					console.log(`${name} reconnected to ${lobby}`);
				}
			}else{				// Name not in lobby
				if (lobbies[lobby].players.length < 2){		// Check if lobby not full
					lobbies[lobby].players.push({ws: ws, name: name, card: [null, null, null, null, null, null, null, null, null], time: null});

					console.log(`${name} connected to ${lobby}, currently ${lobbies[lobby].players.length} players in ${lobby}`);

					sendMsg(charCode(0x02) + JSON.stringify(lobbies[lobby].card));
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

	console.log(lobbies);		// Debug

	console.log('if player failed to connect, this shouldn\'t be here :p (just testing)');

	ws.on('message', (msg) =>{
		active = true;

		switch (msg[0]){
			case 0x00:
				let players = [];
				lobbies[lobby].players.forEach((player) =>{
					players.push({name: player.name/*, card: player.card, time: player.time*/});
				});
				ws.send(JSON.stringify(players));
				break;
			case 0x03:		// Keepalive
				break;
			case 0x1A:
				setCard(msg[1], `https://sputnik.zone/school/Sammanslaget2024/image/images/${lobby + name + msg[1]}`);
				break;
			case 0x1B:
				fetch(`https://sputnik.zone/school/Sammanslaget2024/image/removeImage.php?id=${msg[1]}`);
				setCard(msg[1], null);
				break;
			case 0x1C:
				if (!lobbies[lobby].isWon){
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