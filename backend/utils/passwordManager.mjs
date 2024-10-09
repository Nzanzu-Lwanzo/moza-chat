import { hashSync, compare } from "bcrypt";

export const generate = (raw) => hashSync(raw, 10);

export const validate = async (raw, hashed) => await compare(raw, hashed);
