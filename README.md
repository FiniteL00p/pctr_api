# Clique API - The API for Clique
Clique is a geolocation-based file sharing client designed to help you explore your surroundings wherever you happen to be.  This backend API handles the following functions:
  - User authentication (sign-up, sign-in, logout, and change password
  - Create, read, update, and delete actions on the database containing user photos and metadata such as titles, descriptions, tags, and comments.

## Repository links
[Client Repo] - https://github.com/FiniteL00p/pctr
[Backend/API Repo] - https://github.com/FiniteL00p/pctr_api

## Deployed links
[Client] - https://finitel00p.github.io/pctr/
[Backend/API] - https://file-bucket-api.herokuapp.com/

## API components
1. Node.js
2. MongoDB and Mongoose

## API Routes
| Verb   | URI Pattern            | Controller#Action       |
|--------|------------------------|-------------------------|
| POST   | `/sign-up`             | `users#signup`          |
| POST   | `/sign-in`             | `users#signin`          |
| PATCH  | `/change-password`     | `users#changePassword`  |
| DELETE | `/sign-out`            | `users#signout`         |
| GET    | `/images`              | `images#index`          |
| GET    | `/images/:id`          | `images#show`           |
| POST   | `/images`              | `images#create`         |
| PATCH  | `/images/:id`          | `images#update`         |
| GET    | `/images/:id`          | `images#destroy`        |
| POST   | `/images`              | `images#addComment`     |
| PATCH  | `/images/:id`          | `images#editComment`    |
| GET    | `/user-location/:id`   | `users#updateLocation`  |
|--------|------------------------|-------------------------|

## API Specific Planned Feature Enhancements

1. [Feature Description] - Update schema to allow for the creation of a search feature using tags or other metadata

## Entity Relationship Diagram, User Stories, & Wireframes
The ERD and wireframes for this project can be found at https://imgur.com/a/mzRop

-MVP User Stories-
1. As a user, I want to be able to sign up for this app.
2. As a user, I want to be able to sign-in.
3. As a user, I want to be able to change my password.
4. As a user, I want to be able to upload an image.
5. As a user, I want to be able to edit fields/information associated with that image.
6. As a user, I want to be able to destroy a photo that I upload.
7. As a user, I want to be able to see uploaded photos.
8. As a user, I want to be able to download a photo.

-Bonus User Stories-
1. As a user, I want to be able to see photos based on their geographic location.
2. As a user, I want to be able to delete my account.
3. As a user, I want to be able to like/comment on other people's photos.
4. As a user, I want to know if someone has liked or commented on my photos.
5. As a user, I want to have a username.

## Project Development Schedule
Day 1
  * Objectives:
    - Agree on a purpose/theme for the website
    - Develop basic wireframes and an ERD
    - Get a working shell of a landing page with user authentication
Day 2
  * Objectives:
    - Finalize landing page and user authentication functionality
    - Get a working shell of the "my photos", "upload photos", and "community carousel" pages
Day 3
  * Objectives
    - Continue working on the site layout and incorporate styling wherever time allows
    - Get user upload functionality working incorporating the ability to upload multiple photos at once if possible
Day 4
  * Objectives
    - Extract EXIF data from photos and store in the database
    - Get user's geolocation data and store in the database
    - Get geo-distance logic and code working
Day 5
  * Objectives
    - Enable user tags and comments
    - Finalize site styling and
Day 6
  * Objectives
    - Finalize documentation, close out any remaining issues

## [License](LICENSE)

1.  All content is licensed under a CC­BY­NC­SA 4.0 license.
1.  All software code is licensed under GNU GPLv3. For commercial use or
    alternative licensing, please contact legal@ga.co.
