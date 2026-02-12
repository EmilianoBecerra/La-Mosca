import bcrypt from "bcrypt";
export const hashPass = async (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const verificarPass = (password, hashPass) => bcrypt.compareSync(password, hashPass);
//# sourceMappingURL=user.js.map