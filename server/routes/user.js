const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    console.log("user");
    res.render("user/home");
})

module.exports = router;