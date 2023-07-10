export default async (handler, req) => {
  const res = {
    statusCode: 200,
    status: function (code) {
      this.statusCode = code;
      return code;
    },
  };
  
  req.headers = {};

  try {
    const result = await handler(req, res);

    return {
      type: "RESULT",
      message: result.message || "OK",
      total: result?.length || 0,
      result: result,
      error: null,
      code: 200,
    };
  } catch (error) {
    return {
      type: "ERROR",
      message: error.message,
      result: null,
      error: process.env.ENV_TYPE === "production" ? null : error.stack,
      code: res.statusCode ? res.statusCode : 500,
    };
  }
};
