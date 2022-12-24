class AlbumHandler {
    constructor(albumservice, songservice, validator) {
        this._albumService = albumservice;
        this._songservice = songservice
        this._validator = validator;

        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);

    }

    async postAlbumHandler(request, h) {
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
    }

    async getAlbumByIdHandler(request) {
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
    }

    async putAlbumByIdHandler(request) {
        this._validator.validateAlbumPayload(request.payload);
        const { name, year } = request.payload;
        const { id } = request.params;

        await this._albumService.editAlbumById(id, { name, year });

        return {
            status: 'success',
            message: 'Album berhasil diperbarui',
        }

    }

    async deleteAlbumByIdHandler(request) {
        const { id } = request.params;
        await this._albumService.deleteAlbumById(id);
        return {
            status: 'success',
            message: 'Album berhasil dihapus'
        }
    }

}

module.exports = AlbumHandler;