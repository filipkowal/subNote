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
