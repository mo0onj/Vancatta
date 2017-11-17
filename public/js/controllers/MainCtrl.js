angular.module('MainCtrl', ['authServ'])
	.controller('MainController', function ($scope, authService,$location, $http) {

		$scope.tagline = 'To the moon and back!';

		var po=$scope;
		var vm = this;
		// vm.auth = authService;
		po.auth = authService;

		po.home=false;

		authService.test('checking main');

		po.query = function (searchText) {

            if (!searchText) return;
            
            return $http
                .get('api/sear/' + searchText)
                .then(function (data) {
                    // Map the response object to the data object.
                    console.log(data.data);
                    return data.data;
                });
		};
		
		po.test=function(){

			console.log(po.dateFrom);
			console.log(po.dateTo);
			console.log(po.pfrom);
			$location.path('/flight')
			po.home=true;
		}

		var options = {
			theme: {
				logo: '../../image/logo.png',
				primaryColor: '#91c73e',
				displayName: 'Vancatta',
			},
			languageDictionary: {
				// emailInputPlaceholder: "something@youremail.com",
				title: "Vancatta Travels"
			},
			auth: {
				redirect: true,
				redirectUrl: 'http://localhost:8080/callback',
				responseType: 'token id_token',
				sso: true,
				// responseMode: 'form_post',
				// audience: 'vancatauth',
			},
			additionalSignUpFields: [{
				name: "address",
				placeholder: "enter your address",
				// The following properties are optional
				// icon: "",
				prefill: "street 123",
				validator: function (address) {
					return {
						valid: address.length >= 10,
						hint: "Must have 10 or more chars" // optional
					};
				}
			},
			{
				name: "full_name",
				placeholder: "Enter your full name"
			}]

		}

		var lock = new Auth0Lock('llIYKzri04db7D11pA7W6F2sx3n0LxqM', 'vancatta1.eu.auth0.com', options);


		$scope.lock = lock;
		vm.getMessage = function () {
			$http.get('http://localhost:8080/api/public').then(function (response) {
				vm.message = response.data.message;
			});
		}

		// Makes a call to a private endpoint.
		// We will append our access_token to the call and the backend will
		// verify that it is valid before sending a response.
		vm.getSecretMessage = function () {
			$http.get('http://localhost:8080/api/private', {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('id_token')
				}
			}).then(function (response) {
				vm.message = response.data.message;
			}).catch(function (error) {
				vm.message = "You must be logged in to access this resource."
			});
		}

	});