import { Router } from 'express'
import { raiseTicket } from '../controllers/ticket.controller.js'

const router = Router() // create a router 

router.route('/raise').post(raiseTicket)

export default router