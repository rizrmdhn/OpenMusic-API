/* eslint-disable no-underscore-dangle */
const ClientError = require("../../exceptions/ClientError");


class MusicHandler {
    constructor(albumservice, songservice, validator) {
        this._albumService = albumservice;
        this._songservice = songservice;
        this._validator = validator;

        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongHandler = this.getSongHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);

    }

    async postAlbumHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload);
            const { name = 'unnamed', year } = request.payload;

            const albumId = await this._albumService.addAlbum({ name, year });

            const response = h.response({
                status: 'success',
                message: 'Album berhasil ditambahkan',
                data: {
                    albumId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            return response;
        }
    }

    async getAlbumByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const albumId = id;

            const album = await this._albumService.getAlbumById(id);
            const songs = await this._songservice.getSongByAlbumId(albumId);


            if (songs.length !== 0) {
                return {
                    status: 'success',
                    data: {
                        album: {
                            ...album,
                            songs
                        }
                    },
                };
            }
            return {
                status: 'success',
                data: {
                    album,
                },
            };


        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            return response;
        }
    }

    async putAlbumByIdHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload);
            const { name, year } = request.payload;
            const { id } = request.params;

            await this._albumService.editAlbumById(id, { name, year });

            return {
                status: 'success',
                message: 'Album berhasil diperbarui',
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            return response;
        }

    }

    async deleteAlbumByIdHandler(request, h) {
        try {
            const { id } = request.params;
            await this._albumService.deleteAlbumById(id);
            return {
                status: 'success',
                message: 'Album berhasil dihapus'
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            return response;
        }
    }

    async postSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const { title, year, genre, performer, duration, albumId } = request.payload;

            const songId = await this._songservice.addSong({ title, year, genre, performer, duration, albumId });

            const response = h.response({
                status: 'success',
                message: 'Album berhasil ditambahkan',
                data: {
                    songId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            return response;
        }
    }

    async getSongHandler(request, h) {
        try {
            const { title, performer } = request.query;
            let songs = await this._songservice.getSong();

            if (title !== undefined) {
                songs = songs.filter((song) => song.title.toLowerCase().includes(title.toLowerCase()));
            }

            if (performer !== undefined) {
                songs = songs.filter((song) => song.performer.toLowerCase().includes(performer.toLowerCase()));
            }

            return {
                status: 'success',
                data: {
                    songs,
                },
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            return response;
        }
    }

    async getSongByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const song = await this._songservice.getSongById(id);
            return {
                status: 'success',
                data: {
                    song,
                },
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            return response;
        }
    }

    async putSongByIdHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const { title, year, genre, performer, duration, albumId } = request.payload;
            const { id } = request.params;

            await this._songservice.editSongById(id, { title, year, genre, performer, duration, albumId });

            return {
                status: 'success',
                message: 'Album berhasil diperbarui',
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: error.message,
            });
            response.code(500);
            return response;
        }
    }

    async deleteSongByIdHandler(request, h) {
        try {
            const { id } = request.params;
            await this._songservice.deleteSongById(id);
            return {
                status: 'success',
                message: 'Album berhasil dihapus'
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            return response;
        }
    }

}

module.exports = MusicHandler;