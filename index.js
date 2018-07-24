const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'), Schema = mongoose.Schema;
const bodyParser = require('body-parser');

const server = express();
server.use(cors());

const port = process.env.PORT || 3030;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:admin1234@ds018558.mlab.com:18558/passwordgen');

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

const UserInfo = new Schema ({
  username: {
    type: String
  },
  website: {
    type: String
  },
  password: {
    type: String,
    required: true
  }
});

const Login = new Schema ({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

const User = mongoose.model('UserInfo', UserInfo);
const UserLogin = mongoose.model('Login', Login);

server.get('/', (req, res) => {
  res.send('IF YOU ARE SEEING THIS! YOU ARE NOT ALLOWED HERE');
});

server.post('/isLoggedIn', (req, res) => {
})

server.post('/createUser', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(500).json({ direction: 'Failed', data: 'Empty Input' });
  }
  const newUser = new UserLogin();
  newUser.username = username;
  newUser.password = password;
  newUser.save(err => {
    if (err) {
      return res.status(500).json({ direction: 'Failed', data: err });
    }
  });
  res.status(200).json({ direction: 'Success', data: 'Saved' });
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(500).json({ direction: 'Failed', data: 'Input is empty' });
  }
  UserLogin.findOne({ username: username })
    .then(packet => {
      if (!packet) {
        return res.status(402).json({ direction: 'Failed', data: 'Username or Password is incorrect' });
      }
      if (packet.password !== password) {
        return res.status(402).json({ direction: 'Failed', data: 'Username or Password is incorrect' });
      }
      res.status(200).json({ direction: 'Success', data: packet });
    })
    .catch(err => {
      console.log(err);
      return res.status(400).json({ direction: 'Failed', data: err });
    });
});

server.post('/sendInfo', (req, res) => {
  const { username, password, website } = req.body;
  console.log(req.body);
  console.log('hello');
  if (!username || !password || !website) {
    return res.status(403).json({ message: 'empty input' });
  }
  const addInfo = new User();
  addInfo.username = username;
  addInfo.website = website;
  addInfo.password = password;
  addInfo.save();
  res.status(200).json({ direction: 'Success', data: 'Saved' });
});

server.post('/sendOne', (req, res) => {
  let { website } = req.body;
  if (!website) {
    return res.status(500).json({ direction: 'Failed', data: 'Input is empty' });
  }
  website = website.toLowerCase();
  User.findOne({ website })
    .then(result => {
      if (!result) {
        return res.status(403).json({ direction: 'Failed', message: 'No results' });
      }
      res.status(200).json({ direction: 'Success', data: result });
    })
    .catch(err => {
      res.statu(500).json({ direction: 'Failed', data: err });
    });
})

server.get('/getInfo', (req, res) => {
  User.find({})
    .then(packet => {
      res.status(200).json({ direction: 'Success', data: packet });
    })
    .catch(err => {
      return res.status(400).json({ direction: 'Failed', data: err });
    });
});

server.listen(port, () => {
  console.log(`Server is up and running on ${port}`);
});
