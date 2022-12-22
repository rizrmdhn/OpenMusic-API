/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    // membuat table collaborations
    pgm.createTable('playlist_song_activities', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlists_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        users_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        action: {
            type: 'TEXT',
            notNull: true,
        },
        time: {
            type: 'TEXT',
            notNull: true,
        }
    });


    // memberikan constraint foreign key pada kolom playlists_id dan user_id terhadap playlists.id dan users.id
    pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlists_id_playlist.id', 'FOREIGN KEY(playlists_id) REFERENCES playlist(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    // menghapus tabel collaborations
    pgm.dropTable('playlist_song_activities');
};
