import React, { useEffect, useRef } from 'react'


interface Props {
    edit: boolean
    setEdit: (val: boolean) => void
}

function useCancelEdit({
    edit,
    setEdit,
}: Props) {
    const lastEditTimestamp = useRef<number>()

    useEffect(() => {
        if (edit) {
            lastEditTimestamp.current = Number(new Date())
        }
    }, [edit])

    return {
        // addCancelEditCallback: <T extends Parameters<any>>(action: (...args: T) => Promise<any>): (...args: T) => Promise<any> => {
        //     return async (...args) => {
        //         const ts = lastEditTimestamp.current
        //         await action(...args)
        //             .then(() => {
        //                 if (ts === lastEditTimestamp.current) {
        //                     setEdit(false)
        //                 }
        //             })
        //     }

        // },
        getLastEditTs: () => lastEditTimestamp.current,
        cancelEdit: (ts: number) => {
            if (ts === lastEditTimestamp.current) {
                setEdit(false)
            }
        },
    }
}

export default useCancelEdit
