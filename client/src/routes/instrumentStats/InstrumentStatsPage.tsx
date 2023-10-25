import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

import { headerStyle, rowStyle } from 'src/assets/style/tableStyle';

import dayjs from 'dayjs';
import { useTitle } from "../../hooks/useTitle"
import { InstrumentStat} from "common/interfaces"
import { Link as RouterLink, useOutletContext } from 'react-router-dom';

export default function InstrumentStatsPage() {
    useTitle("Instrumentstatistikk")
    const data = useOutletContext<InstrumentStat[]>()
    return (
        <>
            <h1>Instrumentstatistikk</h1>
	    <InstrumentStatTable
	        stats={data}
	    />
        </>
    )
}


function InstrumentStatTable({
    stats
}: {
    stats: InstrumentStat[]
}) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={headerStyle}>
                    <TableRow>
                        <TableCell>Instrument</TableCell>
                        <TableCell>Lydnivå</TableCell>
                        <TableCell>Surhetsgrad</TableCell>
                        <TableCell>Dato</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stats.map((stat: InstrumentStat) => (
                        <TableRow sx={rowStyle} key={stat.statDate}>
                            <TableCell>
			        {stat.instrument}
                            </TableCell>
                            <TableCell>
                                {stat.loudness}
                            </TableCell>
                            <TableCell>
                                {stat.sourpercentage}
                            </TableCell>
                            <TableCell>
                                {formatDate(stat.statDate)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function formatDate(dateStr: string | null) {
    return dateStr ? dayjs(dateStr).format("HH:mm DD-MM-YYYY") : "-"
}
