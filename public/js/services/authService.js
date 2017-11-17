angular.module('authServ',[])
    .service('authService', authService);

authService.$inject = ['$state', 'angularAuth0', 'authManager'];

function authService($state, angularAuth0, authManager) {

    function test(txt){
        console.log(txt);
        return txt;
    }

    function login(username, password) {
        angularAuth0.authorize();
    }

    function handleParseHash() {
        angularAuth0.parseHash(
            { _idTokenVerification: false },
            function (err, authResult) {
                // console.log(authResult);
                if (err) {
                    console.log(err);
                }
                if (authResult && authResult.idToken) {
                    console.log('settoken');
                    setUser(authResult);
                    console.log(setUser(authResult));
                }
            });
    }

    function logout() {
        console.log('removetoken');
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
    }

    function setUser(authResult) {
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
    }

    function isAuthenticated() {
        return authManager.isAuthenticated();
    }

    return {
        login: login,
        handleParseHash: handleParseHash,
        logout: logout,
        isAuthenticated: isAuthenticated,
        test:test
    }
}