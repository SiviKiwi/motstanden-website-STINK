import React from "react"
import { Box, Paper, Stack, Typography } from '@mui/material';
import May17Img from "../../assets/pictures/17mai2021.jpg"
import { PageContainer } from "../../layout/PageContainer";
import { useTitle } from "../../hooks/useTitle";

export default function FrontPage(){
    useTitle("Framside")
    return (
        <PageContainer disableGutters>
            <img src={May17Img}
                alt="Motstanden feirer 17. Mai 2021" 
                loading="lazy" 
                style={{width: "100%", maxHeight: "33vh", objectFit: "cover"}}/>
            <div style={{paddingInline: "35px", paddingBottom: "100px"}}>
                <h2>Om oss</h2>
                    <p>
                        #TODO...?
                    </p>
                    <br/>
                <h2>Bli medlem?</h2>
                    <p>
                        #TODO...?
                    </p>
                    <br/>
                <h2>Øvelse</h2>
                    <p>
                        #TODO...?
                    </p>
                    <br/>
                <h2>Kontakt oss</h2>
                    <p>
                        #TODO...?
                    </p>
            </div>
        </PageContainer>
    )
}

