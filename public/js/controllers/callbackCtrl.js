angular.module('callbackCtrl', [])
    .controller('CallbackController', ['$http',
        function ($http,$scope) {

        var po=$scope;
        var vm=this;

        vm.test=function(txt){
            console.log('Testing');
            console.log(txt);
        }


        }]);