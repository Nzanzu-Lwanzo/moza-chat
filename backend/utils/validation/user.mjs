import { maxLengthName, minLengthName } from "../../database/models/users.mjs";

let maxPasswordLength = 20;
let minPasswordLength = 6;

/**
 * @type {import("express-validator").Schema}
 */
export const userSchema = {
  name: {
    isString: true,
    notEmpty: {
      errorMessage: "Vous devez fournir un nom pour ce compte!",
    },
    isLength: {
      options: {
        min: minLengthName,
        max: maxLengthName,
      },
      errorMessage: `Le nom doit avoir une longueur minimale de ${minLengthName} et maximale de ${maxLengthName}, espace et caractères spéciaux inclus.`,
    },
  },

  password: {
    isString: true,
    notEmpty: {
      errorMessage: "Vous devez fournir un mot de passe pour ce compte!",
    },
    isLength: {
      options: {
        min: minPasswordLength,
        max: maxPasswordLength,
      },
      errorMessage: `Le mot de passe doit avoir une longueur minimale de ${minLengthName} et maximale de ${maxLengthName}, caractères spéciaux inclus, sans espace.`,
    },
  },

  email: {
    isEmail: {
      errorMessage: "Vous n'avez pas fourni une adresse e-amail valide !",
    },
    optional: true,
    trim: true,
  },

  picture: {
    isString: true,
    optional: true,
  },
};
