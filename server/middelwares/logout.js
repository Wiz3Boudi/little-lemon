export default (req, res, next) => {
    try {
        req.logout((err) => {
            if (err) {
                return next(err)
            }
            req.session.destroy((err) => {
                if (err) {
                    return next(err)
                }
                res.clearCookie('connect.sid');
                return res.redirect('/login')
            })
        })
    } catch (error) {
        next(error)
    }
}