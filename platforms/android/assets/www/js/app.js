var starter=angular.module("starter",["ionic","ionic.service.core","ionic.service.analytics","chart.js","ngCordova"]);starter.run(["$ionicPlatform","$ionicAnalytics",function(t,e){t.ready(function(){e.register(),window.cordova&&window.cordova.plugins.Keyboard&&(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),cordova.plugins.Keyboard.disableScroll(!0)),window.StatusBar&&StatusBar.styleDefault()})}]),starter.config(["$stateProvider","$urlRouterProvider",function(t,e){t.state("app",{url:"/app","abstract":!0,templateUrl:"templates/menu.html",controller:"AppCtrl"}).state("app.hello",{url:"/hello",views:{menuContent:{templateUrl:"templates/hello.html",controller:"HelloCtrl"}}}).state("app.conditions",{url:"/conditions",views:{menuContent:{templateUrl:"templates/conditions.html",controller:"ConditionsCtrl"}}}).state("app.status",{url:"/status",views:{menuContent:{templateUrl:"templates/status.html",controller:"StatusCtrl"}}}).state("app.settings",{url:"/settings",views:{menuContent:{templateUrl:"templates/settings.html",controller:"SettingsCtrl"}}}).state("app.results",{cache:!1,url:"/results",views:{menuContent:{templateUrl:"templates/results.html",controller:"ResultsCtrl"}}}).state("app.docs",{url:"/docs",views:{menuContent:{templateUrl:"templates/docs.html",controller:"DocsCtrl"}}}).state("app.feedback",{url:"/feedback",views:{menuContent:{templateUrl:"templates/feedback.html",controller:"FeedbackCtrl"}}}).state("app.disclaimer",{url:"/disclaimer",views:{menuContent:{templateUrl:"templates/disclaimer.html",controller:"DisclaimerCtrl"}}}).state("app.help",{url:"/help",views:{menuContent:{templateUrl:"templates/help.html",controller:"HelpCtrl"}}}).state("app.nice",{url:"/nice",views:{menuContent:{templateUrl:"templates/nice.html",controller:"NiceCtrl"}}}).state("app.about",{url:"/about",views:{menuContent:{templateUrl:"templates/about.html",controller:"AboutCtrl"}}}),e.otherwise("/app/hello")}]);