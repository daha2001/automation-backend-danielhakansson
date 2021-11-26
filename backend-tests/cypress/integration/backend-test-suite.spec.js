/// <reference types="cypress" />

import * as clientHelp from '../helpers/clientHelp'
import * as reservationHelp from '../helpers/reservationHelp'

describe ('backend test suite - hotel application', function(){

    it('Create a new client', function(){
        clientHelp.createClientRequest(cy)
    })

    it('Edit the third client', function(){
        clientHelp.editClientRequest(cy)
    })
    
    it('Create reservation', function(){
        reservationHelp.createNewReservationRequest(cy)
    })
    
    it('Edit the second reservation', function(){
        reservationHelp.editReservationRequest(cy)
    })
    
    it('Delete the last client', function(){
        clientHelp.deleteLatestClient(cy)
    })



})
