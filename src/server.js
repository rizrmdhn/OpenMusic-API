require('dotenv').config();

const Hapi = require('@hapi/hapi');
const album = require('./api/album');
const song = require('./api/song');
const ClientError = require('./exceptions/ClientError');
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


    await server.register([
        {
            plugin: album,
            options: {
                albumservice: albumService,
                songservice: songService,
                validator: MusicValidator,
            },
        },
        {
            plugin: song,
            options: {
                songservice: songService,
                validator: MusicValidator,
            },
        },
    ]);

    server.ext('onPreResponse', (request, h) => {
        // mendapatkan konteks response dari request
        const { response } = request;


        if (response instanceof ClientError) {
            // membuat response baru dari response toolkit sesuai kebutuhan error handling
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }


        // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
        return response.continue || response;
    });

    await server.start();
    // eslint-disable-next-line no-console
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();