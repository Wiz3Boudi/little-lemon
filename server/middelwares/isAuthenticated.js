export default (req, res, next) =>{
    try {
        if(req.isAuthenticated()){
            return next()
        }
        return res.redirect('/login')
    } catch (error) {
        return next(error)
    }
}