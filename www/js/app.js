angular.module('starter', ['ionic','ngCordova'])

.run(function($rootScope, $ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    var db = $rootScope.db = $cordovaSQLite.openDB({ name: "my.db", location: "default" });
    //var db = $rootScope.db = window.openDatabase("my.db","1","Productores","2000");

    $cordovaSQLite.execute(db, "CREATE TABLE productor (id INTEGER, firstname TEXT, lastname TEXT, isactive TEXT DEFAULT 'Y',PRIMARY KEY(id))");
    $cordovaSQLite.execute(db, "CREATE TABLE tipofinca (id INTEGER, name TEXT, isactive TEXT DEFAULT 'Y',PRIMARY KEY(id))");
    $cordovaSQLite.execute(db, "CREATE TABLE finca (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT,idtipofinca INTEGER,idproductor INTEGER, status TEXT DEFAULT 'N')");
  });

})

.controller('HomeCtrl',function($scope, $ionicSideMenuDelegate, $state){

  $scope.title = "Home";

   $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.toHome = function(){
      $state.go('home');
      $scope.title = "Home";
  }

  $scope.toProductor = function(){
      $state.go('productor');
      $scope.title = "Productor";
  }

  $scope.toTipoFinca = function(){
      $scope.title = "Tipo de Finca";
      $state.go('tipo_finca');
  }

  $scope.toFinca = function(){
      $scope.title = "Finca";
      $state.go('finca');
  }

})

.controller('ProductorCtrl',function($scope, $cordovaSQLite, $http){

  $scope.import = function(){
    $cordovaSQLite.execute($scope.db, "delete from productor");

    $http.get("http://www.inteligenciadenegocios.xyz/api/getimport.php?operation=iproductores").
    success(function(data, status, header, config){

      for(var i = 0;i < data.length; i++){
        //console.log(data[i].firstname + " " +data[i].lastname);

        var id = data[i].id;
        var firstname = data[i].firstname;
        var lastname = data[i].lastname;

        $cordovaSQLite.execute($scope.db, "insert into productor (id,firstname, lastname) values ("+id+",'"+firstname+"','"+lastname+"')");
      }

      //console.log("Productores importados con exito");

      var query = "SELECT * FROM productor";
      $scope.productores = [];
      $cordovaSQLite.execute($scope.db, query, []).then(function(res) {
         for(var i = 0;i < res.rows.length; i++){
            $scope.productores.push({
              id : res.rows.item(i).id,
              firstname : res.rows.item(i).firstname,
              lastname : res.rows.item(i).lastname
            });
         }
      }, function (err) {
          console.error(err);
      });

    }).error(function(data, status, headers, config){
      //
    });
  }

    var query = "SELECT * FROM productor";
    $scope.productores = [];
    $cordovaSQLite.execute($scope.db, query, []).then(function(res) {
       for(var i = 0;i < res.rows.length; i++){
          $scope.productores.push({
            id : res.rows.item(i).id,
            firstname : res.rows.item(i).firstname,
            lastname : res.rows.item(i).lastname
          });
       }
    }, function (err) {
        console.error(err);
    });

})

.controller('TipoFincaCtrl',function ($scope, $cordovaSQLite, $http){

    $scope.import = function(){
      $cordovaSQLite.execute($scope.db, "delete from tipofinca");

      $http.get("http://www.inteligenciadenegocios.xyz/api/getimport.php?operation=itipofincas").
      success(function(data, status, header, config){

        for(var i = 0;i < data.length; i++){
          //console.log(data[i].firstname + " " +data[i].lastname);

          var id = data[i].id;
          var name = data[i].name;

          $cordovaSQLite.execute($scope.db, "insert into tipofinca (id,name) values ("+id+",'"+name+"')");
        }

        //console.log("Productores importados con exito");

        var query = "SELECT * FROM tipofinca";
        $scope.tipofincas = [];
        $cordovaSQLite.execute($scope.db, query, []).then(function(res) {
           for(var i = 0;i < res.rows.length; i++){
              $scope.tipofincas.push({
                id : res.rows.item(i).id,
                name : res.rows.item(i).name
              });
           }
        }, function (err) {
            console.error(err);
        });

      }).error(function(data, status, headers, config){
        //
      });
    }

    var query = "SELECT * FROM tipofinca";
    $scope.tipofincas = [];
    $cordovaSQLite.execute($scope.db, query, []).then(function(res) {
       for(var i = 0;i < res.rows.length; i++){
          $scope.tipofincas.push({
            id : res.rows.item(i).id,
            name : res.rows.item(i).name
          });
       }
    }, function (err) {
        console.error(err);
    });

})

.controller('FincaCtrl',function($scope){


})

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('home',{
    url : '/home',
    templateUrl : 'templates/index.html',
    controller : 'HomeCtrl'
  })

  .state('productor',{
    url : '/productor',
    templateUrl : 'templates/productor/index.html',
    controller : 'ProductorCtrl'
  })

  .state('tipo_finca',{
    url : '/tipo_finca',
    templateUrl : 'templates/tipofinca/index.html',
    controller : 'TipoFincaCtrl'
  })

  .state('finca',{
    url : '/finca',
    templateUrl : 'templates/finca/index.html',
    controller : 'FincaCtrl'
  })
  
  $urlRouterProvider.otherwise('home');
})