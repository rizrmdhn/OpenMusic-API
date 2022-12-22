const { PlaylistNamePayloadSchema, PlaylistSongIdPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsValidator = {
    validatePlaylistNamePayload: (payload) => {
        const validationResult = PlaylistNamePayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validatePlaylistSongIdPayload: (payload) => {
        const validationResult = PlaylistSongIdPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistsValidator;