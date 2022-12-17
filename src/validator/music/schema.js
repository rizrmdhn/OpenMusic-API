const Joi = require('joi');

const AlbumSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().required(),
})



const SongSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().required(),
    genre: Joi.string().required(),
    performer: Joi.string().required(),
    duration: Joi.number(),
    albumId: Joi.string(),
})



module.exports = { AlbumSchema, SongSchema };