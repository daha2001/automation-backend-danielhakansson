const faker = require('faker')
const ENDPOINT_POST_CLIENT = 'http://localhost:3000/api/client/new'
const ENDPOINT_GET_ALL_CLIENTS = 'http://localhost:3000/api/clients'
const ENDPOINT_GET_CLIENT = 'http://localhost:3000/api/client/'
const ENDPOINT_CLIENT_NR3 = 'http://localhost:3000/api/client/3'

function createClientWithFakerPayload() {
    const fakeName = faker.name.firstName()
    const fakeEmail = faker.internet.email()
    const fakePhone = faker.phone.phoneNumber()

    const payload = {
        "name": fakeName,
        "email": fakeEmail,
        "telephone": fakePhone
    }
    return payload
}

function editClientWithFakerPayload() {
    const fakeName = faker.name.firstName()
    const fakeEmail = faker.internet.email()
    const fakePhone = faker.phone.phoneNumber()

    const payload = {
        "id": 3,
        "name": fakeName,
        "email": fakeEmail,
        "telephone": fakePhone
    }
    return payload
}

function deleteLatestClient(cy) {
    
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ALL_CLIENTS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {

        let lastId = response.body[response.body.length - 1].id
        cy.request({
            method: "DELETE",
            url: ENDPOINT_GET_CLIENT + lastId,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            // assert that client is deleted
            const responseAsString = JSON.stringify(response.body)
            cy.log(responseAsString)
            expect(responseAsString).to.have.string('true')
        }))


    }))

}

function getRequestClientListWithAssertion(cy, name, email, telephone) {
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ALL_CLIENTS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(name)
        expect(responseAsString).to.have.string(email)
        expect(responseAsString).to.have.string(telephone)
    }))
}



function createClientRequest(cy) {
    cy.loginSession().then((response => {

        let clientFakerPayload = createClientWithFakerPayload()

        cy.request({
            method: "POST",
            url: ENDPOINT_POST_CLIENT,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: clientFakerPayload
        }).then((response => {
            //cy.log(JSON.stringify(response))
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(clientFakerPayload.name)
        }))
        getRequestClientListWithAssertion(cy, clientFakerPayload.name, clientFakerPayload.email, clientFakerPayload.telephone)
    }))
}


function editClientRequest(cy) {
    cy.loginSession().then((response => {

        let fakeClientPayload = editClientWithFakerPayload()

        cy.request({
            method: "GET",
            url: ENDPOINT_GET_ALL_CLIENTS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            cy.request({
                method: "PUT",
                url: ENDPOINT_CLIENT_NR3,
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
                body: fakeClientPayload
            }).then((response => {
                const responseAsString = JSON.stringify(response)
                expect(responseAsString).to.have.string(fakeClientPayload.name)
            }))
        }))
    }))

}

module.exports = {
            createClientWithFakerPayload,
            createClientRequest,
            editClientRequest,
            deleteLatestClient
        }
