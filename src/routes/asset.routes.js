import { Router } from 'express'
import { addAsset } from '../controllers/asset.controller.js'

const router = Router() // create a router 

router.route('/add').post(addAsset)

export default router