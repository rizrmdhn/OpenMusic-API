/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsServices {
    constructor(collaborationService) {
        this._pool = new Pool();
        this._collaborationService = collaborationService;

    }

    async addPlaylist({ name, owner }) {

        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlist VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        }

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylist(owner) {
        const query = {
            text: `SELECT playlist.id, playlist.name, users.username
            FROM playlist
            LEFT JOIN collaborations ON collaborations.playlists_id = playlist.id
            LEFT JOIN users ON users.id = playlist.owner
            WHERE playlist.owner = $1 OR collaborations.users_id = $1
            GROUP BY playlist.id, users.username
            `,
            values: [owner],
        };

        const result = await this._pool.query(query);

        return result.rows;

    }

    async getPlaylistById(id) {

        const query = {
            text: `SELECT playlist.id, playlist.name, users.username
            FROM playlist
            LEFT JOIN users ON users.id = playlist.owner
            WHERE playlist.id = $1`,
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return result.rows[0];
    }

    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlist WHERE id = $1 RETURNING id',
            values: [id],
        }

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
        }
    }

    async addSongToPlaylist(songId, playlistId) {

        const id = `playlist_songs-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, songId, playlistId],
        }

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError;
        }

        return result.rows[0].id;
    }

    async getSongInPlaylistById(id) {
        const query = {
            text: `SELECT song.id, song.title, song.performer
            FROM song
            LEFT JOIN playlist_songs ON song_id = song.id
            WHERE playlist_songs.playlist_id = $1`,
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return result.rows;
    }

    async verifyPlaylistOwner(id, owner) {

        const query = {
            text: 'SELECT * FROM playlist WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];

        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistOwner(playlistId, userId);

        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            try {
                await this._collaborationService.verifyCollaborator(playlistId, userId);
            } catch {
                throw error;
            }
        }
    }

    async deleteSongInPlaylistById(songId) {

        const query = {
            text: 'DELETE FROM playlist_songs WHERE song_id = $1 RETURNING id',
            values: [songId],
        }

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Song gagal dihapus dari playlist. Id tidak ditemukan');
        }

    }

}

module.exports = PlaylistsServices;