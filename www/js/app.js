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

    //var db = $rootScope.db = $cordovaSQLite.openDB({ name: "my.db", location: "default" });
    var db = $rootScope.db = window.openDatabase("my.db","1","Productores","2000");

    $cordovaSQLite.execute(db, "CREATE TABLE server (url TEXT)");
    $cordovaSQLite.execute(db, "CREATE TABLE semilla (cultivo TEXT, semilla TEXT, descripcio TEXT, siclosiemb INTEGER, tipologia INTEGER)");
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

  $scope.toConfiguracion = function(){
      $state.go('configuracion');
      $scope.title = "Configuracion";
  }

  $scope.toSemilla = function(){
      $scope.title = "Semilla";
      $state.go('semilla');
  }

})

.controller('ConfiguracionCtrl',function($scope, $cordovaSQLite, $http){

  $scope.import = function(){
    //$cordovaSQLite.execute($scope.db, "delete from productor");

    /*$http.get("").
    success(function(data, status, header, config){

      for(var i = 0;i < data.length; i++){
        //console.log(data[i].firstname + " " +data[i].lastname);
        $cordovaSQLite.execute($scope.db, "Query Here");
      }

      var query = "Query Here";
      $scope.configuraciones = [];
      $cordovaSQLite.execute($scope.db, query, []).then(function(res) {
         for(var i = 0;i < res.rows.length; i++){
            $scope.configuraciones.push({
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
    });*/
  }

})

.controller('SemillaCtrl',function($scope, $state, $cordovaSQLite, $http){

  $scope.goToAddSemilla = function(){
      $state.go("add-semilla");
  }

   $scope.goToEditSemilla = function(){
      $state.go("edit-semilla");
  }

  $scope.cancel = function(){
    $state.go("semilla");
  }

  $scope.add = function(){
    //$cordovaSQLite.execute($scope.db, "INSERT INTO finca (name,idtipofinca,idproductor) values ('"+name+"',"+tipofinca+","+productor+")");
    $state.go("semilla");
  }

  $scope.export = function(){

    $http.get("").
    success(function(data, status, header, config){
        console.log(data);
    }).error(function(data, status, headers, config){
      console.log(data);
    });

      var query = "Query Here";
      $cordovaSQLite.execute($scope.db, query, []).then(function(res) {
         for(var i = 0;i < res.rows.length; i++){
              $http.get("").
              success(function(data, status, header, config){
                  console.log(data);
              }).error(function(data, status, headers, config){
                console.log(data);
              });
         }
         $state.go("semilla");
      }, function (err) {
          console.error(err);
      });
  }

})

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('home',{
    url : '/home',
    templateUrl : 'templates/index.html',
    controller : 'HomeCtrl'
  })

  .state('configuracion',{
    url : '/configuracion',
    templateUrl : 'templates/configuracion/index.html',
    controller : 'ConfiguracionCtrl'
  })

  .state('semilla',{
    url : '/semilla',
    cache: false,
    templateUrl : 'templates/semilla/index.html',
    controller : 'SemillaCtrl'
  })

  .state('add-semilla',{
    url : '/add-semilla',
    templateUrl : 'templates/semilla/add.html',
    controller : 'SemillaCtrl'
  })

  .state('edit-semilla',{
    url : '/edit-semilla',
    templateUrl : 'templates/semilla/edit.html',
    controller : 'SemillaCtrl'
  })
  
  $urlRouterProvider.otherwise('home');
})