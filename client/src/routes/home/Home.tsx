import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Link from "@mui/material/Link"
import { Link as RouterLink } from "react-router-dom"
import Paper from "@mui/material/Paper"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { EventData, Quote, Rumour } from "common/interfaces"
import React, { useEffect } from "react"
import { TitleCard } from "src/components/TitleCard"
import { fetchAsync } from "src/utils/fetchAsync"
import { useAuth } from "../../context/Authentication"
import { useTitle } from "../../hooks/useTitle"
import { PageContainer } from "../../layout/PageContainer"
import { buildEventItemUrl } from "../event/Context"
import { QuoteList, ListSkeleton as QuotesListSkeleton } from "../quotes/QuotesPage"
import { RumourList, ListSkeleton as RumourListSkeleton } from "../rumour/RumourPage"
import dayjs from "dayjs"
import Skeleton from "@mui/material/Skeleton"
import FacebookIcon from "@mui/icons-material/Facebook"


export default function Home(){
    useTitle("Hjem")
    const user = useAuth().user!
    return (
        <PageContainer>
            <h1>Hjem</h1>
            <p style={{marginBottom: "40px"}}>Velkommen {user.firstName}!</p>
            <Grid container spacing={4} >
                <ItemOfTheDay 
                    title="Arrangement" 
                    fetchUrl="/api/events/upcoming?limit=5" 
                    renderSkeleton={<EventListSkeleton length={5}/>}
                    renderItems={RenderEventList}
                />
                <NoItem/>
                <ItemOfTheDay 
                    title="Nyeste sitater" 
                    fetchUrl="/api/quotes?limit=3" 
                    renderSkeleton={<QuotesListSkeleton length={3}/>}
                    renderItems={RenderQuotesList}
                />
                <ItemOfTheDay
                    title="Nyeste rykter"
                    fetchUrl="/api/rumours?limit=3"
                    renderSkeleton={<RumourListSkeleton length={3}/>}
                    renderItems={RenderRumourList}
                />
                <ItemOfTheDay 
                    title="Dagens sitater" 
                    fetchUrl="/api/quotes/daily-quotes" 
                    renderSkeleton={<QuotesListSkeleton length={3}/>}
                    renderItems={RenderQuotesList}
                />
                <ItemOfTheDay
                    title="Dagens rykter"
                    fetchUrl="/api/rumours/daily-rumour"
                    renderSkeleton={<RumourListSkeleton length={3}/>}
                    renderItems={RenderRumourList}
                />
                <InfoItem
                    title="Nyttige lenker"
                />
            </Grid>
        </PageContainer>
    )
}

type RenderItemProps<T> = {
    items: T[], 
    refetchItems: VoidFunction
}

function RenderEventList(props: RenderItemProps<EventData> ){
    return (
        <ul style={{
            listStyle: "none", 
            paddingLeft: "10px"
            }}
        >
            {props.items.map( (event, index) => ( 
                <li key={`${index} ${event.title}}`} style={{marginBottom: "15px"}}>
                    <Link 
                        color="secondary" 
                        component={RouterLink}
                        to={buildEventItemUrl(event)}
                        underline="hover"
                        >
                            {event.title}
                    </Link>              
                    <div style={{
                            marginLeft: "15px",
                            opacity: 0.65,
                            fontSize: "small"
                        }} 
                    > 
                        {dayjs(event.startDateTime).format("dddd D. MMM k[l]: HH:mm")}
                    </div>                
                </li>
            ))}
        </ul>
    )
}

function EventListSkeleton( {length}: {length: number}){
    return(
        <>
            <ul style={{
                listStyle: "none", 
                paddingLeft: "10px"
            }}
            >
                { Array(length).fill(1).map( (_, i) => (
                    <li key={i} style={{marginBottom: "15px"}}>
                        <div>
                            <Skeleton style={{width: "125px", height: "2em"}} />
                        </div>
                        <div>
                            <Skeleton style={{marginLeft: "15px", width: "155px"}} />                        
                        </div>                
                    </li>
                ))}
            </ul>
        </>
    )    
}

function RenderRumourList( props: RenderItemProps<Rumour>) {
    return (
        <>
            <div style={{
                opacity: 0.6, 
                fontSize: "small", 
                marginBottom: "-10px", 
                marginLeft: "5px"
            }}>
                <em>
                    <strong>
                        Har du hørt at...
                    </strong>
                </em>
            </div>
            <RumourList 
                rumours={props.items}
                onItemChanged={props.refetchItems}        
                />
        </>
    )
}

