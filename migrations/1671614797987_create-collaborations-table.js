exports.up = (pgm) => {
    pgm.createTable('collaborations', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlists_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        users_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });

    pgm.addConstraint('collaborations', 'unique_playlists_id_and_users_id', 'UNIQUE(playlists_id, users_id)');

    pgm.addConstraint('collaborations', 'fk_collaborations.playlists_id_playlist.id', 'FOREIGN KEY(playlists_id) REFERENCES playlist(id) ON DELETE CASCADE');
    pgm.addConstraint('collaborations', 'fk_collaborations.users_id_users.id', 'FOREIGN KEY(users_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropTable('collaborations');
};