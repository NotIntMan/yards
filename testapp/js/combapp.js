angular.module('CombApp',[])
    .controller('main',function($scope,winBar) {
        window.$scope=$scope;
        $scope.win=winBar(window);
        $scope.screen='start';
        $scope.args=[];
        ($scope.addArg=function() {
            $scope.args.push({
                name:(Math.floor(Math.random()*26)+10).toString(36),
                opts:'0123456789',
                delimiter:''
            });
        })();
        $scope.removeArg=function(id) {
            var newArgs=[];
            for (var i=0; i<$scope.args.length; i++)
                if (i!=id)
                    newArgs.push($scope.args[i]);
            $scope.args=newArgs;
        };
        $scope.code='return;';
        $scope.vars=[];
        $scope.run=function() {
            var vars=[];
            var fn=eval('(function('+$scope.args.map(function(a) {
                return a.name;
            }).join(',')+'){'+$scope.code+'})');
            console.log('(function('+$scope.args.map(function(a) {
                return a.name;
            }).join(',')+'){'+$scope.code+'})');
            var gen=function(index,args) {
                if (index>=$scope.args.length&&args.length>0) {
                    vars.push(fn.apply(null,args));
                    return;
                };
                var opts=$scope.args[index].opts.split($scope.args[index].delimiter);
                for (var i=0; i<opts.length; i++)
                    gen(index+1,args.concat([opts[i]]));
            };
            gen(0,[]);
            $scope.vars=vars;
            $scope.screen='vars';
        };
    });