function RenderQuotesList(props: RenderItemProps<Quote>) {
    return (
        <QuoteList 
            quotes={props.items} 
            onItemChanged={props.refetchItems} />
    )
}

interface InfoItem {
    link: string,
    title: string,
    subtitle: string,
    icon: React.ReactNode
}

function RenderInfo() {

    const items: InfoItem[] = [{
            link:"https://www.facebook.com/groups/399149784137861",
            title: "Facebook medlemsgruppe",
            subtitle: "Facebookgruppe",
            icon: <></>
        }, {
            link:"https://www.facebook.com/groups/1496116444049224",
            title:"NASH",
            subtitle:"Facebookgruppe for alle studentorchesterne i Norge",
            icon: <></>
        }, {
            link:"https://www.facebook.com/groups/824108334919023",
            title:"SOT",
            subtitle:"Facebookgruppe for alle studentorchesterne i Trondheim",
            icon: <></>
        }, {
            link:"https://www.messenger.com/t/1795481677236473",
            title:"Facebook chat",
            subtitle:"Spør noen i motstanden for å bli med",
            icon: <></>
        }, {
            link:"https://www.snapchat.com/invite/NWM3NGQ4MjktODBlYS0zNTczLTk1MDctOWRkZTYyMWU5OGZl/MTM5ZDdmMmItMmVmMC1mMDRlLTM3NTUtMTRiMTA2ZjkyZDBm",
            title:"Snapchat",
            subtitle:"",
            icon: <></>
        }, {
            link:"https://discord.gg/Np3uAfS28V",
            title:"Discord",
            subtitle:"",
            icon: <></>
        }, {
            link:"https://www.instagram.com/denohmskemotstanden/",
            title:"Instagram",
            subtitle:"",
            icon: <></>
        }, {
            link:"https://www.tiktok.com/@denohmskemotstanden",
            title:"Tiktok",
            subtitle:"",
            icon: <></>
        }
    ]
    

    return (
        <ul style={{
            listStyle: "none", 
            paddingLeft: "10px"
        }}
        >
            {items.map( (info, index) => (
                <>
                    <Link
                        color="secondary"
                        href={info.link}
                        underline="hover"
                        >
                            {info.title}
                    </Link>
                    <div style={{
                        marginBottom: "20px",
                        paddingLeft: "10px",
                        opacity: 0.65,
                        fontSize: "small",
                    }}>
                        {info.subtitle}
                    </div>
                </>
            ))}
        </ul>
    )
}

function NoItem(){
    return (
        <Grid 
            item 
            xs={12} sm={12} md={6} 
            display={{xs: "none", xm: "none", md: "block"}}/>
    )
}



function InfoItem({
    title
}: {
    title: string
}) {
    return (
        <Grid item xs={12} sm={12} md={6} >
            <TitleCard 
                title={title}
                sx={{maxWidth: "600px", height: "100%"}}
                >
                <RenderInfo />
            </TitleCard>
        </Grid>
    )
}


function ItemOfTheDay<T>({
    title, 
    fetchUrl, 
    renderSkeleton,
    renderItems
}: {
    title: string, 
    fetchUrl: string, 
    renderSkeleton: React.ReactElement,
    renderItems: (props: RenderItemProps<T>) => React.ReactElement,
} ){
    return (
        <Grid item xs={12} sm={12} md={6} >
            <TitleCard 
                title={title} 
                sx={{maxWidth: "600px", height: "100%"}}>
                <ItemLoader<T>
                    queryKey={ [`${title}: ${fetchUrl}`] } 
                    fetchUrl={fetchUrl} 
                    renderSkeleton={renderSkeleton}
                    renderItems={renderItems}
                    />
            </TitleCard>
        </Grid>
    )
}

function ItemLoader<T>({
    queryKey, 
    fetchUrl, 
    renderSkeleton,
    renderItems
}: {
    queryKey: any[], 
    fetchUrl: string, 
    renderSkeleton: React.ReactElement,
    renderItems: (props: RenderItemProps<T>) => React.ReactElement
}) {

    
    const queryClient = useQueryClient()
    const onRefetchItems = () => queryClient.invalidateQueries(queryKey)

    const {isLoading, isError, data, error} = useQuery<T[]>(queryKey, () => fetchAsync<T[]>(fetchUrl) )

    if (isLoading) {
        return (
            <>
                {renderSkeleton}
            </>
        )
    }
    
    if (isError) {
        return <div style={{minHeight: "100px"}}>{`${error}`}</div>
    }

    return (
        <>
            {renderItems({items: data, refetchItems: onRefetchItems})}
        </>
    )
}
