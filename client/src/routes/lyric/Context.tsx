import { useQuery } from "@tanstack/react-query"
import { SongLyric, StrippedSongLyric } from "common/interfaces"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { useAuth } from "src/context/Authentication"
import { TabbedPageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"
import { strToPrettyUrl } from "src/utils/strToPrettyUrl"

export const lyricContextQueryKey = ["AllLyricData"]

export function LyricContext() {
    const { isLoading, isError, data, error } = useQuery<StrippedSongLyric[]>(lyricContextQueryKey, () => fetchAsync<StrippedSongLyric[]>("/api/song-lyric/simple-list"))

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

function PageContainer( {children}: {children?: React.ReactNode} ) {
    const isLoggedIn = useAuth().user !== null

    let tabItems = [
        { to: "/studenttraller/populaere", label: "Populære" },
        { to: "/studenttraller/alle", label: "Alle" },
    ]

    if(isLoggedIn) {
        tabItems.push({ to: "/studenttraller/ny", label: "ny" })
    }

    return (
        <TabbedPageContainer
            tabItems={tabItems}
            matchChildPath={true}
        >
            {children}
        </TabbedPageContainer>
    )
}

export function LyricItemContext() {
    const params = useParams();
    const urlTitle = params.title;
    
    const allLyrics = useOutletContext<StrippedSongLyric[]>()
    const lyricId = allLyrics.find(item => strToPrettyUrl(item.title) === urlTitle)?.id

    if(!lyricId) 
        return <Navigate to="/studenttraller" replace={true} />

    return <LyricItemLoader id={lyricId} />
}

export const getLyricItemContextQueryKey = (id: number) => ["LyricItem", id]

export function LyricItemLoader( {id}: {id: number}){
    const allLyrics = useOutletContext<StrippedSongLyric[]>()

    const isPublic = useAuth().user === null
    const url = `/api/${isPublic ? "public" : "private"}/song-lyric/${id}`

    const { isLoading, isError, data } = useQuery<SongLyric>(getLyricItemContextQueryKey(id), () => fetchAsync<SongLyric>(url))

    if (isLoading) {
        return <></>
    }

    if (isError) {
        return <Navigate to="/studenttraller/populaere" replace={true} />
    }

    const context = [allLyrics, data]

    return (
        <Outlet context={context} />
    )
}

export function useLyricContext() {
    const context = useOutletContext<StrippedSongLyric[]>()
    return context
}

export function useLyricItemContext() {
    const context = useOutletContext<[StrippedSongLyric[], SongLyric]>()
    return context
}

export function buildLyricItemUrl(title: string, isPopular: boolean) {
    return `/studenttraller/${isPopular ? "populaere" : "alle"}/${strToPrettyUrl(title)}`

}