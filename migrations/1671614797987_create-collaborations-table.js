exports.up = (pgm) => {
    // membuat table collaborations
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

    /*
      Menambahkan constraint UNIQUE, kombinasi dari kolom playlists_id dan user_id.
      Guna menghindari duplikasi data antara nilai keduanya.
    */
    pgm.addConstraint('collaborations', 'unique_playlists_id_and_users_id', 'UNIQUE(playlists_id, users_id)');

    // memberikan constraint foreign key pada kolom playlists_id dan user_id terhadap playlists.id dan users.id
    pgm.addConstraint('collaborations', 'fk_collaborations.playlists_id_playlist.id', 'FOREIGN KEY(playlists_id) REFERENCES playlist(id) ON DELETE CASCADE');
    pgm.addConstraint('collaborations', 'fk_collaborations.users_id_users.id', 'FOREIGN KEY(users_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    // menghapus tabel collaborations
    pgm.dropTable('collaborations');
};