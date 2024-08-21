import {WebSocketServer} from 'ws';

// Charcodes: 0x00=request server send user data (toServer), 0x01=player data on reconnect (toClient), 0x03=keepalive (serverClient)
//            0x10=create new lobby (toServer) lobby already exists (toClient), 0x11=name already taken (toClient), 0x12=lobby not exists (toClient), 0x13=player already connected (toClient)
//            0x20=player added image to card (toServer), 0x21=player removed image from card (toServer), 0x22=player done with card (toServer) other player done with card (toClient)

const squareTexts = ['temp1', 'temp2', 'temp3', 'temp4', 'temp5', 'temp6', 'temp7', 'temp8', 'temp9'];

const wss = new WebSocketServer({port: 443});
let lobbies = {};

/*
demoLobby = {
	card: ['mås', 'båt', 'etc', 'etc', 'etc', 'etc', 'etc', 'etc', 'etc'],
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
	let name = req.url.substring(1).split(charCode(0x00))[0];
	let lobby = req.url.substring(1).split(charCode(0x00))[1];
	let active = true;

	if (lobby[0] == 0x10){		// Check if create lobby
		lobby = lobby.substring(1);
		if (lobbies[lobby]){			// Check if lobby exists
			ws.send(charCode(0x10));
			ws.close();
		}else{						// Lobby not exists
			lobbies[lobby] = {
				card: createCard(),
				players: []
			}
			ws.send('yuppi c:');
		}
	}else{						// Not create lobby
		if (lobbies[lobby]){							// Check if lobby exists
			if (lobbies[lobby].players.find((player) => player.name === name)){		// Check if name in lobby
				if (player.ws){			// Check if player already connected
					ws.send(charCode(0x13));
					ws.close();
				}else{					// Player not connected
					player.ws = ws;
					ws.send(charCode(0x01) + JSON.stringify(player.card));
				}
			}else{
				lobbies[lobby].players.push({ws: ws, name: name, card: [null, null, null, null, null, null, null, null, null], time: null});
			}
		}else{						// Lobby not exists
			ws.send(charCode(0x12));
		}
	}

	console.log(`${name} connected to ${lobby}, currently ${lobbies[lobby].length} players in ${lobby}`);

	ws.on('message', (msg) =>{
		active = true;
		if (msg[0] == 0x03) return;   // Keepalive

		switch (msg[0]){
			case 0x00:
				let players = [];
				lobbies[lobby].players.forEach((player) =>{
					players.push({name: player.name/*, card: player.card, time: player.time*/});
				});
				ws.send(JSON.stringify(players));
			case 0x20:
				setCard(msg[1], `https://sputnik.zone/school/Sammanslaget2024/image/images/${lobby + name + msg[1]}`);
				break;
			case 0x21:
				fetch(`https://sputnik.zone/school/Sammanslaget2024/image/removeImage.php?id=${msg[1]}`);
				break;
			case 0x22:
				sendMsg(charCode(0x22) + name, lobby);
				break;
			default:
				//sendMsg({player: name, msg: msg}, lobby);
		}
	});

	let interval = setInterval(() =>{	// Keepalive
		if (active){
			active = false;
			ws.send(charCode(0x03));
		}else{
			lobbies[lobby].players.splice(lobbies[lobby].players.findIndex((player) => player.name === name), 1);
			ws.terminate();
			console.log(`${name} does not respond, terminating`);
		}
	},600000);

	ws.on('close', () =>{
		clearInterval(interval);
		lobbies[lobby].players[lobbies[lobby].players.findIndex((player) => player.name === name)].ws = null;
	});

	function getCard(){
		return lobbies[lobby].players[lobbies[lobby].players.findIndex((player) => player.name === name)].card;
	}

	function setCard(i, data){
		return lobbies[lobby].players[lobbies[lobby].players.findIndex((player) => player.name === name)].card[i] = data;
	}
});

function sendMsg(msg, lobby){
	lobbies.[lobby].players.forEach((player) =>{
		if (player.lobby == lobby) player.ws.send(msg);
	});
}

function sendTo(msg, lobby, name){
	lobbies.[lobby].players.forEach((player) =>{
		if (player.name == name) player.ws.send(msg);
	});
}

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