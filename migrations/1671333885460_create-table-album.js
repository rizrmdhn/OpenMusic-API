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
        cover: {
            type: 'TEXT',
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('album');
};
