exports.up = (pgm) => {
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

    pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlists_id_playlist.id', 'FOREIGN KEY(playlists_id) REFERENCES playlist(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropTable('playlist_song_activities');
};
