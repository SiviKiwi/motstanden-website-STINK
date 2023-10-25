import { useQuery } from "@tanstack/react-query"
import { InstrumentStat } from "common/interfaces"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { PageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"

export const statContextQueryKey = ["AllInstrumentStatData"]

export function InstrumentStatsContext() {
    const { isLoading, isError, data, error } = useQuery<InstrumentStat[]>(statContextQueryKey, () => fetchAsync<InstrumentStat[]>("/api/instrument-stats"))

    if (isLoading) {
        return <PageContainer/>
    }

    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>
    }
    return (
        <PageContainer>
            <Outlet context={data} />
        </PageContainer>
    )
}


