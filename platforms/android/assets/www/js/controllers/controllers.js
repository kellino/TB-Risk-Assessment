starter.controller("AppCtrl",["$scope","$state","SettingsFactory","Navigator",function(t,e,o,n){t.$on("ionicView.enter",function(){t.loadNiceData(),t.loadFirstScreen()}),t.loadFirstScreen=function(){o.get().showHello===!1?n.changeState("app.status"):n.changeState("app.hello")}}]),starter.controller("AboutCtrl",["$scope","$state","$ionicPopup","Navigator",function(t,e,o,n){t.goToLink=function(t){try{window.open(t,"_system")}catch(e){o.alert("Unable to connect to the internet")}},t.goBack=function(){n.changeState("app.status")}}]),starter.controller("DisclaimerCtrl",["$scope","$state","Navigator",function(t,e,o){t.goBack=function(){o.changeState("app.status")}}]),starter.controller("DocsCtrl",["$scope","$state","Navigator",function(t,e,o){t.goBack=function(){o.changeState("app.status")}}]),starter.controller("SettingsCtrl",["$scope","SettingsFactory","$ionicPopup",function(t,e,o){t.$on("ionicView.enter",function(){try{t.settings=e.get()}catch(n){o.alert({title:"Error",template:"Unable to access settings"})}}),t.onShowClick=function(){e.setShowHello()}}]),starter.controller("HelloCtrl",["$scope","$state","Navigator",function(t,e,o){t.newPatient=function(){o.changeState("app.status")},t.goToHelp=function(){o.changeState("app.help")}}]),starter.controller("HelpCtrl",["$scope","$state","Navigator",function(t,e,o){t.newPatient=function(){o.changeState("app.status")}}]),starter.controller("FeedbackCtrl",["$scope","$cordovaCamera","$cordovaFile","Navigator",function(t,e,o,n){t.newPatient=function(){n.changeState("app.status")},t.sendFeedback=function(){window.plugins&&window.plugins.emailComposer&&window.plugins.emailComposer.showEmailComposerWithCallback(function(t){},"Feedback for App","",["david.kelly.15@ucl.ac.uk"],null,null,!1,null,null)},t.images=[],t.getPhoto=function(){var o={destinationType:Camera.DestinationType.FILE_URI,sourceType:Camera.PictureSourceType.CAMERA,allowEdit:!1,encodingType:Camera.EncodingType.JPEG,popoverOptions:CameraPopoverOptions,saveToPhotoAlbum:!0};e.getPicture(o).then(function(e){function o(t){n(t)}function n(t){window.resolveLocalFileSystemURL(t,a,i)}function a(t){var e=t.fullPath.substr(t.fullPath.lastIndexOf("/")+1),o=r()+e;window.resolveLocalFileSystemURL(cordova.file.dataDirectory,function(e){t.copyTo(e,o,c,i)},i)}function c(e){t.$apply(function(){t.images.push(e.nativeURL)})}function i(t){}function r(){for(var t="",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",o=0;5>o;o++)t+=e.charAt(Math.floor(Math.random()*e.length));return t}o(e)},function(t){})}}]);