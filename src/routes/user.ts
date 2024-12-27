import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { Router } from "express";

const userRouter = Router();
const prisma = new PrismaClient();

const findEmail = async ({ email }: { email: string }) => {
  try {
    const emailExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    return emailExists;
  } catch (error) {
    console.error(error);
  }
};

const createNewUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const user = prisma.user.create({
      data: {
        email,
        password,
        admin: false,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
  }
};

userRouter.post("/", async (req, res) => {
  const { SALT, SECRET_PHRASE } = process.env;
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      error: "Email or password not provided",
    });
    return;
  }

  const emailExists = await findEmail({ email });

  if (emailExists) {
    res.status(401).json({});
    return;
  }

  const hashPassword = await hash(password + SECRET_PHRASE, Number(SALT));
  const newUser = await createNewUser({ email, password: hashPassword });

  if (newUser) {
    res.status(201).json({});
  } else {
    res.status(500).json({});
  }
});

userRouter.post("/login", async (req, res) => {
  const { SECRET_PHRASE } = process.env;
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      error: "Email or password not provided",
    });
    return;
  }

  const user = await findEmail({ email });

  if (!user) {
    res.status(401).json({});
    return;
  }

  const validatePassword = await compare(
    password + SECRET_PHRASE,
    user.password
  );

  if (validatePassword) {
    res.status(200).json({});
  } else {
    res.status(401).json({});
  }
});

export { userRouter };
