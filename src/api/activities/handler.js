/* eslint-disable no-underscore-dangle */

class ActivitiessHandler {
    constructor(activitiesService, playlistsService) {
        this._activitiesService = activitiesService;
        this._playlistsService = playlistsService;

        this.getActivitiesHandler = this.getActivitiesHandler.bind(this);
    }

    async getActivitiesHandler(request) {


        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistAccess(id, credentialId);
        const playlistId = await this._playlistsService.getPlaylistById(id);
        const activities = await this._activitiesService.getActivities(id);

        return {
            status: 'success',
            data: {
                playlistId: playlistId.id,
                activities,
            }
        }
    }
}

module.exports = ActivitiessHandler;