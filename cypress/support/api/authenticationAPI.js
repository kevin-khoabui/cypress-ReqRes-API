class AuthenticationAPI {
    constructor (){
        this.baseUrl = "https://reqres.in/api"
    }

    registerUser(){
        return `${this.baseUrl}/register`;
    }

    loginUser(){
        return `${this.baseUrl}/login`;
    }

}

export default new AuthenticationAPI();