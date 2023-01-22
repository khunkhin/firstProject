const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name:  {type: String, required: true, trim: true },
  photo: {type: String, default: 'nopic.png'}, 
  location: {
    lat: Number,
    lgn: Number
  },

},{ 
    toJSON: {virtuals: true},
    timestamps: true,
    collection: 'shops'
});

schema.virtual('menus',{
  ref: 'Menu', //link to menu model
  localField: '_id', //_id belong to Shop model (this file)
  foreignField: 'shop'
})

const shop = mongoose.model('Shop', schema);

module.exports = shop;