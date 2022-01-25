import {checkAuth, checkRole} from "@/plugins/init";

export default async function (context) {

  if (process.server) {
    return;
  }

  await checkAuth(context)
  // await checkRole(context)
}
