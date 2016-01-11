/** 
 * Controller for the condidtions view.
 * Checkboxes for specific medical conditions 
 * @param {$scope}
 * @param {$state}
 * @param {$ionicPopup}
 */
starter.controller('ConditionsCtrl', function($scope, $state, $ionicPopup, Navigator) {
    /** 
     * array of conditions supported by the app. 
     * Data is available in country_data.js
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
        Navigator.changeState("app.status");
    };


    /** validates the screen and launches the calculateRisk() function */
    $scope.clickRight = function() {
        try {
            $scope.sumRiskFactors();
            $scope.calculatePPV();
            $scope.calculateARD();
            Navigator.changeState("app.results");
            // clear the list
            $scope.resetList();
        } catch (err) {
            $ionicPopup.alert({
                title: "Calculcation Error",
                template: "Unable to perform calculation. Please try restarting the app"
            });
        }
    };

    /**
     * loops through the list of conditions, summing the total risk factors of all selected
     * checkboxes
     */
    $scope.sumRiskFactors = function() {
        if ($scope.condList.lenght !== 0) {
            for (var i = 0; i < $scope.condList.length; i++) {
                if ($scope.condList[i].checked === true) {
                    window.sessionStorage.selectedList += JSON.stringify($scope.condList[
                            i]
                        .text);
                    window.sessionStorage.condRisk += parseInt($scope.condList[i].rate);
                }
            }
        }
    };

    $scope.countryOrState = function() {
        console.log("country info is " + window.sessionStorage.COB);
        console.log("states info is " + window.sessionStorage.states);
        var countryStats;
        switch (window.sessionStorage.COB) {
            case "8":
                countryStats = window.argentinaState[window.sessionStorage.states - 1];
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
        if (parseInt(window.sessionStorage.rc) === 2) {
            contact = 0.4;
            // if recent casual contact, 8%
        } else if (parseInt(window.sessionStorage.rc) === 3) {
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
        } else {
            pLTBI = 1 - Math.pow((1 - contact * 1) * (1 - (s / 4900)), a);
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
            baseRate = 0.001;
            baseRateAfter2years = 0.001;
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
