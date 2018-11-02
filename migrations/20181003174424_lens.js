
exports.up = function(knex, Promise) {
    return knex
        .schema

        // Session
        .createTable('session', table => {
            table.string('sid').primary();
            table.json('sess').notNullable();
            table
                .timestamp('expired')
                .notNullable()
                .index();
        })

        // Users
        .createTable('users', table => {
            table.increments('id').primary();
            table.string('email');
            table.json('auth');
            table.json('data');
            table.uuid('apiminerId');
            table.string('apiminerToken');
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));

            table.unique('email');
        })
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('users')
        .dropTable('session');
};
