class AlbumLikesHandler {
    constructor(service) {
        this._service = service;

        this.postLikeAlbumHandler = this.postLikeAlbumHandler.bind(this);
        this.getLikeAlbumHandler = this.getLikeAlbumHandler.bind(this);
    }

    async postLikeAlbumHandler(request, h) {
        const { id: albumId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.validateAlbumId(albumId);
        const isLiked = await this._service.checkIsLiked(credentialId, albumId);

        if (!isLiked) {
            await this._service.addAlbumLike(credentialId, albumId);

            const response = h.response({
                status: 'success',
                message: 'Berhasil menyukai album',
            });
            response.code(201);
            return response;
        }

        await this._service.deleteAlbumLike(credentialId, albumId);

        const response = h.response({
            status: 'success',
            message: 'Album dihapus dari daftar disukai',
        });
        response.code(201);
        return response;
    }

    async getLikeAlbumHandler(request, h) {

        const { id: albumId } = request.params;

        const data = await this._service.getNumberOfLikedAlbums(albumId);

        const response = h.response({
            status: 'success',
            data: {
                likes: data.rowCount,
            },
        }).header('X-Data-Source', data.source);

        response.code(200);
        return response;
    }
}

module.exports = AlbumLikesHandler;