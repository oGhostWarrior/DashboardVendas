import { LoginForm } from "@/components/LoginForm";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm flex flex-col items-center mt-10">
        <div className="p-6 flex-col">
          <div className="text-primary-foreground flex flex-col size-6 items-center justify-between rounded-md">
            <Image src="/icon.png" alt="Logo da Axon" width={32} height={32} />
          </div>
          <p className="text-3xl font-semibold">Axon</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
