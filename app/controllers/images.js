'use strict'

const mongoose = require('mongoose')

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Image = models.image
const User = models.user

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const s3Upload = require('lib/aws-upload')
console.log(s3Upload)
const multer = require('multer')
const interimMulterUpload = multer({ dest: '/tmp/' })

const index = (req, res, next) => {
  if(req.query.latitude && req.query.longitude) {
    const maxDistance = 0.01963495408493679;
    const coords = [];
    coords[0] = req.query.longitude;
    coords[1] = req.query.latitude;
    console.log('ran')
    Image.find({
      loc: {
       $near: coords,
       $maxDistance: maxDistance
     }
    })
      // can use .populate() on an array as well!
      .populate('_owner')
      //
      .then(images => res.json({
        images: images.map((e) =>
          e.toJSON({ user: req.user }))
      }))
      .catch(next)
  }
  else {
  Image.find()
    // can use .populate() on an array as well!
    .populate('_owner')
    //
    .then(images => res.json({
      images: images.map((e) =>
        e.toJSON({ user: req.user }))
    }))
    .catch(next)
  }
}

const show = (req, res) => {
  Image.findById(req.params.id)
    .populate('_owner')
    .then((image) => {
      res.json({
        image: image.toJSON({ user: req.user })
      })
    })
}

const create = (req, res, next) => {
  console.log(req.body.image.loc)
  // create file object from our multer-req object, which we will then pass
  // to s3Upload and the create function
  const file = {
    path: req.file.path,
    title: req.body.image.title,
    loc: req.body.image.loc,
    description: req.body.image.description,
    tags: req.body.image.tags,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    owner: req.user._id
  }
  // passing file to AWS
  s3Upload(file)
  // Passing AWS response to create function (which will importantly
  // include the AWS url path for our image)
    .then((s3Response) => Image.create({
      url: s3Response.Location,
      title: file.title,
      description: file.description,
      tags: file.tags,
      loc: [file.loc.longitude, file.loc.latitude],
      city: req.body.image.city,
      state: req.body.image.state,
      country: req.body.image.country,
      _owner: req.user._id
    }))
    .then(image => {
      res.status(201)
        .json({ image: image.toJSON({ user: req.user }) })
      return image
    })
    // then push the image to the user's images array
    .then(function (image) {
      User.findById(req.user._id)
        .then(function (user) {
          user.images.push(mongoose.Types.ObjectId(image._id))
        })
    })
    .catch(next)
}

const update = (req, res, next) => {
  Image.findById(req.params.id)
    .populate('_owner')
    .then(function (image) {
      return image
    })
    .then(function (image) {
      const imageOwner = image._owner._id.toString()
      const currentUser = req.user._id.toString()
      if (imageOwner === currentUser) {
        // delete req.body.image._owner (use .update instead?)
        image.title = req.body.image.title
        image.description = req.body.image.description
        image.tags = []
        const newTagsArr = req.body.image.tags.split(' ')
        newTagsArr.forEach(function (element) {
          image.tags.push(element)
        })
        return image.save()
      } else {
        res.status(400).send('User lacks ownership; unable to edit image.')
      }
    })
    .then(function (image) {
      return image
    })
    .then(() => res.sendStatus(204))
    .catch(next)
}

const addComment = (req, res, next) => {
  const newId = mongoose.Types.ObjectId()
  const newComment = [req.body.image.comments, req.user.email, newId]
  Image.findById(req.params.id)
    .populate('_owner')
    .then(function (image) {
      image.comments.push(newComment)
      return image.save()
    })
    .then(image => {
      res.status(201)
        .json({ image: image.toJSON({ user: req.user }) })
      return image
    })
    .catch(next)
}

const editComment = (req, res, next) => {
  Image.findById(req.params.id)
    .populate('_owner')
    .then(function (image) {
      return image
    })
    .then(function (image) {
      for (let i = 0; i < image.comments.length; i++) {
        const currentCommentId = image.comments[i][2].toString()
        const commentIdPassedFromClient = req.body.image.commentId.toString()
        if (currentCommentId === commentIdPassedFromClient) {
          const removeIndex = image.comments.indexOf(image.comments[i])
          image.comments.splice(removeIndex, 1)
          // build new comment
          const newId = mongoose.Types.ObjectId()
          const newComment = [req.body.image.updatedComment, req.user.email, newId]
          // push new comment
          image.comments.push(newComment)
          return image.save()
        }
      }
    })
    // need to add notice if there was no successful edit?
    .then(function (image) {
      return image
    })
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.image.remove()
    .then(() => res.sendStatus(204))
    .catch(next)
}

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
  addComment,
  editComment
}, { before: [
  { method: setUser, only: ['index', 'show'] },
  { method: authenticate, except: ['index', 'show'] },
  { method: interimMulterUpload.single('image[file]'), only: ['create'] },
  // { method: setModel(Image), only: ['show'] },
  // ***NOTE*** I don't think this is necessary anymore because we now manually
  // find the image to populate it
  // { method: setModel(Image, { forUser: true }), only: ['update', 'destroy'] }
  { method: setModel(Image, { forUser: true }), only: ['destroy'] }
] })
