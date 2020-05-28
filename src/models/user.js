const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true
    },
    age:{
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number ')
            }
        },
        default: 0
    },
    email: { 
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        },
        unique:true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }
}, {
    timestamps: true
})
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// On individual user
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.tokens
    delete userObject.password
    delete userObject.avatar
    return userObject
}
// creating new find method
userSchema.statics.findByCredentials = async(email, password) =>{
    const user = await User.findOne({email})
    if (!user) throw new Error('Unable to Login')
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Unable to Login')
    return user
}

// Hash plain text password
userSchema.pre('save',async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})
// delete user task when user is deleted
userSchema.pre('remove', async function (next){
    const user = this
    await Task.deleteMany({owner: user._id}) 
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User