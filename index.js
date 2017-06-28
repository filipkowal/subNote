var app = angular.module("subNote", []);

app.controller("mainCtrl", function($scope, noteService, $rootScope, $interval, $http) {
    (function init () {
        $rootScope.$broadcast('restorestate');
        $http.get('https://api.github.com/users/filipkowal').then(function(response){
            $scope.user = response.data;
        });
    })();

    $scope.sheets = noteService.sheets;
    $scope.deleteNote = function (note) {
        if($scope.moreThenOneNote) {
            $scope.sheets.notes = $scope.sheets.notes.filter(function(elem) {
                return note.id !== elem.id;
            })
        }
        $rootScope.$broadcast('savestate');
        $rootScope.$broadcast('restorestate');
    };
    $scope.deleteSubNote = function (note, subnote) {
        note.subNotes = note.subNotes.filter(function(elem){
            return subnote.id !== elem.id;
        });
        $rootScope.$broadcast('savestate');
        $rootScope.$broadcast('restorestate');
    };
    $scope.newSubNote = function(note) {
        note.subNotes.push({
            text: '',
            title: null,
            id: Math.random(),
            parentId: note.id
        });
        $rootScope.$broadcast('savestate');
        $rootScope.$broadcast('restorestate');

    };
    $scope.moreThenOneNote = function () {
        return $scope.sheets.notes.length -1;
    };
    $scope.view = {name: 'notes'};

    window.onbeforeunload = function (event) {
        $rootScope.$broadcast('savestate');
    };
    $interval(function () {
        $rootScope.$broadcast('savestate');
    }, 100);
    //
    $scope.toggleShowSubNotes = function (note) {
        note.showSubNotes = !note.showSubNotes;
    }
});