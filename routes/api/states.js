const express = require('express');
const router = express.Router();
const statessController = require('../../controllers/statesController');

router.route('/')
    .get(statessController.getAllEmployees)
    .post(statessController.createNewEmployee)
    .put(statessController.updateEmployee)
    .delete(statessController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;


//routes
router.route('/')
    .get(statesController.getAllStates)

router.route('/:state')
        .get(statesController.getState);
    
router.route('/:state/funfact')
        .get(statesController.getFunFact)
        .post(statesController.createFunFact)
        .patch(statesController.updateFunFact)
        .delete(statesController.deleteFunFact); 

router.route('/:state/capital')
        .get(statesController.getCapital);

router.route('/:state/nickname')
        .get(statesController.getNickname);

router.route('/:state/population')
        .get(statesController.getPopulation);

router.route('/:state/admission')
        .get(statesController.getAdmission);


module.exports = router;