const Staff = require('../models/staff');

exports.index = async (req, res, next) => {

    const staff = await Staff.find().sort({_id: -1});

    res.status(200).json({ 
        data: staff
     });
  };

  exports.show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const staff = await Staff.findById(id);

        if(!staff){
            throw new Error("Can not find")
        }

        res.status(200).json({
            data: staff
        })
    } catch (error) {
        res.status(400).json({
            error: {
                message: "The data doesn't match" + error.message
            }
        })
    }
    
  };

  exports.insert = async (req, res, next) => {

    const {name, salary} = req.body

    let staff = new Staff({
        name: name,
        salary: salary
    })
    await staff.save();

    res.status(201).json({ 
        massage: "data is added"
     });
  };

  exports.destroy = async (req, res, next) => {
    try {
        const { id } = req.params;

        const staff = await Staff.deleteOne({_id: id});
        if(staff.deletedCount === 0){
            throw new Error("Can not find ID");
        }

        res.status(200).json({
            message: 'Data is deleted'
        });
    } catch (error) {
        res.status(400).json({
            error: {
                message: "There is an error" + error.message
            }
        })
    }
    
  };