import { LoginForm } from "@/components/LoginForm";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm flex flex-col items-center mt-10">
        <div className="p-4">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Image
                src="../app/icon.png"
                alt="Logo da Axon"
                width={32}
                height={32}
              />
            </div>
            <p className="text-xl font-semibold text-gray-900">Axon</p>
          </a>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
