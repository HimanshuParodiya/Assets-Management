import { Router } from 'express'
import { raiseTicket, updateTicket } from '../controllers/ticket.controller.js'

const router = Router() // create a router 

router.route('/raise').post(raiseTicket)
router.route('/update-ticket/:id').patch(updateTicket)

export default router