import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserByEmail, createUser } from "../repositories/user.repository";
import { HttpError } from "../errors/http-error";
import { RegisterInput, LoginInput } from "../types/user.type";
import { JWT_SECRET } from "../config";

export const registerUser = async (data: RegisterInput) => {
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
        throw new HttpError(400, "Email already exists");
    }

    const hashedPassword = await bcryptjs.hash(data.password, 10);

    const newUser = await createUser({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "user"
    });

    return {
        message: "User created successfully",
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        }
    };
};

export const loginUser = async (data: LoginInput) => {
    const user = await getUserByEmail(data.email);
    if (!user) {
        throw new HttpError(401, "Invalid email or password");
    }

    const isValid = await bcryptjs.compare(data.password, user.password);
    if (!isValid) {
        throw new HttpError(401, "Invalid email or password");
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        message: "Login successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};