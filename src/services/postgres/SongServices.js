/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongServices {
    constructor() {
        this._pool = new Pool();
    }

    async addSong({ title, year, genre, performer, duration, albumId }) {

        const id = `song-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO song VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId],
        }

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('song gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getSong() {
        const result = await this._pool.query('SELECT id, title, performer FROM song');
        return result.rows;
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM song WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Song tidak ditemukan');
        }

        return result.rows[0];
    }

    async getSongByAlbumId(albumId) {
        const query = {
            text: 'SELECT id, title, performer FROM song WHERE "albumId" = $1',
            values: [albumId],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            return result.rows;
        }

        return result.rows;
    }

    async editSongById(id, { title, year, genre, performer, duration, albumId }) {
        const query = {
            text: 'UPDATE song SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6 WHERE id = $7 RETURNING id',
            values: [title, year, genre, performer, duration, albumId, id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
        }
    }

    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM song WHERE id = $1 RETURNING id',
            values: [id],
        }

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = SongServices;