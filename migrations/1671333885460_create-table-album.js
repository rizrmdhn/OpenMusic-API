/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('album', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        year: {
            type: 'INTEGER',
            notNull: true,
        },
    });

    pgm.addConstraint('album', 'fk_album.id_song.albumId', 'FOREIGN KEY(id) REFERENCES song(albumId) ON DELETE CASCADE');

};

exports.down = pgm => {
    pgm.dropConstraint('playlist', 'fk_album.id_song.albumId');

    pgm.dropTable('album');
};
