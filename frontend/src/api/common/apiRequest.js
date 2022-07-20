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
        error: function(data) {
            toastr["error"](data.responseJSON.message);
        }
    })
}