import { Link, Stack, Tab, Tabs, TextField, Theme, useMediaQuery } from "@mui/material"
import { isNullOrWhitespace } from "common/utils"
import { useState } from "react"
import Markdown from "react-markdown"
import remarkGfm from 'remark-gfm'
import { HelpButton } from "src/components/HelpButton"

interface MarkDownEditorProps {
    value?: string,
    onChange?: ( value: string ) => void
    placeholder?: string
    required?: boolean,
    minRows?: number
    previewPlaceholder?: string
}

export function MarkDownEditor( props: MarkDownEditorProps) {

    const [isPreview, setIsPreview] = useState(false)

    return (
        <div>
            <div style={{ marginBottom: "-1.5px" }}>
                <EditorTabs 
                    isPreview={isPreview}
                    onWriteClick={() => setIsPreview(false)}
                    onPreviewClick={() => setIsPreview(true)}
                />
            </div>

            <ContentPicker 
                {...props} 
                isPreview={isPreview}
            />
        </div>
    )
}

function EditorTabs( {
    isPreview, 
    onWriteClick,
    onPreviewClick,
}: {
    isPreview: boolean, 
    onWriteClick: () => void,
    onPreviewClick: () => void
}) {

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const isTinyScreen = useMediaQuery("(max-width: 360px)")

    const selectedTabStyle: React.CSSProperties = {
        borderTop: "1px",
        borderLeft: "1px",
        borderRight: "1px",
        borderStyle: "solid",
        borderColor: "gray",
        borderRadius: "4px",
    }

    let infoButtonStyle: React.CSSProperties 
    let infoButtonSize: "small" | "medium" | "large"
    if(isTinyScreen) {
        infoButtonSize = "small"
        infoButtonStyle = {
            position: "absolute",
            bottom: "-28px",
            right: "-1px",
            zIndex: 1,
            padding: "5px",
        }
    } else if (isSmallScreen) {
        infoButtonSize = "medium"
        infoButtonStyle = {
            position: "absolute",
            bottom: "-34px",
            right: "0px",
            zIndex: 1,
            padding: "5px",
        }
    } else {
        infoButtonSize = "large"
        infoButtonStyle = {
            position: "absolute",
            top: "5px",
            right: "-9px",
            padding: "5px",
        }
    }

    return (
            <div style={{position: "relative"}}>
                <Tabs 
                    value={isPreview ? 1 : 0}
                    textColor="secondary"
                    indicatorColor="secondary"
                    variant={isSmallScreen ? "fullWidth" : "standard"}
                >
                    <Tab
                        label="Skriv"
                        value={0}
                        onClick={onWriteClick}
                        style={isPreview ? {} : selectedTabStyle}
                    />
                    <Tab
                        label="Forhåndsvis"
                        value={1}
                        onClick={onPreviewClick}
                        style={isPreview ? selectedTabStyle : {}}
                    />
                </Tabs>
                {!isPreview && 
                    <InfoButton 
                        style={infoButtonStyle}
                        fontSize={infoButtonSize}
                    />
                }   
            </div>
    )
}

function InfoButton({ fontSize, style }: {fontSize?: "small" | "medium" | "large", style?: React.CSSProperties }) {
    return (
        <HelpButton fontSize={fontSize} style={style}>
            <div style={{ margin: "10px", maxWidth: "280px" }}>
                <h2>MarkDown</h2>
                <p>
                    <p>
                        Dette feltet støtter det meste av MarkDown.
                    </p>
                    <p>
                        MarkDown er en enkel måte å formatere tekst på. 
                    </p>
                    <p>
                        <Link 
                            href="https://www.markdownguide.org/cheat-sheet/" 
                            target="_blank" 
                            rel="noreferrer"
                            color="secondary"
                            underline="hover">
                            Her er en kort oversikt over MarkDown-syntaksen.
                        </Link>
                    </p>
                </p>
            </div>
        </HelpButton>
    )
}


interface ContentPickerProps extends MarkDownEditorProps {
    isPreview: boolean
}

function ContentPicker(props: ContentPickerProps){
    const {isPreview, ...mdProps} = props
    return isPreview 
        ? <MarkDownReader value={props.value} placeholder={props.previewPlaceholder}/> 
        : <MarkDownWriter {...mdProps}/>
}

function MarkDownWriter( props: MarkDownEditorProps ) {
    const { value, onChange, placeholder, required, minRows } = props

    const onValueChange = ( e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
        if(onChange !== undefined){
            onChange(e.target.value)
        }
    }

    return (
        <div>
            <TextField 
                multiline
                placeholder={placeholder}
                variant="outlined"
                required={required}
                fullWidth
                type="text"
                autoComplete="off"
                color="secondary"
                value={value}
                onChange={onValueChange}
                minRows={minRows}
            />
        </div>
    )
}

export function MarkDownReader( {value, placeholder}: {value?: string, placeholder?: string}){

    const emptyValue = isNullOrWhitespace(value)
    const showPlaceHolder = emptyValue && !isNullOrWhitespace(placeholder)
    const showMarkdown = !emptyValue && !showPlaceHolder

    return (
        <div style={{
            paddingBlock: "0px",
            paddingInline: "14px",
            borderRadius: "4px",
            minHeight: "155px"
        }}>
            {showPlaceHolder && (
                <div style={{
                    opacity: 0.5,
                    marginTop: "15px",
                }}>
                    {placeholder}
                </div>
            )}

            {showMarkdown && (
                <Markdown remarkPlugins={[remarkGfm]}>
                    {enforceLinebreaks(value)}
                </Markdown>
            )}

        </div>
    )
}

export function enforceLinebreaks( value?: string) {
    if(value === undefined)
        return undefined

    return value.replace(/(\r\n|\n|\r)/gm, "  \n") ?? "" // Add two spaces to end of line to force linebreak
}