const faker = require('faker')
const ENDPOINT_NEW_RESERVATION = 'http://localhost:3000/api/reservation/new'
const ENDPOINT_RESERVATIONS =    'http://localhost:3000/api/reservations'
const ENDPOINT_RESERVATION_NR2 = 'http://localhost:3000/api/reservation/2'

function createNewReservationWithFaker(){
    const startDate = faker.date.past()
    const endDate = faker.date.future()

    const newReservation = {

        "client": 3,
        "room": 1,
        "bill": 1,
        "start": startDate,
        "end": endDate
    }
    return newReservation
}

function editReservationWithFaker(){
    const startDate = faker.date.past()
    const endDate = faker.date.future()

    const newReservation = {

        "client": 3,
        "room": 2,
        "bill": 1,
        "start": startDate,
        "end": endDate
    }
    return newReservation
}

function getRequestReservationWithAssertion(cy, client, bill, room, startDate, endDate) {
    cy.request({
        method: "GET",
        url: ENDPOINT_RESERVATIONS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        const responseAsString = JSON.stringify(response.body[1])
        expect(responseAsString).to.have.string(client)
        expect(responseAsString).to.have.string(bill)
        expect(responseAsString).to.have.string(room)
       // expect(responseAsString).to.have.string(startDate)
       // expect(responseAsString).to.have.string(endDate)
    }))
}

function createNewReservationRequest(cy) {
    cy.loginSession().then((response => {

        let reservationFaker = createNewReservationWithFaker()

        cy.request({
            method: "POST",
            url: ENDPOINT_NEW_RESERVATION,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:reservationFaker
        }).then((response => {
            
             const responseAsString = JSON.stringify(response.body)
             cy.log(responseAsString)
             expect(responseAsString).to.have.string(reservationFaker.client)
            }))
        getRequestReservationWithAssertion(cy, reservationFaker.client, 
        reservationFaker.bill, reservationFaker.room)
    }))
}

function editReservationRequest(cy) {
    cy.loginSession().then((response => {

        let reservationFaker = editReservationWithFaker()

        cy.request({
            method: "GET",
            url: ENDPOINT_RESERVATIONS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            cy.request({
                method: "PUT",
                url: ENDPOINT_RESERVATION_NR2,
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
                body:reservationFaker
            }).then((response =>{
                const responseAsString = JSON.stringify(response)
                cy.log(responseAsString)
                expect(responseAsString).to.have.string(reservationFaker.client)
            }))
        }))
    }))

}




module.exports = {
    createNewReservationWithFaker,
    createNewReservationRequest,
    editReservationRequest
}