var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('contactsdb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'contactsdb' database");
        db.collection('contacts', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'contacts' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving contact: ' + id);
    db.collection('contacts', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('contacts', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addContact = function(req, res) {
    var contact = req.body;
    console.log('Adding contact: ' + JSON.stringify(contact));
    db.collection('contacts', function(err, collection) {
        collection.insert(contact, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateContact = function(req, res) {
    var id = req.params.id;
    var contact = req.body;
    console.log('Updating contact: ' + id);
    console.log(JSON.stringify(contact));
    db.collection('contacts', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, contact, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating contact: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(contact);
            }
        });
    });
}
 
exports.deleteContact = function(req, res) {
    var id = req.params.id;
    console.log('Deleting contact: ' + id);
    db.collection('contacts', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var contacts = [
    {
        name: "Ricky Lamba",
        email: "ricky.phoenix.lamba@gmail.com",
        phone: "9983526207"
    },
    {
        name: "Prabhjot Singh Lamba",
        email: "prabhjot.singh.lamba.1@gmail.com",
        phone: "8897061412"
    }];
 
    db.collection('contacts', function(err, collection) {
        collection.insert(contacts, {safe:true}, function(err, result) {});
    });
 
};