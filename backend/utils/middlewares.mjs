import { isValidObjectId } from "mongoose";
import { validationResult, matchedData } from "express-validator";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const validateParmId = (req, res, next) => {
  let { id } = req.params;

  if (!id || !isValidObjectId(id)) return res.sendStatus(406);

  next();
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const getValidData = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty())
    return res.json({
      code: 400,
      errors: result.array(),
    });

  req.body = matchedData(req);

  next();
};
