const helper=require('../../helper/helper')
const authService = {}
authService.login = async (data) => {
    const user = data.toObject();
    user.token = await helper.generateTokken(user);
    delete user.password;
    return user;
}
module.exports = authService