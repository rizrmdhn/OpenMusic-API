/* eslint-disable camelcase */
const mapAlbumDbtoModel = ({
    id,
    name,
    year,
    cover,
}) => ({
    id,
    name,
    year,
    coverUrl: cover,
});

module.exports = { mapAlbumDbtoModel };