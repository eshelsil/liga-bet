export function createSingleton(callback){
    let succeed = false;
    return async (...params)=>{
        if (!succeed){
            const res = await callback(...params);
            succeed = true;
            return res;
        }
    }
}