import React, { Component, Fragment } from 'react';
import { Grid, Button, TextField, Typography } from '@material-ui/core';
import api from '../services/api';
import { Redirect } from 'react-router-dom';
import InputAdornment from '@material-ui/core/InputAdornment';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { Link } from 'react-router-dom';
import '../index.css';

class Login extends Component {
  state = {
    email: '',
    password: '',
    isLogin: false,
    message: '',
    beneficiary_id: '',
  };

  handleSubmit = async () => {
    const login = {
      email: this.state.email,
      password: this.state.password,
    };

    const { email, password } = login;
    let acessoLogin = await api.post('/', {
      email,
      password,
    });

    try {
      if (acessoLogin.status === 200) {
        this.setState({
          isLogin: true,
          beneficiary_id: acessoLogin.data.emailExists.id,
        });
        return localStorage.setItem('tokenUser', acessoLogin.data.token);
      }
    } catch (error) {
      this.setState({ isLogin: false });
      if (error.response.data.validateDataLogin) {
        this.setState({
          message: error.response.data.validateDataLogin,
        });
      }
      if (error.response.data.message) {
        this.setState({
          message: error.response.data.message,
          email: '',
          password: '',
        });
      }
      if (error.response.data.messageError) {
        this.setState({
          message: error.response.data.messageError,
        });
      }
      if (error.response.data.messagePassword) {
        this.setState({ message: error.response.data.messagePassword });
      }
    }
  };

  render() {
    return (
      <Fragment>
        <div>
          {this.state.isLogin === true && (
            <div className="alert alert-success" role="alert">
              <h4 className="text-center">Seja bem-vindo(a) ao DoaMed</h4>
              {
                <Redirect
                  to={`${this.state.beneficiary_id}/register_medicine_benef`}
                />
              }
            </div>
          )}

          {this.state.isLogin === false && (
            <div className="alert alert-danger" role="alert">
              <h4 className="text-center">{this.state.message}</h4>
            </div>
          )}
        </div>
        <Grid
          className="grid"
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <h2>Login</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <Grid item>
              <TextField
                required
                autoFocus
                fullWidth
                label="Email"
                type="email"
                style={{ margin: 18 }}
                value={this.state.email}
                onChange={(e) => this.setState({ email: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="end">
                      <MailOutlineIcon />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                fullWidth
                label="Senha"
                type="password"
                style={{ margin: 18 }}
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="end">
                      <LockOpenIcon />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                type="submit"
                style={{ margin: 5 }}
                onClick={this.handleSubmit}
              >
                Logar
              </Button>
            </Grid>
            <Grid item>
              <Typography align="right" variant="caption">
                <Link to="/register_user">Faça seu cadastro Aqui</Link>
              </Typography>
            </Grid>
          </form>
        </Grid>
      </Fragment>
    );
  }
}

export default Login;
