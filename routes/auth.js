const express = require('express');
const { register, 
        login,
        getMe,
        forgotPassword, 
        resetPassword,
        updateDetails,
        updatePassword} = require('../controllers/auth');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize("sub_admin", "admin"));


router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.route("/resetpassword/:resettoken").put(resetPassword)
router.route("/updatedetails").put(protect, updateDetails);
router.route("/updatepassword").put(protect, updatePassword);

module.exports = router;