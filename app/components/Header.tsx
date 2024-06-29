import { getSignInUrl, getUser, signOut } from "@workos-inc/authkit-nextjs";
import Link from "next/link";

export default async function Header() {
  const { user } = await getUser();
  const signInUrl = await getSignInUrl();

  return (
    <header className="bg-gray-800 text-white">
      <div className="container flex items-center justify-between mx-auto py-4 px-6">
        <Link href={'/'} className="font-bold text-2xl text-yellow-300">
          Job Board
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
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
            href={'/new-listing'}>
            New Listing
          </Link>
        </nav>
      </div>
    </header>
  );
}
