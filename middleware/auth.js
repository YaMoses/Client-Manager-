const { request } = require('express');
const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../util/errorResponse');
const User = require('../models/User');
const sendEmail = require("../util/sendEmail");


//Protect routes 
exports.protect = asyncHandler(async (req, res, next) => {
  let token; 

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  else if(req.cookies.token) {
    token = req.cookies.token
  }
  //console.log(`token:${token}`);
  // Check if token exists 
  // if(!token) {
  //   return next(new ErrorResponse('Not authorized to access this route', 401));
  // }

  jwt.verify(token, 'sjjsk73838f8h8d8d8d8', function(err, decoded) {
    if(err){
        console.log(err)
    }else{
        //console.log(decoded)
        req.user =  User.findById(decoded.id)

        next()
    }
   });

});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
