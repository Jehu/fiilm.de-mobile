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


    $scope.loadMovies = function() {
        return function() {
            // FIXME dynamic user id!
            $http.get($scope.serverPath + '/user/1/my-movies.json')
            .success(function(data) {
               console.log('load users movies list, now!');     
               console.log('data: ',data.nodes); 
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
        $scope.drupalUser = data.user;
        if ($scope.drupalUser.uid == 0) {
            // User is not logged in
            $scope.showLoginBtn = true;
            $.ui.loadContent("login");
        }
        else {
            // User is logged in.
            $scope.showLoginBtn = false;
            // now we can load the users movie list
            console.log('load users movie list!');
            $scope.loadMovies()();
        }
    });

    $scope.logout = function() {
        $http.post(
            $scope.serverPath +'/?q=mobileapp/user/logout.json', 
            {} 
        )
        .success(function(data) {
            $scope.drupalUser = undefined;
            $scope.showLoginBtn = true;
            $.ui.loadContent("login");
        })
        .error(function(data, code) {
            if(code == '406') {
                $scope.drupalUser = undefined;
                $scope.showLoginBtn = false;
                $.ui.loadContent('login');
            }
            else {
                $scope.drupalUser = undefined;
                $scope.showLoginBtn = false;
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
            $scope.drupalUser = data.user;
            $scope.username = null;
            $scope.password = null;
            $scope.showLoginBtn = false; // FIXME: why this don't work?
            console.log('login successful');
            console.log('load users movie list!');
            $scope.loadMovies()();
            $.ui.loadContent("start");
        }).error(function(data,code) {
            console.log('error: ',code);
            if(code == '406') {
                $scope.drupalUser = undefined;
                $scope.username = null;
                $scope.password = null;
                $scope.showLoginBtn = true;
                $.ui.loadContent("dialog-already-logged-in");
            }
            else if(code == '401') {
                $scope.drupalUser = undefined;
                $scope.showLoginBtn = true;
                $.ui.loadContent("dialog-authentication-error");
            }
            else {
                alert('An error occured!');
                $scope.drupalUser = undefined;
                $scope.showLoginBtn = true;
            }
        });
    }
}
