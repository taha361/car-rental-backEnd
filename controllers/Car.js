const Car = require('../models/Car');

exports.addCar = (req, res, next) => {
         if(!req.user.admin)
        { 
            const err = new Error('you are not authorized to Add');
            err.statusCode=403;
            throw err;
        }
    console.log(req.body);
    const car = req.body;
    const newCar = new Car(car)
    newCar.save().then(result => {
        res.status(200).json({
            message : 'car Added successfully',carId : result._id
        })
    }).catch(err => {
        err.statusCode = 403;
        throw err
        
    })

}
exports.getCars = async (req,res,next) => {
    const currentPage = req.params.page || 1;
    const perPage = 6;
    let total;
    try{
    const totalItems = await Car.find().countDocuments()
    total = totalItems
    const cars = await Car.find()
        .skip((currentPage -1)*perPage)
        .limit(perPage)
        res.status(200).json({
            cars : cars,
            totalItems : total
        })
    } catch (err) {
        if(!err.statusCode)
        {
            err.statusCode = 500;
        }
        next(err);
    };
}

exports.deleteCar = (req, res, next) => {
    carId = req.params.carId;
    Car.findById(carId).then(car => {
        if(!car){
            const err = new Error('Car not found');
            err.statusCode = 404;
            throw err;
        }
        // if(!req.user.admin)
        // { 
        //     const err = new Error('you are not authorized to delete');
        //     err.statusCode=403;
        //     throw err;
        // }
        return Car.findByIdAndRemove(carId)
    }).then(result => {
        res.status(200).json({message: 'delete car successfully'});
    })
    .catch(err => {
        err.statusCode = 500;
        throw err;
    })
};