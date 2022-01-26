import {checkAuth} from "@/plugins/init";

export default async function (context) {
  if (process.client) {
    await checkAuth(context)
  }
}
