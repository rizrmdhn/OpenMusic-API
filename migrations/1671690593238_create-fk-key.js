/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addConstraint('song', 'fk_song.album.id', 'FOREIGN KEY("albumId") REFERENCES album(id) ON DELETE CASCADE');
    pgm.addConstraint('playlist', 'fk_playlist.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('song', 'fk_song.album.id');
    pgm.dropConstraint('playlist', 'fk_playlist.owner_users.id');
    pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlist.id');
};
