const ErrorResponse = require('../util/errorResponse');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const { use } = require('../routes/auth');

// @desc        Register User
// @route      Post /api/v1/auth/register
// @access     Public 
exports.register =  asyncHandler (async (req, res, next) => {
    const { name, email, password, role } = req.body;
      
        // Create user
        const user = await User.create({
          name,
          email,
          password,
          role
        });

        sendTokenResponse(user, 200, res);

});

// @desc       Login User
// @route      Post /api/v1/auth/login
// @access     Public 
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
      
         // Validate email and passwprd 
         if(!email || !password) {
             return next(new ErrorResponse('Please provide an email and password', 400));
         }

         // Check for user
         const user = await User.findOne({ email }).select('+password');

         if(!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
         }

         // Check if password matches 
         const isMatch = await user.matchPassword(password);

         if(!isMatch) {
             return next(new ErrorResponse('Invalid credentials', 401));
         }

       sendTokenResponse(user, 200, res);
};



// @desc       Get current logged in user
// @route      POST /api/v1/auth/me
// @access     Private
exports.getMe = (request, response, next) => {
    User.findOne(request.user)
      .then(user => {
        response.status(200).json({
          success: true,
          data: user
        });
        next();
      })
      .catch(error => {
        next(error);
      });
  };


// @desc       Forgot password
// @route      POST /api/v1/auth/forgotpassword
// @access     Public
exports.forgotPassword = asyncHandler ( async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if(!user) {
        return next(new ErrorResponse(' There is no user with that email ', 404));
    }

    // Get reset token 
    const resetToken = user.getRestPasswordToken();

    //console.log(resetToken);

    await user.save({ })

    res.status(200).json({
        success: true,
        data: user
    });
  });


  // Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expiresIn: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if(process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
         success: true, 
         token});
};

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Private
exports.resetPassword = (request, response, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(request.params.resettoken)
    .digest("hex");

  User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })
    .then(user => {
      // set new password
      user.password = request.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      user
        .save()
        .then(() => {
          sendTokenResponse(user, 200, response);
          next();
        })
        .catch(error => {
          next(error);
        });
    })
    .catch(error => {
      next(new ErrorResponse("Invalid token", 400));
    });
};

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = (request, response, next) => {
  const fields = {
    name: request.body.name,
    email: request.body.email
  };
  User.findByIdAndUpdate(request.user.id, fields, {
    new: true,
    runValidators: true
  })
    .then(user => {
      response.status(200).json({
        success: true,
        data: user
      });
      next();
    })
    .catch(error => {
      next(error);
    });
};

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = (request, response, next) => {
  User.findById(request.user.id)
    .select("+password")
    .then(user => {
      user
        .matchPassword(request.body.currentPassword)
        .then(() => {
          user.password = request.body.newPassword;
          user
            .save()
            .then(() => {
              sendTokenResponse(user, 200, response);
              next();
            })
            .catch(error => {
              throw error;
            });
        })
        .catch(error => {
          throw error;
        });
    })
    .catch(error => {
      next(error);
    });
};
