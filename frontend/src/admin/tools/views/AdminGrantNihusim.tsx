import React, { useEffect, useState } from 'react'
import { Button, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import useGoTo from '../../../hooks/useGoTo'
import { Contestants, CurrentCompetitionId } from '../../../_selectors'
import { useSelector } from 'react-redux'
import { fetchAndStoreAllPlayers } from '../../../_actions/players'
import { useAppDispatch } from '../../../_helpers/store'
import { LoadingButton } from '../../../widgets/Buttons'
import { grantNihusim } from '../../../api/admin'
import NumberField from '@/widgets/inputs/NumberField'
import { cn, valuesOf } from '@/utils'
import { useTranslation } from 'react-i18next'




function AdminGrantNihusim() {
    const { t } = useTranslation('admin')
    const dispatch = useAppDispatch()
    const competitionId = useSelector(CurrentCompetitionId)
    const { goToAdminIndex } = useGoTo()
    const [utlId, setUtlId] = useState<number>(null)
    const [amount, setAmount] = useState<number>(null)
    const [reason, setReason] = useState('')
    const utlsById = useSelector(Contestants)
    const utls = valuesOf(utlsById)

    const submit = async () => {
        await grantNihusim(utlId, amount, reason)
            .then(data => {
                (window as any).toastr["success"](t('toasts.updatedSuccessfully'))
            })
    }

    useEffect(() => {
        if (competitionId) {
            dispatch(fetchAndStoreAllPlayers())
        }
    }, [competitionId])

    return (
        <div >
            <h2>{t('grantNihusim.title')}</h2>
            <InputLabel>{t('grantNihusim.selectUser')}</InputLabel>
            <Select
                value={utlId}
                onChange={(e: SelectChangeEvent<number>) => {
                    const utlId = e.target.value as number
                    setUtlId(utlId)
                }}
                renderValue={(utlId) => {
                    const utl = utlsById[utlId]
                    if (!utl) return
                    return (
                        `${utl.name} (id: ${utl.id})`
                    )
                }}
                fullWidth
                MenuProps={{
                    classes: {
                    }
                }}
            >
                {utls.map((utl) => (
                    <MenuItem key={utl.id} value={utl.id}>
                        {`${utl.name} (id: ${utl.id})`}
                    </MenuItem>
                ))}
            </Select>
            <InputLabel>{t('grantNihusim.amount')}</InputLabel>
            <NumberField value={amount} onChange={(e) => setAmount(Number(e.target.value) || null)} />
            <InputLabel>{t('grantNihusim.reason')}</InputLabel>
            <TextField value={reason} onChange={(e) => setReason(e.target.value)} />
            <div>
                <LoadingButton action={submit} className={cn("mt-6")}>
                    {t('buttons.update')}
                </LoadingButton>
            </div>
            <div className='goBackButton'>
                <Button
                    variant='outlined'
                    color='primary'
                    onClick={goToAdminIndex}
                    style={{marginTop: 24}}
                >
                    {t('buttons.back')}
                </Button>
            </div>
        </div>
    )
}

export default AdminGrantNihusim 
