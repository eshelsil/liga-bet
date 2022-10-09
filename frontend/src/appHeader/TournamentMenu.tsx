import React from 'react';
import {UtlWithTournament} from '../types';
import {hasManagePermissions, isUtlConfirmed} from '../utils';
import ManageUTLsIcon from '@mui/icons-material/PeopleAltOutlined';
import TournamentIcon from '@mui/icons-material/EmojiEventsOutlined';
import LinkMenuItem from './LinkMenuItem'
import {routesMap} from './routes'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import {Avatar} from "@mui/material";
import DropMenuItem from "./DropMenuItem";
import { useMediaQuery } from 'react-responsive'

interface Props {
    currentUtl: UtlWithTournament,
    isTournamentStarted: boolean,
    currentRoute: string,
    currentUsername: string
    deselectUtl: () => void
    openDialogChangePassword: () => void
}

function TournamentMenu({
                            isTournamentStarted,
                            currentUtl,
                            currentRoute,
                            currentUsername,
                            deselectUtl,
                            openDialogChangePassword
                        }: Props) {
    const showManagerManagementViews = hasManagePermissions(currentUtl);

    // const isMobile = useMediaQuery({
    //     query: '(max-width: 1000px)'
    // })
    // console.log(isMobile)

    const groupBetsRoute = isTournamentStarted ? "all-group-standings" : "open-group-standings";
    const specialBetsRoute = isTournamentStarted ? "all-questions" : "open-questions";

    return (
            <AppBar className='appbar-header' position="static">
                <Toolbar className='toolbar'>
                    <Container className='toolbar-container'>
                        <LinkMenuItem className='appbar-item' route={routesMap['leaderboard']}
                                      currentPath={currentRoute}/>
                        <LinkMenuItem className='appbar-item' route={routesMap['open-matches']}
                                      currentPath={currentRoute}/>
                        <LinkMenuItem className='appbar-item' route={routesMap['closed-matches']}
                                      currentPath={currentRoute}/>
                        <DropMenuItem label='הימורים של לפני הטורניר'>
                            <LinkMenuItem route={routesMap[groupBetsRoute]} className='menu-item'
                                          currentPath={currentRoute}/>
                            <LinkMenuItem route={routesMap[specialBetsRoute]} className='menu-item'
                                          currentPath={currentRoute}/>
                        </DropMenuItem>
                        <LinkMenuItem className='appbar-item' route={routesMap['my-bets']} currentPath={currentRoute}/>
                    </Container>
                    <Container className='toolbar-container'>
                        <DropMenuItem
                            className='avatar-dropmenu'
                            label={
                                <Avatar
                                    className='avatar'>
                                    {currentUsername[0]}
                                </Avatar>
                            }
                        >
                            <LinkMenuItem
                                route={routesMap['user']}
                                className='menu-item'
                                currentPath={currentRoute}
                            />
                            <LinkMenuItem
                                route={routesMap['utl']}
                                className='menu-item'
                                currentPath={currentRoute}
                            />

                            {showManagerManagementViews && (
                                <LinkMenuItem
                                    className='menu-item'
                                    route={routesMap['contestants']}
                                    currentPath={currentRoute}
                                />
                            )}
                            <LinkMenuItem
                                route={routesMap['choose-utl']}
                                className='menu-item'
                                currentPath={currentRoute}
                                onClick={deselectUtl}
                            />
                            <LinkMenuItem
                                className='menu-item'
                                route={routesMap['set-password']}
                                onClick={openDialogChangePassword}
                                currentPath={currentRoute}
                            />
                            <LinkMenuItem
                                className='menu-item'
                                route={routesMap['logout']}
                                currentPath={currentRoute}
                            />
                        </DropMenuItem>
                    </Container>
                </Toolbar>
            </AppBar>
    );
}

export default TournamentMenu;