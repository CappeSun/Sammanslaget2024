export class Bingo{
	constructor(onwin, ongetusers, onstart, onreconnect, ondisconnect, onnametaken, onlobbytaken){
		this.ws;
		#onwin = onwin;
		#ongetusers = ongetusers;
		#onstart = onstart;
		#onreconnect = onreconnect;
		#ondisconnect = ondisconnect;
		#onnametaken = onnametaken;
		#onlobbytaken = onlobbytaken;
	}

	enterLobby(name, lobby, isCreate){
		ws = new WebSocket(`wss://renderimojs.com/${name + charCode(0x00) + isCreate ? charCode(0x10) : '' + lobby}`);
		ws.onopen = () =>{
			ws.onmessage = (event) =>{
				switch (msg[0]){
					case 0x00:
						this.ongetusers(JSON.parse(msg.substring(1));
						break;
					case 0x01:
						this.onreconnect(JSON.parse(msg.substring(1)));
						break;
					case 0x03:
						ws.send(charCode(0x03));
						break;
					case 0x22:
						this.onwin(msg.substring(1));
						break;
				}
			}
		}
		this.name = name;
		this.lobby = lobby;

		ws.onclose = () =>{
			ondisconnect();
			delete this.name;
			delete this.lobby;
		}
	}

	exitLobby(){
		this.ws.close();
	}

	getUsers(){			// Returns names of other users in lobby
		ws.send(0x00);
	}

	add(id, formData){					// Add image to server
		ws.send(charCode(0x20) + id);
		fetch(`https://sputnik.zone/school/Sammanslaget2024/image/uploadImage.php?lobbynameid=${this.lobby + this.name + id}`, {
			method: 'POST',
			body: formData
		});
	}

	remove(id){							// Remove image from server
		ws.send(charCode(0x21) + id);
	}

	win(){							// Win the game
		ws.send(charCode(0x22));
	}

	#charCode(code){
		return String.fromCharCode(code);
	}
}