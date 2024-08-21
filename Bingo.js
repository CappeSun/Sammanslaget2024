export class Bingo{
	constructor(onwin, ongetusers, onreconnect, ondisconnect){
		this.ws;
		#onwin = onwin;
		#ongetusers = ongetusers;
		#onreconnect = onreconnect;
		#ondisconnect = ondisconnect;
	}

	connect(name, lobby, isCreate){
		ws = new WebSocket(`wss://renderimojs.com/${name + charCode(0x00) + isCreate ? charCode(0x10) + lobby}`);
		ws.onopen = () =>{
			ws.onmessage = (event) =>{
				switch (msg[0]){
					case 0x00:
						this.ongetusers(JSON.parse(msg.substring(1));
						break;
					case 0x03:
						ws.send(charCode(0x03));
						break;
					case 0x14:
						this.onreconnect(JSON.parse(msg.substring(1)));
						break;
					case 0x22:
						this.onwin(msg.substring(1));
						break;
				}
			}
		}
		ws.onclose = () =>{
			ondisconnect();
		}
	}

	getUsers(){			// Returns names of other users in lobby
		ws.send(0x00);
	}

	add(id, formData){
		ws.send(charCode(0x20) + id);
		fetch(`https://sputnik.zone/school/Sammanslaget2024/image/uploadImage.php`, {
			method: 'POST',
			body: formData
		});
	}

	remove(id){
		ws.send(charCode(0x21) + id);
	}

	win(){
		ws.send(charCode(0x22));
	}

	#charCode(code){
		return String.fromCharCode(code);
	}
}