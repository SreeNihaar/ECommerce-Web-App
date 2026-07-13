class AuthenticationService {

    setupToken(token){
        localStorage.setItem('token', token);
    }

    setupRoles(roles){
        localStorage.setItem('roles', JSON.stringify(roles));
    }

    logout(){
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload(false);
    }

    isUserLoggedIn(){
        const token = localStorage.getItem('token');
        if(token === null){
            return false;
        }
        return true;
    }

    getUserRoles(){
        const roles = localStorage.getItem('roles');
        if(roles.trim()===null){
            return [];
        }
        const rolesArray = JSON.parse(roles);
        return rolesArray;
    }
}

export default new AuthenticationService();