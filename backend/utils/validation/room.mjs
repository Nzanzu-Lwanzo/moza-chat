import { isValidObjectId } from "mongoose";
import { maxLengthName, minLengthName } from "../../database/models/rooms.mjs";

/**
 * @type {  import("express-validator").Schema}
 */
export const roomSchema = {
  name: {
    isString: true,
    notEmpty: {
      errorMessage: "Vous devez fournir un nom pour le nom d'un chat room !",
    },
    isLength: {
      options: {
        min: minLengthName,
        max: maxLengthName,
      },
      errorMessage: `Le nom doit avoir une longueur minimale de ${minLengthName} et maximale de ${maxLengthName}, espace et caractères spéciaux inclus.`,
    },
  },

  description: {
    optional: true,
    trim: true,
    escape: true,
  },

  picture: {
    optional: true,
  },

  restricted: {
    isBoolean: true,
  },

  private: {
    isBoolean: true,
  },
};

export const validateArrayOfIds = (array) => {
  return (
    Array.isArray(array) && array.every((element) => isValidObjectId(element))
  );
};
