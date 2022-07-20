export const sendApiRequest = async ({
    type = 'GET',
    url,
    data,
}) => {
    return await $.ajax({
        type,
        url,
        contentType: 'application/json',
        data,
    })
}