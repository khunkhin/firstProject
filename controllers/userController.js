const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('../config/index');

exports.index = (req, res, next) => {
  res.status(200).json({ 
      data: [
        {id: 1, name: 'John'},
        {id: 2, name: 'Mary'}
      ]
   });
};

exports.register = async (req, res, next) => {
    try {
      const { name, email, password } = req.body; 

      //validation
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        const error = new Error('Your input is not correct');
        error.statusCode = 422;
        error.validation = errors.array();
        throw error;
      }

      // checking exist email
      const existEmail = await User.findOne({email: email});
      if(existEmail) {
          const error = new Error('This Email is already used.');
          error.statusCode = 400;
          throw error;
      }

      let user = new User();
      user.name = name;
      user.email = email;
      user.password = await user.encryptPassword(password);
    
      await user.save();
    
      res.status(201).json({ 
        message: "Register completed" 
      });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body; 

    // checking registered email
    const user = await User.findOne({email: email});
    if(!user) {
        const error = new Error('This Email is not found');
        error.statusCode = 404;
        throw error;
    }

    // checking password
    const isValid = await user.checkPassword(password);
    if (!isValid) {
      const error = new Error('Password is not correct');
      error.statusCode = 401;
      throw error;
    }

    // create token
    const token = await jwt.sign({
      id: user._id,
      role: user.role
    }, config.JWT_SECRET, { expiresIn: '5 days'})
    
    const expires_in = jwt.decode(token);

    res.status(200).json({ 
       access_token: token,
       expires_in: expires_in.exp,
       token_type: 'Bearer'
    });
  } catch (error) {
      next(error);
  }
};

exports.me = (req, res, next) => {
  const { _id, name, email, role } = req.user;
  return res.status(200).json({ 
      user: {
        id:_id,
        name: name,
        email: email,
        role: role
      }
    })
};