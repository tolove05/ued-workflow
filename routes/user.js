/**
 * Created with JetBrains WebStorm.
 * User: xiongsongsong
 * Date: 13-4-22
 * Time: 下午9:55
 * To change this template use File | Settings | File Templates.
 */


var app = require('app');
var DB = require('db');

function user() {
    var u = new DB.Collection(DB.Client, 'user');
    u.find({}).toArray(function (err, docs) {
        exports.user = docs;
        console.log(exports.user);
    });
}

DB.runCb(user);