const mapDBToModel = ({
    id,
    name,
    year,
    title,
    created_at,
    updated_at,
}) => ({
    id,
    title,
    body,
    tags,
    createdAt: created_at,
    updatedAt: updated_at,
});

module.exports = { mapDBToModel };