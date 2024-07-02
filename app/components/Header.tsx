import { getSignInUrl, getUser, signOut } from "@workos-inc/authkit-nextjs";
import Link from "next/link";

export default async function Header() {
  const { user } = await getUser();
  const signInUrl = await getSignInUrl();

  return (
    <header className="bg-slate-300 text-white">
      <div className="container flex items-center justify-between mx-auto py-4 px-6">
        <Link href={'/'} className="font-bold text-2xl text-blue-700">
          Talent Point
        </Link>
        <nav className="flex gap-4">
          {!user && (
            <Link 
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300"
              href={signInUrl}>
              Login
            </Link>
          )}
          {user && (
            <form action={async () => {
              'use server';
              await signOut();
            }}>
              <button
                type="submit"
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300">
                Logout
              </button>
            </form>
          )}
          <Link
            className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-900 transition-colors duration-300"
            href={'/new-listing'}>
            Create Job Listing
          </Link>
        </nav>
      </div>
    </header>
  );
}
