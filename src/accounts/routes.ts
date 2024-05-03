import { Router } from "express";
import { registerUser, verifyLogin } from "./controllers";
import { loginSchema, registerSchema } from "./schema";
import { createAccessToken, createRefreshToken, verifyToken } from "./utils";
import validate from "../middlewares/validateBody";
import { TRouter } from "../types/Router";
import { authenticateUser } from "../middlewares/authenticate";

const router = Router();

router.get("/", authenticateUser, async (req, res) => {
  res.json(req.user);
});

router.post("/register", validate(registerSchema), async (req, res) => {
  const { email, password, name } = req.body;

  await registerUser(email, password, name);

  res.json({ message: "Successfully signed up" });
});

router.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  const user = await verifyLogin(email, password);
  const accessToken = await createAccessToken(
    user.id,
    user.email,
    user.fullName
  );
  const refreshToken = await createRefreshToken(
    user.id,
    user.email,
    user.fullName
  );

  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    expires: date,
    sameSite: "none",
    secure: true,
  });

  res.json({ accessToken, user, refreshToken });
});

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const user = await verifyToken(refreshToken);
  const { id, email, fullName } = user;
  const accessToken = await createAccessToken(id, email, fullName);

  res.json({ accessToken, user });
});

export const AccountsRouter: TRouter = { path: "/accounts", router };
