function requestLogger(context :any){
    const text = context.request.method + " : " + context.path
    console.log(text)
}

export {requestLogger}