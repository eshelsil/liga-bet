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




function AdminGrantNihusim() {
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
                (window as any).toastr["success"]('עודכן בהצלחה')
            })
    }

    useEffect(() => {
        if (competitionId) {
            dispatch(fetchAndStoreAllPlayers())
        }
    }, [competitionId])

    return (
        <div >
            <h2>הענק ניחוסים</h2>
            <InputLabel>בחר משתמש</InputLabel>
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
            <InputLabel>כמות:</InputLabel>
            <NumberField value={amount} onChange={(e) => setAmount(Number(e.target.value) || null)} />
            <InputLabel>סיבה:</InputLabel>
            <TextField value={reason} onChange={(e) => setReason(e.target.value)} />
            <div>
                <LoadingButton action={submit} className={cn("mt-6")}>
                    עדכן
                </LoadingButton>
            </div>
            <div className='goBackButton'>
                <Button
                    variant='outlined'
                    color='primary'
                    onClick={goToAdminIndex}
                    style={{marginTop: 24}}
                >
                    חזור
                </Button>
            </div>
        </div>
    )
}

export default AdminGrantNihusim 
