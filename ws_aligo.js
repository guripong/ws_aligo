'use strict';

const express = require('express');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;
const request = require('request');
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
      request.post(
        {
          url: 'https://apis.aligo.in/send/',
          form:
          {
            key: 'u1jsqzbnrmkwy95xi3znqg040bfxpjip',
            user_id:'guripong',
            sender:'01027794543',
            receiver:'01086867659',
            msg:data+' <by Jace> ',
          }
        },
        function (err, res, body) {
          if(err)
          {
            console.log(`request error!!!!`);
            lambdaws.send('fail to send ' + data);
          }
          else{
            //console.log(`success  res:`,res);
            //console.log(`success  body:`,body);
            
            lambdaws.send('success to send a message that ' + data + 'to every users!');
          }

        }
      .bind(lambdaws));

    
     

     
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