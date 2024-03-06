import React from 'react'
import { MyActiveNihus, NihusimWithRelations, } from '../_selectors'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/_helpers/store'
import { markSeenNihus } from '@/_actions/nihusim'
import NihusSticker from './NihusSticker'
import { useNihusStickerContext } from './context'



const NihusStickerManager = () => {
    const {selected, setSelected} = useNihusStickerContext()
    const nihusActive = useSelector(MyActiveNihus)
    const nihusim = useSelector(NihusimWithRelations)
    const selectedNihus = selected ? nihusim[selected] : undefined;
    const isTargeted = !!nihusActive?.id;
    const nihus = isTargeted ? nihusActive : selectedNihus
    const nihusId = nihus?.id

    const dispatch  = useAppDispatch()

    const onQuit = () => {
        if (isTargeted){
            dispatch(markSeenNihus(nihusId))
        } else {
            setSelected(undefined)
        }
    }
    
    if (!nihusId) return null;

    return (
        <NihusSticker
            nihus={nihus}
            blocking={isTargeted}
            showTargetUtl={!isTargeted}
            onQuit={onQuit}
        />
    )
}

export default NihusStickerManager
