angular.module('flightService', [])

    .factory('flight', function ($http) {

        var artFactory = {};


        artFactory.complete = {
            'from': '',
            'to': '',
            'dateFrom': '',
            'dateTo': '',
            'ftype': ''
        };

        artFactory.getLoc = function () {
            return $http.get('/api/user/loc');
        };
        artFactory.getAirs = function () {
            return $http.get('/api/f/airlines');
        };

        artFactory.checkFlight = function (id) {
            return $http.post('/api/flights/chk/', id);
        };


        artFactory.spot = function (keyword) {
            return $http.get('/api/spot/' + keyword);
        };

        return artFactory;


    });