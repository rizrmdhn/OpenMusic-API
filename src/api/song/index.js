const SongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'song',
    version: '1.0.0',
    register: async (server, { songservice, validator }) => {
        const songHandler = new SongHandler(songservice, validator);
        server.route(routes(songHandler));
    }
}