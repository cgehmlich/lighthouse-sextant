# Sextant

This project is intended to serve as a collection of useful links, docs, specs, cheat sheets, etc for students participating in a Lighthouse Labs program.

![Sextant](public/assets/sextant.png)

We chose to emulate the design of Lighthouse Labs' learning platform, Compass, with the aim of being a proof-of-concept that Compass could eventually incorporate.

![A comparison of Sextant and Compass](public/assets/comparison.gif)

## Contributors

Sextant was developed by [Adam Lovatt](https://github.com/jalovatt/), [Bryan Kenny](https://github.com/bryankenny), and [Cam Gehmlich](https://github.com/cgehmlich).

## Usage

### The Easy Way
[https://sextant-lhl.herokuapp.com/](https://sextant-lhl.herokuapp.com/)

### The Hard Way

- Install PostgreSQL. I won't even try to offer instructions on how to do that.
- In `psql`:
  - `CREATE DATABASE sextant;`
  - `CREATE USER sextant;`
  - `\password sextant`
    - Use the password _sextant_. Really creative, I know.
  - `ALTER USER sextant WITH SUPERUSER`;
- Clone this repository
- `npm install`
- `npm run knex migrate:latest`
- `npm run knex seed:run`

  You may get a database error at this point which we were unable to diagnose in the time available. If so, running the `seed` command a second time seems to consistently do the trick.

- Create a file called `.env` in the project's root directory. Put the following in it:
  ```
  DB_HOST=localhost
  DB_USER=sextant
  DB_PASS=sextant
  DB_NAME=sextant
  ```
- `npm start`
- Direct your browser to [http://localhost:8080](http://localhost:8080)

### Signing In

The app allows you to register a new user name, but you can just log in as "Adam", "Bryan", or "Cam". We won't mind.

## Dependencies

- PostgreSQL (not provided when installing the project)
- EJS
- Express
- Knex
- PG
- Moment.js

### Development Dependencies

- Knex Logger
- Morgan
- Nodemon
- Dotenv

## Assets

We borrowed liberally from Lighthouse Labs' stylesheets and markup, obviously. Cheers to the Compass development team.