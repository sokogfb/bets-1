betsModule

.controller('WelcomeController', [
'$scope', 'UserInformation', 'InitUrls', 'Settings', 'Templates',
function ($scope, UserInformation, InitUrls, Settings, Templates) {

    $scope.userInfo = UserInformation;
    $scope.Settings = Settings;
    $scope.Templates = Templates;

    $scope.carouselSlides = [];

    function shuffle(o){ // shuffle array
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    var prepareSlides = function (n, keep) {
        for (var i = 0; i < n; i++) {
            $scope.carouselSlides.push({
                image: '/images/carousel/' + i + '.jpg',
                title: carouselImagesDescription[i].title,
                description: carouselImagesDescription[i].description
            });
        }
        $scope.carouselSlides = shuffle($scope.carouselSlides).slice(0, 3);
    }

    prepareSlides(TOTAL_CAROUSEL_IMAGES, 3);

}
]
);