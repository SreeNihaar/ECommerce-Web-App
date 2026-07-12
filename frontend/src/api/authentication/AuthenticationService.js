class AuthenticationService {

    setupToken(token){
        localStorage.setItem('token', token);
    }

    logout(){
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload(false);
    }
}

export default new AuthenticationService();
