import { Router } from 'express'
import { addAsset, updateAssetDetails } from '../controllers/asset.controller.js'

const router = Router() // create a router 

router.route('/add').post(addAsset)
router.route('/update-details/:id').patch(updateAssetDetails)

export default router