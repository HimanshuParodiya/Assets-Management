import { Router } from 'express'
import { addAsset, deleteAsset, getAllAssets, getAssetDetails, updateAssetDetails } from '../controllers/asset.controller.js'

const router = Router() // create a router 

router.route('/add').post(addAsset)
router.route('/all-assets').get(getAllAssets)
router.route('/asset-details/:id').get(getAssetDetails)
router.route('/update-details/:id').patch(updateAssetDetails)
router.route('/delete-asset/:id').delete(deleteAsset)

export default router