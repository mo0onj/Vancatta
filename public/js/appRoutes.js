angular.module('appRoutes', ['auth0.auth0', 'angular-jwt', 'ui.router', 'authServ'])
	.config(['$routeProvider', '$locationProvider', 'angularAuth0Provider', '$urlRouterProvider', 'jwtOptionsProvider',
		function ($routeProvider, $locationProvider, angularAuth0Provider, $urlRouterProvider, jwtOptionsProvider) {

			$routeProvider
				.when('/', {
					templateUrl: 'views/explore.html',
					controller: 'MainController',
					controllerAs: 'ctrl'
				})

				// .when('/nerds', {
				// 	templateUrl: 'views/nerd.html',
				// 	controller: 'NerdController'
				// })
				.when('/hotel', {
					templateUrl: 'views/hotel.html',
					controller: 'hotelController'
				})
				.when('/tours', {
					templateUrl: 'views/tour.html',
					controller: 'tourController'
				})
				.when('/flight', {
					templateUrl: 'views/flight.html',
					controller: 'flightController',
					controllerAs: 'ctrl'
				})
				.when('/flight/result', {
					templateUrl: 'views/flight/flightResult.html',
					controller: 'flightController',
					controllerAs: 'ctrl'
				})
				.when('/flight/payment', {
					templateUrl: 'app/views/pages/own.html',
					controller: 'flightController',
					controllerAs: 'ctrl'
				})
				// .when('/flight/booking/w', {
				// 	templateUrl: 'app/views/pages/loadingF.html',
				// 	controller: 'flightController',
				// 	controllerAs: 'ctrl'
				// })
				.when('/safari', {
					templateUrl: 'views/safari.html',
					controller: 'safariController'
				})

				.when('/geeks', {
					templateUrl: 'views/geek.html',
					controller: 'GeekController'
				})
				.when('/callback', {
					templateUrl: 'views/callback.html',
					controller: 'CallbackController',

				});


			// Initialization for the angular-auth0 library
			angularAuth0Provider.init({
				clientID: 'llIYKzri04db7D11pA7W6F2sx3n0LxqM',
				domain: 'vancatta1.eu.auth0.com',
				responseType: 'token id_token',
				redirectUri: 'http://localhost:8080/callback',
				audience: 'vancatauth',
			});

			// Configure a tokenGetter so that the isAuthenticated
			// method from angular-jwt can be used
			jwtOptionsProvider.config({
				tokenGetter: function () {
					return localStorage.getItem('id_token');
				}
			});

			//  $urlRouterProvider.otherwise('/');

			// Remove the ! from the hash so that
			// auth0.js can properly parse it
			$locationProvider.hashPrefix('');

			$locationProvider.html5Mode(true);

		}])
	.run(function ($rootScope, authService) {

		// Put the authService on $rootScope so its methods
		// can be accessed from the nav bar
		$rootScope.auth = authService;

		// Process the auth token if it exists and fetch the profile
		authService.handleParseHash();
	});