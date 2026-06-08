import { RejectUpload, route, type Router } from "@better-upload/server";
import { toRouteHandler } from "@better-upload/server/adapters/next";
import { aws } from "@better-upload/server/clients";
import { auth } from "@/lib/auth";
import { v4 as uuid } from "uuid";

const router: Router = {
  client: aws({
    region: process.env.AWS_REGION || "eu-west-3",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  }),
  bucketName: process.env.AWS_BUCKET_NAME || "vinyl-collection",
  routes: {
    form: route({
      fileTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
      maxFileSize: 1024 * 1024 * 5,
      onBeforeUpload: async ({ req, file }) => {
        const session = await auth.api.getSession({
          headers: req.headers,
        });

        if (!session?.user) {
          throw new RejectUpload("Unauthorized");
        }

        const extension = file.name.split(".").pop();
        const key = `albums/${session.user.id}/${uuid()}.${extension}`;

        return {
          objectInfo: {
            key,
          },
        };
      },
    }),
  },
};

export const { POST } = toRouteHandler(router);
