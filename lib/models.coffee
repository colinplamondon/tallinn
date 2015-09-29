mongoose = require 'mongoose'
timestamps = require 'mongoose-timestamp'

{ Schema } = mongoose

userSchema = new Schema {
  facebookId: String
  tinderFbookToken: String
  tinderFbookTokenCreatedAt: Date
  tinderToken: String
  email: String
}
userSchema.plugin timestamps

module.exports = {
  User: mongoose.model 'User', userSchema
}

