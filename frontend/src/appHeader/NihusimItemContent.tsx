import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { CanSendNihus, IsOnNihusim } from '@/_selectors'
import { cn, handlerNoPropagation } from '@/utils'
import { Switch } from '@mui/material'
import { useAppDispatch } from '@/_helpers/store'
import settings from '@/_reducers/settings'



function NihusimItemContent() {
    const { t } = useTranslation('appHeader')
    const isOn = useSelector(IsOnNihusim)
    const dispatch =  useAppDispatch();
    const updateNihusim = (value: boolean) => {
        dispatch(settings.actions.update({nihusim: value}));
    }
    const canSendNihus = useSelector(CanSendNihus)
    return (
        <>
            {canSendNihus && (
                <div className={cn("flex items-center justify-between w-full")}>
                    <p className={cn("m-0 leading-[1]")}>{t('nihusim')}</p>
                    <Switch  className={cn("rounded-2xl bg-black/30 me-3")} onClick={handlerNoPropagation(()=>{})} checked={isOn} onChange={(e, value) => updateNihusim(value)}/>
                </div>
            )}
            {!canSendNihus && (
                t('nihusim')
            )}
        </>
    )
}

export default NihusimItemContent
