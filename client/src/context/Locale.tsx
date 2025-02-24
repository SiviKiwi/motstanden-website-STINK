import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers"
import dayjs from 'dayjs';
import "dayjs/locale/nb";
import CustomParseFormat from "dayjs/plugin/customParseFormat";
import RelativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import React from "react";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    dayjs.locale("nb")
    dayjs.extend(utc)
    dayjs.extend(CustomParseFormat)
    dayjs.extend(RelativeTime)
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"nb"}>
            {children}
        </LocalizationProvider>

    )
}