var express = require('express');
var router = express.Router();

let files = require("../tempDB");

router.get("/list", async (req,res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    try{
        res.status(200).json({
            data:files
        });
    } catch (err){
        res.status(400).json({
            message: "An error has occured",
            err
        });
    }
});

router.get("/list/:id", async (req,res) => {
    let { id } = req.params;
    id = Number(id);
    try{
        let file = files.find(file => file._id === id);
        res.status(200).json({
            data:file
        });
    } catch (err){
        res.status(400).json({
            message: "An error has occured",
            err
        });
    }
  });

module.exports = router;