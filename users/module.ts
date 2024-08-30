import { login } from "../types";
import APIError from "../utils/api-error";
import { generateJwtToken } from "../utils/authentication";
import { User } from "./model";
import { compare } from "bcryptjs";

export async function login(loginData: login) {
  try {
    const user = await User.findOne({
      where: { username: loginData.username },
    });
    if (!user) {
      throw new APIError("user doesnot exist", "USER DOESNOT EXIST");
    }
    if (user.isActive === false) {
      throw new APIError("Not active user", "UNAUTHORIZED", 401);
    }
    const res = await compare(loginData.passward, user.password);
    if (res) {
      const tokenBody: any = {
        username: user.username,
        role: user.userRole,
        id: user.id,
      };
      if (user.userRole == "EMBED") {
        tokenBody.name = "EMBED";
      } else {
        tokenBody.name = "QC";
      }
      return await generateJwtToken(tokenBody);
    } else {
      throw new APIError("invalid passward", "INVALID PASSWARD");
    }
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
