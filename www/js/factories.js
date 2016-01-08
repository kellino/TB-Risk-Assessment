/**
 * The following code was suggested by
 * https://stackoverflow.com/questions/28293790/how-to-save-load-web-app-setting-in-ionic-framework-after-we-close-it 
 * It uses getters and setters to implement the settings view of the app
 */
angular.module('starter.factories', [])
.factory('SettingsFactory', function() {
    var _settingsKey = "appSettings",
        defaultSettings = {
            showHello: true
        };

    function _retrieveSettings() {
        var settings = localStorage[_settingsKey];
        if (settings) {
            return angular.fromJson(settings);
        }
        return defaultSettings;
    }

    function _saveSettings(settings) {
        localStorage[_settingsKey] = angular.toJson(settings);
    }

    return {
        get: _retrieveSettings,
        set: _saveSettings,
        getShowHello: function() {
            return _retrieveSettings().showHello;
        },
        setShowHello: function() {
            var settings = _retrieveSettings();
            if (settings.showHello === true) {
                settings.showHello = false;
            } else {
                settings.showHello = true;
            }
            _saveSettings(settings);
        }
    };
});
