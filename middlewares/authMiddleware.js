const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;

    // Also check Authorization header for Bearer token
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Token is not valid",
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedData;
    next();
  } catch (error) {
    console.log("Error : ", error.message);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = protect;