const express = require("express");;

const router = express.Router({ mergeParams: true });

router.get("/about_us", (req, res) => {
    res.render("about_us");
});

router.get("/contact_us", (req, res) => {
    res.render("contact_us");
});

router.use("/admin", require("./admin"));
router.use("/", require("./user"));
router.get("*", (req, res) => res.status(404).render("page_not_found"));

module.exports = router;
