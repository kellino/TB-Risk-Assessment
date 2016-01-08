describe("Controller Unit Tests", function() {

    var $scope;
    beforeEach(module('starter'));

    beforeEach(inject(function($rootScope) {
        $scope = $rootScope.$new();
    }));

    it("should say this is true", function() {
        expect(true).toBe(true);
    });
});
