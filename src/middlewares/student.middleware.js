exports.can_view = (req,res,next)=>{
    return next();
    const auth = req.session.auth;
    // const permissions = auth && auth.permissions?auth.permissions:[];
    // if(permissions.includes(permission)){
    //    return next();
    // }
    if(auth){
        return next();
    }
    res.status(404).send("404 Not found");
};

exports.can_action = (req,res,next)=>{
    return next();
    const auth = req.session.auth;
    const permissions = auth && auth.permissions?auth.permissions:[];
    if(permissions.includes(permission)){
        return next();
    }
    res.status(404).send("404 Not found");
};