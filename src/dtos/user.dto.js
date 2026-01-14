module.exports = class UserDto {
  id;
  email;
  fullName;
  avatar;

  constructor(model) {
    this.id = model._id;
    this.email = model.email;
    this.fullName = model.fullName;
    this.avatar = model.avatar;
  }
}