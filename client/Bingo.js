export class Bingo{
	#onwin;
	#ongetusers;
	#onstart;
	#onreconnect;
	#ondisconnect;
	#onnametaken;
	#onlobbytaken;
	#onplayeralreadyconn;
	#onlobbyfull;
	#onlobbynameempty;
	constructor(onlobbycreated, onlobbyclosed, onwin, ongetusers, onstart, onreconnect, ondisconnect, onnametaken, onlobbytaken, onlobbynotfound, onlobbyfull, onlobbynameempty){
		this.onlobbycreated = onlobbycreated;
		this.onlobbyclosed = onlobbyclosed;
		this.onwin = onwin;
		this.ongetusers = ongetusers;
		this.onstart = onstart;
		this.onreconnect = onreconnect;
		this.ondisconnect = ondisconnect;
		this.onnametaken = onnametaken;
		this.onlobbynotfound = onlobbynotfound;
		this.onlobbytaken = onlobbytaken;
		this.onlobbyfull = onlobbyfull;
		this.onlobbynameempty = onlobbynameempty;
	}

	enterLobby(name, lobby, isCreate){
		if (this.ws) return;		// Cannot enter lobby while connected to lobby

		this.ws = new WebSocket(`ws://127.0.0.1:444/${name + charCode(0x00) + (isCreate ? charCode(0x10) : '') + lobby}`);
		this.ws.onopen = () =>{
			this.ws.onmessage = (event) =>{
				let msg = event.data;
				switch (msg.charCodeAt(0)){
					case 0x00:
						this.ongetusers(JSON.parse(msg.substring(1)));		// Returns array of usernames
						break;
					case 0x01:
						this.onreconnect(JSON.parse(msg.substring(1)));		// Returns lobby card and returning players card as {lobby: array of string, player: array of urls/null}
						break;
					case 0x02:
						this.onstart(JSON.parse(msg.substring(1)));		// Returns lobby card
						break;
					case 0x03:						// Keepalive
						this.ws.send(charCode(0x03));
						break;
					case 0x10:
						this.onlobbytaken();
						break;
					case 0x11:
						this.onnametaken();
						break;
					case 0x12:
						this.onlobbynotfound();
						break;
					case 0x13:
						this.onlobbycreated();
						break;
					case 0x14:
						this.onlobbyfull();
						break;
					case 0x1C:
						this.onwin(msg.substring(1));		// Returns winners username
						break;
				}
			}
		}
		this.name = name;
		this.lobby = lobby;

		this.ws.onclose = () =>{
			ondisconnect();
			delete this.name;
			delete this.lobby;
			delete this.ws;
		}
	}

	exitLobby(){
		this.ws.close();
	}

	getUsers(){			// Returns names of other users in lobby
		this.ws.send(0x00);
	}

	add(id, formData){					// Add image to server
		this.ws.send(charCode(0x1A) + id);
		fetch(`https://sputnik.zone/school/Sammanslaget2024/image/uploadImage.php?lobbynameid=${this.lobby + this.name + id}`, {
			method: 'POST',
			body: formData
		});
	}

	remove(id){							// Remove image from server
		this.ws.send(charCode(0x1B) + id);
	}

	win(){							// Win the game
		this.ws.send(charCode(0x1C));
	}
}

function charCode(code){
	return String.fromCharCode(code);
}