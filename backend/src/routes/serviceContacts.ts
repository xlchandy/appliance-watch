import { Router } from 'express';

const router = Router();

// Placeholder routes for service contacts
// These can be implemented later following the same pattern as appliances

// GET /api/service-contacts
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Service contacts endpoint - to be implemented'
  });
});

// GET /api/service-contacts/:id
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    data: null,
    message: 'Service contact by ID endpoint - to be implemented'
  });
});

// POST /api/service-contacts
router.post('/', (req, res) => {
  res.status(501).json({
    success: false,
    error: 'Service contact creation endpoint - to be implemented'
  });
});

// PUT /api/service-contacts/:id
router.put('/:id', (req, res) => {
  res.status(501).json({
    success: false,
    error: 'Service contact update endpoint - to be implemented'
  });
});

// DELETE /api/service-contacts/:id
router.delete('/:id', (req, res) => {
  res.status(501).json({
    success: false,
    error: 'Service contact deletion endpoint - to be implemented'
  });
});

export { router as serviceContactRoutes };