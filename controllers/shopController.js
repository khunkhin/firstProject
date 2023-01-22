const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid');
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)

const config = require('../config/index')

const Shop = require("../models/shop");
const Menu = require("../models/menu");

exports.index = async (req, res, next) => {
  const shop = await Shop.find()
    .select("name photo location")
    .sort({ _id: -1 });

  const shopWithPhotoDomain = await shop.map((shop, index) => {
    return {
      id: shop._id,
      name: shop.name,
      photo: config.DOMAIN + "/images/" + shop.photo,
      location: shop.location,
    };
  });

  res.status(200).json({
    data: shopWithPhotoDomain,
  });
};

//get Menu
exports.menu = async (req, res, next) => {
  //const menu = await Menu.find().select('+name -price');
  //const menu = await Menu.find().where('price').gt(100);
  //const menu = await Menu.find({price: {$gt: 100}});
  //const menu = await Menu.find()
  const menu = await Menu.find()
    .populate("shop", "name location -_id")
    .sort("-_id");

  res.status(200).json({
    data: menu,
  });
};

//get shop by id with Menu
exports.getShopWithMenu = async (req, res, next) => {
  const { id } = req.params;
  const shopWithMenu = await Shop.findById(id).populate("menus");
  res.status(200).json({
    data: shopWithMenu,
  });
};


//insert shop
exports.insert = async (req, res, next) => {
  const { name, location, photo } = req.body;

  let shop = new Shop({
    name: name,
    location: location,
    photo: await saveImageToDisk(photo)
  });
  await shop.save();

  res.status(201).json({
    massage: "data is added",
  });
};

async function saveImageToDisk(baseImage) {
  //find project path
  const projectPath = path.resolve('./') ;
  //upload to path folder
  const uploadPath = `${projectPath}/public/images/`;

  //find file type
  const ext = baseImage.substring(baseImage.indexOf("/")+1, baseImage.indexOf(";base64"));

  //random file name and file type
  let filename = '';
  if (ext === 'svg+xml') {
      filename = `${uuidv4.v4()}.svg`;
  } else {
      filename = `${uuidv4.v4()}.${ext}`;
  }

  //extract base64 data
  let image = decodeBase64Image(baseImage);

  //write file to path
  await writeFileAsync(uploadPath+filename, image.data, 'base64');
  //return new file name
  return filename;
}

function decodeBase64Image(base64Str) {
  let matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let image = {};
  if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
  }

  image.type = matches[1];
  image.data = matches[2];

  return image;
}