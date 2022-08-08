import React, { useState } from 'react';

import { PageContainer } from '../../layout/PageContainer';
import { useTitle } from '../../hooks/useTitle';
import { EmailInfo, EmailLogin } from './EmailLogin';
import { useAuth } from 'src/context/Authentication';
import { Navigate, useLocation } from 'react-router-dom';

export function LoginPage() {
	const [mailInfo, setMailInfo] = useState<EmailInfo | undefined>(undefined)

	useTitle("Logg inn")
	const auth = useAuth()
    let location = useLocation()
	
	if(auth.user){
		const to = location.pathname === "/logg-inn" ? "/hjem" : location.pathname 
		return <Navigate  to={to} state={{ from: location }} replace/>
	}

	return ( 
		<PageContainer disableGutters >
			<div style={{
				textAlign: "center", 
				paddingBottom: "100px"}}>
				<h1 style={{
					margin: "0px", 
					paddingBlock: "20px" }}>
						Logg inn
				</h1>
				{
					!mailInfo && <EmailLogin onEmailSent={ e => setMailInfo(e)}/> 
				}
				{
					mailInfo && <EmailSent emailInfo={mailInfo}/>
				}
			</div>
		</PageContainer>
	)
} 

function EmailSent( {emailInfo}: {emailInfo: EmailInfo} ) {

	return (
		<>
		E-post er sendt.
		</>
	)
}
