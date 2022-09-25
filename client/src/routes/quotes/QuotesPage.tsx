import React, { useState } from "react"
import { useTitle } from "../../hooks/useTitle"
import { NewQuote, Quote as QuoteData } from "common/interfaces"
import dayjs from "dayjs"
import { useOutletContext } from "react-router-dom"
import Stack from "@mui/material/Stack"
import { EditOrDeleteMenu } from "src/components/menu/EditOrDeleteMenu"
import { useAuth } from "src/context/Authentication"
import { hasGroupAccess } from "common/utils"
import { UserGroup } from "common/enums"
import { postJson } from "src/utils/postJson"
import Divider from "@mui/material/Divider"
import { Form } from "src/components/form/Form"
import { UpsertQuoteInputs } from "./NewPage"
import { isNullOrWhitespace } from "src/utils/isNullOrWhitespace"
import { useContextInvalidator } from "./Context"
import { Skeleton } from "@mui/material"

export default function QuotesPage(){
    useTitle("Sitater")
    const data = useOutletContext<QuoteData[]>()
    const contextInvalidator = useContextInvalidator()

    const onItemChanged = () => contextInvalidator()

    return (
        <>
            <h1>Sitater</h1>
            <QuoteList quotes={data} onItemChanged={onItemChanged}/>
        </>
    )
}

export function QuoteList( {quotes, onItemChanged}: {quotes: QuoteData[], onItemChanged?: VoidFunction } ){
    return (
        <ul style={{ 
                paddingLeft: "5px", 
                listStyleType: "none" 
        }}>
            { quotes.map( item => <QuoteItem key={item.id} quoteData={item} onItemChanged={onItemChanged}/>)}
        </ul>
    )
}

function QuoteItem( {quoteData, onItemChanged}: {quoteData: QuoteData, onItemChanged?: VoidFunction }){
    const [isEditing, setIsEditing] = useState(false)

    const [prevData, setPrevData] = useState(quoteData) 
    const [isChanging, setIsChanging] = useState(false)

    const onEditClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        setPrevData(quoteData)
        setIsEditing(true)
    }
    
    const onEditAbort = () => {
        setIsEditing(false)
    }
    
    const onEditSuccess = () => {
        setIsEditing(false)
        setIsChanging(true)
        onItemChanged && onItemChanged()
    }

    if(isChanging) {
        if(prevData.utterer === quoteData.utterer && prevData.quote === quoteData.quote) {
            return <QuoteSkeleton/>
        }
        setPrevData(quoteData)
        setIsChanging(false)
    }

    if(isEditing) {
        return <EditableQuoteItem quoteData={quoteData} onEditAbort={onEditAbort} onEditSuccess={onEditSuccess}/>
    }

    return <ReadOnlyQuoteItem quoteData={quoteData} onEditClick={onEditClick} onDeleteSuccess={onItemChanged}/>
}

export function QuoteSkeleton() {
    return (
        <>
            <div>
                <Skeleton 
                    style={{
                        maxWidth: "700px", 
                        // marginRight: "50px", 
                        marginBottom: "-10px",
                        height: "6em"
                    }}/>
            </div>
            <div style={{marginBottom: "35px"}}>
                <Skeleton 
                    style={{
                        maxWidth: "650px", 
                        marginLeft: "50px", 
                        height: "2em"
                    }}
                />
            </div>
        </>
    )
}

