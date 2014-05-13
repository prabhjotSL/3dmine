var express = require('express'),
	contacts = require('./routes/contacts');
 
var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/contacts', contacts.findAll);
app.get('/contacts/:id', contacts.findById);
app.post('/contacts', contacts.addContact);
app.put('/contacts/:id', contacts.updateContact);
app.delete('/contacts/:id', contacts.deleteContact);
 
app.listen(3000);
console.log('Listening on port 3000...');