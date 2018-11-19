module.exports = (knex) => {

  const queries = {};

  queries.getProfile = function (id) {

    return knex('users')
      .where({ id: id })
      .select()
      .then((results) => results);

  }

  queries.getMyResources = function (userID) {

    let results = {};
    return Promise.all([
      knex('resources')
        .where({ user_id: userID })
        .select("*")
        .then(function (mine) {
          results.mine = mine;
        }),
      knex('resources')
        .join('reactions', 'resources.id', 'reactions.resource_id')
        .select('*')
        .then(function (liked) {
          results.liked = liked;
        })
    ]).then(() => results);

  }

  queries.getUserResources = function (userName) {

    return knex('resources')
      .join("users", "resources.user_id", "users.id")
      .where({ "users.name": userName })
      .select("*")
      .then((results) => results);

  };

  queries.getTopicResources = function (topicID) {

    return knex('resources')
      .join("resources_topics", "resources.id", "resources_topics.resource_id")
      .join("topics", "resources_topics.topic_id", "topics.id")
      .where({ "topics.id": topicID })
      .select("resources.*")
      .then((results) => results);

  };

  queries.getTopicName = function (topicID) {

    return knex("topics")
      .where({"topics.id": topicID})
      .select("*")
      .then((results) => results);

  };

  queries.getUserResources = function (userID) {

    return knex('resources')
      .where({ "resources.user_id": userID })
      .select("resources.*")
      .then((results) => results);

  };

  queries.getUserName = function (userID) {

    return knex("users")
      .where({"users.id": userID})
      .select("*")
      .then((results) => results);

  };

  queries.getRecentResources = function () {

    return knex("resources")
      .select("*")
      .orderBy("id", "desc")
      .limit(5)
      .then((results) => results);

  };

  queries.getDayResources = function (day) {

    return knex('days')
      .join('days_topics', 'days.id', 'days_topics.day_id')
      .join('topics', 'days_topics.topic_id', 'topics.id')
      .join('resources_topics', 'topics.id', 'resources_topics.topic_id')
      .join("resources", "resources_topics.resource_id", "resources.id")
      .join("users", "resources.user_id", "users.id")
      .where({ 'days.day': day })
      .select("resources.*")
      .orderBy("topics.name")
      .then((results) => results);

  }

  queries.getResource = function (resourceID) {

    const out = {};

    console.log("GETTING RESOURCE");

    return Promise.all([

      knex('resources')
        .where({ 'resources.id': resourceID })
        .select("*")
        .then((results) => out.resource = results[0] ),

      knex("comments")
        .where({"comments.resource_id": resourceID})
        .select("*")
        .then((results) => out.comments = results),

      knex("topics")
        .join("resources_topics", "topics.id", "resources_topics.topic_id")
        .join("resources", "resources_topics.resource_id", "resources.id")
        .where({"resources.id": resourceID})
        .select("topics.name as name", "topics.id as id")
        .then((results) => out.topic = results[0])

    ]).then(() => out);

  }

  queries.registerUser = function (name) {

    return knex('users')
      .insert({ name: name })
      .returning(['id', 'name'])
      .then((results) => results);

  }

  queries.login = function (name) {

    return knex('users')
      .where({ 'users.name': name })
      .select('id', 'name')
      .then((results) => results);

  }

  queries.newResource = function (id, body) {

    const url = body.url;
    const title = body.title;
    const description = body.description;
    const topic = body.topic;

    knex('resources')
      .insert({ url: url, title: title, description: description, topic_id: topic, owner_id: id })
      .returning("id")
      .then((results) => results);


  };

  queries.getReaction = function (user_id, resource_id) {

    return knex("reactions")
      .where({"resource_id": resource_id, "user_id": user_id})
      .then((results) => results);

  }

  queries.toggleLike = function (user_id, resource_id) {

    return queries.getReaction(user_id, resource_id).then((results) => {

      if (results[0]) {
        knex('reactions')
        .where({ 'resource_id': resource_id, "user_id": user_id })
        .update({ 'liked': !results[0].liked })
        .then((results) => results);
      } else {
        knex('reactions')
        .insert({ 'user_id': user_id, 'resource_id': resource_id, 'liked': "true" })
        .then((results) => results);
      }

    });

  }

  queries.rate = function (user_id, resource_id, rating) {

    return queries.getReaction(user_id, resource_id).then((results) => {

      if (results[0]) {
        knex('reactions')
        .where({ 'resource_id': resource_id, "user_id": user_id })
        .update({ 'rating': rating })
        .then((results) => results);
      } else {
        knex('reactions')
        .insert({ 'user_id': user_id, 'resource_id': resource_id, "rating": rating })
        .then((results) => results);
      }

    });

    }

  queries.comment = function (user_id, resource_id, comment) {

    return knex('comments')
      .where({ 'resource_id': resource_id })
      .insert({ 'user_id': user_id, 'resource_id': resource_id, 'text': comment })
      .then((results) => results);

  }


  queries.getReactions = function(resource_id) {
    return knex('resources')
    .join('reactions', 'resources.id', 'reactions.resource_id')
    .where({ 'resource_id': resource_id })
    .select('resources.id', 'reactions.liked', 'reactions.rating')
    .then((results) => results);
  }

  queries.aboutMe = function(user_id, about) {
    return knex('users')
    .where({'id': user_id})
    .update({'about': about})
    .then((results) => results);
  }

  return queries;
};
