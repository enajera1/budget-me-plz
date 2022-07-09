const router = require("express").Router();
const { User, Bills, Accounts, Debt, Cards } = require("../models");
// const user = require("../models/User");
const withAuth = require("../utils/auth");

router.get("/", async(req, res) => {
    console.log(req.session.user_id);

    try {
        if (!req.session.logged_in) {
            res.redirect("/login");
        } else {
            let logged_in = req.session.logged_in;
            // const data = await User.findOne({ where: { id: req.session.user_id },
            console.log("SESSION", req.session);
            const user = await User.findByPk(req.session.user_id, {
                include: [{ model: Bills }],
            });
            console.log("USER", user);
            const userData = await user.get({ plain: true });

            // res.status(200).json(userData)
            // console.log("USER DATA --- ", userData)
            // res.status(200).json(serializedData)
            res.render("user", { data: userData, logged_in });
        }
    } catch (err) {
        for (let key in Bills.rawAttributes) {
            console.log("field", key);
        }
        console.log("Error", err);
        res.status(500).json(err);
    }
});

router.get("/login", (req, res) => {
    console.log(req.session.logged_in, req.session.user_id);
    if (req.session.logged_in) {
        res.redirect("/");
        return;
    }

    res.render("login");
});

//7.2.22 after logging in
router.get('/dashboard', withAuth, (req, res) => {
    console.log(req.session);
    console.log('--------------');
    User.findAll({
        where: {
            user_id: req.session.user_id
        },
        include: [
            {
                model: Accounts,
                attributes: ['name', 'amount', 'user_id' ]
            }
        ]
    })
    .then(dbUserData => {
        const userData = dbUserData.map(post => post.get({ plain: true }));
        res.render('dashboard', { userData, loggedIn: true });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get("/signup", (req, res) => {
    if (req.session.logged_in) {
        res.redirect("/user");
        return;
    }
    res.render("signup");
});

router.get("/user", withAuth, (req, res) => {
    res.render("user");
});

router.get("/request-new-password", (req, res) => {
    res.render("requestreset");
});

router.get(`/password-reset?:id`, (req, res) => {
    res.render("passwordreset");
});

module.exports = router;