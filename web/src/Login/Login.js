import React from "react";
import styled from "styled-components";
import appStoreLazy from "../stores/AppStoreLazy"

const Wrapper = styled.div`
  cursor: pointer;
`;
const Login = (props) => {
  const { authLazy } = props;
  const login = async () => {
    const auth = await authLazy.create();
    auth.login(this.props.onLogin);
  };

  const logout = async () => {
    const auth = await authLazy.create();
    auth.logout();
  };

  return (
    <Wrapper>
      <svg
        onClick={async () => {
          const appStore = await appStoreLazy.load();
          appStore.authData === null ? login() : logout();
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="48px"
        height="48px"
      >
        <circle cx="24" cy="24" r="20" fill="#ff3e00" />
        <path
          fill="#fff"
          d="M25,31v-3.436C25,25.901,21.669,25,20,25s-5,0.901-5,2.564V31H25z"
        />
        <circle cx="20" cy="20" r="3" fill="#fff" />
        <path
          fill="#fff"
          d="M33,27.56V31h-6v-3.44c0-0.93-0.36-1.69-0.92-2.3C26.78,25.09,27.47,25,28,25	C29.67,25,33,25.9,33,27.56z"
        />
        <circle cx="28" cy="20" r="3" fill="#fff" />
      </svg>
    </Wrapper>
  );
};

export default Login;
