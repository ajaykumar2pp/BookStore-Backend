const adminMiddleware = (req, resp, next) => {
    try {

        //  console.log(req.user);
        const adminRole = req.user.isAdmin;
        if (!adminRole) {
            return resp.status(403).json({ message: "User is not an admin" });
        }
        next();
    } catch (error) {
        // console.log(error)
        next(error);
    }

}
module.exports = adminMiddleware;