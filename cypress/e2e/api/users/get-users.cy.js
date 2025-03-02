import usersAPI from "../../../support/api/usersAPI"
import authenticationAPI from "../../../support/api/authenticationAPI"


describe ("API Testing - GET /users", ()=>{
    
        it("API_GET_001_Verify successful retrieval of users list", ()=>{
            cy.request("GET", usersAPI.getUsers(2)).then((response)=>{
                // Verify response status is 200
                expect(response.status).to.eq(200)

                //Verify response body contains expected keys
                expect(response.body).to.have.property("page",2)

                // Verify response body data is an array
                expect(response.body.data).to.be.an("Array")
        })
    })

        it("API_GET_002_Verify pagination works correctly", () => {
        const pageNumber = 2;
            cy.request("GET", usersAPI.getUsers(pageNumber)).then((response) => { 
                expect(response.status).to.eq(200)
                expect(response.body.page).to.eq(pageNumber)
                expect(response.body.data).to.have.length(6)
        })
    })

        it ("API_GET_003_Verify response contains required fields", ()=>{
            cy.request("GET",usersAPI.getUsers(2)).then((response)=>{
                response.body.data.forEach((user)=>{
                    expect(user).to.have.property("id").that.is.a("number")
                    expect(user).to.have.property("email").that.is.a("string")
                    expect(user).to.have.property("first_name").that.is.a("string")
                    expect(user).to.have.property("last_name").that.is.a("string")
                    expect(user).to.have.property("avatar").that.is.a("string")


                })
            
            })
        })

        it ("API_GET_004_Verify response for non-existing user", () => {
            cy.request({
                method: "GET", 
                url: usersAPI.getUsersByID(23),
                failOnStatusCode: false,
            }).then((response)=>{
                expect(response.status).to.eq(404)
            })
        })
    
})

describe("API Testing - GET /usersid",()=>{
    it ("API_GET_005_Verify successful retrieval of a single user",()=>{
        cy.request("GET",usersAPI.getUsersByID(2)).then((response)=>{
            expect(response.status).to.eq(200)
            expect(response.body.data).to.have.property("id",2)
        })
    })

    it ("API_GET_006_Verify response for a non-existing user",()=>{
        cy.request({
            method: "GET",
            url: usersAPI.getUsersByID(999),
            failOnStatusCode: false,
        }).then((response)=>{
            expect(response.status).to.eq(404)
        })
    })
})

describe ("API Testing - POST /users",()=>{
    it ("API_POST_001_Verify successful user creation",()=>{
        cy.request({
            method: "POST",
            url: usersAPI.createUser(),
            body: {
                name: "morpheus",
                job: "leader"
            }
        }).then((response)=>{
            expect(response.status).to.eq(201)
            expect(response.body).to.have.property("name","morpheus")
            expect(response.body).to.have.property("job","leader")
            expect(response.body).to.have.property("id").that.is.a("string") // In this API, they design id is a string
            expect(response.body).to.have.property("createdAt").that.is.a("string")
    })
})

})

describe ("API Testing - PUT /users",()=>{
    it ("API_PUT_001_Verify successful user update",()=>{
        cy.request({
            method: "PUT",
            url: usersAPI.updateUser(2),
            body: {
                name: "morpheus",
                job: "zion resident"
            }
        }).then((response)=>{
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property("name","morpheus")
            expect(response.body).to.have.property("job", "zion resident")
            expect(response.body).to.have.property("updatedAt").and.that.is.a("string")
        })
    })

})



describe("API Testing - PATCH /users/{id}",()=>{
    it ("API_PATCH_001_Verify partial update of a user", ()=> {
        cy.request({
            method: "PATCH",
            url: usersAPI.getUsersByID(2),
            body: {
                name: "Updated Name"
            }
        }).then((response)=>{
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property("updatedAt")
    })
    })
})


describe ("API Testing - DELETE /users/{id}",()=>{
    it ("API_DELETE_001_Verify successful user deletion",()=>{
        cy.request({
            method: "DELETE",
            url: usersAPI.getUsersByID(2),
        }).then((response)=>{
            expect(response.status).to.eq(204)
        })
    })

    it ("API_DELETE_002_Verify response for deleting a non-existing user",()=>{
        cy.request({
            method: "DELETE",
            url: usersAPI.getUsersByID(999),
            //failONStatusCode: false, // This is prevent test from failing with code different 2xx
        }).then((response)=>{
            expect(response.status).is.eq(204)
        })
    })
})

describe ("API Testing - POST /users",()=>{
    it ("API_LOGIN_001_Verify successful login", () =>{
        cy.request({
            method: "POST",
            url: authenticationAPI.loginUser(),
            // url: "https://reqres.in/api/login",
            body: {
                email: "eve.holt@reqres.in",
                password: "cityslicka"
            }
        }).then((response)=>{
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property("token").and.to.be.a("string")

            // Store token for future request
            cy.wrap(response.body.token).as("authToken");
    })
})

    it("API_LOGIN_002_Verify login with missing password",()=>{
        cy.request({
            method: "POST",
            url: authenticationAPI.loginUser(),
            body: {
                email: "peter@klaven",
                // password: "123344455"
            },
            failOnStatusCode: false
        }).then((response)=>{
            expect(response.status).to.eq(400)
            expect(response.body).to.have.property("error","Missing password")
        })
    })
})

describe ("API Testing - POST /register",()=>{
    it ("API_REGISTER_001_Verify successful registration",()=>{
        cy.request({
            method: "POST",
            url: authenticationAPI.registerUser(),
            body: {
                email: "eve.holt@reqres.in",
                password: "pistol"
            }
        }).then((response)=>{
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('id').and.to.be.a("number")
            expect(response.body).to.have.property('token').and.to.be.a("string")
        })
    })
    it ("API_REGISTER_002_Verify registration with missing password",()=> {
        cy.request({
            method: "POST",
            url: authenticationAPI.registerUser(),
            body:{
                email: "sydney@fife"
            },
            failOnStatusCode: false
        }).then((response)=>{
            expect(response.status).to.eq(400)
            expect(response.body).to.have.property("error", "Missing password")
        })
    })
})