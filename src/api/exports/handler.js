/* eslint-disable no-underscore-dangle */

class ExportsHandler {
    constructor(service, playlistsService, validator) {
        this._service = service;
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
    }

    async postExportPlaylistHandler(request, h) {

        this._validator.validateExportNotesPayload(request.payload);
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistAccess(id, credentialId);
        await this._playlistsService.getPlaylistById(id);

        const message = {
            userId: request.auth.credentials.id,
            targetEmail: request.payload.targetEmail,
        };

        await this._service.sendMessage('export:playlist', JSON.stringify(message));

        const response = h.response({
            status: 'success',
            message: 'Permintaan Anda sedang kami proses',
        });
        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;