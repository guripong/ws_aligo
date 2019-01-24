'use strict';

const express = require('express');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;

const PORT = process.env.PORT || 7979;

const server = express()
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new SocketServer({ server });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};


var lambdaip = `::ffff:52.71.221.159`;
var lambdaws = ``;

wss.on('connection', function connection(ws, req) {

  ws.on('message', function incoming(data) {
    var ip = req.connection.remoteAddress;
    //ip=req.headers['x-forwarded-for'].split('/\s*','\s*/')[0];
    //console.log(`1:`,req.headers['x-forwarded-for']);

    if (ip == lambdaip) {
      console.log(`here is lambda!`);
      lambdaws = ws;
      console.log(`receive data:`,data);
      lambdaws.send('i received:'+data);
    }

    // Broadcast to everyone else.
    if (data.indexOf('PING') !== -1) {
      //console.log('ip:', ip, '->received:PING');
    }



    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data); //전부다한테 보냄
      }
    });

  });//message


}); //connection


setInterval(() => {
  wss.clients.forEach((client) => {
    client.send('PING:'+new Date().toTimeString());
  });
}, 5000);