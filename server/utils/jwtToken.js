const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken(); // Simulate getting the JWT token
  res.setHeader("Authorization", `Bearer ${token}`);
  res.status(statusCode).json({
    message: "login Successfully",
    success: true,
    user,
    token,
  });
};
module.exports = sendToken;
