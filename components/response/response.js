export function success(req,res,data,status){
    res.status(status).send(data);
}


export function failure(req,res,data,status){
    res.status(status).send(data);
}

