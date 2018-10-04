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

export async function signUp({ email, password1, password2 }) {
  let reply = await axios.post("/api/signup/", {
    email,
    password1,
    password2
  });
  return { user: reply.data.user, token: reply.data.token };
}

export default {
  getToken,
  getUser,
  signUp
};
