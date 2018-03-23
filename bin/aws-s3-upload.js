'use strict'

require('dotenv').config()

const fs = require('fs')
const crypto = require('crypto')
const path = require('path')

const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const mime = require('mime-types')

const file = {
  path: process.argv[2]
  // stream: created from createReadStream
  // ext: pulled from file name with path.extname
  // mimeType: created from mime.lookup
}

file.stream = fs.createReadStream(file.path)
file.ext = path.extname(file.path)
file.mimeType = mime.lookup(file.path)

const promiseRandomBytes = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        reject(err)
      }
      resolve(buf.toString('hex'))
    })
  })
}

const promiseS3Upload = (params) => {
  return new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

promiseRandomBytes()
  .then((randomString) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: randomString + file.ext,
      Body: file.stream,
      // granting access
      ACL: 'public-read',
      // so the browser knows what the data type is
      ContentType: file.mimeType
    }
  })
  .then(promiseS3Upload)
  .then((prev) => {
    console.log('prev is ', prev)
    return prev
  })
  .catch(console.error)
