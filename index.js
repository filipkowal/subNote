var app = angular.module('subNote', []);

app.controller('mainCtrl', ['$scope',
    'noteService',
    '$rootScope',
    '$interval',
    '$http',
    function($scope,
             noteService,
             $rootScope,
             $interval,
             $http) {
    (function init () {
        // $rootScope.$broadcast('restorestate');
        $scope.sheets = noteService.sheets;
        // $scope.sheets = {
        //     sheets: {
        //         notes: [
        //             {
        //                 text: 'pies\nczupiradło',
        //                 title: null,
        //                 color: 'blue',
        //                 id: 0.4,
        //                 showSubNotes: true,
        //                 subNotes: [
        //                     {title: 'mięso', text: 'mieso', id: 0.3, parentId: 0.4}
        //                 ]
        //             }
        //         ]
        //     }};
        //
        // $scope.notes = [
        //     {
        //         text: 'pies\nczupiradło',
        //         title: null,
        //         color: 'blue',
        //         id: 0.4,
        //         showSubNotes: true,
        //         subNotes: [
        //             {title: 'mięso', text: 'mieso', id: 0.3, parentId: 0.4}
        //         ]
        //     }
        // ];
        console.log('$scope.sheets', $scope.sheets);

        $http.get('https://api.github.com/users/filipkowal').then(function(response){
            $scope.user = response.data;
        });
    })();

    $scope.moreThenOneNote = function () {
        return $scope.sheets.notes.length -1;
    };

    $scope.toggleShowSubNotes = function (note) {
        note.showSubNotes = !note.showSubNotes;
    };

    $scope.deleteNote = function (note) {
        if($scope.moreThenOneNote) {
            $scope.sheets.notes = $scope.sheets.notes.filter(function(elem) {
                return note.id !== elem.id;
            })
        }
        $rootScope.$broadcast('savestate');
    };

    $scope.deleteSubNote = function (note, subnote) {
        note.subNotes = note.subNotes.filter(function(elem){
            return subnote.id !== elem.id;
        });
        $rootScope.$broadcast('savestate');
    };

    $scope.newSubNote = function(note) {
        note.subNotes.push({
            text: '',
            title: null,
            id: Math.random(),
            parentId: note.id
        });
        $rootScope.$broadcast('savestate');
    };

    $scope.$watch('sheets', function() {
        console.log('change in sheets');
        $rootScope.$broadcast('savestate');
    }, true);
}]);
app.directive('watchNote', function($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            $scope.initialHeight = $scope.initialHeight || element[0].style.height;

            // element.on("input change", watchNote());
            $timeout(resize, 0);

            $scope.$watch(attrs.ngModel, function(newVal, oldVal) {
                var note = $scope.sheets.notes.find(function(note){
                    return note.id === Number(attrs.id);
                });
                if (note === undefined) {
                    $scope.sheets.notes.forEach(function(e){
                        subNote = e.subNotes.find(function(elem){
                            return elem.id === Number(attrs.id);
                        });
                        if (subNote) {
                            note = e;}
                    });
                    watchNote(newVal, note, subNote);
                    return
                }
                watchNote(newVal, note);
            });

            function watchNote (text, note, subNote) {
                resize();
                if( text && text.search(/\n\n$/) > -1 ) {
                    if (subNote) subNote.text = text.substring(0, text.length -2);
                    else note.text = text.substring(0, text.length -2);
                    newNote(note, subNote);
                }
                else if(text === null) {
                    element[0].focus();
                }
            }
            function resize () {
                element[0].style.height = $scope.initialHeight;
                element[0].style.height = "" + (element[0].scrollHeight + 2) + "px";
            }
            function newNote (note, subNote) {
                var id = Math.random();
                if (subNote) {
                    note.subNotes.push({text: null, title: null, id: id});
                }
                else $scope.sheets.notes.push({text: null, title: null, id: id, showSubNotes: true, subNotes: []});
            }
        }
    }
});
app.factory('noteService', ['$rootScope', function ($rootScope) {

    var service = {
        sheets: {
            notes: [
                {
                    text: 'pies\nczupiradło',
                    title: null,
                    color: 'blue',
                    id: 0.4,
                    showSubNotes: true,
                    subNotes: [
                        {title: 'mięso', text: 'mieso', id: 0.3, parentId: 0.4}
                    ]
                }
            ]
        },

        SaveState: function () {
            console.log('save');
            localStorage.noteService = JSON.stringify(service.sheets);
        },

        RestoreState: function () {
            console.log('restore');
            service.sheets = JSON.parse(localStorage.noteService);
        }
    };

    $rootScope.$on("savestate", service.SaveState);
    $rootScope.$on("restorestate", service.RestoreState);

    return service;
}]);