import axios from "axios";

export async function getToken({ email, password }) {
  let reply = await axios.post("/api/token-auth/", {
    username: email,
    password: password
  });
  return reply.data.token;
}

export async function getUser() {
  let reply = await axios.get("/api/request-user/");
  return reply.data;
}

export function signUp(
  { email, password1, password2 },
  resolve,
  axiosConfig = {}
) {
  return axios
    .post(
      "/api/signup/",
      {
        email,
        password1,
        password2
      },
      axiosConfig
    )
    .then(r => {
      resolve({ user: r.data.user, token: r.data.token });
    });
}

export default {
  getToken,
  getUser,
  signUp
};
