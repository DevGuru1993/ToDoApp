'use strict';

angular.module('myApp.sampleBoard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/sampleBoard', {
    templateUrl: 'sampleBoard/sampleBoardView.html',
    controller: 'sampleBoardController'
  });
}])

.controller('sampleBoardController', ['$scope','$mdDialog','$mdMedia','$mdToast',function($scope,$mdDialog, $mdMedia,$mdToast) {

  $scope.sampleBoard = {
    "grocesrries":{
        "tommatto": ["Check Whether it is riped","Check for the size","Check for the color"],
        "pottato":["Check whether it is highly solid","The color must be highly pale","It should be cooked very well before eat."]
    },
    "furnitures":{
        "table":["It must be tek wood","the height must me atleast 6 feet","The height must be 4 feet width"],
        "chair":["Plastic chair must be good width","The chair must white in color","The chair must have a hand"]
    },
    "office":{
        "mail":["Check the mail","Reply for the mail","Send all th important mail"],
        "meeting":["Be professional in meeting","Check for the agenda of meeting","Prepare the presentation need and clean"]
    },
    "test":{
      "testsub1":["Check the mail","Reply for the mail","Send all th important mail"],
      "testsub2":["Be professional in meeting","Check for the agenda of meeting","Prepare the presentation need and clean"]
    },
    "test1":{
      "testsub1":["Check the mail","Reply for the mail","Send all th important mail"],
      "testsub2":["Be professional in meeting","Check for the agenda of meeting","Prepare the presentation need and clean"]
    }
  };

  //Toast util functions
  var last = {
    bottom: false,
    top: true,
    left: false,
    right: true
  };
  $scope.toastPosition = angular.extend({},last);
  $scope.getToastPosition = function() {
    sanitizePosition();
    return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
  };
  function sanitizePosition() {
    var current = $scope.toastPosition;
    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;
    last = angular.extend({},current);
  }


  //Delete the card
  $scope.deleteCard = function(ev,listKey,cardKey) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
        .title('Would you like to delete this card?')
        .textContent('All you remainder comments will be deleted')
        .ariaLabel('Card Done')
        .targetEvent(ev)
        .ok('Please delete the card!')
        .cancel("Don't delete the card");
    $mdDialog.show(confirm).then(function() {
      delete $scope.sampleBoard[listKey][cardKey];
      if( Object.keys($scope.sampleBoard[listKey]).length == 0|| angular.isUndefined($scope.sampleBoard[listKey]) || $scope.sampleBoard[listKey]== null){
        delete $scope.sampleBoard[listKey]
      }
      $mdToast.show(
          $mdToast.simple()
              .textContent('Successfully deleted the card.')
              .position($scope.getToastPosition())
              .hideDelay(1000)
      );
    }, function() {
      $mdToast.show(
          $mdToast.simple()
              .textContent('You are opted not do delete the card')
              .position($scope.getToastPosition())
              .hideDelay(1000)
      );
    });
  };

  //This function is to delete the given list.
  $scope.deleteList= function(ev,listKey) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
        .title('Would you like to delete this list?')
        .textContent('All you cards under the list will be deleted')
        .ariaLabel('List Done')
        .targetEvent(ev)
        .ok('Please delete the list!')
        .cancel("Don't delete the list");
    $mdDialog.show(confirm).then(function() {
      delete $scope.sampleBoard[listKey];
      $mdToast.show(
          $mdToast.simple()
              .textContent('Successfully deleted the list.')
              .position($scope.getToastPosition())
              .hideDelay(1000)
      );
    }, function() {
      $mdToast.show(
          $mdToast.simple()
              .textContent('You are opted not do delete the list')
              .position($scope.getToastPosition())
              .hideDelay(1000)
      );
    });
  };

  //To add comments in the card
  $scope.addComment = function(ev,listKey,cardKey) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
          controller: DialogController,
          templateUrl: 'sampleBoard/commentAddDialog.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen
        })
        .then(function(answer) {
          $scope.sampleBoard[listKey][cardKey].push(answer);
          $mdToast.show(
              $mdToast.simple()
                  .textContent('Your comment is successfully added to '+ cardKey + " card.")
                  .position($scope.getToastPosition())
                  .hideDelay(500)
          );

        }, function() {
          $mdToast.show(
              $mdToast.simple()
                  .textContent('Your cancelled the add comment.')
                  .position($scope.getToastPosition())
                  .hideDelay(500)
          );
        });
    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };
  function DialogController($scope, $mdDialog) {
    $scope.comment = null;
   
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }


  //This function is to add card.
  $scope.addCard = function(ev,listKey) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
          controller: addCardDialogController,
          templateUrl: 'sampleBoard/addCardDialog.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen
        })
        .then(function(card) {
          $scope.sampleBoard[listKey][card.name] = card.comments;
          $mdToast.show(
              $mdToast.simple()
                  .textContent('Your card is successfully added to '+ listKey + " list.")
                  .position($scope.getToastPosition())
                  .hideDelay(500)
          );

        }, function() {
          $mdToast.show(
              $mdToast.simple()
                  .textContent('Your cancelled the add card.')
                  .position($scope.getToastPosition())
                  .hideDelay(500)
          );
        });
    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };
  function addCardDialogController($scope, $mdDialog) {
    $scope.card = {};
    $scope.card.name = null;
    $scope.card.comment1 = null;
    $scope.card.comment2 = null;
    $scope.card.comment3 = null;

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.addCard = function(card) {
      var tempCommentArray = [];
      if(card.comment1 != null){
        tempCommentArray.push(card.comment1);
      }
      if(card.comment2 != null){
        tempCommentArray.push(card.comment2);
      }
      if(card.comment3 != null){
        tempCommentArray.push(card.comment3);
      }
      delete card.comment1;
      delete card.comment2;
      delete card.comment3;
      card.comments = tempCommentArray;
      $mdDialog.hide(card);
    };
  }

  //This function is to Add List in board
  //This function is to add card.
  $scope.addList = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
          controller: addListDialogController,
          templateUrl: 'sampleBoard/addListDialog.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen
        })
        .then(function(list) {
          $scope.sampleBoard[list.name] = {};
          $mdToast.show(
              $mdToast.simple()
                  .textContent('Your list is successfully added.')
                  .position($scope.getToastPosition())
                  .hideDelay(500)
          );

        }, function() {
          $mdToast.show(
              $mdToast.simple()
                  .textContent('Your cancelled the list card.')
                  .position($scope.getToastPosition())
                  .hideDelay(500)
          );
        });
    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };
  function addListDialogController($scope, $mdDialog) {
    $scope.list = null;

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.addList = function(list) {
      $mdDialog.hide(list);
    };
  }
}]);