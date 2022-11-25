import { Page } from "@playwright/test";
import { Dayjs } from "dayjs";
import dayjs from "../lib/dayjs";
import { isMobile } from "./mediaQueries";

type dateFormat = "MonthYear" | "DayMonthYear" | "TimeDayMonthYear"

export async function selectDate(
    page: Page, 
    label: string | RegExp, 
    date: Dayjs | string, 
    format: dateFormat
) {
    if(typeof date === "string")
        date = dayjs(date);

   
    if(await isMobile(page)) {
        return await mobileSelectDate(page, label, date, format)
    }        

    return await defaultSelectDate(page, label, date, format)
}

async function defaultSelectDate(
    page: Page, 
    label: string | RegExp, 
    date: Dayjs, 
    format: dateFormat
) {
    let dateValue: string

    if(format === "MonthYear") {
        dateValue = date.format("MMMM YYYY")
    }

    if(format === "DayMonthYear") {
        dateValue = dayjs(date).format("DD.MM.YYYY")
    }
    
    if(format === "TimeDayMonthYear") {
        dateValue = dayjs(date).format("DD.MM.YYYY HH:mm")
    }

    await page.getByLabel(label).fill(dateValue)
}

// This is not thoroughly tested
async function mobileSelectDate(
    page: Page, 
    label: string | RegExp, 
    date: Dayjs, 
    format: dateFormat
) {
    switch (format) {
        case "MonthYear": 
            return await mobileSelectMonthYear(page, label, date)
        case "DayMonthYear": 
            return await await mobileSelectDayMonthYear(page, label, date)
        case "TimeDayMonthYear": 
            throw "Not implemented"
        default: 
            throw "Not implemented"
    }
}

// This is not thoroughly tested
async function mobileSelectMonthYear(page: Page, label: string | RegExp, date: Dayjs) {
    await page.getByLabel(label).click();
    await page.getByRole('button', { name: date.format("YYYY") }).click();
    await page.getByRole('button', { name: date.format("MMM") }).click();
    await page.getByRole('button', { name: 'OK' }).click();
}

// This is not thoroughly tested
async function mobileSelectDayMonthYear(page: Page, label: string | RegExp, date: Dayjs) {
    await page.getByLabel(label).click();
    await page.getByText(/(januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember)\s+[0-9]{4}/).click();
    await page.getByRole('button', { name: date.format("YYYY") }).click();
    await page.getByRole('button', { name: date.format("MMM") }).click();
    await page.getByRole('gridcell', { name: date.format("D") }).click();
    await page.getByRole('button', { name: 'OK' }).click();
}