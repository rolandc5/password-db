const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'), Schema = mongoose.Schema;
const bodyParser = require('body-parser');

const server = express();
const port = process.env.PORT || 3030;
server.use(cors());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:admin1234@ds018558.mlab.com:18558/passwordgen');

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

const User = mongoose.model('UserInfo', UserInfo);

server.get('/', (req, res) => {
  res.send('IF YOU ARE SEEING THIS! YOU ARE NOT ALLOWED HERE');
})

server.post('/sendInfo', (req, res) => {
  const { username, password, website } = req.body;
  const addInfo = new User();
  addInfo.username = username;
  addInfo.website = website;
  addInfo.password = password;
  addInfo.save(err => {
    if (err) {
      res.send('Save error');
    }
  });
  res.status(200).json({ direction: 'Success' });
});

server.get('/getInfo', (req, res) => {
  User.find({})
    .then(user => {
      res.status(200).json({ direction: 'Success', data: user });
    })
    .catch(err => {
      res.status(400).json({ direction: 'Failure', data: err });
    })
})

server.listen(port, () => {
  console.log(`Server is up and running on ${port}`)
});
