const Joi = require('joi');

const PlaylistNamePayloadSchema = Joi.object({
    name: Joi.string().required(),
});

const PlaylistSongIdPayloadSchema = Joi.object({
    songId: Joi.string().required(),
});


module.exports = { PlaylistNamePayloadSchema, PlaylistSongIdPayloadSchema };