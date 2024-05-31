import { Router } from 'express'
import { deleteTicket, getAllTickets, raiseTicket, updateTicket } from '../controllers/ticket.controller.js'

const router = Router() // create a router 

router.route('/raise').post(raiseTicket)
router.route('/all-tickets').get(getAllTickets)
router.route('/update-ticket/:id').patch(updateTicket)
router.route('/delete-ticket/:id').delete(deleteTicket)

export default router