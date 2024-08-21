import http from "http";
import { WebSocketServer } from "ws";
import url from "url";
import { v4 as uuidv4 } from "uuid";

const server = http.createServer();
const ws = new WebSocketServer({ server });
const port = 8000;

const users = {};
const lobbys = {};

const generateLobbyCode = () => {
  let code;
  do {
    code = uuidv4().slice(0, 6);
  } while (lobbys[code]);
  return code;
};

const handleMessage = (bytes, id) => {
  const message = JSON.parse(bytes.toString());

  if (message.action === "create") {
    const code = generateLobbyCode();
    lobbys[code] = {
      users: [id],
    };

    users[id].connection.send(JSON.stringify({ success: true, code: code }));
  }

  if (message.action === "join") {
    const code = message.code;

    if (!lobbys[code].users.includes(id)) {
      lobbys[code].users.push(id);

      // Notify all users in the lobby about the new user
      lobbys[code].users.forEach((userId) => {
        if (userId !== id) {
          users[userId].connection.send(
            JSON.stringify({
              user: { id, username: users[id].username },
            })
          );
        }
      });

      // Send back to the joining user all the users already in the lobby
      const existingUsers = lobbys[code].users.map((userId) => ({
        id: userId,
        username: users[userId].username,
      }));

      users[id].connection.send(
        JSON.stringify({
          success: true,
          code,
          users: existingUsers,
        })
      );
    }

    if (message.action === "username") {
        // Add or overwrite username
        users[id].username === message.username

        console.log(users)
        
        Object.values(v => {
            console.log(v)
        })

        users[id].connection.send(JSON.stringify({ success: true, users }));
    }
  }
};

const handleClose = (id) => {
  // Handle user disconnection
};

ws.on("connection", (connection) => {
  const id = uuidv4();

  users[id] = { connection };

  connection.on("message", (message) => handleMessage(message, id));
  connection.on("close", () => handleClose(id));

  connection.send(JSON.stringify({ success: true, user: { id } }));
});

server.listen(port, () => {
  console.log(`WebSocket server is running on port: ${port}`);
});
