describe("Controller Unit Tests", function() {

    beforeEach(angular.mock.module('starter'));
    var scope;
    var controller;

    beforeEach(inject(function($rootScope, $controller) {
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
});
