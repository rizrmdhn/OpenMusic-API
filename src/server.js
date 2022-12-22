require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const ClientError = require('./exceptions/ClientError');
const MusicValidator = require('./validator/music');

// song
const song = require('./api/song');
const SongServices = require('./services/postgres/SongServices');

// album
const album = require('./api/album');
const AlbumServices = require('./services/postgres/AlbumServices');

// playlist
const playlists = require('./api/playlists');
const PlaylistsServices = require('./services/postgres/PlaylistsServices');
const PlaylistsValidator = require('./validator/playlists');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/tokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');


const init = async () => {
    const albumService = new AlbumServices();
    const songService = new SongServices();
    const userService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const collaborationsService = new CollaborationsService();
    const playlistsService = new PlaylistsServices(collaborationsService);

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
            plugin: Jwt,
        },
    ]);

    server.auth.strategy('openmusic_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
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
        {
            plugin: users,
            options: {
                service: userService,
                validator: UsersValidator,
            },
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService: userService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            }
        },
        {
            plugin: playlists,
            options: {
                songservice: songService,
                service: playlistsService,
                validator: PlaylistsValidator,
            }
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                playlistsService,
                userService,
                validator: CollaborationsValidator,
            },
        },
    ]);



    server.ext('onPreResponse', (request, h) => {
        // mendapatkan konteks response dari request
        const { response } = request;
        if (response instanceof Error) {

            // penanganan client error secara internal.
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message,
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }
            // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
            if (!response.isServer) {
                return h.continue;
            }
            // penanganan server error sesuai kebutuhan
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            newResponse.code(500);
            return newResponse;
        }
        // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
        return h.continue;
    });

    await server.start();
    // eslint-disable-next-line no-console
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();