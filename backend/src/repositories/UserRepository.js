import User from '../models/User.js';

class UserRepository {
  async create(userData) {
    const user = await User.create(userData);
    return user;
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select('+password');
  }

  async findById(id) {
    return await User.findById(id);
  }
}

export default new UserRepository();
