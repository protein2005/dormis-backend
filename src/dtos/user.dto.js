module.exports = class UserDto {
  id;
  email;
  gender;
  fullName;
  avatar;

  constructor(model) {
    this.id = model._id;
    this.email = model.email;
    this.gender = model.gender
    this.fullName = model.fullName;
    this.avatar = model.avatar;
  }
}