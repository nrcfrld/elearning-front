import useJwt from '@core/auth/jwt/useJwt'
import axios from '@axios'
import { BASE_URL } from '@/repositories/Repository'

const { jwt } = useJwt(axios, {
  loginEndpoint: `${BASE_URL}/auth/jwt/token`,
  refreshEndpoint: `${BASE_URL}/auth/jwt/refresh`,
  logoutEndpoint: `${BASE_URL}/auth/jwt/logout`,
  registerEndpoint: `${BASE_URL}/auth/register`,
  profileEndpoint: `${BASE_URL}/auth/me`,
})

jwt.login = auth =>
  jwt.axiosIns.get(jwt.jwtConfig.loginEndpoint, {
    auth,
  })

jwt.fetchUser = () => jwt.axiosIns.get(jwt.jwtConfig.profileEndpoint)

export default jwt
