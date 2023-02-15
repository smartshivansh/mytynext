function validateParams(orderBy, desec, limit, page) {
  const p = {
    orderBy: String(orderBy),
    desec: Number(desec),
    limit: Number(limit),
    page: Number(page),
  };

  const orderOptions = ["date"];
  if (!orderOptions.includes(orderBy)) {
    throw new Error("Invalid Parameters");
  }

  // if (!desec || !limit || !page) {
  //   throw new Error("Invalid Parameters");
  // }

  // if (isNaN(Number(desec)) || isNaN(Number(limit)) || isNaN(Number(page))) {
  //   throw new Error("Invalid Parameters");
  // }

  return {
    valid: true,
    params: p,
  };
}

module.exports = { validateParams };
