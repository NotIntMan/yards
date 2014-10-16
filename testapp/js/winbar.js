angular.module('CombApp')
    .factory('winBar',function() {
        var gui = require('nw.gui');
        return function(win) {
            var win = gui.Window.get(win);
            var maxed = false;
            win.on('maximize',function() {
                maxed=true;
            });
            win.on('unmaximize',function() {
                maxed=false;
            });
            return {
                min:function() {
                    win.minimize();
                },
                max:function(){
                    if (maxed)
                        win.unmaximize();
                    else
                        win.maximize();
                },
                close:function() {
                    win.close();
                },
                get maxed() {
                    return maxed;
                },
                get win() {
                    return win;
                }
            };
        };
    });