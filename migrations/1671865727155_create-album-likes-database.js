exports.up = (pgm) => {
    // membuat table collaborations
    pgm.createTable('user_album_likes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        album_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });


    // memberikan constraint foreign key pada kolom playlists_id dan user_id terhadap playlists.id dan users.id
    pgm.addConstraint('user_album_likes', 'fk_user_album_likes.album_id_album.id', 'FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE');
    pgm.addConstraint('user_album_likes', 'fk_user_album_likes.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    // menghapus tabel collaborations
    pgm.dropTable('user_album_likes');
};
