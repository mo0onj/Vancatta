angular.module('NerdCtrl', ['ADM-dateTimePicker']).controller('NerdController', function($scope) {


	var po=$scope;

	// po.adult='Adults';
	$scope.tagline = 'Nothing beats a pocket protector!';


	console.log(po.date);

	po.test=function(){
		console.log(po.adult);
	}

});