//name of the app
angular.module('CRM',[])
    .controller('mainController',function(){
    //bond to view-model
    var vm=this;

    //define var and obj on 'this'
    //this lets them be available to our views

    //basic var
    vm.message='HEy there how are you?';

    //list of items
    vm.chocolates=[
        { name: 'Mars', type:'Bar', price:10},
        { name: 'Ferrero', type:'Ball', price:50},
        { name: 'Tobelerone', type:'Cone', price:20},
    ]

    //info that comes from the form
    vm.chocolatesData={};

    //addind a chocolate
    vm.addChocolate=function(){

    vm.chocolates.push({
        name:vm.chocolatesData.name,
        type:vm.chocolatesData.type,
        price:vm.chocolatesData.price,
    });

    //after adding, clear the form
    vm.chocolatesData={};

    };
});
