import { reportApiError } from "../../utils";

interface ApiRequestParams {
    type?: string,
    url: string,
    data?: object,
    includeResponseHeaders?: string[],
}

export const sendApiRequest = async ({
    type = 'GET',
    url,
    data,
    includeResponseHeaders,
}: ApiRequestParams): Promise<any> => {
    return new Promise((resolve, reject) => {
        (window as any).$.ajax({
            type,
            url,
            contentType: 'application/json',
            dataType: 'json',
            data: data ? JSON.stringify(data) : undefined,
            success: function(data: any, textStatus, request){
                if (includeResponseHeaders){
                    const headers = {} as Record<string, any>;
                    for (const header of includeResponseHeaders){
                        headers[header] = request.getResponseHeader(header);
                    }
                    resolve({
                        data,
                        headers,
                    });
                } else {
                    resolve(data);
                }
            },
            error: function(data) {
                console.error(data);
                reportApiError(data);
                reject(data);
            }
        })
    })
}