import { Router } from 'express';
import { ApplianceController } from '../controllers/applianceController.js';

const router = Router();
const applianceController = new ApplianceController();

// GET /api/appliances/stats - Get appliance statistics
router.get('/stats', applianceController.getApplianceStats);

// GET /api/appliances - Get all appliances with filtering and pagination
router.get('/', applianceController.getAppliances);

// GET /api/appliances/:id - Get single appliance by ID
router.get('/:id', applianceController.getApplianceById);

// POST /api/appliances - Create new appliance
router.post('/', applianceController.createAppliance);

// PUT /api/appliances/:id - Update appliance
router.put('/:id', applianceController.updateAppliance);

// DELETE /api/appliances/:id - Delete appliance
router.delete('/:id', applianceController.deleteAppliance);

export { router as applianceRoutes };