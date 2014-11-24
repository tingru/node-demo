/*
    taskController.js

    REST API controller for /tasks
*/
'use strict';

var express = require('express');
var _db;

function getAllTasks(req, res, next) {
    _db.all('select rowid, title, done from Tasks where done=0', function (err, rows) {
        if(err) {
            return next(err);
        }

        res.json(rows);

    });
}

function insertTask(req, res, next) {
    //every ask must hae a tittle property that is non-blank
    if(!req.body.title || 0 == req.body.title.trim().length) {
        return next({statusCode: 400, message: 'All tasks must have title!'});
    }
    _db.run('insert into tasks(title, done) values(?, 0)', req.body.title, function(err) {
        if(err) {
            return next(err);
        }
        res.json({rowid: this.lastID});
    });
}

function updateTask(req, res, next) {
    _db.run('update Tasks set done=? where rowid=?', req.body.done, req.params.id, function(err) {
            if(err) {
                return next(err);
            }
            res.json({rowsAffected: this.changes});
        });

}
module.exports.Router = function(db) {
    //hold on to database reference
    _db = db;

    //create a router for our routes
    var router = express.Router();

    //add routes for:

    //GET /tasks (gets all undone tasks)
    router.get('/tasks', getAllTasks);

    //POST /tasks (inserts new task)
    router.post('/tasks', insertTask);

    //GET /tasks/:id (gets a particular task)
    //PUT /tasks/:id (updates a particular task)
    router.put('/tasks/:id', updateTask);
    //DELETE /tasks/:id (deletes a particular task)

    return router;
};
