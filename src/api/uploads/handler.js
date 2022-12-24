class UploadsHandler {
    constructor(service, albumService, validator) {
        this._service = service;
        this._albumService = albumService;
        this._validator = validator;

        this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
    }

    async postUploadImageHandler(request, h) {
        const { cover } = request.payload;
        const { id } = request.params;
        const albumId = id;

        this._validator.validateImageHeaders(cover.hapi.headers);

        const filename = await this._service.writeFile(cover, cover.hapi);
        const location = `http://${process.env.HOST}:${process.env.PORT}/upload/album-cover/${filename}`;

        this._service.updateAlbumCover(albumId, location);

        const response = h.response({
            status: 'success',
            message: 'Sampul berhasil diunggah',
        });
        response.code(201);
        return response;
    }
}

module.exports = UploadsHandler;