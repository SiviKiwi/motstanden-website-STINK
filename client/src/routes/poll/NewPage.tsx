import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Checkbox, IconButton, MenuItem, Radio, Stack, TextField } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { NewPollWithOption, PollWithOption } from "common/interfaces";
import { isNullOrWhitespace } from "common/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "src/components/form/Form";
import { useTitle } from "src/hooks/useTitle";
import { pollListQueryKey } from "./Context";

const emptyPoll: NewPollWithOption = {
    title: "",
    type: "single",
    options: [
        { text: "" },
        { text: "" },
        { text: "" },
    ],
}

export default function NewPollPage() {
    useTitle("Ny avstemning");
    const navigate = useNavigate();
    const queryClient = useQueryClient()

    const onAbort = () => navigate("/avstemninger");

    const onSuccess = () => {
        queryClient.invalidateQueries(pollListQueryKey)
        navigate("/avstemninger");
    };

    return (
        <>
            <h1>Ny avstemning</h1>
            <UpsertPollForm
                initialValue={emptyPoll}
                postUrl="/api/polls/new"
                onAbortClick={onAbort}
                onPostSuccess={onSuccess} />
        </>
    );
}


// This may seem overly convoluted, ant that take would be correct!! :O
// I wrote it this way because I am trying to predict the future.
// In the future we may want to reuse this form for editing preexisting polls as well.
// This pattern is similar to what you will find in ../quotes and ../rumours
function UpsertPollForm({
    initialValue, 
    postUrl, 
    onAbortClick, 
    onPostSuccess,
}: {
    initialValue: NewPollWithOption | PollWithOption;
    postUrl: string;
    onAbortClick: VoidFunction;
    onPostSuccess: VoidFunction;
}) {
    const [newValue, setNewValue] = useState<NewPollWithOption | PollWithOption>(initialValue);

    const isValidData = () => {
        const isEmpty = isNullOrWhitespace(newValue.title);
        const isEqual = newValue.title.trim() === initialValue.title.trim() && 
                        newValue.type.trim() === initialValue.type.trim() &&
                        newValue.options.length === initialValue.options.length &&
                        newValue.options.every((o, i) => o.text.trim() === initialValue.options[i].text.trim());
        
        const correctType = newValue.type === "single" || 
                            newValue.type === "multiple";

        const hasOptions = newValue.options.length >= 2;

        const hasEmptyOption = newValue.options.some(o => isNullOrWhitespace(o.text))
        
        return !isEmpty && !isEqual && correctType && hasOptions && !hasEmptyOption;
    };

    const getSubmitData = () => {
        return { 
            ...newValue, 
            title: newValue.title.trim(),
            type: newValue.type.trim(),
            options: newValue.options.map(o => ({ ...o, text: o.text.trim() })),
        }
    };

    const disabled = !isValidData();

    return (
        <div style={{ maxWidth: "600px" }}>
            <Form
                value={getSubmitData}
                postUrl={postUrl}
                disabled={disabled}
                onAbortClick={_ => onAbortClick()}
                onPostSuccess={_ => onPostSuccess()}

            >
                <div>
                    <TextField
                        label="Spørsmål"
                        name="title"
                        type="text"
                        required
                        fullWidth
                        autoComplete="off"
                        value={newValue.title}
                        onChange={(e) => setNewValue({ ...newValue, title: e.target.value })}
                        sx={{ mb: 4 }}
                        />
                </div>
                <div>
                    <TextField 
                        select
                        label="Avstemningstype"
                        name="type"
                        required
                        fullWidth
                        autoComplete="off"
                        value={newValue.type}
                        onChange={(e) => setNewValue({ ...newValue, type: e.target.value === "multiple" ? "multiple" : "single" })}
                        sx={{ mb: 4 }}
                    >
                        <MenuItem value={"single"}>Enkeltvalg</MenuItem>
                        <MenuItem value={"multiple"}>Flervalg</MenuItem>
                    </TextField>
                </div>
                <div>
                    {newValue.options.map((option, index) => (
                        <Stack 
                            key={index} 
                            direction="row"
                            sx={{mb: 4}}
                        > 
                            { newValue.type === "single" ? (<Radio disabled />) : (<Checkbox disabled />)}
                            <TextField
                                label={`Alternativ ${index + 1}`}
                                name={`option-${index}`}
                                type="text"
                                required
                                fullWidth
                                autoComplete="off"
                                value={option.text}
                                onChange={(e) => {
                                    setNewValue( oldValues => {
                                        const newOptions = [...oldValues.options];
                                        newOptions[index] = { ...newOptions[index], text: e.target.value };
                                        return { ...oldValues, options: newOptions };
                                    })
                                }}
                                sx={{ mr: 1}}
                            />
                            <IconButton
                                style={{
                                    width: "min-content",
                                    height: "min-content",
                                    margin: "auto"
                                }}

                                onClick={() => setNewValue( oldValue => {
                                    const newOptions = [...oldValue.options];
                                    newOptions.splice(index, 1);
                                    return { ...oldValue, options: newOptions };
                                })}
                            >
                                <DeleteIcon color='error' />
                            </IconButton>
                        </Stack>
                    ))}
                </div>
                <div>
                    <Button 
                        sx={{ml: 5, mb: 2}}
                        variant="contained"
                        startIcon={<AddIcon/>}
                        onClick={() => setNewValue( oldValue => {
                            const newOptions = [...oldValue.options, { text: "" }];
                            return { ...oldValue, options: newOptions };
                        })}
                    >
                        Alternativ
                    </Button>
                </div>
            </Form>
        </div>
    );
}