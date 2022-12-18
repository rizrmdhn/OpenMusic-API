const AlbumHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'album',
    version: '1.0.0',
    register: async (server, { albumservice, songservice, validator }) => {
        const albumHandler = new AlbumHandler(albumservice, songservice, validator);
        server.route(routes(albumHandler));
    }
}