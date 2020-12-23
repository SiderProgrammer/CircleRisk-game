const redis = require('redis')
const session = require('express-session')

const RedisStore = require('connect-redis')(session)
const client = redis.createClient()

client.on('connect', () => console.log('Connected to Redis', 6379))
client.on('error', console.error)

const { promisify } = require('util')

const hmgetASync = promisify(client.hmget).bind(client)
const hmsetASync = promisify(client.hmset).bind(client)
const setAsync = promisify(client.set).bind(client)
const getAsync = promisify(client.get).bind(client)
const incrbyAsync = promisify(client.incrby).bind(client)

const cookieLifeTime = 1000 * 60 * 30 // 1000 * 60 * 60 * 48

const multi = client.multi()

const hdelMutli = (hset, hkeys) => {
  hkeys.forEach((hkey) => {
    multi.hdel(hset, hkey)
  })
  multi.exec((err, res) => {
    if (err) throw err
    console.log('terminated. results: %j', res)
  })
}

module.exports = {
  session: session({
    store: new RedisStore({ client }),
    resave: false,
    rolling: true,
    saveUninitialized: true,
    secret: '573a01cb727e6b09728167f88deffcdc2b7ec407ff12afa2db2a406b11cd932c',
    cookie: {
      expires: new Date(Date.now() + cookieLifeTime), // 1000 * 60 * 60 * 48,
      maxAge: cookieLifeTime,
      sameSite: true,
      httpOnly: true,
      secure: false,
    },
    ttl: cookieLifeTime / 1000,
  }),
  client,
  hmsetASync,
  hmgetASync,
  getAsync,
  setAsync,
  incrbyAsync,
  hdelMutli,
}
