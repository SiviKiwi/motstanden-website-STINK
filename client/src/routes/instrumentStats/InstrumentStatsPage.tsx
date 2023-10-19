import { useQuery } from '@tanstack/react-query'
import { useTitle } from "../../hooks/useTitle"
import { PageContainer } from "../../layout/PageContainer"
import { fetchAsync } from "../../utils/fetchAsync"

export default function InstrumentStatsPage() {
    useTitle("Instrumentstatistikk")
    return (
        <PageContainer>
            <h1>Instrumentstatistikk</h1>
        </PageContainer>
    )
}

