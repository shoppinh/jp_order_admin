import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import Head from './head/Head';
import Header from './header/Header';
import Footer from './footer/Footer';
import AppRoot from './global/AppRoot';
import AppMain from './global/AppMain';
import AppWrap from './global/AppWrap';

import FileManagerProvider from '../pages/app/file-manager/components/Context';
import { useDispatch, useSelector } from 'react-redux';
import { useSettingSlice } from '../store/slices/setting';
import { useCategorySlice } from '../store/slices/category';
import { getAccessToken } from '../store/selectors/session';
import JToast from '../components/toast/Toast';
const Layout = ({ title, ...props }) => {
  const { actions: settingActions } = useSettingSlice();
  const { actions: categoryActions } = useCategorySlice();
  const dispatch = useDispatch();
  const currentAccessToken = useSelector(getAccessToken);
  React.useEffect(() => {
    if (currentAccessToken && currentAccessToken !== '') {
      dispatch(settingActions.loadSetting({ token: currentAccessToken }));
      dispatch(categoryActions.loadCategoryList({ token: currentAccessToken }));
    }
  }, [categoryActions, currentAccessToken, dispatch, settingActions]);

  return (
    <FileManagerProvider>
      <Head title={!title && 'Loading'} />
      <AppRoot>
        <AppMain>
          <Sidebar fixed />
          <AppWrap>
            <Header fixed />
            <Outlet />
            <Footer />
          </AppWrap>
        </AppMain>
        <JToast />
      </AppRoot>
    </FileManagerProvider>
  );
};
export default Layout;
