import React, {useState} from 'react';
import {DropdownToggle, DropdownMenu, Dropdown} from 'reactstrap';
import {Icon} from '../../../../components/Component';
import {LinkList, LinkItem} from '../../../../components/links/Links';
import UserAvatar from '../../../../components/user/UserAvatar';
import {SiteMap} from '../../../../utils/sitemap';
import {useDispatch, useSelector} from 'react-redux';
import {useSessionSlice} from '../../../../store/slices/session';
import {getUserInfo} from "../../../../store/selectors/session";

const User = () => {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen((prevState) => !prevState);
    const dispatch = useDispatch();
    const {actions: sessionActions} = useSessionSlice();
    const currentUser = useSelector(getUserInfo);
    const handleSignout = () => {
        dispatch(sessionActions.doLogout());
    };

    return (
        <Dropdown isOpen={open} className='user-dropdown' toggle={toggle}>
            <DropdownToggle
                tag='a'
                href='#toggle'
                className='dropdown-toggle'
                onClick={(ev) => {
                    ev.preventDefault();
                }}
            >
                <div className='user-toggle'>
                    <UserAvatar icon='user-alt' className='sm'/>
                    <div className='user-info d-none d-md-block'>
                        <div className='user-status'>{currentUser?.role}</div>
                        <div className='user-name dropdown-indicator'>{currentUser?.username}</div>
                    </div>
                </div>
            </DropdownToggle>
            <DropdownMenu end className='dropdown-menu-md dropdown-menu-s1'>
                <div className='dropdown-inner user-card-wrap bg-lighter d-none d-md-block'>
                    <div className='user-card sm'>
                        <div className='user-avatar'>
                            <span>AB</span>
                        </div>
                        <div className='user-info'>
                            <span className='lead-text'>{currentUser?.username}</span>
                            <span className='sub-text'>{currentUser?.email}</span>
                        </div>
                    </div>
                </div>
                <div className='dropdown-inner'>
                    <LinkList>
                        <LinkItem link='/user-profile-regular' icon='user-alt' onClick={toggle}>
                            View Profile
                        </LinkItem>
                        <LinkItem link='/user-profile-setting' icon='setting-alt' onClick={toggle}>
                            Account Setting
                        </LinkItem>
                        <LinkItem link='/user-profile-activity' icon='activity-alt' onClick={toggle}>
                            Login Activity
                        </LinkItem>
                    </LinkList>
                </div>
                <div className='dropdown-inner'>
                    <LinkList>
                        <a href='#' onClick={handleSignout}>
                            <Icon name='signout'></Icon>
                            <span>Sign Out</span>
                        </a>
                    </LinkList>
                </div>
            </DropdownMenu>
        </Dropdown>
    );
};

export default User;
