import { Router } from 'express'
import { deleteTicket, raiseTicket, updateTicket } from '../controllers/ticket.controller.js'

const router = Router() // create a router 

router.route('/raise').post(raiseTicket)
router.route('/update-ticket/:id').patch(updateTicket)
router.route('/delete-ticket/:id').delete(deleteTicket)

export default router