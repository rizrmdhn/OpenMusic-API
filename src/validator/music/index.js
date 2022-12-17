const InvariantError = require("../../exceptions/InvariantError");
const { AlbumSchema, SongSchema } = require("./schema")


const MusicValidator = {
    validateSongPayload: (payload) => {
        const validationResult = SongSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateAlbumPayload: (payload) => {
        const validationResult = AlbumSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
}

module.exports = MusicValidator;