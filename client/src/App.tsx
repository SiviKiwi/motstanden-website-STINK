import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { RequireAuth, RequireAuthRouter, useAuth } from "src/context/Authentication";

import { UserGroup } from 'common/enums';
import { AppLayout } from 'src/layout/AppLayout';

// URL routes
// -- Event pages --
import { EventContext, EventItemContext } from 'src/routes/event/Context';
import EventListPage from "src/routes/event/ListPage";
import EditEventPage from "src/routes/event/EditPage"
import NewEventPage from "src/routes/event/NewPage"
import EventItemPage from "src/routes/event/ItemPage"

// -- User pages --
import { UserContext, UserProfileContext } from 'src/routes/user/Context';
import UserListPage from "src/routes/user/ListPage";
import UserPage from "src/routes/user/UserPage";
import NewUserPage from "src/routes/user/NewPage"
import EditUserPage from "src/routes/user/EditPage"

// -- Other pages --
import AdminPage from "src/routes/admin/Admin";
import SuperAdminPage from "src/routes/admin/SuperAdmin";
import BecomeMemberPage from "src/routes/becomeMember/BecomeMember";
import BoardWebsiteListPage from "src/routes/boardWebsiteList/BoardWebsiteList";
import DocumentsPage from "src/routes/documents/DocumentsPage";
import { InstrumentStatsContext } from "./routes/instrumentStats/Context";
import InstrumentStatsPage from "src/routes/instrumentStats/InstrumentStatsPage"
import FrontPage from "src/routes/frontPage/FrontPage";
import HomePage from "src/routes/home/Home";
import { LicenseOnlyPage, LicensePage } from "src/routes/license/LicensePage";
import LoginPage from "src/routes/login/Login";
import { EditLyricPage } from "src/routes/lyric/EditPage";
import { LyricListPage } from 'src/routes/lyric/ListPage';
import { NewLyricPage } from "src/routes/lyric/NewPage";
import NotFound from "src/routes/notFound/NotFound";
import { PollContext } from "src/routes/poll/Context";
import NewPollPage from "src/routes/poll/NewPage";
import PollPage from "src/routes/poll/Poll";
import { QuotesContext } from 'src/routes/quotes/Context';
import QuoteListPage from "src/routes/quotes/ListPage";
import NewQuotePage from "src/routes/quotes/NewPage";
import { RumourContext } from 'src/routes/rumour/Context';
import { NewRumourPage, RumourPage } from 'src/routes/rumour/RumourPage';
import { SheetArchiveContext } from "src/routes/sheetArchive/Context";
import InstrumentPage from "src/routes/sheetArchive/InstrumentPage";
import SongPage from "src/routes/sheetArchive/SongPage";
import { LyricContext, LyricItemContext } from "./routes/lyric/Context";
import { LyricItemPage } from './routes/lyric/ItemPage';

function App() {
	const auth = useAuth()

	return (
		<div className='App' style={{ minHeight: "100vh", height: "100%" }}>
			<Routes>
				<Route element={<AppLayout />}>

					<Route path="/" element={auth.user ? <HomePage /> : <FrontPage/>} />

					{/* Routes that are publicly available */}
					<Route element={<Outlet/>}>
						<Route path="/framside" element={<FrontPage />} />
						<Route path="/logg-inn" element={<LoginPage />} />
						<Route path="/studenttraller" element={<LyricContext/>}>
							<Route path="" element={<Navigate to="populaere" />} />
							<Route path="populaere" element={<LyricListPage filterPopular/>}/>
							<Route path="populaere/:title" element={<LyricItemContext/>}>
								<Route index element={<LyricItemPage />} />
								<Route path="rediger" element={<RequireAuth><EditLyricPage/></RequireAuth>} />
							</Route>
							<Route path="alle" element={<LyricListPage />} />
							<Route path="alle/:title" element={<LyricItemContext/>}>
								<Route index element={<LyricItemPage />} />
								<Route path="rediger" element={<RequireAuth><EditLyricPage/></RequireAuth>} />
							</Route>
							<Route path="ny" element={<RequireAuth><NewLyricPage/></RequireAuth>}/>
						</Route>
						<Route path="/dokumenter" element={<DocumentsPage />} />
						<Route path="/bli-medlem" element={<BecomeMemberPage />} />
						<Route path="/styrets-nettsider" element={<BoardWebsiteListPage/>} />
						<Route path="/lisens" element={<LicensePage />} />
						<Route path="/maakesodd" element={<LicenseOnlyPage />} />
					</Route>

					{/* Routes that requires the user to be logged in */}
					<Route element={<RequireAuthRouter requiredGroup={UserGroup.Contributor} />}>
						<Route path="/hjem" element={<HomePage />} />
						<Route path="/notearkiv" element={<SheetArchiveContext />}>
							<Route path="" element={<Navigate to="repertoar" />} />
							<Route path="repertoar" element={<SongPage mode='repertoire' />} />
							<Route path="repertoar/:title" element={<InstrumentPage />} />
							<Route path="alle" element={<SongPage />} />
							<Route path="alle/:title" element={<InstrumentPage />} />
						</Route>
						<Route path="/sitater" element={<QuotesContext />}>
							<Route index element={<QuoteListPage />} />
							<Route path='ny' element={<NewQuotePage />} />
						</Route>
						<Route path="/rykter" element={<RumourContext />}>
							<Route index element={<RumourPage />} />
							<Route path="ny" element={<NewRumourPage />} />
						</Route>
						<Route path="/avstemninger" element={<PollContext/>}>
							<Route index element={<PollPage/>}/>
							<Route path="ny" element={<NewPollPage/>}/>
						</Route>
						<Route path="/medlem" element={<UserContext />}>
							<Route path="" element={<Navigate to="liste" />} />
							<Route path="liste" element={<UserListPage />} />
							<Route path=":userId" element={<UserProfileContext />}>
								<Route index element={<UserPage />} />
								<Route path="rediger" element={<EditUserPage/>} /> {/* Authorization to this path is handled internally by EditUserPage. */}
							</Route>
							<Route element={<RequireAuthRouter requiredGroup={UserGroup.SuperAdministrator} />}>
								<Route path="ny" element={<NewUserPage/>} />
							</Route>
						</Route>
						<Route path="/instrumentstatistikk" element={<InstrumentStatsContext />}>
							<Route index element={<InstrumentStatsPage/>}/>
		                                </Route>
						<Route path="/arrangement" element={<EventContext />}>
							<Route path="" element={<Navigate to="kommende" />} />
							<Route path=':eventId' element={<EventItemContext />} /> 	{/* Will redirect to correct path */}
							<Route path="kommende" element={<EventListPage mode='upcoming' />} />
							<Route path="kommende/:eventId" element={<EventItemContext />}>
								<Route index element={<EventItemPage/>} />
								<Route path="rediger" element={<EditEventPage />} />
							</Route>
							<Route path="tidligere" element={<EventListPage mode='previous' />} />
							<Route path="tidligere/:eventId" element={<EventItemContext />}>
								<Route index element={<EventItemPage />} />
								<Route path="rediger" element={<EditEventPage />} />
							</Route>
							<Route path="ny" element={<NewEventPage/>} />
						</Route>
					</Route>

					<Route element={<RequireAuthRouter requiredGroup={UserGroup.Administrator} />}>
						<Route path="/admin" element={<AdminPage />} />
					</Route>

					<Route element={<RequireAuthRouter requiredGroup={UserGroup.SuperAdministrator} />}>
						<Route path="/super-admin" element={<SuperAdminPage />} />
					</Route>

					{/* 404: no matching routes */}
					<Route path="/*" element={<NotFound />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App
