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
     * tests for the About Controller
     */
    beforeEach(inject(function($controller, $state) {
        state = $state;
        controller = $controller('AboutCtrl', {
            $scope: scope,
        });
    }));

    // this test is not yet complete
    it('should open a link in the browser', function() {
        var link = 'http://www.google.com';
        scope.goToLink(link);
    });
});
