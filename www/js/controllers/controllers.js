/** 
 * The controllers create the behaviour of the various different template views 
 */

/** 
 * Controller for App view. 
 */
starter.controller('AppCtrl', function($scope, $state, SettingsFactory, Navigator) {
    $scope.$on('ionicView.enter', function() {
        $scope.loadNiceData();
        $scope.loadFirstScreen();
    });

    $scope.loadFirstScreen = function() {
        if (SettingsFactory.get().showHello === false) {
            Navigator.changeState('app.status');
        } else {
            Navigator.changeState('app.hello');
        }
    };
});


/**
 * MINOR CONTROLLERS
 * while each view has a controller, not all views, or controllers are equal. Those pages which are
 * Some simple navigation features are shared in the Navigator factory
 */

/** 
 * Controller for About view
 */
starter.controller("AboutCtrl", function($scope, $state, $ionicPopup, Navigator) {
    // opens link in system brower
    $scope.goToLink = function(link) {
        try {
            window.open(link, '_system');
        } catch (err) {
            $ionicPopup.alert("Unable to connect to the internet");
        }
    };


    $scope.goBack = function() {
        Navigator.changeState('app.status');
    };
});

/**
 * Controller for Disclaimer view
 */
starter.controller("DisclaimerCtrl", function($scope, $state, Navigator) {
    $scope.goBack = function() {
        Navigator.changeState('app.status');
    };
});

/**
 * Controller for doc screen
 */
starter.controller("DocsCtrl", function($scope, $state, Navigator) {
    $scope.goBack = function() {
        Navigator.changeState('app.status');
    };
});

/**
 * Controller for the settings view
 */
starter.controller('SettingsCtrl', function($scope, SettingsFactory, $ionicPopup) {
    $scope.$on('ionicView.enter', function() {
        try {
            $scope.settings = SettingsFactory.get();
        } catch (err) {
            $ionicPopup.alert({
                title: "Error",
                template: "Unable to access settings"
            });
        }
    });

    $scope.onShowClick = function() {
        SettingsFactory.setShowHello();
    };
});

/**
 * Controller for Welcome view
 */
starter.controller("HelloCtrl", function($scope, $state, Navigator) {
    $scope.newPatient = function() {
        Navigator.changeState('app.status');
    };

    $scope.goToHelp = function() {
        Navigator.changeState('app.help');
    };
});

starter.controller("HelpCtrl", function($scope, $state, Navigator) {
    $scope.newPatient = function() {
        Navigator.changeState('app.status');
    };
});

/** 
 * provided functionality for sending an email regarding the performance of the app. It needs a
 * configured email client to be present on the user's device 
 */
starter.controller("FeedbackCtrl", function($scope, $cordovaCamera, $cordovaFile, Navigator) {
    $scope.newPatient = function() {
        Navigator.changeState('app.status');
    };

    $scope.sendFeedback = function() {
        if (window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(
                    result) {},
                "Feedback for App", // Subject
                "", // Body
                ["david.kelly.15@ucl.ac.uk"], // To
                null, // CC
                null, // BCC
                false, // isHTML
                null, // Attachments
                null); // Attachment Data
        }
    };

    /* The following code (with small modifications) is from https://devdactic.com/how-to-capture-and-store-images-with-ionic/ */
    $scope.images = [];
    $scope.getPhoto = function() {
        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {

            onImageSuccess(imageData);

            function onImageSuccess(fileURI) {
                createFileEntry(fileURI);
            }

            function createFileEntry(fileURI) {
                window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
            }

            function copyFile(fileEntry) {
                var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf(
                    '/') + 1);
                var newName = makeid() + name;

                window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
                    function(fileSystem2) {
                        fileEntry.copyTo(
                            fileSystem2,
                            newName,
                            onCopySuccess,
                            fail
                        );
                    },
                    fail);
            }

            function onCopySuccess(entry) {
                $scope.$apply(function() {
                    $scope.images.push(entry.nativeURL);
                });
            }

            function fail(error) {
                console.log("fail: " + error.code);
            }

            function makeid() {
                var text = "";
                var possible =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() *
                        possible
                        .length));
                }
                return text;
            }

        }, function(err) {
            console.log(err);
        });
    };
});
