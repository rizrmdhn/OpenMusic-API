/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('playlist_songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'TEXT',
            notNull: false,
        },
        song_id: {
            type: 'TEXT',
            notNull: false,
        },
    });

    pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE');
};

exports.down = pgm => {

    pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlist.id');
    pgm.dropTable('playlist_songs');
};
