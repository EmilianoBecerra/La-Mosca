import bcrypt from "bcrypt";

export const hashPass = async (password: string) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const verificarPass = (password: string, hashPass: string) => bcrypt.compareSync(password, hashPass)