export const paginate = (req) => {
  // Get query parameters with defaults
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status || null;
  const search = req.query.search || null;

  // Validate page and limit
  const validPage = page > 0 ? page : 1;
  const validLimit = limit > 0 && limit <= 100 ? limit : 10;

  // Calculate skip for pagination
  const skip = (validPage - 1) * validLimit;

  // Build filter object
  const filter = {};

  // Add status filter if provided
  if (status) {
    filter.status = status.toLowerCase();
  }

  // Add search filter if provided (searches in title and description)
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  return {
    page: validPage,
    limit: validLimit,
    skip,
    filter,
    status,
    search
  };
};

/**
 * Format paginated response
 */
export const formatPaginatedResponse = (data, page, limit, total) => {
  return {
    success: true,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    },
    count: data.length,
    data
  };
};
