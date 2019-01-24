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
/*
 request.post(
        {
          url: 'https://apis.aligo.in/send/',
          form:
          {
            key: 'u1jsqzbnrmkwy95xi3znqg040bfxpjip',
            user_id:'guripong',
            sender:'01086867659',
            receiver:`
            01027794543,
            01098551337,
            01063689515,
            01027675501,
            01086867659,
            01026017659,
            01053247659,
            01089520405,
            01026598965,
            01090666539,
            01024461019,
            01051809398,
            01053117659,
            01087597188,
            01032657613,
            01095904515,
            01094775127,
            01037147354,
            01034921212,
            01076007862,
            01027228145,
            01068581115,
            01071514572,
            01050931760,
            01046535481,
            01031531405,
            01053884150,
            01086365250,
            01027256869,
            01062258627,
            01051950204,
            01025644182,
            01053637687,
            01094237063,
            01021041787,
            01092827440,
            01020817659,
            01089379528,
            01032407578,
            01030082186,
            01076884510,
            01029206209,
            01032047659,
            01088687659,
            01090036008,
            01045345735,
            01097870474,
            01099457659,
            01064360780,
            01093307659,
            01033848508,
            01090795343,
            01047840518,
            01073735534,
            01033187659,
            01026988986,
            01038463287,
            01033807659,
            01091252580,
            01030239366
            `,
            msg:data+' <by Jace ,AI동아리 회장 김성식> ',
          }
        },


*/
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
            sender:'01086867659',
            receiver:`
            01027794543,
            01098551337,
            01063689515,
            01027675501,
            01086867659`,
            msg:data+' <by Jace ,AI동아리 회장 김성식> ',
          }
        },
        function (err, res, body) {
          if(err)
          {
            console.log(`request error!!!!`);
            lambdaws.send('I failed to send the message, ' + data + ', to everybody!');
          }
          else{
            //console.log(`success  res:`,res);
            //console.log(`success  body:`,body);
            
            lambdaws.send('I Successfully sent the message, ' + data + ', to everybody!');
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