/* eslint-disable no-underscore-dangle */
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
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

// activities
const activities = require('./api/activities');
const ActivitiesService = require('./services/postgres/ActivitiesServices');


// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// Exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

// album likes
const albumLikes = require('./api/albumLikes');
const AlbumLikesService = require('./services/postgres/AlbumLikesService');

// Redis cache
const CacheService = require('./services/redis/CacheService');


const init = async () => {
    const cacheService = new CacheService();
    const albumService = new AlbumServices();
    const songService = new SongServices();
    const userService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const collaborationsService = new CollaborationsService();
    const playlistsService = new PlaylistsServices(collaborationsService);
    const activitiesService = new ActivitiesService();
    const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/album-cover'));
    const albumLikesService = new AlbumLikesService(cacheService);

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
        {
            plugin: Inert,
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
                activitiesService,
                songservice: songService,
                service: playlistsService,
                validator: PlaylistsValidator,
            }
        },
        {
            plugin: activities,
            options: {
                playlistsService,
                activitiesService,
            },
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
        {
            plugin: _exports,
            options: {
                playlistsService,
                service: ProducerService,
                validator: ExportsValidator,
            },
        },
        {
            plugin: uploads,
            options: {
                albumService,
                service: storageService,
                validator: UploadsValidator,
            },
        },
        {
            plugin: albumLikes,
            options: {
                service: albumLikesService,
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