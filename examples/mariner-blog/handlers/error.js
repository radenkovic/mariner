export default e => {
  switch (e.code) {
    case 'not-found':
      return { status: 404, data: e };
    case 'validation':
      return { status: 400, data: e };
    case 'update-without-id':
      return { status: 400, data: e };
    case '23503': {
      const user = e.message.includes('user_id_foreign');
      let data;
      if (user) data = { user_id: ['user_id does not exist'] };
      return { status: 409, data: data || { error: 'conflict' } };
    }
    case '23505': {
      // Username or email is taken
      const emailTaken = e.message.includes('user_email_unique');
      const usernameTaken = e.message.includes('user_username_unique');
      let data;
      if (usernameTaken) data = { username: ['username is already taken'] };
      else if (emailTaken) data = { email: ['email is already taken'] };
      return { status: 409, data: data || { error: 'conflict' } };
    }
    default:
      console.log('Unhandled Error!', e);
      return { status: 500, data: 'Something really bad happened' };
  }
};
