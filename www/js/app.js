var starter = angular.module('starter', ['ionic', 'ionic.service.core', 'ionic.service.analytics', 'chart.js', 'ngCordova']);

starter.run(function($ionicPlatform, $ionicAnalytics) {
    $ionicPlatform.ready(function() {

        $ionicAnalytics.register();

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
});

starter.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.hello', {
        url: '/hello',
        views: {
            'menuContent': {
                templateUrl: 'templates/hello.html',
                controller: 'HelloCtrl'
            }
        }
    })

    .state('app.conditions', {
        url: '/conditions',
        views: {
            'menuContent': {
                templateUrl: 'templates/conditions.html',
                controller: 'ConditionsCtrl'
            }
        }
    })

    .state('app.status', {
        url: '/status',
        views: {
            'menuContent': {
                templateUrl: 'templates/status.html',
                controller: 'StatusCtrl'
            }
        }
    })

    .state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl'
            }
        }
    })

    .state('app.results', {
        cache: false,
        url: '/results',
        views: {
            'menuContent': {
                templateUrl: 'templates/results.html',
                controller: 'ResultsCtrl'
            }
        }
    })

    .state('app.docs', {
        url: '/docs',
        views: {
            'menuContent': {
                templateUrl: 'templates/docs.html',
                controller: 'DocsCtrl'
            }
        }
    })

    .state('app.feedback', {
        url: '/feedback',
        views: {
            'menuContent': {
                templateUrl: 'templates/feedback.html',
                controller: 'FeedbackCtrl'
            }
        }
    })

    .state('app.disclaimer', {
        url: '/disclaimer',
        views: {
            'menuContent': {
                templateUrl: 'templates/disclaimer.html',
                controller: 'DisclaimerCtrl'
            }
        }
    })

    .state('app.help', {
        url: '/help',
        views: {
            'menuContent': {
                templateUrl: 'templates/help.html',
                controller: 'HelpCtrl'
            }
        }
    })

    .state('app.about', {
        url: '/about',
        views: {
            'menuContent': {
                templateUrl: 'templates/about.html',
                controller: 'AboutCtrl'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/hello');
});
