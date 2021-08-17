const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    console.log("admin");
    res.render("admin/home");
})

module.exports = router;