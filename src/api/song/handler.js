/* eslint-disable no-underscore-dangle */


class SongHandler {
    constructor(songservice, validator) {
        this._songservice = songservice;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongHandler = this.getSongHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);

    }

    async postSongHandler(request, h) {
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
    }

    async getSongHandler(request) {
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
    }

    async getSongByIdHandler(request) {
        const { id } = request.params;
        const song = await this._songservice.getSongById(id);
        return {
            status: 'success',
            data: {
                song,
            },
        };
    }

    async putSongByIdHandler(request) {
        this._validator.validateSongPayload(request.payload);
        const { title, year, genre, performer, duration, albumId } = request.payload;
        const { id } = request.params;

        await this._songservice.editSongById(id, { title, year, genre, performer, duration, albumId });

        return {
            status: 'success',
            message: 'Album berhasil diperbarui',
        }
    }

    async deleteSongByIdHandler(request) {
        const { id } = request.params;
        await this._songservice.deleteSongById(id);
        return {
            status: 'success',
            message: 'Album berhasil dihapus'
        }
    }

}

module.exports = SongHandler;