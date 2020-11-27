 const path = require('path');
 const ErrorResponse = require('../util/errorResponse');
 const Client = require('../models/Clients');
 const asyncHandler = require('../middleware/async');

 
 // @desc       GET all clients 
 // @route      GET /api/v1/clients
 // @access     Public 
 exports.getClients = async (req, res, next) => {
   try {
      const clients = await Client.find();

      res.status(200).json({ success: true,count: clients.length, data: clients})
   } catch (err) {
      next(err)
   }
 };

// @desc      GET a client 
// @route      GET /api/v1/clients/:id
// @access     Public 
 exports.getClient = async (req, res, next) => {
   try {
      const client = await Client.findById(req.params.id);

      if(!client) {
         return next(new ErrorResponse(`Client not found with ID of ${req.params.id}`, 404));

      }

      res.status(200).json({ success: true, data: client});
   } catch (err) {
      //res.status(400).json({ success: false });
      next(err);
   }
 };


// @desc     Create new client 
// @route    POST /api/v1/clients
// @access   Private 
 exports.createClient = async (req, res, next) => {
  try {
   const client = await Client.create(req.body);

   res.status(201).json({
      success: true,
      data: client
   });
  } catch (err) {
      next(err)
}

 };


// @desc     Update client  
// @route    PUT /api/v1/clients/:id
// @access   Private 
exports.updateClient = async (req, res, next) => {
    try {
       const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true
       });

       if(!client){ 
          //return res.status(400).json( { success: false });
          return next(new ErrorResponse(`Client not found with ID of ${req.params.id}`, 404));

       }

       res.status(200).json({ success: true, data: client});
    } catch (err) {
         next(err);
    }
 };

 // @desc     Delete client 
// @route     DELETE /api/v1/clients/:id
// @access    Private 
exports.deleteClient = async (req, res, next) => {
   try {
      const client = await Client.findByIdAndDelete(req.params.id);

      if(!client){
         return next(new ErrorResponse(`Client not found with ID of ${req.params.id}`, 404));

      }

      res.status(200).json({ success: true, data: {}});
   } catch (err) {
         next(err);
   }

 };


  // @desc    Upload file for client  
// @route     PUT /api/v1/clients/:id/file
// @access    Private 
 exports.clientUpload = asyncHandler ( async (req, res, next) => {
       const client = await Client.findById(req.params.id);

      if(!client){
         return next(
            new ErrorResponse(`Client not found with ID of ${req.params.id}`, 404)
            );
      }

      if(!req.files) {
         return next(new ErrorResponse(`Please upload a file`,400));
      }

      const file =  req.files.file;

      // // Check to see if file is a photo
      // if(!file.mimetype.content('image')) {
      //    return next(new ErrorResponse(`Please upload a file`, 400));
      // }

      //Check filesize 
      if(file.size > process.env.MAX_FILE_UPLOAD) {
         return next(
            new ErrorResponse(
               `Please upload a file less than ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
         );
   };

   //console.log(file);

         //file.mv(path.resolve(__dirname, '../public/images', filename)


      // // Create custom filename 
      file.name = `file_${client._id}`;

      file.mv(path.resolve(__dirname,'../public/uploads',file.name), async err => {
         if (err) {
            console.error(err);
            return next(
               new ErrorResponse(
                  `Problem with file upload`, 500));
         }

         await Client.findByIdAndDelete(req.params.id, { file: file.name });

         res.status(200).json({
            success: true,
            data: file.name
         });
      });
      
      //console.log(file.name);
 });
 

