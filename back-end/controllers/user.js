const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
require("dotenv").config();
const { validationResult } = require("express-validator");


//USER SIGNUP
exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const salt = await bcrypt.genSalt(10);

  const user = await db.User.create({
    username: req.body.username,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, salt),
  })
    .then(() =>
      res.status(201).send({ message: "Utilisateur créé avec succès" })
    )
    .catch((err) => {
      res.status(400).json({ err });
    });
};

//USER LOGIN
exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  db.User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Utilisateur non trouvé." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Mot de passe invalide !",
        });
      }
      let token = jwt.sign({ id: user.id }, process.env.TOKEN, {
        expiresIn: "24h",
      });
      
      res.status(200).send({
        id: user.id,
        username: user.username,
        accessToken: token,
        imageUrl: user.image,
        isAdmin: user.isAdmin,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};


//UPDATE ou mettre des infos dans la base de données des utilisateurs
exports.changeInfo = (req, res, next) => {
  
  const userId = req.body.userId;

  if (req.file) {
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
    db.User.update({ image: imageUrl }, { where: { id: userId } });
  }
  db.User.update(
    { bio: req.body.bio, role: req.body.role },
    { where: { id: userId } }
  )
    .then((picture) => res.status(200).json({ picture }))
    .catch((err) => res.status(400).json({ err }));
};

//pour obtenir tous les utilisateurs
exports.getAllUsers = async (req, res, next) => {
  const users = await db.User.findAll({
    include: [db.Post],
  });
  res.send({ users });
};

//pour obtenir les informations d'un seul utilisateur
exports.getOneUser = async (req, res, next) => {
  db.User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((user) => res.status(200).json({ user }))
    .catch((err) => res.status(400).json({ err }));
};

//supprimer le compte et tous ses messages et commentaires de l'utilisateur totalement de la base de données
exports.deleteUser = async (req, res, next) => {
  db.User.destroy({ where: { id: req.params.id } });
  
  db.Post.destroy({
    where: {
      userId: req.params.id,
    },
  });
  db.Comment.destroy({
    where: {
      userId: req.params.id,
    },
  })
    .then(() =>
      res
        .status(200)
        .json({ message: "l'utilisateur et tout son contenue ont été supprimés avec succès" })
    )
    .catch((err) => res.status(400).json({ err }));
 
};

