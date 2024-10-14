const AdminAuth = (req, res, next) => {
  console.log("Authenticating Admin");

  const token = "xyz";

  const isAuthenticated = token === "xyz";

  if (!isAuthenticated) {
    res.status(401).send("Authentication failed. Please login Again");
  } else {
    next();
  }
};


const UserAuth = (req, res, next) => {
    console.log("Authenticating User");
  
    const token = "xyz";
  
    const isAuthenticated = token === "xyz";
  
    if (!isAuthenticated) {
      res.status(401).send("Authentication failed. Please login Again");
    } else {
      next();
    }
  };

  
module.exports = {
  AdminAuth,
  UserAuth
};
