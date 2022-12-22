/* eslint-disable no-underscore-dangle */


class PlaylistsHandler {
    constructor(service, songservice, validator) {
        this._service = service;
        this._songservice = songservice
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
        this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
        this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
        this.getSongInPlaylist = this.getSongInPlaylist.bind(this);
        this.deleteSongFromPlaylist = this.deleteSongFromPlaylist.bind(this);

    }

    async postPlaylistHandler(request, h) {

        this._validator.validatePlaylistNamePayload(request.payload);
        const { name } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;
    }

    async getPlaylistHandler(request) {

        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._service.getPlaylist(credentialId);


        return {
            status: 'success',
            data: {
                playlists,
            }
        }
    }

    async deletePlaylistHandler(request) {


        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistOwner(id, credentialId);
        await this._service.deletePlaylistById(id);

        return {
            status: 'success',
            message: 'Playlist berhasil dihapus'
        }

    }

    async postSongToPlaylistHandler(request, h) {

        this._validator.validatePlaylistSongIdPayload(request.payload);
        const { id } = request.params
        const { songId } = request.payload
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(id, credentialId);
        await this._songservice.getSongById(songId);

        const playlists = await this._service.addSongToPlaylist(id, songId);

        const response = h.response({
            status: 'success',
            message: 'Song berhasil ditambahkan ke playlist',
            data: {
                playlists,
            },
        });
        response.code(201);
        return response;
    }

    async getSongInPlaylist(request) {

        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(id, credentialId);
        const playlists = await this._service.getPlaylistById(id);
        const songs = await this._service.getSongInPlaylistById(id);


        return {
            status: 'success',
            data: {
                playlist: {
                    ...playlists,
                    songs
                }

            },
        }
    }

    async deleteSongFromPlaylist(request) {

        const { id } = request.params;
        const { songId } = request.payload;
        this._validator.validatePlaylistSongIdPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(id, credentialId);
        this._service.deleteSongInPlaylistById(songId);

        return {
            status: 'success',
            message: 'Song berhasil dihapus dari playlist'
        }
    }
}

module.exports = PlaylistsHandler;