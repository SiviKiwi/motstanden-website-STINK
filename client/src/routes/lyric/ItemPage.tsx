import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Theme, useMediaQuery, useTheme } from '@mui/material';
import { SongLyric } from 'common/interfaces';
import { useNavigate, useOutletContext } from "react-router-dom";
import { AuthorInfo } from 'src/components/AuthorInfo';
import { MarkDownRenderer } from 'src/components/MarkDownEditor';
import { DeleteMenuItem, EditMenuItem } from 'src/components/menu/EditOrDeleteMenu';
import { IconPopupMenu } from 'src/components/menu/IconPopupMenu';
import { useAuth } from 'src/context/Authentication';
import { useTitle } from "../../hooks/useTitle";
import { UserGroup } from 'common/enums';
import { hasGroupAccess } from 'common/utils';

export function LyricItemPage() {
    const lyric = useOutletContext<SongLyric>();
    useTitle(lyric.title);

    const theme = useTheme();

    return (
        <>
            <div style={{
                color: theme.palette.text.secondary,
            }}>
                <TitleHeader lyric={lyric} />
                <AuthorInfo
                    createdByUserId={lyric.createdBy}
                    createdByUserName={lyric.createdByName}
                    createdAt={lyric.createdAt}
                    updatedByUserId={lyric.updatedBy}
                    updatedByUserName={lyric.updatedByName}
                    updatedAt={lyric.updatedAt}
                    style={{
                        fontSize: "small",
                    }}/>
                <div style={{
                    fontSize: "1.2em",
                    lineHeight: "1.6em",
                }}>
                    <MarkDownRenderer value={lyric.content} />
                </div>
            </div>
        </>
    );
}


function TitleHeader( {lyric}: {lyric: SongLyric} ) {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    
    const user = useAuth().user;
    const isLoggedIn = user !== null
    const canDelete = isLoggedIn && ( user.userId === lyric.createdBy || hasGroupAccess(user, UserGroup.Administrator));

    

    const navigate = useNavigate();

    const onEditClick = () => {
        navigate("rediger")
    }

    const onDeleteClick = () => {
        // Todo
    }

    if(!isLoggedIn)
        return (
            <h1 
                style={{
                    marginBottom: "0px",
                    overflowWrap: "break-word",
                }} 
            >
                {lyric.title}
            </h1>
    )

    return (
        <div 
            style={{
                display: "grid",
                gridTemplateColumns: isSmallScreen ? "auto min-content" : "auto min-content 1fr",
                gridTemplateRows: "auto",
                wordBreak: "break-all",
                alignItems: "flex-start",
                marginTop: "20px",
                marginBottom: "0px"
            }}
        >
            <h1 style={{margin: "0px"}} >
                {lyric.title}
            </h1>
            <IconPopupMenu 
                icon={<MoreHorizIcon/>}
                style={{
                    marginTop: "5px",
                    marginLeft: isSmallScreen ? "0px" : "20px"
                }}
            >
                <EditMenuItem onClick={onEditClick} divider={canDelete} />
                {canDelete && <DeleteMenuItem onClick={onDeleteClick} />}
            </IconPopupMenu>
        </div>
    )
}