import { useQuery } from '@tanstack/react-query'
import { UrlList, UrlListItem } from "../../components/UrlList"
import { useTitle } from "../../hooks/useTitle"
import { PageContainer } from "../../layout/PageContainer"
import { fetchAsync } from "../../utils/fetchAsync"

export default function DocumentsPage() {
    useTitle("Dokumenter")
    return (
        <PageContainer>
            <h1>Dokumenter</h1>
            <DocumentList />
        </PageContainer>
    )
}

function DocumentList() {

    const { isLoading, isError, data, error } = useQuery<Document[]>(["FetchDocuments"], () => fetchAsync<Document[]>("/api/documents"))

    if (isLoading) {
        return <PageContainer><div /></PageContainer>
    }

    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>
    }
    return (
        <UrlList>
            <>
                <UrlListItem
                    externalRoute
                    to="https://statutter.motstanden.no" 
                    type="application/pdf"
                    text="Motstandens Statutter"/>
                <UrlListItem
                    externalRoute
                    to="https://manifest.motstanden.no" 
                    type="application/pdf"
                    text="Motstandens Propaganda 2023"/>
                {data.map(doc => 
                    <UrlListItem 
                        key={doc.url} 
                        to={`/${doc.url}`} 
                        text={doc.title} 
                        type="application/pdf" 
                        reloadDocument />)}
            </>
        </UrlList>
    )
}

interface Document {
    title: string,
    url: string
}
