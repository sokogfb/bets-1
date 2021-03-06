
var Roles = require('./../model/Roles.js')('en');
var Translations = require('./../config/Translations.js');

var hasRole = function (role) {
    return function (req, res, next, user, onError, onSuccess) {
        if (role && Roles.roleValue(user.role) < Roles.roleValue(role)) {
            res.status(401).json({
                message: Translations[req.query.lang].tokenChecks.notPermittedToExecuteMethod
            });
            onError();
        }
        else {
            onSuccess();
        }
    }
}

var hasSameId = function () {
    return function (req, res, next, user, onError, onSuccess) {

        if (user._id != req.params.id) {
            res.status(401).json({
                message: Translations[req.query.lang].tokenChecks.notPermittedToExecuteMethod
            }).end();
            onError();
        }
        else {
            onSuccess();
        }

    }
}

var hasSameIdOrHasRole = function (role) {
    return function (req, res, next, user, onError, onSuccess) {

        if (role && Roles.roleValue(user.role) < Roles.roleValue(role)) {
            // if role isn't enough, check if same id
            if (user._id != req.params.id) {
                res.status(401).json({
                    message: Translations[req.query.lang].tokenChecks.notPermittedToExecuteMethod
                }).end();
                onError();
            }
            else {
                onSuccess();
            }
        }
        else {
            onSuccess();
        }

    }
}

module.exports = {
    hasRole: hasRole,
    hasSameId: hasSameId,
    hasSameIdOrHasRole: hasSameIdOrHasRole
};
