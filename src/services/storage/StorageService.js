/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const { Pool } = require('pg');

class StorageService {
    constructor(folder) {
        this._pool = new Pool();
        this._folder = folder;


        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
    }

    writeFile(file, meta) {
        const filename = +new Date() + meta.filename;
        const path = `${this._folder}/${filename}`;

        const fileStream = fs.createWriteStream(path);

        return new Promise((resolve, reject) => {
            fileStream.on('error', (error) => reject(error));
            file.pipe(fileStream);
            file.on('end', () => resolve(filename));
        });
    }

    async updateAlbumCover(id, cover) {

        const query = {
            text: 'UPDATE album SET cover = $2 WHERE album.id = $1',
            values: [id, cover],
        }

        const result = await this._pool.query(query);

        return result.rows;
    }
}

module.exports = StorageService;