import Account from "@/components/Account/account";
import AuthGuard from "@/components/Auth/AuthGuard";

export default function AccountPage() {

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
        <Account  />
      </div>
    </AuthGuard>
  );
}
