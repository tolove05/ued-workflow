/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-7-11
 * Time: 下午4:24
 * To change this template use File | Settings | File Templates.
 */
var app = require('app');
var DB = require('db');

app.get('/search', function (req, res) {
    var search = new DB.Collection(DB.Client, 'task-of-design');

    var keywords = req.query.keywords;
    if (keywords) {
        keywords = keywords.split(/\s+/);
        var regexp = new RegExp('(?:' + keywords.join('|') + ')');
    }

    var filter = {};

    if (regexp) filter.$or = [
        {to: regexp},
        {name: regexp},
        {demand_side: regexp}
    ]

    if (filter)

        search.find(
                filter
            ).toArray(function (err, data) {
                res.json({data: data});
            })

    /*DB.mongodb.command({ text: 'collectionName', search: '短发' }, function (e, o) {
     if (e) {
     console.log(e, 'error')
     }
     else {
     console.log(e, o)
     }
     });*/
    DB.dbServer.command({ text: 'task-of-design', search: '短发' }, function (e, o) {
        if (e) {
            console.log(e, 'error')
        }
        else {
            console.log(JSON.stringify(o))
        }
    })
});