const express = require('express');


const { getClient,
        getClients, 
        createClient,
        updateClient, 
        deleteClient,
        clientUpload
    } = require('../controllers/clients');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/:id/file').put(clientUpload);

router
   .route('/')
   .get(getClients)
   .post(protect, createClient);

router.route('/:id')
    .get(getClient)
    .put(protect, updateClient)
    .delete(protect, deleteClient);

module.exports = router;