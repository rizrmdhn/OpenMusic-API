/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class ActivitiesServices {
    constructor() {
        this._pool = new Pool();
    }


    async addActivites(playlistId, songId, userId, action) {

        const id = `activities-${nanoid(16)}`;
        const time = new Date().toISOString();


        const query = {
            text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [id, playlistId, songId, userId, action, time],
        }

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getActivities(id) {
        const query = {
            text: `SELECT users.username, song.title, playlist_song_activities.action, playlist_song_activities.time
            FROM playlist_song_activities
            LEFT JOIN users ON users.id = playlist_song_activities.users_id
			LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlist_song_activities.playlists_id
			LEFT JOIN song ON song.id = playlist_song_activities.song_id
            WHERE playlist_song_activities.playlists_id = $1
            GROUP BY users.id, playlist_song_activities.id, song.id`,
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            return result.rows;
        }

        return result.rows;
    }

}

module.exports = ActivitiesServices;