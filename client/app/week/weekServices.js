
weekModule

.factory('WeekFactory',[
'InitUrls', 'CallUrlService',
function (InitUrls, CallUrlService) {

    var thisFactory = {};

    thisFactory.error = {
        current: {
            active: false,
            message: ''
        },
        beforeCurrent: {
            active: false,
            message: ''
        },
        all: {
            active: false,
            message: ''
        },
        newWeekSave: {
            active: false,
            message: ''
        },
        alteredWeek: {
            active: false,
            message: ''
        }
    };

    thisFactory.resetWeekFactory = function () {

        thisFactory.error = _.object(_.map(thisFactory.error, function (item, key) {
            item.active = false;
            item.message = '';
            return [key, item];
        }));

        thisFactory.currentWeek = null;
        thisFactory.beforeCurrentWeek = null;
        thisFactory.allWeeks = null;

    }

    thisFactory.fetchCurrentWeek = function () {

        thisFactory.error.current.active = false;
        thisFactory.currentWeek = null;

        InitUrls.then(
            function (data) {
                CallUrlService.get({uri: data.week.current},
                    function (data) {
                        thisFactory.currentWeek = data;
                    },
                    function (response) {
                        thisFactory.error.current.active = true;
                        thisFactory.error.current.message = "An error occured.";
                    }
                );
            }
        );
    }

    thisFactory.fetchBeforeCurrentWeek = function () {

        thisFactory.error.beforeCurrent.active = false;
        thisFactory.beforeCurrentWeek = null;

        InitUrls.then(
            function (data) {
                CallUrlService.get({uri: data.week.beforeLast},
                    function (data) {
                        thisFactory.beforeCurrentWeek = data;
                    },
                    function (response) {
                        thisFactory.error.beforeCurrent.active = true;
                        thisFactory.error.beforeCurrent.message = "An error occured.";
                    }
                );
            }
        );
    }

    thisFactory.fetchAllWeeks = function () {

        thisFactory.allWeeks = null;
        thisFactory.error.all.active = false;

        InitUrls.then(function (data) {

            CallUrlService.get({uri: data.week.address},
            function (data) {
                thisFactory.allWeeks = data;
            },
            function (response) {
                thisFactory.error.all.active = true;
                thisFactory.error.all.message = "An error occured.";
            }
            );

        });

    }

    thisFactory.saveANewWeek = function (newWeek, successCallback) {

        thisFactory.error.newWeekSave.active = false;

        InitUrls.then(function (data) {

            CallUrlService.post({uri: data.week.address}, newWeek,
                function (data) {
                    successCallback({
                        message: "Week saved successfully."
                    });
                },
                function (response) {
                    thisFactory.error.newWeekSave.active = true;
                    thisFactory.error.newWeekSave.message = "Week wasn't saved. An error occured.";
                }
            );

        });
    }

    thisFactory.alterWeek = function (alteredWeek, successCallback) {

        thisFactory.error.alteredWeek.active = true;

        InitUrls.then(function (data) {

            CallUrlService.post({uri: data.week.address}, newWeek,
                function (data) {
                    successCallback({
                        message: "Week saved successfully."
                    });
                },
                function (response) {
                    thisFactory.error.alteredWeek.active = true;
                    thisFactory.error.alteredWeek.message = "Week wasn't saved. An error occured.";
                }
            );

        });
    }

    return thisFactory;

}
])

.factory('BetFactory',[
'InitUrls', 'CallUrlService',
function (InitUrls, CallUrlService) {

    var betFactory = {};

    betFactory.place = function (bets) {

        InitUrls.then(function (data) {

            CallUrlService.post({uri: data.bet.place}, bets,
            function (data) {

            },
            function (response) {

            }
            );

        });

    }

    return betFactory;

}
])

;