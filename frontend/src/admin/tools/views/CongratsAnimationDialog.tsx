import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import {
    Button,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
    CongratsAnimationConfig,
    CongratsAnimationType,
    CongratsRankEntry,
} from '../../../types'
import { updateCongratsAnimationConfig } from '../../../_actions/admin'
import { AppDispatch } from '../../../_helpers/store'

const ANIM_TYPES: CongratsAnimationType[] = [
    CongratsAnimationType.Confetti,
    CongratsAnimationType.TwoBags,
    CongratsAnimationType.OneBag,
    CongratsAnimationType.SingleDollar,
    CongratsAnimationType.None,
]

const DEFAULT_CONFIG: CongratsAnimationConfig = {
    enabled: false,
    lang: 'he',
    ranks: [],
    default: { type: CongratsAnimationType.None, title: '', msg: '' },
}

interface Props {
    open: boolean
    onClose: () => void
    tournamentId: number
    name: string
    config?: CongratsAnimationConfig
}

export default function CongratsAnimationDialog({
    open,
    onClose,
    tournamentId,
    name,
    config,
}: Props) {
    const { t } = useTranslation('admin')
    const dispatch = useDispatch<AppDispatch>()
    const [form, setForm] = useState<CongratsAnimationConfig>(DEFAULT_CONFIG)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (open) {
            setForm(config ? { ...DEFAULT_CONFIG, ...config } : DEFAULT_CONFIG)
        }
    }, [open, config])

    const typeLabel = (type: CongratsAnimationType) =>
        t(`congratsAnimation.types.${type}`)

    const updateRank = (index: number, changes: Partial<CongratsRankEntry>) => {
        setForm((prev) => ({
            ...prev,
            ranks: prev.ranks.map((entry, i) =>
                i === index ? { ...entry, ...changes } : entry
            ),
        }))
    }

    const addRank = () => {
        const nextRank = form.ranks.length
            ? Math.max(...form.ranks.map((r) => r.rank)) + 1
            : 1
        setForm((prev) => ({
            ...prev,
            ranks: [
                ...prev.ranks,
                {
                    rank: nextRank,
                    type: CongratsAnimationType.None,
                    title: '',
                    msg: '',
                },
            ],
        }))
    }

    const removeRank = (index: number) => {
        setForm((prev) => ({
            ...prev,
            ranks: prev.ranks.filter((_, i) => i !== index),
        }))
    }

    const onSave = async () => {
        setSaving(true)
        try {
            await dispatch(updateCongratsAnimationConfig(tournamentId, form))
            onClose()
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog
            classes={{ root: 'LB-CongratsAnimationDialog' }}
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogContent>
                <DialogTitle>
                    <IconButton onClick={onClose} className={'closeButton'}>
                        <CloseIcon />
                    </IconButton>
                    {t('congratsAnimation.title', { name })}
                </DialogTitle>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 20,
                        padding: '8px 0',
                    }}
                >
                    <FormControlLabel
                        control={
                            <Switch
                                checked={form.enabled}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        enabled: e.target.checked,
                                    }))
                                }
                            />
                        }
                        label={t('congratsAnimation.enabled')}
                    />

                    <FormControl style={{ maxWidth: 220 }}>
                        <InputLabel>
                            {t('congratsAnimation.language')}
                        </InputLabel>
                        <Select
                            label={t('congratsAnimation.language')}
                            value={form.lang}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    lang: e.target
                                        .value as CongratsAnimationConfig['lang'],
                                }))
                            }
                        >
                            <MenuItem value="he">
                                {t('congratsAnimation.langHe')}
                            </MenuItem>
                            <MenuItem value="en">
                                {t('congratsAnimation.langEn')}
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <div>
                        <h4 style={{ margin: '4px 0' }}>
                            {t('congratsAnimation.perRankTitle')}
                        </h4>
                        {form.ranks.map((entry, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    gap: 8,
                                    alignItems: 'flex-start',
                                    marginBottom: 12,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <TextField
                                    type="number"
                                    label={t('congratsAnimation.rank')}
                                    style={{ width: 80 }}
                                    inputProps={{ min: 1 }}
                                    value={entry.rank}
                                    onChange={(e) =>
                                        updateRank(index, {
                                            rank: Number(e.target.value),
                                        })
                                    }
                                />
                                <FormControl style={{ minWidth: 150 }}>
                                    <InputLabel>
                                        {t('congratsAnimation.type')}
                                    </InputLabel>
                                    <Select
                                        label={t('congratsAnimation.type')}
                                        value={entry.type}
                                        onChange={(e) =>
                                            updateRank(index, {
                                                type: e.target
                                                    .value as CongratsAnimationType,
                                            })
                                        }
                                    >
                                        {ANIM_TYPES.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {typeLabel(type)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label={t('congratsAnimation.contentTitle')}
                                    style={{ minWidth: 180, flex: 1 }}
                                    value={entry.title}
                                    onChange={(e) =>
                                        updateRank(index, {
                                            title: e.target.value,
                                        })
                                    }
                                />
                                <TextField
                                    label={t('congratsAnimation.message')}
                                    style={{ minWidth: 220, flex: 2 }}
                                    multiline
                                    value={entry.msg}
                                    onChange={(e) =>
                                        updateRank(index, {
                                            msg: e.target.value,
                                        })
                                    }
                                />
                                <IconButton
                                    aria-label="remove"
                                    onClick={() => removeRank(index)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        ))}
                        <Button variant="outlined" onClick={addRank}>
                            {t('congratsAnimation.addRank')}
                        </Button>
                    </div>

                    <div>
                        <h4 style={{ margin: '4px 0' }}>
                            {t('congratsAnimation.defaultEntry')}
                        </h4>
                        <div
                            style={{
                                display: 'flex',
                                gap: 8,
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                            }}
                        >
                            <FormControl style={{ minWidth: 150 }}>
                                <InputLabel>
                                    {t('congratsAnimation.type')}
                                </InputLabel>
                                <Select
                                    label={t('congratsAnimation.type')}
                                    value={form.default.type}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            default: {
                                                ...prev.default,
                                                type: e.target
                                                    .value as CongratsAnimationType,
                                            },
                                        }))
                                    }
                                >
                                    {ANIM_TYPES.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {typeLabel(type)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label={t('congratsAnimation.contentTitle')}
                                style={{ minWidth: 180, flex: 1 }}
                                value={form.default.title}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        default: {
                                            ...prev.default,
                                            title: e.target.value,
                                        },
                                    }))
                                }
                            />
                            <TextField
                                label={t('congratsAnimation.message')}
                                style={{ minWidth: 220, flex: 2 }}
                                multiline
                                value={form.default.msg}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        default: {
                                            ...prev.default,
                                            msg: e.target.value,
                                        },
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <div style={{ textAlign: 'end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onSave}
                            disabled={saving}
                        >
                            {t('congratsAnimation.save')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
