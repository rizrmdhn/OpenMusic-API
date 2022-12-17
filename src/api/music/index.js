const MusicHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'music',
    version: '1.0.0',
    register: async (server, { albumService, songservice, validator }) => {
        const musicHandler = new MusicHandler(albumService, songservice, validator);
        server.route(routes(musicHandler));
    }
}