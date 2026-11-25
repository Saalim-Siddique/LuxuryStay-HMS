'use strict';

/**
 * pagination – extracts and clamps page/limit from req.query.
 *
 * Usage in a controller:
 *   const { page, limit, skip } = paginate(req.query);
 *   const docs = await Model.find(filter).skip(skip).limit(limit);
 */
const { PAGINATION } = require('../config/constants');

const paginate = (query = {}) => {
  const page  = Math.max(1, parseInt(query.page,  10) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT)
  );
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

module.exports = { paginate };

