import React, { useEffect, useState } from 'react';
import Logo from '../../images/logo.png';
import LogoDark from '../../images/logo-dark.png';
import Head from '../../layout/head/Head';
import AuthFooter from './AuthFooter';
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from '../../components/Component';
import { Form, Spinner, Alert } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useSessionSlice } from '../../store/slices/session';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthError, getAuthLoading } from '../../store/selectors/session';
import { SiteMap } from '../../utils/sitemap';

const Login = () => {
  const { actions: sessionActions } = useSessionSlice();
  const [passState, setPassState] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const authLoading = useSelector(getAuthLoading);
  const authError = useSelector(getAuthError);
  const [isFormSent, setIsFormSent] = React.useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const onFormSubmit = (formData) => {
    dispatch(sessionActions.doLogin(formData));
    setIsFormSent(true);
  };

  useEffect(() => {
    if (isFormSent && !authLoading) {
      setIsFormSent(false);
      if (authError) {
        alert('Login failed');
      } else {
        navigate(SiteMap.home.link, { replace: true });
      }
    }
  }, [authError, authLoading, isFormSent, navigate]);

  return (
    <>
      <Head title='Login' />
      <Block className='nk-block-middle nk-auth-body  wide-xs'>
        <div className='brand-logo pb-4 text-center'>
          <Link to={process.env.PUBLIC_URL + '/'} className='logo-link'>
            <img className='logo-light logo-img logo-img-lg' src={Logo} alt='logo' />
            <img className='logo-dark logo-img logo-img-lg' src={LogoDark} alt='logo-dark' />
          </Link>
        </div>

        <PreviewCard className='card-bordered' bodyClass='card-inner-lg'>
          <BlockHead>
            <BlockContent>
              <BlockTitle tag='h4'>Sign-In</BlockTitle>
              <BlockDes>
                <p>Access Japan Order using your email and passcode.</p>
              </BlockDes>
            </BlockContent>
          </BlockHead>
          {authError && (
            <div className='mb-3'>
              <Alert color='danger' className='alert-icon'>
                <Icon name='alert-circle' /> Unable to login with credentials{' '}
              </Alert>
            </div>
          )}
          <Form className='is-alter' onSubmit={handleSubmit(onFormSubmit)}>
            <div className='form-group'>
              <div className='form-label-group'>
                <label className='form-label' htmlFor='default-01'>
                  Email or Username
                </label>
              </div>
              <div className='form-control-wrap'>
                <input
                  type='text'
                  id='default-01'
                  {...register('username', { required: 'This field is required' })}
                  placeholder='Enter your email address or username'
                  className='form-control-lg form-control'
                />
                {errors.name && <span className='invalid'>{errors.name.message}</span>}
              </div>
            </div>
            <div className='form-group'>
              <div className='form-label-group'>
                <label className='form-label' htmlFor='password'>
                  Passcode
                </label>
                <Link
                  className='link link-primary link-sm'
                  to={`${process.env.PUBLIC_URL}/auth-reset`}
                >
                  Forgot Code?
                </Link>
              </div>
              <div className='form-control-wrap'>
                <a
                  href='#password'
                  onClick={(ev) => {
                    ev.preventDefault();
                    setPassState(!passState);
                  }}
                  className={`form-icon lg form-icon-right passcode-switch ${
                    passState ? 'is-hidden' : 'is-shown'
                  }`}
                >
                  <Icon name='eye' className='passcode-icon icon-show'></Icon>

                  <Icon name='eye-off' className='passcode-icon icon-hide'></Icon>
                </a>
                <input
                  type={passState ? 'text' : 'password'}
                  id='password'
                  {...register('password', { required: 'This field is required' })}
                  placeholder='Enter your password'
                  className={`form-control-lg form-control ${passState ? 'is-hidden' : 'is-shown'}`}
                />
                {errors.passcode && <span className='invalid'>{errors.passcode.message}</span>}
              </div>
            </div>
            <div className='form-group'>
              <Button size='lg' className='btn-block' type='submit' color='primary'>
                {authLoading ? <Spinner size='sm' color='light' /> : 'Sign in'}
              </Button>
            </div>
          </Form>
          <div className='form-note-s2 text-center pt-4'>
            New on our platform?{' '}
            <Link to={`${process.env.PUBLIC_URL}/auth-register`}>Create an account</Link>
          </div>
          {/*<div className="text-center pt-4 pb-3">*/}
          {/*  <h6 className="overline-title overline-title-sap">*/}
          {/*    <span>OR</span>*/}
          {/*  </h6>*/}
          {/*</div>*/}
          {/*<ul className="nav justify-center gx-4">*/}
          {/*  <li className="nav-item">*/}
          {/*    <a*/}
          {/*      className="nav-link"*/}
          {/*      href="#socials"*/}
          {/*      onClick={(ev) => {*/}
          {/*        ev.preventDefault();*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      Facebook*/}
          {/*    </a>*/}
          {/*  </li>*/}
          {/*  <li className="nav-item">*/}
          {/*    <a*/}
          {/*      className="nav-link"*/}
          {/*      href="#socials"*/}
          {/*      onClick={(ev) => {*/}
          {/*        ev.preventDefault();*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      Google*/}
          {/*    </a>*/}
          {/*  </li>*/}
          {/*</ul>*/}
        </PreviewCard>
      </Block>
      <AuthFooter />
    </>
  );
};
export default Login;
