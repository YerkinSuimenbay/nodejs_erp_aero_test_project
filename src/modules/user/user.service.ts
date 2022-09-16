import { db } from "../../utils/db.server";

export function getLastLougoutTimeByUserId(userId: string) {
  return db.user.findUnique({
    where: { userId },
    select: {
      lastLogoutTime: true,
    },
  });
}
