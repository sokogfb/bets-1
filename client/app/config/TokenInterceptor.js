
configModule

.config(['$provide', '$httpProvider', function ($provide, $httpProvider) {


    $provide.factory('TokenInterceptor', [
        '$q', 'LoginTokenFactory',
        function ($q, LoginTokenFactory) {

            return {
                request: function (config) {

                    if (config.url.indexOf("ip-api.com") < 0) {
                        var token = LoginTokenFactory.getToken();
                        if (token) {
                            config.headers['x-access-token'] = token.token;
                        }
                    }

                    return config|| $q.when(config);
                }
            }
        }
    ]);

    $httpProvider.interceptors.push('TokenInterceptor');

}]);
