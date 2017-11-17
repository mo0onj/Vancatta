
angular.module('flightCtrl', ['flightService', 'ADM-dateTimePicker', 'ngMaterial', 'ngMessages', 'rzModule','authServ'])
    .config(function ($mdThemingProvider) {

        $mdThemingProvider.theme('default')
            .primaryPalette('orange');
    })
    .filter('unique', function () {
        return function (collection, keyname) {
            var output = [],
                keys = [];

            angular.forEach(collection, function (item) {
                var key = item[keyname];
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            });
            return output;
        };
    })
    .controller('flightController', function ($window, $http, $location,authService, $scope, $timeout, $filter, $q, $log, flight, $interval) {

        var vm = this;

        var po = $scope;

        var auth=authService;

        po.home=false;

        auth.test('checkign flights');

        po.date1_options={
            calType: 'gregorian',
            format: 'DD/MM/YYYY',
            default: 'today',
        };

        console.log(po.departure);
        console.log(po.arrival);

        po.slider = {
            min: 0,
            max: 0,
            options: {
                step: 1000,
                floor: 0,
                ceil: 0,
                minRange: 10000,
                pushRange: true
            }
        };

        vm.refreshSlider = function () {
            $timeout(function () {
                $scope.$broadcast('rzSliderForceRender');
            });
        };


        //   po.slider.options.ceil=600;

        // vall('yeee kiaaaaa huoooooo');

        var slider = document.getElementById('slider');

        po.loading = false;

        // var slider = document.getElementById('slider');

        // noUiSlider.create(slider, {
        //     start: [vm.lower, vm.upper],
        //     connect: true,
        //     margin: 10,
        //     step: 10,
        //     tooltips: true,
        //     range: {
        //         'min': vm.lower,
        //         'max': vm.upper
        //     },
        //     pips: { // Show a scale with the slider
        //         mode: 'steps',
        //         stepped: true,
        //         density: 4
        //     }
        // });


        // var min = 10;
        // var max = 100;
        // vm.lower = min;
        // vm.upper = max;

        var bkngdata = {
            'email': 'nabeel@gmail.com',
            'ccn': '4580-4580-4580-4580',
            'month': '01',
            'year': '20',
            'cvv': '123',
        }


        var body = {
            'lang': 'en',
            'bags': 0,
            'hold_bags': {
                '316956349': { '1': 1, '2': 1, '3': 0 }
            },
            'passengers': [
                {
                    'surname': 'test',
                    'cardno': '4332434',
                    'phone': '+44 564564568456',
                    'birthday': 724118400,
                    'nationality': 'UK',
                    'name': 'test',
                    'title': 'mr',
                    'expiration': 1454371200,
                    'email': 'lubos@skypicker.com'
                }
            ],
            'locale': 'en',
            'currency': 'czk',
            'booking_token': 'ltFG6EK6U1ktN1pD3kSeC0tMesZ1LWs1COTiIEclJxEXkNQZ 7u7AvSpolNNNZKzV4tOgrh/ sPQhgX78tURsphF2vJneyzb83QOkYi0SWS2BlHoFemXNA7wPmu83zNfUaSJ2i5zwN8IodeS2mJyWk5tCpAMCJvm7WcrY/0xG5LQE aAGcGEJFPpvh6XZO4JQihMncVgy9eq4Oaekw6lV8H5WyEBZA8W6DhI9usSgHYeBeUW4nD0ANonoyUrOG6Ycso34IJN5zI3oqr0DlOiWz2J0 bxAJtVeUFMbl4dWGGbiSb4Rje40QfzpGXrNqKoDrhi1EUhgWXfQjFG7b4GXqmsfn93MUEZ6nwNnmg1ScNVLmmbS/wXpV/tckjcB14C2wL/V kbeLYZWui13rE5GO GbBhVibfSrE1cA0T4zWLE70oa3PPI1fEqgkmApX42o4I52Wd1sqaE76t6Q35c2cLgtkxd zOPK229wXnUq/oxaRpqADYNsc1vD3XtJsbxfxPaatquMF1NPJbKLOcItlqdDvfc37IM9VFK4CJcU8tU9GyqM1F6tcplk1oHRuSaGp83cR2gl veYlR8VeOJ9Q==',
            'affily': 'picky',
            'booked_at': 'picky'
        };

        var zooz = '55RQZLF5HJXR7DCH5FEFAKZOGY';

        //   var mkpm=makePayment(bkngdata,zooz);

        po.zeez = function () {
            console.log('ye looooooooooo');
            //   mkpm(bkngdata,zooz);
        }
        //   _makePayment(bkngdata,zooz);

        console.log(flight.complete);

        //    vm.deleteArt=function(id){
        //        vm.processing= true;
        //        //accept the user id as parameter
        //        flight.delete(id)
        //            .success(function(data){
        //            flight.all()
        //                .success(function(data){
        //                vm.processing = false;
        //                vm.art=data;
        //            });
        //        });
        //    };


        // $http.get('/api/user/loc').success(function (data) {

        //     console.log(data);
        // });

        po.test = function () {

            console.log(po.departure);
            console.log(po.arrival);

            // $http.get('/api/user/loc').then(successCallback, errorCallback);

            // function successCallback(response) {
            //     //success code
            //     console.log(response.data);
            // }
            // function errorCallback(error) {
            //     //error code
            // }

        }

        flight.getLoc().then(function (data) {
            flight.complete.from = data.data.country_code;
            po.pfrom = data.data.country_name;
            // console.log(po.pfcrom)
        })
        flight.getAirs()
            .then(function (data) {
                // console.log(data.data);
                po.airs = data.data;
                // console.log(po.airs)
            })

        po.minFilter = function (p) {
            // console.log(p);
            return p.price >= po.slider.min;
        };

        po.maxFilter = function (p) {
            return p.price <= po.slider.max;
        };

        po.loadAirlines = function () {
            let data = vm.flights;
            let temp = [];

            var airr = [];


            data.forEach(function (item) {
                airr.push(item.airlines[0]);
            })

            // console.log(airr);

            temp = airr.filter(function (item, pos) {
                return airr.indexOf(item) == pos;
            })

            // console.log(temp);
            // data.forEach(function (item) {
            //     if (temp.valueOf(item.airlines[0]) === -1) {
            //         console.log(item.airlines[0]);
            //         temp.push(item);
            //     }
            // });
            vm.workItems = temp;

            console.log(vm.workItems);
        }
        po.detailToggle = false;

        po.showDetail = function () {
            if (po.detailToggle) {
                po.detailToggle = false;
                console.log(po.detailToggle);
            } else {
                po.detailToggle = true;
                console.log(po.detailToggle);
            }
        }




        po.loadPrice = function () {
            let data = vm.flights;
            let temp = [];

            var airr = [];


            data.forEach(function (item) {
                airr.push(item.price);
            })

            // console.log(airr);
            var min = Math.min.apply(Math, airr);
            var max = Math.max.apply(Math, airr);

            po.slider.options.floor = min;
            po.slider.options.ceil = max;

            po.slider.min = min + 500;
            po.slider.max = max - 500;

            // po.slider.min=Math.min.apply(Math, airr)+500;


            // console.log(vm.lower);
            // console.log(vm.upper);




            // noUiSlider.create(slider, {
            //     start: [vm.lower + 50, vm.upper - 50],
            //     connect: true,
            //     margin: 10,
            //     step: 10,
            //     tooltips: true,
            //     range: {
            //         'min': vm.lower,
            //         'max': vm.upper
            //     },
            //     pips: { // Show a scale with the slider
            //         mode: 'range',
            //         stepped: true,
            //         density: 4
            //     }
            // });

            // po.test();
        }




        $scope.clearSearchTerm = function () {
            $scope.searchTerm = '';
        };



        vm.text = 'adele'

        vm.resp = '';
        vm.imgurl = '';



        vm.city = [];

        vm.progress = false;



        //    vm.from;

        //    var arr=function airs(rsp){
        //        return rsp;
        //    }


        vm.airs;
        po.chng = false;
        po.currentNum = 20;

        $scope.flightType = false;
        flight.complete.ftype = 0;
        $scope.fTypeText = 'Connected (Stops)'



        po.changed = function () {
            po.chng = true;
        }

        function init() {

            var def = $q.defer();


            $http.get('/api/user/loc').then(function (data) {
                console.log(data);
                def.resolve(data);
                //            vm.from= data.country_code;
            });



            $http.get('/api/flights/' + 'airlines').then(function (data) {

                $scope.airs = data[0].airlines;
                //air=data[0].airlines;

                //            airs(retu);
            });

            return def.promise;
        };

        po.formatDate = function (date) {
            console.log(date);
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [day, month, year].join('/');
        };

        po.dateFrom = po.formatDate(new Date());
        po.dateTo = po.formatDate(new Date());

        //    console.log(formatDate(new Date()));





        vm.flightinfo = false;

        vm.airlines = true;



        //    init()
        //        .then(function(data){
        //        flight.complete.from=data.country_code;
        //        po.pfrom=data.country_name;
        //        console.log(data);
        //        console.log(po.pfrom);
        //    });



        vm.search = function () {

            flight.complete.dateFrom = po.dateFrom
            // flight.complete.dateFrom = po.departure
            flight.complete.dateTo = po.dateTo
            // flight.complete.dateTo = po.arrival

            // $location.path('/booking/w');

            po.loading = true;

            vm.flights = null;
            console.log('clickjed');

            var from = po.pfrom;
            var to = '';

            if (po.chng) {
                if (po.pfrom.type == 'country' || po.pfrom.type == 'airport') {
                    flight.complete.from = po.pfrom.id;
                } else if (po.pfrom.type == 'city') {
                    flight.complete.from = po.pfrom.name;
                } else if (po.pfrom.type == 'subdivision') {
                    po.pfrom = 'Please choose a different location';
                }
            }
            if (vm.to) {
                if (vm.to.type == 'country' || vm.to.type == 'airport') {
                    flight.complete.to = vm.to.id;
                } else if (vm.to.type == 'city') {
                    flight.complete.to = vm.to.name;
                } else if (vm.to.type == 'subdivision') {
                    vm.to = 'Please choose a different location';
                }

            }


            vm.complete = {
                'from': from,//vm.from,
                'to': to,//vm.to.id,
                'dateFrom': po.dateFrom,
                // 'dateFrom': po.departure,
                'dateTo': po.dateTo,
                'ftype': vm.ftype
            };
            console.log(flight.complete);


            vm.progress = true;
            //        
            $http.post('/api/flight/search/', flight.complete).then(function (data) {
                var response=data.data.data;
                // console.log(response);
                // console.log(data.data);
                vm.flights = response;
                po.length = response.length;
                vm.progress = false;
                po.loading = false;
                po.loadPrice();
                vm.refreshSlider();
                console.log(response);
                console.log(po.loading);
                console.log(po.progress);
                // $location.path('/flights');
            },
            function (err) {
                vm.progress = false;
                po.loading = false;
                throw err;

            })



        }



        vm.fType = function (val) {
            if (val) {
                $scope.fTypeText = 'Direct Flight (Non-Stop)';
                flight.complete.ftype = 1;


            } else {
                $scope.fTypeText = 'Connected (Stops)';
                flight.complete.ftype = 0;


            }

            //       "'Direct Flight (Non-Stop)'" "'Connected (Stops)'" 
            //        console.log(val)
        }


        po.ip = function (min, max) {
            console.log(min);
            console.log(max);
        }

        po.pricefilter = function (product) {
            if ((product.price <= po.slider.max) && (product.price >= po.slider.max)) {
                return product;
            }
        };



        vm.airls = function (line) {
            //        console.log($scope.airs);
            return po.airs.find(function (lin) {
                return lin.id == line;
            }).name;
        }

        po.airFilter = function (p) {
            return po.workItems.find(function (lin) {
                return p.airlines[0] == line;
            })
        }


        po.today = new Date();

        po.today = $filter('date')(new Date(1507486020), 'EEE MMM dd');
        // po.todayTime = $filter('date')(new Date(),'h:mm a');
        console.log(po.today);

        vm.dateConv = function (date) {
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            d.setUTCSeconds(date);
            var ret = $filter('date')(d, 'EEE MMM dd');
            // console.log(ret);
            return ret;
        }

        vm.timeConv = function (time) {
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            d.setUTCSeconds(time);
            var ret = $filter('date')(d, 'h:mm a');
            // console.log(ret);
            return ret;
        }

        vm.time = function (time) {
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            d.setUTCSeconds(time);

            //        console.log(d);
            return d.toLocaleString();
        }

        vm.book = function (item) {

            // po.stop();



            var token = item.booking_token;
            var token = {
                'tk': item.booking_token
            }

            po.cond = false;
            po.cancel = false;



            var i = 0;
            console.log(token)

            var promise;

            po.stop = function () {
                $interval.cancel(promise);
            }

            po.start = function () {
                po.stop();

                po.loading = true;
                promise = $interval(po.rep, 5000);
            }






            po.rep = function () {



                if (po.cond) {
                    po.stop();
                    console.log('check--');
                    console.log(po.checked);
                    po.loading = false;
                    $location.path('/flight/payment')
                    return;
                } else if (po.cancel) {
                    po.stop();
                    console.log('cancel--');
                    console.log(po.checked);
                    po.loading = false;
                    $location.path('/flight/payment')
                    return;
                }
                // console.log(';-;')
                // console.log(';;')

                $http({
                    method: 'POST',
                    data: token,
                    url: '/api/flights/chk/'
                }).then(function successCallback(data) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log(data.data);
                    po.cond = data.data.flights_checked;
                    po.cancel = data.data.flights_invalid;
                    po.checked = data.data;
                    console.log('check : %s', po.cond);
                    console.log('cancel : %s', po.cancel);

                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });





            };

            po.start();

            // if (po.cond) {
            //     po.start();

            // } else {
            //     po.stop();
            //     console.log(po.checked);
            // }


        }










        //    vm.submit=function(){
        //
        //        //        vm.resp='';
        //        //vm.text='asjjaklshdfl'
        //        flight.spot(vm.text)
        //            .success(function(data){
        //            console.log('successlu returned');
        //            var rety=data;
        //            var ert=rety._embedded.events[0];
        //            console.log(ert);
        //            var imageUrl = ert.images[0].url;
        //            po.decachedImageUrl = imageUrl + '?decache=' + Math.random();
        //            vm.imgurl=imageUrl;
        //            //            vm.imgurl=ert.images[0].url;
        //            vm.resp=ert;
        //        })
        //        ;
        //    }

        //    var ret=[];






        //    var se='airport';
        //    $http.get('/api/flights/'+'airport').success(function(data){
        //
        //        var rret=data[0].locations;
        //
        //
        //        vm.state=rret.map( function (state) {
        //            state.name=state.name.toLowerCase();
        //            return state;
        //        });
        //
        //
        //
        //        console.log(vm.states);
        //
        //    }).error(function(err){
        //        throw err;
        //    });

        //    var air=[];
        //
        //    vm.airs=function airs(rsp){
        //        return rsp;
        //    }








        //    function errr(rsp){
        //        console.log(rsp);
        //    }
        //    console.log(airlines());

        //
        //    vm.airls=function(line){
        //        console.log(line);
        //        return vm.airs.find(function(lin){
        //            return lin.id==line;
        //        }).name;
        //    }


        //    console.log(vm.airs('OV'));



        var city = {
            cit: 'telaviv'
        }



        po.hotel = function (searchText) {
            return $http
                .get('api/hotel/search/' + searchText)
                .then(function (data) {
                    // Map the response object to the data object.
                    console.log(data.data);
                    return data.data;
                });
        };



        //    $http.get('/api/loc/').success(function(data){
        //
        //        //var ert=data[0].locations;
        //
        //
        //
        //    }).error(function(err){
        //        throw err;
        //    });

        //        $http.get('/api/loc/').success(function(data){
        //            console.log(data);
        //        });








        // console.log(vm.all);


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




    });