const sip = require('sip');
const proxy = require('sip/proxy');
const fs = require('fs');

const contacts = {};

function formatDate(date) {
  return new Date(date).toLocaleString('en-SK')
}

function saveLog(message, type) {
  let content;

  if (message.method === 'INVITE' && type === 'send') {
    const from = sip.parseUri(message.headers.from.uri).user;
    const to = sip.parseUri(message.headers.to.uri).user;
    content = `Call from ${from} to ${to} at ${formatDate(Date.now())}`;
  }
  else if (message.method === 'CANCEL' && type === 'send') {
    const from = sip.parseUri(message.headers.from.uri).user;
    const to = sip.parseUri(message.headers.to.uri).user;
    content = `Canceled call from ${from} to ${to} at ${formatDate(Date.now())}`;
  }
  else if (message.status === 486 && type === 'recv') {
    const to = sip.parseUri(message.headers.to.uri).user;
    content = `${to} declined call`;
  }

  if (!content)
    return;

  fs.writeFile('./logs/calls.log', content + '\n', { flag: 'a+' }, (err) => {});
}

const logger = {
  send: (message) => saveLog(message, 'send'),
  recv: (message) => saveLog(message, 'recv')
};

function onResponse(request, response) {
  if (response.status === 486) {
    request.headers.via.shift();
    proxy.send(sip.makeResponse(request, 486, 'Obsadene'), (response) => onResponse(request, response));
  }
  else {
    response.headers.via.shift();

    proxy.send(response, (response) => onResponse(request, response));
  }
}

proxy.start({ logger }, (request) => {
  if (request.method === 'REGISTER') {
    const user = sip.parseUri(request.headers.to.uri).user;

    contacts[user] = request.headers.contact;
    const response = sip.makeResponse(request, 200, 'Ok');
    response.headers.to.tag = Math.floor(Math.random() * 1e6);

    proxy.send(response);
  }
  else {
    const user = sip.parseUri(request.headers.to.uri).user;

    if (contacts[user] && Array.isArray(contacts[user]) && contacts[user].length > 0) {
      request.uri = contacts[user][0].uri;

      proxy.send(sip.makeResponse(request, 100, 'Trying'));

      proxy.send(request, (response) => onResponse(request, response));
    }
    else {
      proxy.send(sip.makeResponse(request, 404, 'Not Found'));
    }
  }
});

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('Proxy running on: ' + add);
})
