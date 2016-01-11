/** 
 * Controller for Results view. 
 * draws graph showing PPV percentage, and also an array of buttons opening modal views of NICE recommendations
 */
starter.controller("ResultsCtrl", function($scope, $state, $filter, SettingsFactory, $ionicPopup,
    $ionicModal, Navigator, NiceFactory) {
    /**
     * load the nice data from the json file
     */
    $scope.niceData = [];
    $scope.getData = function() {
        NiceFactory.loadNiceData().success(function(data) {
            $scope.niceData = data;
        });
    };

    /**
     * load the screen with graphics and guidelines upon entry
     */
    $scope.$on("$ionicView.enter", function() {
        $scope.showResults();
        $scope.niceGuidelines();
    });

    /**
     * grab the necessary data from localStorage
     */
    $scope.showResults = function() {
        $scope.ppvResult = parseFloat(window.sessionStorage.PPVglobal) * 100; // make it a percentage 
        $scope.ardResult = parseFloat(window.sessionStorage.ard);
        $scope.tooYoung = $scope.checkOldEnough();
        $scope.cumulResult = parseFloat(window.sessionStorage.ardAfter2);
        $scope.labels = ["PPV RISK", ""];
        $scope.data = [$scope.ppvResult, 100 - $scope.ppvResult];
    };

    /**
     * if the patient is a minor, we shouldn't print $scope.ardResult or $scope.cumulResult to
     * screen, as the calculations do not work for that age group
     */
    $scope.checkOldEnough = function() {
        if (parseInt(window.sessionStorage.age) < 18) {
            return false;
        } else {
            return true;
        }
    };

    $scope.resetPatient = function() {
        window.sessionStorage.clear();
        Navigator.changeState("app.status");
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
            $scope.string = JSON.stringify($scope.ob_by_id);
            $scope.nice += $scope.extractText($scope.string);
        }

        if ((window.sessionStorage.selectedList.indexOf("AIDS") >= 0) ||
            (window.sessionStorage.selectedList.indexOf("HIV") >= 0) ||
            (window.sessionStorage.selectedList.indexOf("Transplantation") >= 0)) {
            $scope.ob_by_id = $filter('filter')($scope.niceData.data, {
                id: "immunocompromised"
            });
            $scope.string = JSON.stringify($scope.ob_by_id);
            $scope.nice += $scope.extractText($scope.string);
        }

        // 1 year old - newborns: nice 1.6.1.5
        // the app doesn't have a question to ask if the child is a neonate, so let's give this
        // info for any child with an age of one with close contact
        if ((parseInt(window.sessionStorage.age)) === 1) {
            $scope.ob_by_id = $filter('filter')($scope.niceData.data, {
                id: "neonates"
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
