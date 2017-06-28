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