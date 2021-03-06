
// NOTE that app is defined globally

var express = require('express');

var Bet = require('./../model/Bet.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');
var weekChecks = require('./../middlewares/weekChecksForBets.js');

var mongoose = require('mongoose');

var Translations = require('./../config/Translations.js');

var fs = require('fs');
var LOG_BET_PLACEMENT_FILE_NAME = 'logs/bet_placement.txt';

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var setUserId = function(req, res, next, user, onError, onSuccess) {
    // set userId
    req.body.userId = user._id;
    req.body.username = user.username;
    onSuccess();

}

var router = express.Router();

router.get('/',
jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]),
function (req, res, next) {

    Bet.find({}, function (err, bets) {
        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].bet.betsCouldntBeFetched
            }).end();
        }
        else {
            res.status(200).json(bets).end();
        }
    });

});

router.get('/:id([0-9a-fA-F]{24})',
jwtauth([tokenChecks.hasRole('ROLE_USER')]),
function (req, res, next) {

    Bet.findOne({_id: req.params.id}, function (err, bet) {
        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].bet.betCouldntBeFetched
            }).end();
        }
        else {
            res.status(200).json(bet).end();
        }
    });

});

router.post('/',
jwtauth([tokenChecks.hasRole('ROLE_USER'), setUserId]),
weekChecks.weekMiddleware([weekChecks.callbacks.checkIfWeekEnded, weekChecks.callbacks.checkIfCorrectNumberOfMatches]),

function (req, res, next) {
    // check if bet was already placed

    Bet.findOne({userId: req.body.userId, weekNumber: req.body.weekNumber},
        function (err, bet) {
            if (err) {
                res.status(500).json({
                    message: Translations[req.query.lang].bet.cannotPlaceBetFTM
                }).end();
            }
            else if (bet) {
                res.status(500).json({
                    message: Translations[req.query.lang].bet.alreadyPlacedABet
                }).end();
            }
            else {
                next();
            }
        });

},

function (req, res, next) {

    var bet = new Bet();

    bet.points = 0;
    bet.ended = false;
    bet.congratsSent = false;

    for (var i in req.body) {
        bet[i] = req.body[i];
    }

    bet.save(function (err) {
        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].bet.couldntSaveBet
            }).end();
        }
        else {
            res.status(201).json(bet).end();
            var wk = res.data.local.week;
            fs.appendFile(LOG_BET_PLACEMENT_FILE_NAME,
                'PLACEMENT -- ' +
                'user: ' + bet.username +
                ', week: ' + wk.number +
                ', bets: ' + JSON.stringify(bet.scores) +
                ', date: ' + new Date() +
                '\r\n');
        }
    });

});

router.put('/:id([0-9a-fA-F]{24})',
jwtauth([tokenChecks.hasRole('ROLE_USER')]),
weekChecks.weekMiddleware([weekChecks.callbacks.checkIfWeekEnded, weekChecks.callbacks.checkIfCorrectNumberOfMatches]),

function (req, res, next) {

    Bet.findOne({_id: req.params.id}, function (err, bet) {
        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].bet.couldntSaveBet
            }).end();
        }
        else {

            // check if user who's trying to save bet is the one who posted the bet
            if (res.data.local.user._id.toString() != bet.userId.toString()) {
                res.status(500).json({
                    message: Translations[req.query.lang].bet.notPermittedToSaveBetForAnotherUser
                }).end();
            }
            else {
                bet.points = 0; // you cannot save the bet after points are calculated, so there is no risk to overwrite results
                bet.ended = false; // the same, no risk that bet ended and you save as not ended

                bet.scores = req.body.scores;

                bet.save(function (err) {
                    if (err) {
                        res.status(500).json({
                            message: Translations[req.query.lang].bet.couldntSaveBet
                        }).end();
                    }
                    else {
                        res.status(200).json(bet).end();
                        var wk = res.data.local.week;
                        fs.appendFile(LOG_BET_PLACEMENT_FILE_NAME,
                            'CHANGE -- ' +
                            'user: ' + bet.username +
                            ', week: ' + wk.number +
                            ', bets: ' + JSON.stringify(bet.scores) +
                            ', date: ' + new Date() +
                            '\r\n');
                    }
                });

            }

        }
    });

});

app.use('/api/bet', router);
