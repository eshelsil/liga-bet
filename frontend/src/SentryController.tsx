import React, { ReactNode, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { useTranslation } from "react-i18next";
import { cn } from "./utils";
import { Button } from "@mui/material";





function UnexpectedError(){
    const { t } = useTranslation('common');
    return (
        <div className={cn("fixed h-full w-full px-6 py-12 bg-black/50 text-center")}>
            <h2 className={cn("text-white text-center")}>{t('unexpectedError.title')}</h2>
            <h4 className={cn("text-white mt-10 text-center")}>{t('unexpectedError.description')}</h4>
            <Button size="large" variant="contained" style={{marginTop: 60}} onClick={()=>window.location.reload()}>
                {t('unexpectedError.refresh')}
            </Button>
        </div>
    )
}

function SentryController({children}: {children: ReactNode}) {
    useEffect(()=>{
        Sentry.init({
            dsn: "https://e78e59b523e122101ff066b055b09c30@o4506902709600256.ingest.us.sentry.io/4506902712877056",
            integrations: [],
            environment: process.env.NODE_ENV ?? 'development',
        });
    },[])

    return (
        <Sentry.ErrorBoundary fallback={<UnexpectedError />}>
            {children}
        </Sentry.ErrorBoundary>
    )
}

export default SentryController;