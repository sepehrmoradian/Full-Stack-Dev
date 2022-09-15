var express = require('express');
const Place = require('../schemas/place.js');
var router = express.Router();

//create new place
router.post("/places", function(req, res, next) {
    var place = new Place(req.body);
    place.save(function(err) {
        if (err) { return next(err); }
        res.status(201).json(place);
    });
});

//get all places
router.get("/places", function(req, res, next) {
    Place.find(function(err, places){
        if (err) { return next(err); }
        res.json({"places":places});
    });
});

//get place by ID
router.get("/places/:id", function(req, res, next){
    var id = req.params.id;
    Place.findById({_id: id}, function(err, place){
        if (err) { return next(err); }
        if (place == null) {
            return res.status(404).json({"message":"Place not found"});
        }
        res.json(place);
    });
});

//delete multiple place
router.delete("/places", function(req, res, next) {
    Place.deleteMany(function(err, place){
        if (err) { return next(err); }
        res.json(place);
    });
});

//delete place by ID
router.delete("/places/:id", function(req, res, next) {
    var id = req.params.id;
    Place.findOneAndDelete(id, function (err, place) {
        if (err) { return next (err); }
        if (place == null) {
            return res.status(404).json({"message":"Place not found"});
        }
        res.json(place);
    });
});

//Update place by id
router.put("/places/:id", function(req, res, next) {
    var id = req.params.id;
    Place.findById(id, function(err, place){
        if (err) { return next(err); }
        if (place == null) {
            return res.status(404).json({"message":"Place not found"});
        }
        place.placeType = req.body.placeType;
        place.email_address = req.body.email_address;
        place.password = req.body.password;
        place.bio = req.body.bio;
        place.place_id = req.body.place_id;
        place.placeName = req.body.placeName;
        place.address = req.body.address;
        place.save();
        res.json(place);
    });

});

module.exports = router;

/*
(a) POST /camels        --
(b) GET /camels         --
(c) DELETE /camels      --
(d) GET /camels/:id     --
(e) PUT /camels/:id     --
(f) PATCH /camels/:id
(g) DELETE /camels/:id  --
*/