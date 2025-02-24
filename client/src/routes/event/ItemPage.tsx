import {
    Avatar,
    Divider,
    Link,
    MenuItem,
    Paper,
    Stack,
    TextField
} from "@mui/material";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { ParticipationStatus } from "common/enums";
import { EventData, Participant, UpsertParticipant } from "common/interfaces";
import { isNullOrWhitespace } from "common/utils";
import { useState } from "react";
import { Link as RouterLink, useOutletContext } from "react-router-dom";
import { AuthorInfo } from "src/components/AuthorInfo";
import { TitleCard } from "src/components/TitleCard";
import { useAuth } from "src/context/Authentication";
import { useTitle } from "src/hooks/useTitle";
import { fetchAsync } from "src/utils/fetchAsync";
import { postJson } from "src/utils/postJson";
import { MarkDownRenderer } from "../../components/MarkDownEditor";
import { ItemMenu } from "./components/ItemMenu";
import { KeyInfo } from "./components/KeyInfo";

export default function ItemPage() {
    const event = useOutletContext<EventData>();
    useTitle(event.title)
    return (
        <div style={{ maxWidth: "900px" }}>

            <Paper elevation={6} sx={{ p: 2, pt: 0, mt: 4 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    marginTop={3}
                    paddingTop={2}
                >
                    <h1 style={{ margin: 0 }}>{event.title}</h1>
                    <ItemMenu event={event} iconOrientation="vertical" />
                </Stack>
                <Divider />
                <AuthorInfo 
                    createdAt={event.createdAt}
                    createdByUserId={event.createdByUserId}
                    createdByUserName={event.createdByName}
                    updatedAt={event.updatedAt}
                    updatedByUserId={event.updatedByUserId}
                    updatedByUserName={event.updatedByName}
                />
                <KeyInfo
                    keyInfo={event.keyInfo}
                    startTime={event.startDateTime}
                    endTime={event.endDateTime}
                    style={{
                        margin: "0px",
                        marginTop: "20px",
                        marginBottom: "20px"
                    }}
                />
                <MarkDownRenderer value={event.description} />
            </Paper>
            <Divider sx={{ my: 4 }} />
            <ParticipationContainer eventId={event.eventId} />
        </div>
    );
}

function ParticipationContainer({ eventId }: { eventId: number }) {
    const queryKey = ["FetchEvenParticipants", eventId]
    const { isLoading, isError, data, error } = useQuery<Participant[]>(queryKey, () => fetchAsync<Participant[]>(`/api/event-participants?eventId=${eventId}`))
    const user = useAuth().user!

    if (isLoading) {
        return <></>
    }

    if (isError) {
        return <div>{`${error}`}</div>
    }

    const currentUserStatus = data.find(participant => participant.id === user.id)

    const attending = data.filter(user => user.status === ParticipationStatus.Attending)
    const maybeAttending = data.filter(user => user.status === ParticipationStatus.Maybe)
    const notAttending = data.filter(user => user.status === ParticipationStatus.NotAttending)

    return (
        <>
            <AttendingForm eventId={eventId} queryKey={queryKey} user={currentUserStatus} />
            <AttendingList title="Deltar" items={attending} />
            <AttendingList title="Deltar kanskje" items={maybeAttending} />
            <AttendingList title="Deltar ikke" items={notAttending} />
        </>
    )
}

function AttendingForm({ eventId, queryKey, user }: { eventId: number, queryKey: QueryKey, user?: Participant }) {
    const attendingStatus = user?.status ?? ParticipationStatus.Unknown
    const [isSubmitting, setIsSubmitting] = useState(false)
    const queryClient = useQueryClient()

    const changeHandler = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsSubmitting(true)
        const newVal: UpsertParticipant = {
            eventId: eventId, 
            participationStatus: e.target.value as ParticipationStatus 
        }
        const response = await postJson("/api/event-participants/upsert", newVal, { alertOnFailure: true })

        if (response && response.ok) {
            await queryClient.invalidateQueries(queryKey)
        }
        setIsSubmitting(false)
    }

    return (
        <div style={{ maxWidth: "450px" }}>
            <Paper sx={{ py: 4, px: 4 }} elevation={6} >
                <TextField
                    select
                    label="Min status"
                    value={attendingStatus}
                    style={{ width: "100%" }}
                    onChange={changeHandler}
                    disabled={isSubmitting}
                    helperText={attendingStatus === ParticipationStatus.Unknown ? "Jeg vil ikke svare..." : `Jeg ${attendingStatus.toLowerCase()} på arrangementet...`}
                    FormHelperTextProps={{ style: { opacity: 0.7 } }}
                >
                    <MenuItem value={ParticipationStatus.Unknown}>——————</MenuItem>
                    <MenuItem value={ParticipationStatus.Attending}>{`${ParticipationStatus.Attending}`}</MenuItem>
                    <MenuItem value={ParticipationStatus.Maybe}>{`${ParticipationStatus.Maybe}`}</MenuItem>
                    <MenuItem value={ParticipationStatus.NotAttending}>{`${ParticipationStatus.NotAttending}`}</MenuItem>
                </TextField>
            </Paper>
        </div>
    )
}

function AttendingList({ title, items }: { title: string, items: Participant[] }) {
    if (items.length === 0) {
        return <></>
    }
    return (
        <TitleCard title={title} sx={{ my: 6 }}>
            {items.map((user, index) => (
                <Stack
                    key={user.id}
                    direction="row"
                    alignItems="center"
                    sx={{ py: 1, pl: 1 }}
                    spacing={2}
                    borderRadius="7px"
                    bgcolor={index % 2 === 1 ? "action.hover" : "transparent"}
                >
                    <Avatar>{user.firstName[0] + user.lastName[0]}</Avatar>
                    <Link
                        color="secondary"
                        component={RouterLink}
                        to={`/medlem/${user.id}`}
                        underline="hover"
                    >
                        {`${user.firstName} ${isNullOrWhitespace(user.middleName) ? user.lastName : user.middleName + " " + user.lastName}`}
                    </Link>
                </Stack>
            )
            )}
        </TitleCard>
    )
}