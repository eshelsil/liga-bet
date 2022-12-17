import React, { useEffect, useRef, useState } from 'react'
import './DaShubi.scss'

interface Props {
    dismiss: () => void
}

const imgs = [
    'dashubi.webp',
    'dashubi2.webp',
    'dashubi3.webp',
]

let imgIndex = 0
const next = () => {
    imgIndex = (imgIndex + 1) % imgs.length
}

const DaShubi = ({dismiss}: Props) => {
    const [shown, setShown] = useState(false)
    const imgRef = useRef(imgs[imgIndex])
    const img = imgRef.current
    useEffect(() => {
        next()
        setTimeout(
            () => setShown(true)
            , 1
        )
        const autoDismissTimeout = setTimeout(dismiss, 4000)
        return () => {
            clearTimeout(autoDismissTimeout)
        }
    }, [])
    return (
        <div className={`LB-DaShubi ${shown ? 'DaShubi-shown' : ''}`}>
            <img onClick={dismiss} className='DaShubi-img' src={`img/${img}`}/>
        </div>
    )
}

export default DaShubi
