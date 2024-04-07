import { Router } from "express";
import { registerUser, verifyLogin } from "./controllers";
import { loginSchema, registerSchema } from "./schema";
import { createAccessToken, createRefreshToken, verifyToken } from "./utils";
import validate from "../middlewares/validateBody";
import { TRouter } from "../types/Router";
import { authenticateUser } from "../middlewares/authenticate";

const router = Router();

router.get("/", authenticateUser, async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});

router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    await registerUser(email, password, name);

    res.json({ message: "Successfully signed up" });
  } catch (error) {
    next(error);
  }
});

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
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

    res.json({ accessToken, user });
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const user = await verifyToken(refreshToken);
    const { id, email, name } = user;
    const accessToken = createAccessToken(id, email, name);

    res.json({ accessToken, user });
  } catch (error) {
    next(error);
  }
});

export const AccountsRouter: TRouter = { path: "/accounts", router };
