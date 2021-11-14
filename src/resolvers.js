
function users() {
  return [{
    userId: 1,
    name: 'someone new1',
    email: 'someone.new1@test.com',
    posts: null,
  }];
}

function posts () {
  return [{
    postId: 1,
    content: 'create multi-site',
    postedBy: {
      userId: 1,
      name: 'someone new1',
      email: 'someone.new1@test.com',
      posts: null,
    },
  }]
}

function commentedBy() {
  return [{
    userId: 1,
    name: 'someone new1',
    email: 'someone.new1@test.com',
    posts: null,
  }];
}

function login(email, password) {
  return {
    userId: 1,
    name: 'someone new1',
    email: 'someone.new1@test.com',
    posts: null,
  }
}

export {
  users,
  posts,
  commentedBy,
  login,
}
