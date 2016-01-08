/** 
 * The controllers create the behaviour of the various different template views 
 */

/** 
 * Controller for App view. 
 */
starter.controller('AppCtrl', function($scope, $state, SettingsFactory) {
    $scope.$on('ionicView.enter', function() {
        $scope.loadFirstScreen();
    });

    $scope.loadFirstScreen = function() {
        if (SettingsFactory.get().showHello === false) {
            $state.go('app.status');
        } else {
            $state.go('app.hello');
        }
    };
});

/** 
 * Controller for Results view. 
 * draws graph showing PPV percentage, and also a select list of NICE recommendations
 * @param {$scope}
 * @param {$state}
 * @param {$http}
 * @param {$filter}
 * @param {SettingsFactory}
 * @param {$ionicModal}
 */
starter.controller("ResultsCtrl", function($scope, $state, $http, $filter, SettingsFactory,
    $ionicPopup, $ionicModal) {
    /**
     * load the nice data from the json file
     */
    $scope.niceData = [];
    $scope.loadNiceData = function() {
        try {
            $http.get('js/nice.json')
                .success(function(data) {
                    $scope.niceData = data;
                });
            // if we are here, something has gone badly wrong. The easiest solution might be to do a
            // fresh install
        } catch (err) {
            $ionicPopup.alert({
                title: "Data Error",
                template: "Unable to access data. Please reinstall the app"
            });
        }
    };

    /**
     * load the screen with graphics and guidelines upon entry
     */
    $scope.$on("$ionicView.enter", function() {
        $scope.showResults();
        $scope.niceGuidelines();
    });

    $scope.showResults = function() {
        $scope.ppvResult = parseFloat(window.sessionStorage.PPVglobal) * 100; // make it a percentage 
        $scope.ardResult = parseFloat(window.sessionStorage.ard);
        $scope.tooYoung = $scope.checkOldEnough();
        $scope.cumulResult = parseFloat(window.sessionStorage.ardAfter2);
        $scope.labels = ["PPV RISK", ""];
        $scope.data = [$scope.ppvResult, 100 - $scope.ppvResult];
    };

    $scope.checkOldEnough = function() {
        if (parseInt(window.sessionStorage.age) < 18) {
            return false;
        } else {
            return true;
        }
    };

    $scope.resetPatient = function() {
        window.sessionStorage.clear();
        $state.go("app.status");
    };

    $scope.nice = "";
    $scope.string = "";

    $scope.niceGuidelines = function() {
        console.log("selected list is " + window.sessionStorage.selectedList);
        $scope.ob_by_id = $filter('filter')($scope.niceData.data, {
            id: "treatment"
        });
        $scope.string = JSON.stringify($scope.ob_by_id);
        $scope.nice += $scope.extractText($scope.string);

        if ((parseInt(window.sessionStorage.bcg) >= 2)) {
            $scope.ob_by_id = $filter('filter')($scope.niceData.data, {
                id: "bcg vaccinated"
            });
            //$scope.idToString();
            $scope.string = JSON.stringify($scope.ob_by_id);
            $scope.nice += $scope.extractText($scope.string);
        }

        console.log(window.sessionStorage.selectedList);
        if ((window.sessionStorage.selectedList.indexOf("AIDS") >= 0) ||
            (window.sessionStorage.selectedList.indexOf("HIV") >= 0) ||
            (window.sessionStorage.selectedList.indexOf("Transplantation") >= 0)) {
            $scope.ob_by_id = $filter('filter')($scope.niceData.data, {
                id: "immunocompromised"
            });
            $scope.string = JSON.stringify($scope.ob_by_id);
            $scope.nice += $scope.extractText($scope.string);
        }

        // younger than 2, without bcg, and in close contact: nice 1.6.1.6 
        if (((parseInt(window.sessionStorage.age)) <= 2) && ((parseInt(window.sessionStorage
                .bcg)) === 1) && ((parseInt(window.sessionStorage.rc)) === 2)) {
            $scope.ob_by_id = $filter('filter')($scope.niceData.data, {
                id: "young-age (without BCG)"
            });
            $scope.string = JSON.stringify($scope.ob_by_id);
            $scope.nice += $scope.extractText($scope.string);
        }

        // younger than 2, with bcg, in close contact: nice 1.6.1.7
        if (((parseInt(window.sessionStorage.age)) <= 2) && ((parseInt(window.sessionStorage
                .bcg)) > 1) && ((parseInt(window.sessionStorage.rc)) === 2)) {
            $scope.ob_by_id = $filter('filter')($scope.niceData.data, {
                id: "young-age (with BCG)"
            });
            $scope.string = JSON.stringify($scope.ob_by_id);
            $scope.nice += $scope.extractText($scope.string);
        }

        // younger that 1 - newborns: nice 1.6.1.5
        // the app doesn't have a question to ask if the child is a neonate, so let's give this
        // info for any child with an age of one with close contact
        if (((parseInt(window.sessionStorage.age)) === 1) && (parseInt(window.sessionStorage
                .rc)) === 2) {
            $scope.ob_by_id = $filter('filter')($scope.niceData.data, {
                id: "neonates"
            });
            $scope.string = JSON.stringify($scope.ob_by_id);
            $scope.nice += $scope.extractText($scope.string);
        }
    };

    /** 
     * extract the title and data from the json file and append it to the html formatted nice
     * string
     */
    $scope.idToString = function() {
        $scope.string = JSON.stringify($scope.ob_by_id);
        $scope.nice += $scope.extractText($scope.string);
        return;
    };

    $scope.niceList = []; // an array of objects of which (k, v) are {title: text}
    $scope.extractText = function() {
        var temp = $scope.string.split("\""); // split the string at the quotation marks
        var titleString = temp[3];
        var bodyText = temp[7];

        var newElem = {};
        newElem.name = titleString;
        newElem.text = bodyText;

        $scope.niceList.push(newElem);
        console.log(newElem);
    };


    /**
     * send the selected nice object to the modal view.
     * For security, let's initialize the strings to empty.
     */
    $scope.condTitle = "";
    $scope.condDetails = "";

    $scope.sendDataToModal = function(item) {
        $scope.condTitle = item.name;
        $scope.condDetails = item.text;
    };

    $ionicModal.fromTemplateUrl('templates/nice-modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });


});

/**
 * MINOR CONTROLLERS
 * while each view has a controller, not all views, or controllers are equal. Those pages which are
 * primarily text only have one (maybe two) function(s). Even though there is a fair amount of
 * redundancy in implementing the $scope.goBack() function for each view, this approach has been
 * preferred as it allows for greater flexibilty and more possibility for extension by future
 * developers.
 */

/** 
 * Controller for About view
 */
starter.controller("AboutCtrl", function($scope, $state, $ionicPopup) {
    // opens link in system browers
    $scope.goToLink = function(link) {
        try {
            window.open(link, '_system');
        } catch (err) {
            $ionicPopup.alert("Unable to connect to the internet");
        }
    };

    $scope.goBack = function() {
        $state.go('app.status');
    };
});

/**
 * Controller for Disclaimer view
 */
starter.controller("DisclaimerCtrl", function($scope, $state) {
    $scope.goBack = function() {
        $state.go('app.status');
    };
});

/**
 * Controller for doc screen
 */
starter.controller("DocsCtrl", function($scope, $state) {
    $scope.goBack = function() {
        $state.go('app.status');
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
starter.controller("HelloCtrl", function($scope, $state) {
    $scope.newPatient = function() {
        $state.go("app.status");
    };

    $scope.goToHelp = function() {
        $state.go("app.help");
    };
});

starter.controller("HelpCtrl", function($scope, $state) {
    $scope.newPatient = function() {
        $state.go("app.status");
    };
});

/**
 * loads an array of buttons onto the screen, which in turn call a modal view with the details
starter.controller("NiceCtrl", function($scope, $state) {
    $scope.niceListComplete = [];
});

/** 
 * provided functionality for sending an email regarding the performance of the app. It needs a
 * configured email client to be present on the user's device 
 */
starter.controller("FeedbackCtrl", function($scope, $cordovaCamera, $cordovaFile) {
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

/** 
 * Controller for the condidtions view.
 * Checkboxes for specific medical conditions 
 * @param {$scope}
 * @param {$state}
 * @param {$ionicPopup}
 */
starter.controller('ConditionsCtrl', function($scope, $state, $ionicPopup) {
    /** 
     * array of conditions supported by the app. 
     * Data is available in data.js
     */
    $scope.condList = [];
    window.sessionStorage.selectedList = "";
    window.sessionStorage.condRisk = 0;

    /** loads $scope.condList with data */
    $scope.loadList = function() {
        $scope.condList.length = 0;
        for (var i = 0; i < conditions.length; i++) {
            // reset everything to unchecked
            $scope.condList.push(conditions[i]);
        }
    };

    $scope.resetList = function() {
        for (var i = 0; i < $scope.condList.length; i++) {
            $scope.condList[i].checked = false;
        }
    };

    // go back if we want to make changes
    $scope.clickLeft = function() {
        $state.go("app.status");
    };


    /** validates the screen and launches the calculateRisk() function */
    $scope.clickRight = function() {
        $scope.sumRiskFactors();
        $scope.calculatePPV();
        $scope.calculateARD();
        $state.go("app.results");
        // clear the list
        $scope.resetList();
    };

    /**
     * loops through the list of conditions, summing the total risk factors of all selected
     * checkboxes
     */
    $scope.sumRiskFactors = function() {
        for (var i = 0; i < $scope.condList.length; i++) {
            if ($scope.condList[i].checked === true) {
                window.sessionStorage.selectedList += JSON.stringify($scope.condList[
                        i]
                    .text);
                window.sessionStorage.condRisk += parseInt($scope.condList[i].rate);
            }
        }
    };

    $scope.countryOrState = function() {
        console.log("country info is " + window.sessionStorage.COB);
        console.log("states info is " + window.sessionStorage.states);
        var countryStats;
        switch (window.sessionStorage.COB) {
            case "8":
                countryStats = window.argentinaState[window.sessionStorage.states -
                    1];
                break;
            case "10":
                countryStats = window.aussieState[window.sessionStorage.states - 1];
                break;
            case "26":
                countryStats = window.brazilState[window.sessionStorage.states - 1];
                break;
            case "43":
                countryStats = window.chinaState[window.sessionStorage.states - 1];
                break;
            case "88":
                countryStats = window.indiaState[window.sessionStorage.states - 1];
                break;
            case "204":
                countryStats = window.usaState[window.sessionStorage.states - 1];
                break;
            default:
                countryStats = window.countries[window.sessionStorage.COB - 1];
                break;
        }
        return countryStats;
    };

    /** extracts the rate of false positives by country or state/province for tst test diameter */
    $scope.falsePosByCountry = function(countryStats) {
        var rate;
        // tst = 5 - 9mm
        if (window.sessionStorage.tst == 2) {
            rate = countryStats.small;
            // tst = 10 - 14mm
        } else if (window.sessionStorage.tst == 3) {
            rate = countryStats.med;
            // tst = 15mm+
        } else if (window.sessionStorage.tst == 4) {
            rate = 0;
            // default
        } else {
            rate = 0;
        }
        console.log("false pos rate is " + rate);
        return rate;
    };

    /** calculates PPV based on igra test */
    $scope.igraResult = function() {
        var positive;
        console.log("window.sessionStorage.igra = " + window.sessionStorage.igra);
        // igra positive
        if (window.sessionStorage.igra === "3") {
            positive = true;
            // igra negative or not done
        } else positive = false;

        return positive;
    };

    /** calculates risk due to proximity to TB sufferers */
    $scope.contactStatus = function() {
        var contact;
        // if recent close contact, ie same house, 40%
        if (window.sessionStorage.rc == 2) {
            contact = 0.4;
            // if recent casual contact, 8%
        } else if (window.sessionStorage.rc == 3) {
            contact = 0.08;
            // if not a recent contact, then 0%
        } else contact = 0;

        return contact;
    };

    /** calculates risk due to to bcg status */
    $scope.falsePosBCG = function(tst) {
        var v;
        // vaccinated before the age of 2
        if (window.sessionStorage.bcg == 2) {
            // 5-9mm
            if (tst == 2) {
                v = 0.042;
                // 10-14mm
            } else if (tst == 3) {
                v = 0.053;
                // 15+mm
            } else if (tst == 4) {
                v = 0.028;
                // default 
            } else v = 0;
        } else if (window.sessionStorage.bcg == 3) {
            // 5-9mm
            if (tst == 2) {
                v = 0.258;
                // 10-14mm
            } else if (tst == 3) {
                v = 0.087;
                // 15+mm
            } else if (tst == 4) {
                v = 0.078;
                // default
            } else v = 0;
            // bcg not done
        } else v = 0;
        return v;
    };

    $scope.calculateARI = function(contact, a, s) {
        /* Styblo's formula, incidence of smear-positive pulmonary TB per 100,000
         * divided by 49
         */
        var pLTBI;
        if (contact === 0) {
            pLTBI = 1 - Math.pow((1 - (s / 4900)), a);
            //pLTBI = 1 - Math.pow((1 - (s / 4900)), a);
        } else {
            pLTBI = 1 - Math.pow((1 - contact * 1) * (1 - (s / 4900)), a);
            //pLTBI = 1 - Math.pow((1 - contact) * (1 - (s / 4900)), a);
        }
        console.log('contact = ' + contact + ' age = ' + a + ' smear = ' + s +
            ' pLTBI = ' + pLTBI);
        return pLTBI;
    };

    $scope.calculateEthnicity = function() {
        var e;
        if (window.sessionStorage.race === "2") {
            e = 3.09;
            // hispanic
        } else if (window.sessionStorage.race == "3") {
            e = 3.66;
        } else {
            e = 1;
        }
        return e;
    };

    /** 
     * performs the PPV (positive predictive value) calculation 
     * 
     * PPVtst = e * [ pLTBI / pLTBI + (FP - TSTbcg + FP - TSTntm)]
     * where pLTBI = 1 - [(1 - c)(1 - ARI)^age]
     * e = relative risk of a positive test based on ethic status
     */
    $scope.calculatePPV = function() {
        var countryStats = $scope.countryOrState();

        /** 
         * countries are in the following format 0.4 0.1 10 Australia
         * n is the rate of false positives in the country of birth 
         */
        var n = $scope.falsePosByCountry(countryStats);
        console.log("Country is " + countryStats.name);

        var igra = $scope.igraResult();
        console.log("igra result is " + igra);

        /* smear positive rate */
        var s = 0;
        s = parseInt(countryStats.smear);

        /* age */
        var a = 0;
        a = parseInt(window.sessionStorage.age);

        /* ethnicity */
        var r = 0;
        if (window.sessionStorage.COB === '204' || window.sessionStorage.COB ===
            '34' ||
            window.sessionStorage.COB === '35') {
            r = countryStats.small + 1;
        }

        /* contact status */
        var contact = $scope.contactStatus();

        /* bcg status */
        var v = $scope.falsePosBCG(n);
        console.log("bcg status " + v);

        //var conditionTotal = window.sessionStorage.condRisk;

        var pLTBI = $scope.calculateARI(contact, a, s);

        var e = $scope.calculateEthnicity();
        console.log("ethnicity calc " + e);

        var ppvigra = 0.98; // 2% risk of false positive from igra
        var ppvtst = (e * 1) * ((pLTBI) / (pLTBI + (n * 1 / 100) + (v * 1)));
        console.log("ppvtst = " + e + " * " + pLTBI + " / " + pLTBI + " + " + (n /
            100) + " + " + v);
        var ppv = 0;

        // if igra negative/not done, and tst not done
        var tstStatus = parseFloat(window.sessionStorage.tst);
        if ((igra === false) && (tstStatus === 1)) {
            ppv = 0;
            console.log("ppv = ppvtst, igra = " + igra + " tst = " + tstStatus);
            // if igra is positive and tst not done
        } else if ((igra === true) && (tstStatus === 1)) {
            ppv = ppvigra; // 0.98
            console.log("ppv = ppvtst, igra = " + igra + " tst = " + tstStatus);
            // if igra is positive and tst is done
        } else if ((igra === true) && (tstStatus > 1)) {
            ppv = 1 - ((1 - ppvtst) * (1 - ppvigra));
            console.log("ppv = ppvtst, igra = " + igra + " n = " + n);
            // if igra is negative and tst is done
        } else {
            ppv = ppvtst;
            console.log("ppv = ppvtst, igra = " + igra + " n = " + n);
        }

        if (ppv > 1) {
            ppv = 0.9999;
        } else if (ppv < 0) {
            ppv = 0;
        }
        window.sessionStorage.PPVglobal = ppv.toFixed(2);
    };

    /** annual risk of disease */
    $scope.calculateARD = function() {
        var baseRate;
        var baseRateAfter2years;
        var conditionRiskTotal;

        if (parseInt(window.sessionStorage.condRisk) === 0) {
            conditionRiskTotal = 1;
        } else {
            conditionRiskTotal = parseInt(window.sessionStorage.condRisk);
            console.log("condition risk total = " + conditionRiskTotal);
        }

        // close contact
        if (parseInt(window.sessionStorage.rc) === 2) {
            baseRate = 0.05; // 5%
            baseRateAfter2years = 0.001; // 1%
            $scope.ard = parseFloat(window.sessionStorage.PPVglobal) * baseRate *
                conditionRiskTotal * 100;
            $scope.ardAfter2 = parseFloat(window.sessionStorage.PPVglobal) *
                baseRateAfter2years * conditionRiskTotal * (80 - parseInt(window.sessionStorage
                    .age)) * 100;
            // otherwise
        } else {
            baseRate = baseRateAfter2years = 0.001;
            // baseRateAfter2years = 0.001;
            $scope.ard = parseFloat(window.sessionStorage.PPVglobal) * baseRate *
                conditionRiskTotal * 100;
            $scope.ardAfter2 = parseFloat(window.sessionStorage.PPVglobal) *
                baseRateAfter2years * conditionRiskTotal * (80 - parseInt(window.sessionStorage
                    .age)) * 100;
        }

        if (isNaN($scope.ard)) {
            window.sessionStorage.ard = 0.0;
        } else if ($scope.ard > 100) {
            window.sessionStorage.ard = 99.99;
        } else if ($scope.ard < 0) {
            window.sessionStorage.ard = 0.0;
        } else {
            window.sessionStorage.ard = $scope.ard.toFixed(4);
        }

        if ($scope.ardAfter2 > 100) {
            window.sessionStorage.ardAfter2 = 99.99;
        } else if ($scope.ardAfter2 < 0) {
            window.sessionStorage.ardAfter2 = 0.0;
        } else if (isNaN($scope.ardAfter2)) {
            window.sessionStorage.ardAfter2 = 0.0;
        } else window.sessionStorage.ardAfter2 = $scope.ardAfter2.toFixed(2);

        console.log("annual risk of disease for first 2 years " + window.sessionStorage
            .ard + " and after 2 years " + window.sessionStorage.ardAfter2);
    };
});

//]);


starter.controller('StatusCtrl', function($scope, $state, $ionicPopup) {
    //starter.controller('StatusCtrl', ['$scope', '$state',
    //'$ionicPopup',
    //function($scope, $state, $ionicPopup) {

    /** 
     * reset fields on entry to the view 
     */
    $scope.$on("ionicView.enter", function() {
        $scope.resetFields();
    });

    /* resets all the dropdown menus to empty */
    $scope.resetFields = function() {
        try {
            $scope.tst.tstSelect = null;
            $scope.igra.igraSelect = null;
            $scope.countryOfBirth.countryOfBirthSelect = null;
            $scope.states.stateSelect = null;
            $scope.age.ageSelect = null;
            $scope.ageIm.ageImSelect = null;
            $scope.race.raceSelect = null;
            $scope.bcg.bcgSelect = null;
            $scope.recentContact.recentContactSelect = null;
            $scope.hasState = false;
            $scope.immigrated = false;
        } catch (err) {
            $ionicPopup.alert({
                title: "Error",
                template: "Unable to reset form"
            });
        }
    };

    // data for status dropdown menus
    $scope.tst = {
        tstSelect: null,
        availableOptions: [{
            id: 1,
            name: 'Test not done'
        }, {
            id: 2,
            name: "5-9 mm"
        }, {
            id: 3,
            name: '10-14 mm'
        }, {
            id: 4,
            name: '15mm+'
        }]
    };

    $scope.igra = {
        igraSelect: null,
        availableOptions: [{
            id: 1,
            name: 'Test not done'
        }, {
            id: 2,
            name: 'Negative'
        }, {
            id: 3,
            name: 'Positive'
        }]
    };

    // loads the select with country / state data from data.js
    $scope.regionLoader = function($list, $array) {
        for (var i = 0; i < $list.length; i++) {
            var newState = {};
            newState.id = $list[i].id;
            newState.name = $list[i].name;
            $array.push(newState);
        }
    };

    var COB = []; // array containing countries of birth
    $scope.regionLoader(countries, COB);
    $scope.countryOfBirth = {
        countryOfBirthSelect: null,
        availableOptions: COB
    };

    $scope.hasState = false;
    var states = []; // array containing states/provinces

    /**
     * loads a list of states / provinces into the select box only if it is one of the following
     * countries: USA, China, India, Brazil, Argentina, Australia
     */
    $scope.loadStates = function() {
        states.length = 0;
        if (window.sessionStorage.COB === "204") { // USA
            $scope.hasState = true;
            $scope.regionLoader(usaState, states);
        } else if (window.sessionStorage.COB === "43") { // China
            $scope.hasState = true;
            $scope.regionLoader(chinaState, states);
        } else if (window.sessionStorage.COB === "88") { // India
            $scope.hasState = true;
            $scope.regionLoader(indiaState, states);
        } else if (window.sessionStorage.COB === "26") { // Brazil
            $scope.hasState = true;
            $scope.regionLoader(brazilState, states);
        } else if (window.sessionStorage.COB === "8") { // Argentina
            $scope.hasState = true;
            $scope.regionLoader(argentinaState, states);
        } else if (window.sessionStorage.COB === "10") { // Australia
            $scope.hasState = true;
            $scope.regionLoader(aussieState, states);
        } else {
            $scope.hasState = false;
            var nState = {};
            nState.id = window.sessionStorage.COB;
            nState.name = "N/A";
            states.push(nState);
        }
    };

    // state select
    $scope.states = {
        stateSelect: null,
        availableOptions: states
    };

    // 80 is a fairly arbitrary cutoff point for maximum age
    var ages = [];
    for (i = 0; i < 80; i++) {
        var newAge = {};
        newAge.id = i + 1;
        newAge.name = i + 1; // we don't want 0 as an age
        ages.push(newAge);
    }

    // age select
    $scope.age = {
        ageSelect: null,
        availableOptions: ages
    };

    // age at immigration select
    $scope.ageIm = {
        ageImSelect: null,
        availableOptions: ages
    };

    $scope.immigrated = false;
    $scope.hasImmigrated = function() {
        if ($scope.ageIm !== null) {
            $scope.immigrated = true;
        }
    };

    // race/ethnicity select
    $scope.race = {
        raceSelect: null,
        availableOptions: [{
            id: 1,
            name: "White/Caucasian"
        }, {
            id: 2,
            name: "Black/African American"
        }, {
            id: 3,
            name: "Hispanic"
        }, {
            id: 4,
            name: "Other"
        }]
    };

    // vaccination select (bcg)
    $scope.bcg = {
        bcgSelect: null,
        availableOptions: [{
            id: 1,
            name: 'Never vaccinated / unknown'
        }, {
            id: 2,
            name: 'Vaccinated < 2 years'
        }, {
            id: 3,
            name: 'Vaccinated ≥ 2 years'
        }]
    };

    // recent contact with a TB sufferer select
    $scope.recentContact = {
        recentContactSelect: null,
        availableOptions: [{
            id: 1,
            name: 'No contact'
        }, {
            id: 2,
            name: 'Close contact'
        }, {
            id: 3,
            name: 'Casual contact'
        }]
    };

    /**
     * stores the selected value in local storage for use in the algorithm
     * @param {$field}
     * @param {$selection}
     */
    $scope.storeValue = function($field, $selection) {
        try {
            window.sessionStorage[$field] = $selection;
        } catch (err) {
            $ionicPopup.alert({
                title: "Error",
                template: "Could not find enough memory to store data"
            });
        }
    };

    /**
     * checks that all the fields are completed. It has the "hidden" side-effect of
     * setting null values to the string "empty" or "old" which is used in the html template for
     * highlighting, in red, incomplete areas
     *
     * @return {boolean}
     */
    $scope.checkValues = function() {
        var errorPresent = false;

        if ($scope.tst.tstSelect === null) {
            $scope.tst.tstSelect = 'empty';
            errorPresent = true;
        } else if ($scope.tst.tstSelect === 'empty') {
            errorPresent = true;
        }
        if ($scope.igra.igraSelect === null) {
            $scope.igra.igraSelect = 'empty';
            errorPresent = true;
        } else if ($scope.igra.igraSelect === 'empty') {
            errorPresent = true;
        }
        if ($scope.countryOfBirth.countryOfBirthSelect === null) {
            $scope.countryOfBirth.countryOfBirthSelect = 'empty';
            errorPresent = true;
        } else if ($scope.countryOfBirth.countryOfBirthSelect === 'empty') {
            errorPresent = true;
        }
        if ($scope.age.ageSelect === null) {
            $scope.age.ageSelect = 'empty';
            errorPresent = true;
        } else if ($scope.age.ageSelect === 'empty') {
            errorPresent = true;
        }
        if ($scope.bcg.bcgSelect === null) {
            $scope.bcg.bcgSelect = 'empty';
            errorPresent = true;
        } else if ($scope.bcg.bcgSelect === 'empty') {
            errorPresent = true;
        }
        if ($scope.recentContact.recentContactSelect === null) {
            $scope.recentContact.recentContactSelect = 'empty';
            errorPresent = true;
        } else if ($scope.recentContact.recentContactSelect === 'empty') {
            errorPresent = true;
        }
        // if neither field is empty/null but immigration age is greater than age, there must be a
        // problem
        if (($scope.ageIm.ageImSelect !== null && $scope.age.ageSelect !== null) &&
            (parseInt($scope.ageIm.ageImSelect) > parseInt($scope.age.ageSelect))) {
            $scope.ageIm.ageImSelect = 'old';
            $scope.age.ageSelect = 'empty';
            errorPresent = true;
        }

        return errorPresent;
    };

    /** if the fields are complete and without errors, navigates to next screen, otherwise sends a warning */
    $scope.clickRight = function() {
        if ($scope.checkValues() === true) {
            $ionicPopup.alert({
                title: "Incorrect Form",
                template: "Form contains errors"
            });
        } else if ((window.sessionStorage.tst === "1") && (window.sessionStorage.igra ===
                "1")) {
            $ionicPopup.alert({
                title: "Incorrect Form",
                template: "No tests performed"
            });
        } else {
            $state.go("app.conditions");
            $scope.resetFields();
        }
    };
});
