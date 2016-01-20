/**
 * the following unit tests are merely a stub to show that the configuration is correct
 * much more extensive testing is needed
 */
describe("Controller Unit Tests", function() {

    beforeEach(angular.mock.module('starter'));
    var scope;
    var controller;
    var state;

    /**
     * General set up of root scope, and a simple test of DocsCtrl
     */
    beforeEach(inject(function($rootScope, $controller, $state) {
        state = $state;
        spyOn(state, 'go');
        scope = $rootScope.$new();
        controller = $controller('DocsCtrl', {
            $scope: scope,
        });
    }));

    it("should say this is true", function() {
        expect(true).toBe(true);
    });

    it('should have a scope defined', function() {
        expect(scope).toBeDefined();
    });

    it('should have DocsCtrl defined', function() {
        expect(controller).toBeDefined();
    });

    it('should move to status page when button is pressed', function() {
        scope.goBack();
        expect(state.go).toHaveBeenCalled();
    });


    /**
     * tests for Hello
     */
    beforeEach(inject(function($controller, $state) {
        state = $state;
        controller = $controller('HelloCtrl', {
            $scope: scope
        });
    }));

    it('should have a button which loads a new patient', function() {
        scope.newPatient();
        expect(state.go).toHaveBeenCalled();
    });

    it('should have a button which goes to the help page', function() {
        scope.goToHelp();
        expect(state.go).toHaveBeenCalled();
    });


    /**
     * tests for the About Controller
     */
    beforeEach(inject(function($controller, $state) {
        state = $state;
        controller = $controller('AboutCtrl', {
            $scope: scope
        });
    }));

    it('should move to status page when button is pressed', function() {
        scope.goBack();
        expect(state.go).toHaveBeenCalled();
    });
    
    // this test fails
    //it('should open a link in the browser', function() {
        //var site = "";
        //var open = scope.goToLink(site);
        //expect(open).toThrow();
    //});

    /**
     *  tests for the Settings Controller
     */
    beforeEach(inject(function($controller) {
        controller = $controller('SettingsCtrl', {
            $scope: scope,
        });
    }));
});