function ReadOnlyQuoteItem( {
    quoteData, 
    onEditClick, 
    onDeleteSuccess
}: {
    quoteData: QuoteData, 
    onEditClick: React.MouseEventHandler<HTMLLIElement>,
    onDeleteSuccess?: VoidFunction
}){

    const [isHighlighted, setIsHighlighted] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)

    const onMouseEnter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setIsHighlighted(true)
    }

    const onMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsHighlighted(false)
    }

    const onMenuOpen = () => {
        setIsHighlighted(true)
    }

    const onMenuClose = () => {
        setIsHighlighted(false)
    }

    const onDeleting = () => {
        setIsDisabled(true)
    }

    const onDeleteFailure = () => {
        setIsDisabled(false)
    }

    const user = useAuth().user!
    const hasEditPrivilege = user.userId === quoteData.userId || hasGroupAccess(user, UserGroup.Administrator) 

    return ( 
        <li style={{ marginBottom: "25px", maxWidth: "700px"}}>
            <Stack 
                direction="row" 
                justifyContent="space-between" 
                bgcolor={isHighlighted || isDisabled ? "action.hover" : "transparent"}
                pl={1}
                ml={-1}
                style={{
                    borderRadius: "5px", 
                    opacity: isDisabled ? 0.4 : 1
                }}
                >
                <div style={{marginBlock: "10px"}}>
                    <NewlineText text={quoteData.quote}/>
                    <div style={{
                        marginLeft: "20px", 
                        marginTop: "2px", 
                        opacity: 0.6, 
                        fontSize: "small", 
                        fontWeight: "bold",
                        display: "flex",
                        gap: "1ch"
                    }}>
                        <div>
                            –
                        </div>
                        <div>
                            {`${quoteData.utterer}, ${dayjs(quoteData.createdAt).utc(true).local().format("D MMMM YYYY")}`}
                        </div>
                    </div>
                </div>
                {hasEditPrivilege && (
                    <div>
                        <ItemMenu 
                            quoteData={quoteData} 
                            disabled={isDisabled}
                            onDeleting={onDeleting}
                            onDeleteFailure={onDeleteFailure}
                            onEditClick={onEditClick}
                            onMouseEnter={onMouseEnter} 
                            onMouseLeave={onMouseLeave} 
                            onMenuOpen={onMenuOpen} 
                            onMenuClose={onMenuClose}
                            onDeleteSuccess={onDeleteSuccess}/>
                    </div>
                )}
            </Stack>
        </li>
    )
}   


function ItemMenu( {
    quoteData,
    onEditClick,
    onMouseEnter,
    onMouseLeave,
    onMenuOpen,
    onMenuClose,
    onDeleting,
    onDeleteFailure,
    onDeleteSuccess,
    disabled
}: {
    quoteData: QuoteData,
    onEditClick: React.MouseEventHandler<HTMLLIElement>,
    onMouseEnter?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement> | undefined,
    onMenuOpen?: VoidFunction,
    onMenuClose?: VoidFunction,
    onDeleting?: VoidFunction,
    onDeleteFailure?: VoidFunction,
    onDeleteSuccess?: VoidFunction
    disabled?: boolean
}) {

    const onDeleteClick = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        onDeleting && onDeleting()
        const response = await postJson(
            "/api/quotes/delete", 
            {id: quoteData.id},
            {
                alertOnFailure: true,
                confirmText: `Vil du permanent slette sitatet?`
            }
        )
        if (!response?.ok){
            onDeleteFailure && onDeleteFailure()
        }
        if(response?.ok){
            onDeleteSuccess && onDeleteSuccess()
        }
    }

    return (
        <div onMouseLeave={onMouseLeave}>
            <EditOrDeleteMenu 
                disabled={disabled}
                onEditClick={onEditClick} 
                onDeleteClick={onDeleteClick} 
                onMouseEnter={onMouseEnter} 
                onMenuOpen={onMenuOpen}
                onMenuClose={onMenuClose}
                />
        </div>
    )
}

function NewlineText({ text }: {text: string}) {
    const newText = text.split('\n').map( (str, i) => <p key={i} style={{margin: 0}}>{str}</p>);
    return <span>{newText}</span>
}


function EditableQuoteItem( {
    quoteData, 
    onEditAbort,
    onEditSuccess
}: {
    quoteData: QuoteData, 
    onEditAbort: VoidFunction,
    onEditSuccess: VoidFunction
}){
    const [newData, setNewData] = useState(quoteData)

    const onChange = (newVal: NewQuote) => setNewData({...quoteData, ...newVal})

    const validateData = () => {
        const isEmpty = isNullOrWhitespace(newData.quote) || isNullOrWhitespace(newData.utterer)
        const isEqual = newData.quote.trim() === quoteData.quote.trim() && newData.utterer.trim() === quoteData.utterer.trim()
        return !isEmpty && !isEqual 
    }

    const disabled = !validateData()
    return ( 
        <li style={{maxWidth: "700px"}}>
            <Divider sx={{mb: 4}}/>
            <Form 
                value={newData}  
                postUrl={"/api/quotes/update"}
                disabled={disabled}
                onAbortClick={() => onEditAbort()}
                onPostSuccess={() => onEditSuccess()}
                >
                <div style={{marginBottom: "-2em"}}>
                    <UpsertQuoteInputs 
                        quoteData={newData} 
                        onChange={onChange}
                        size="small"/>
                </div>
            </Form>
        </li>
    )
}