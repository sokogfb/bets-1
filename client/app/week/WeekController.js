
weekModule

.controller('WeekController', [
'$scope', 'WeekFactory', 'RolesFactory', 'UserInformation', 'InitUrls', 'CallUrlService', '$translate',
function ($scope, WeekFactory, RolesFactory, UserInformation, InitUrls, CallUrlService, $translate) {

    $scope.WeekFactory = WeekFactory;
    $scope.parseInt = parseInt;

    $scope.loadLastTwoWeeks = function () {
        WeekFactory.resetWeekFactory();
        WeekFactory.fetchCurrentWeek(function () {
            WeekFactory.fetchCurrentWeekBet();
        });
        WeekFactory.fetchBeforeCurrentWeek(function () {
            WeekFactory.fetchBeforeCurrentWeekBet();
        });
    }

    $scope.loadLastTwoWeeks();

    $scope.loadSpecificWeekByNumber = function (weekNo) {
        WeekFactory.resetWeekFactory();
        WeekFactory.fetchWeekByNumber(function () {
            WeekFactory.fetchBetForWeekByNumber({number: weekNo},
            function () {
                $scope.searchOn = true;
            },
            function () {
                $scope.searchOn = true;
            });
        }, weekNo);
    }

    $scope.searchOn = false;
    $scope.searchedWeek = {
        model: '',
        number: NaN
    };

    $scope.searchWeek = function () {

        var weekNo = parseInt($scope.searchedWeek.model);
        $scope.searchedWeek.number = weekNo;
        if (isNaN(weekNo)) {
            return;
        }

        $scope.loadSpecificWeekByNumber(weekNo);

    }

    $scope.searchOff = function () {
        $scope.searchOn = false;
    }

    $scope.refreshBets = function () {
        WeekFactory.fetchCurrentWeekBet();
        WeekFactory.fetchBeforeCurrentWeekBet();

        $scope.mailNotificationStatus.error = false;
        $scope.mailNotificationStatus.success = false;
        $scope.mailNotificationStatus.inProgress = false;
    }

    $scope.refreshSearchedWeek = function () {
        WeekFactory.fetchBetForWeekByNumber({number: $scope.searchedWeek.number});

        $scope.mailNotificationStatus.error = false;
        $scope.mailNotificationStatus.success = false;
        $scope.mailNotificationStatus.inProgress = false;
    }

    $scope.mailNotificationStatus = {
        success: false,
        error: false,
        inProgress: false,
        message: ''
    };

    $scope.sendMailNotificationOnNewWeek = function () {
        $scope.mailNotificationStatus.inProgress = true;
        InitUrls.then(function (urls) {
            CallUrlService.get({uri: urls.week.mailNotificationOnNewWeek},
            function (data) {
                $scope.mailNotificationStatus.error = false;
                $scope.mailNotificationStatus.success = true;
                $scope.mailNotificationStatus.inProgress = false;
                $scope.mailNotificationStatus.message = data.message;
            },
            function (response) {
                $scope.mailNotificationStatus.error = true;
                $scope.mailNotificationStatus.success = false;
                $scope.mailNotificationStatus.inProgress = false;

                if (response.data.message) {
                    $scope.mailNotificationStatus.message = response.data.message;
                }
                else {
                    $scope.mailNotificationStatus.message = $translate.instant('weekPage.mailNotificationsNotSent');
                }

            });
        });
    }

    $scope.userInfo = UserInformation;
    $scope.RolesFactory = RolesFactory;
}
])

;
