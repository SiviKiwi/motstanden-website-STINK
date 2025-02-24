
import { Theme, useMediaQuery } from "@mui/material";
import { KeyValuePair } from "common/interfaces";
import { formatDateTimeInterval } from "common/utils/dateTime";
import dayjs from "dayjs";
import React from "react";

export function KeyInfo({
    keyInfo,
    startTime,
    endTime,
    style
}: {
    keyInfo: KeyValuePair<string, string>[],
    startTime: string           // yyyy-mm-dd hh:mm:ss
    endTime?: string | null     // yyyy-mm-dd hh:mm:ss
    style?: React.CSSProperties
}) {
    const localStartTime = dayjs(startTime).utc(true).local()
    const localEndTime = endTime ? dayjs(endTime).utc(true).local()  : null
    return (
        <KeyValueList
            style={style}
            items={[
                {
                    key: "Tid:",
                    value: formatDateTimeInterval(localStartTime, localEndTime)
                },
                ...keyInfo
            ]}
        />
    )
}

function KeyValueList({ items, style }: { items: KeyValuePair<string, string>[]; style?: React.CSSProperties; }) {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    if (items.length === 0) {
        return <></>;
    }

    // Small screen
    if (isSmallScreen) {
        return (
            <div style={{
                marginTop: "10px",
                marginBottom: "10px",
                ...style
            }}
            >
                {items.map((item, index) => (
                    <div
                        key={`${index} ${item.key} ${item.value}`}
                        style={{
                            marginBottom: "10px"
                        }}
                    >
                        <strong>{item.key + " "}</strong>
                        <span>{item.value}</span>
                    </div>
                ))}
            </div>
        );
    }

    // Large screen
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "min-content auto",
            columnGap: "10px",
            rowGap: "5px",
            margin: "10px",
            ...style
        }}
        >
            {items.map((item, index) => (
                // We must use react fragment in order to access the key attribute 
                <React.Fragment key={`${index} ${item.key} ${item.value}`}>
                    <div style={{ whiteSpace: "nowrap" }}>
                        <strong>{item.key}</strong>
                    </div>
                    <div>
                        {item.value}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}
