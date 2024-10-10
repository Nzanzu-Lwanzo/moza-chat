import { hashSync, compareSync } from "bcrypt";

export const generate = (raw) => hashSync(raw, 10);

export const validate = (raw, hashed) => compareSync(raw, hashed);
