module.exports = class UserDto {
  id;
  email;
  fullName;

  constructor(model) {
    this.id = model._id;
    this.email = model.email;
    this.fullName = model.fullName;
  }
}