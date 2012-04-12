function MainCntl($scope, $http) {
    $scope.setHideLoginBtn = function() {
        $scope.hideLoginBtn = true;    
    }
    $scope.serverPath = 'http://192.168.1.87';
    $scope.movies = [];

    $scope.currentMovie = undefined;
    $scope.$watch('currentMovie');

    $scope.showLoginBtn = true;
    $scope.$watch('showLoginBtn');

    $scope.drupalUser = undefined;
    $scope.$watch('drupalUser');

    $scope.setDrupalUser = function(user) {
        $scope.drupalUser = user;
    }

    $scope.setShowLoginBtn = function(value) {
        $scope.showLoginBtn = value;
    }

    $scope.loadMovies = function() {
        return function() {
            $http.get($scope.serverPath + '/user/' + $scope.drupalUser.uid + '/my-movies.json')
            .success(function(data) {
               $scope.movies = data.nodes;
            });
        }
    }

    // used in view!
    $scope.setCurrentMovie = function(movie) {
        $scope.currentMovie = movie;
    };
}

function MoviesListCntl($scope) {
}

function AddMovieCntl($scope) {
}

function MovieDetailsCntl($scope) {
}

function DashboardCntl($scope, $http) {
    $http.post(
        $scope.serverPath + '/?q=mobileapp/system/connect.json',
        {}
    )
    .success(function(data) {
        $scope.setDrupalUser(data.user);
        if ($scope.drupalUser.uid == 0) {
            // User is not logged in
            $scope.setShowLoginBtn(true);
            $.ui.loadContent("login");
        }
        else {
            // User is logged in.
            $scope.setShowLoginBtn(false);
            // now we can load the users movie list
            $scope.loadMovies()();
        }
    });

    $scope.logout = function() {
        $http.post(
            $scope.serverPath +'/?q=mobileapp/user/logout.json', 
            {} 
        )
        .success(function(data) {
            $scope.setDrupalUser(undefined);
            $scope.setShowLoginBtn(false);
            $.ui.loadContent("login");
        })
        .error(function(data, code) {
            if(code == '406') {
                $scope.setDrupalUser(undefined);
                $scope.setShowLoginBtn(false);
                $.ui.loadContent('login');
            }
            else {
                $scope.setDrupalUser(undefined);
                $scope.setShowLoginBtn(false);
                alert('Unknown error');
            }
        });
    };

}

function LoginCntl($scope, $http) {
    $scope.login = function() {
        $http.post(
            $scope.serverPath + '/?q=mobileapp/user/login.json', 
            {
                username: $scope.username
                ,password: $scope.password
            }
        ).success(function(data) {
            $scope.setDrupalUser(data.user);
            $scope.username = null;
            $scope.password = null;
            $scope.setShowLoginBtn(false);
            $scope.loadMovies()();
            $.ui.loadContent("start");
        }).error(function(data,code) {
            if(code == '406') {
                $scope.setDrupalUser(undefined);
                $scope.username = null;
                $scope.password = null;
                $scope.setShowLoginBtn(true);
                $.ui.loadContent("dialog-already-logged-in");
            }
            else if(code == '401') {
                $scope.setDrupalUser(undefined);
                $scope.setShowLoginBtn(true);
                $.ui.loadContent("dialog-authentication-error");
            }
            else {
                alert('An error occured!');
                $scope.setDrupalUser(undefined);
                $scope.setShowLoginBtn(true);
            }
        });
    }
}
