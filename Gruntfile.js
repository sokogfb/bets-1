
'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({

        concat: {
            options: {
                separator: '\r\n'
            },
            dist: {
                src: [

                    'client/lib/jquery/dist/jquery.js',
                    'client/lib/jquery-ui/jquery-ui.min.js',
                    'client/lib/angular/angular.js',
                    'client/lib/angular-ui-date/src/date.js',
                    'client/lib/angular-resource/angular-resource.js',
                    'client/lib/angular-cookies/angular-cookies.js',
                    'client/lib/bootstrap/dist/js/bootstrap.js',
                    'client/lib/underscore/underscore-min.js',

                    <!--    APP -->
                    'client/app/utils/utilsModule.js',
                    'client/app/utils/utilServices.js',

                    'client/app/settings/settingsModule.js',
                    'client/app/settings/Settings.js',

                    'client/app/templates/templatesModule.js',
                    'client/app/templates/templatesProvider.js',

                    'client/app/resources/resourceModule.js',
                    'client/app/resources/ResourceServices.js',

                    'client/app/user/userModule.js',
                    'client/app/user/UserServices.js',
                    'client/app/user/UserController.js',
                    'client/app/user/RegisterController.js',
                    'client/app/user/AccountActivationController.js',

                    'client/app/config/configModule.js',
                    'client/app/config/RoutesFactory.js',
                    'client/app/config/TokenInterceptor.js',
                    'client/app/config/401-Interceptor.js',

                    'client/app/ranking/rankingModule.js',
                    'client/app/ranking/RankingController.js',
                    'client/app/ranking/RankingServices.js',

                    'client/app/week/weekModule.js',
                    'client/app/week/weekServices.js',
                    'client/app/week/WeekController.js',
                    'client/app/week/AddNewWeekController.js',
                    'client/app/week/weekDirective.js',

                    'client/app/profile/profileModule.js',
                    'client/app/profile/ProfileController.js',
                    'client/app/profile/ProfileServices.js',

                    'client/app/history/historyModule.js',
                    'client/app/history/HistoryServices.js',
                    'client/app/history/HistoryController.js',

                    'client/app/admin/adminModule.js',
                    'client/app/admin/AdminPanelController.js',
                    'client/app/admin/AdminRankingPanel.js',
                    'client/app/admin/AdminUsersPanel.js',

                    'client/app/app.js',

                    'client/app/main/WelcomePageController.js',
                    'client/app/main/mainController.js'

                ],
                dest: 'client/dist/built.js'
            }
        },

        uglify: {
                min: {
                    options: {
                        sourceMap: true,
                        sourceMapName: 'client/dist/built.map'
                    },
                    files: {
                        'client/dist/built.min.js': ['client/dist/built.js']
                    }
                }
            }
        }
    );


    grunt.registerTask('cat-min', function() {
        grunt.task.run(
            [
                'concat',
                'uglify'
            ]
        );
    });

    grunt.registerTask('clean-dist', function() {
        grunt.task.run(
            [
                'clean:clean_dist'
            ]
        );
    });

};
