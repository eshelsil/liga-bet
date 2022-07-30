interface ApiRequestParams {
    type?: string,
    url: string,
    data?: object,
}

export const sendApiRequest = async ({
    type = 'GET',
    url,
    data,
}: ApiRequestParams) => {
    return await (window as any).$.ajax({
        type,
        url,
        contentType: 'application/json',
        dataType: 'json',
        data: data ? JSON.stringify(data) : undefined,
        error: function(data) {
            (window as any).toastr["error"](data.responseJSON.message);
        }
    })
}