require('dotenv').config();

const Hapi = require('@hapi/hapi');
const music = require('./api/music');
const ClientError = require('./exceptions/ClientError');
const InvariantError = require('./exceptions/InvariantError');
const NotFoundError = require('./exceptions/NotFoundError');
const AlbumServices = require('./services/postgres/AlbumServices');
const SongServices = require('./services/postgres/SongServices');
const MusicValidator = require('./validator/music');

const init = async () => {
    const albumService = new AlbumServices();
    const songService = new SongServices();
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register({
        plugin: music,
        options: {
            albumService: albumService,
            songservice: songService,
            validator: MusicValidator,
        },
    });


    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();