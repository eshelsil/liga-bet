

export function getPlayerImgLink(externalId: number, scalea: number) {
    const scale = 20
    return `https://imagecache.365scores.com/image/upload/f_png,w_${scale},h_${scale},c_limit,q_auto:eco,dpr_2,d_Athletes:${externalId}.png,r_max,c_thumb,g_face,z_0.65/Athletes/NationalTeam/${externalId}`
}