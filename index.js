var app = angular.module("subNote", []);
app.controller("mainCtrl", function($scope, noteService, $rootScope, $interval) {
    init = function () {
        $rootScope.$broadcast('restorestate');
    };
    init();
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
            localStorage.noteService = JSON.stringify(service.sheets);
        },

        RestoreState: function () {
            service.sheets = JSON.parse(localStorage.noteService);
        }
    };

    $rootScope.$on("savestate", service.SaveState);
    $rootScope.$on("restorestate", service.RestoreState);

    return service;
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

// $scope.newTodo = function(newT) {
//     $scope.sheets.todos.push(
//         {
//             text: newT,
//             title: null,
//             color: 'blue',
//             id: Math.random(),
//             subTodos: [
//                 {title: null, text: null}
//             ]
//         });
// };
// $scope.newSubTodo = function(newT) {
//     $scope.sheets.todos.push(
//         {
//             text: newT,
//             title: null,
//             color: 'blue',
//             id: Math.random(),
//             subTodos: [
//                 {title: null, text: null}
//             ]
//         });
// };
// $scope.done = function (todo) {
//     todo.todoVal = true;
//     $scope.sheets.done.push(todo);
//     $scope.deleteTodo(todo);
// };
// $scope.deleteTodo = function (todo) {
//     $scope.sheets.todos = $scope.sheets.todos.filter(function(elem) {
//         return todo.id !== elem.id;
//     });
// };