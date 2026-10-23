
import Layout from "@/components/layout";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="flex justify-between text-blue-900">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>

        <div className="flex items-center gap-1 overflow-hidden rounded-lg bg-gray-300 text-black">
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "Profile picture"}
              width={24}
              height={24}
              className="h-6 w-6 rounded-full object-cover"
            />
          )}

          <span className="px-2">
            {session?.user?.name}
          </span>
        </div>
      </div>
    </Layout>
  );
}
