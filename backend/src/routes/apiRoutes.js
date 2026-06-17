const { Router } = require('express')
const { requireAuth } = require('../middleware/authMiddleware')
const appointmentController  = require('../controllers/appointmentController')
const professionalController = require('../controllers/professionalController')
const serviceController      = require('../controllers/serviceController')
const slotController         = require('../controllers/slotController')

const router = Router()

router.use(requireAuth)

router.get('/appointments/next',   appointmentController.getNext)
router.get('/appointments/my',     appointmentController.getMy)
router.post('/appointments',       appointmentController.create)
router.patch('/appointments/:id/cancel', appointmentController.cancel)

router.get('/professionals',       professionalController.list)

router.get('/services',            serviceController.list)
router.get('/slots',               slotController.get)

module.exports = router
