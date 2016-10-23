angular.module('app', ['components','ngRoute'])

.run(function($rootScope, $location) {
    $rootScope.location = $location;
})

// Definição de rotas
.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "main.html"
    })
    .when("/tabs", {
        templateUrl : "tabs.html"
    })
    .when("/coments", {
        controller : "Coments as coments",
        templateUrl : "coments.html"
    });
})

// Services
.factory('ComentsService',function($window, $http){
  var service = {
    addComent : addComent,
    getListComents : getListComents,
    removeAllComents : removeAllComents,
    getComentsTypes : getComentsTypes
  };

  return service;

  function addComent(coment){
    console.log("Adicionar comentário!");
    var coments = getListComents();
    coments.push(coment);
    $window.localStorage.setItem("coments", JSON.stringify(coments));
  }

  function getListComents(){
    console.log("Listar comentários!");
    var coments = $window.localStorage.getItem("coments");
    if(coments){
      coments = JSON.parse(coments);
      //console.log(coments);
      return coments;
    }
    return new Array();
  }

  function removeAllComents(){
    console.log("Comentários removidos!")
    $window.localStorage.removeItem("coments");
  }

  function getComentsTypes(){
    return $http.get('comentsTypes.json',{cache : true});
  }

})

// Controladores
.controller('BeerCounter', function($scope, $locale) {
  $scope.beers = [0, 1, 2, 3, 4, 5, 6];
  if ($locale.id == 'en-us') {
    $scope.beerForms = {
      0: 'no beers',
      one: '{} beer',
      other: '{} beers'
    };
  } else {
    $scope.beerForms = {
      0: 'žiadne pivo',
      one: '{} pivo',
      few: '{} pivá',
      other: '{} pív'
    };
  }
})

.controller('Coments', Coments);

// Injeção de dependências
Coments.$inject = ['$scope', '$interval', 'ComentsService'];

// Função construtora do crontrolador Coments
function Coments($scope, $interval, comentsService){
  // Atributos
  $scope.listComents = null;
  $scope.listComentsTypes = null;
  $scope.coment = null;
  $scope.message = null;

  // Funções
  $scope.addNewComent = addNewComent;
  $scope.removeComents = removeComents;

  // Inicializando os atributos
  inicializar();

  function addNewComent(){
    angular.forEach($scope.formComentario.$error.required, function(field) {
				field.$setDirty();
		});

    if($scope.formComentario.$valid){
      $scope.coment.date = new Date();
      comentsService.addComent($scope.coment);
      addMessage("success", "Comentário adicionado com sucesso!");
      inicializar();
      $scope.formComentario.$setPristine();
    } else {
      addMessage("danger", "Preenchimento de campos inválidos!");
    }
  }

  function removeComents(){
    comentsService.removeAllComents();
    $scope.listComents = comentsService.getListComents();
    addMessage("info", "Todos os comentários removidos!");
  }

  function inicializar(){
    $scope.coment = {};
    $scope.listComents = comentsService.getListComents();
    comentsService.getComentsTypes().then(function(retorno){
      // No suceso da requisição http
      $scope.listComentsTypes = retorno.data;
    }, function(retorno){
      // No erro da requisição http
      console.log(retorno);
      addMessage('danger','Não foi possível recuperar os tipos de comentários!');
    });
  }

  function addMessage(typeMsg , textMsg){
    $scope.message = {
      type : typeMsg,
      text : textMsg
    };
    $interval(function(){
      $scope.message = null;
    }, 10000);
  }

}

/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
